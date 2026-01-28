#!/usr/bin/env ruby
# frozen_string_literal: true

# Cloud Connector Health check
#
# This script provides real-time health check of CloudConnector configuration.
#
# Usage:
#   Run this script in your terminal. It will perform a series of health checks on a GitLab instance.
#   It verifies the status of various components such as access data, tokens, licenses, host connectivity,
#   and feature accessibility.
#   The script can be run in debug mode for more detailed output and can generate a report file.
#
#   Usage: gitlab-rails runner health_check.rb
#         --debug                Enable debug mode
#         --output-file FILE     Write report to FILE
#         --username USERNAME    Provide a username to test seat assignments
#         --skip [CHECK]         Skip specific check (options: access_data, token, license, host, features, end_to_end)
#
# Example:
#   Execute:
#   ```
#   gitlab-rails runner [full_path/to/health_check.rb] --debug --username [username]
#   ```
#

require 'optparse'
require 'net/http'
require 'socket'
require 'json'

module Tasks
  module CloudConnector
    class HealthCheck
      include Rails.application.routes.url_helpers

      CLOUD_CONNECTOR_URL = defined?(::CloudConnector::Config) ? ::CloudConnector::Config.base_url.freeze : 'https://cloud.gitlab.com'
      CUSTOMERS_DOT_URL = ::Gitlab::Routing.url_helpers.subscription_portal_url.freeze
      HOST_REACHABLE_TEXT = "%{host} is reachable."
      HOST_UNREACHABLE_TEXT = "%{host} could not be reached. If you use firewalls or proxy servers, " \
                              "they must allow traffic to this host."
      TEST_COMPLETIONS_ERROR_TEXT = "Authentication with GitLab Cloud services failed: %<error>s"
      TEST_COMPLETIONS_TEXT = 'Authentication with GitLab Cloud services succeeded.'
      CONNECTION_FAILED_DEBUG_TEXT = "%{host} connection failed: %<error>s."
      CONNECTION_FAILED_TEST = "%{host} connection failed. For more details use --debug option"
      MISSING_ACCESS_DATA_TEXT = 'Subscription has not yet been synchronized. Synchronize your subscription.'
      STALE_ACCESS_DATA_TEXT = 'Subscription has not been synchronized recently. Synchronize your subscription.'
      MISSING_ACCESS_TOKEN_TEXT = 'Access credentials not found. Synchronize your subscription.'
      EXPIRED_ACCESS_TOKEN_TEXT = 'Access credentials expired. Synchronize your subscription.'
      MISSING_LICENSE_TEXT = 'Subscription for this instance cannot be synchronized. ' \
                             'Contact GitLab customer support to obtain a license.'
      WRONG_LICENSE_TEXT = 'Subscription for this instance cannot be synchronized. ' \
                           'Contact GitLab customer support to upgrade your license.'
      SERVICE_HAS_ACCESS_TEXT = "%{service_name} is accessible."
      SERVICE_HAS_NO_ACCESS_TEXT = "%{service_name} is not accessible."
      STALE_PERIOD = 3.days

      def initialize(options = {})
        @debug = options[:debug]
        @output_file = options[:output_file]
        @username = options[:username]
        @skips = options[:skips]&.map(&:to_sym) || []
        @log = []
        find_and_validate_user if @username
      end

      def perform_check
        check_if_ee?
        log "\nStarting health check for #{::Gitlab::VERSION}..."
        log "\nInstance id: #{::Gitlab::CurrentSettings.uuid.presence}"
        check_access_data unless skip?(:access_data)
        check_token unless skip?(:token)
        check_license unless skip?(:license)
        check_host(CLOUD_CONNECTOR_URL) unless skip?(:host)
        check_host(CUSTOMERS_DOT_URL) unless skip?(:host)
        check_access_to_features unless skip?(:features)
        check_end_to_end unless skip?(:end_to_end)
        log "\nHealth check complete."
        write_output
      end

      private

      def check_if_ee?
        unless ::Gitlab.ee?
          log "Error: Cloud connector is not available in CE/EE Core"
          exit 1
        end
      end

      def find_and_validate_user
        @user = User.find_by(username: @username)
        unless @user
          log "Error: Username '#{@username}' not found."
          exit 1
        end
        log_debug("Username '#{@username}' found.")
      end

      def log(message)
        puts message
        @log << message
      end

      def write_output
        return unless @output_file

        File.open(@output_file, 'w') do |file|
          @log.each { |line| file.puts(line) }
        end
      rescue StandardError => e
        log "Failed to write report to #{@output_file}: #{e.message}"
      end

      def skip?(check)
        result = @skips.include?(check)
        log "Skipping #{check.to_s.titleize} check..." if result && @debug

        result
      end

      def check_access_data
        log "\nRunning Access Data Check..."

        unless defined?(::CloudConnector::Access)
          log "Skipping Access Data check: ::CloudConnector::Access is not available."
          return
        end

        access_record = ::CloudConnector::Access.last
        return failure(MISSING_ACCESS_DATA_TEXT) unless access_record

        log_debug("AccessData - updated_at: #{access_record.updated_at}")
        log_debug("AccessData - data: #{JSON.pretty_generate(access_record.data)}")

        success("Subscription synchronized successfully.")
      rescue StandardError => e
        failure(e.message)
      end

      def check_token
        log "\nRunning Token Check..."

        unless defined?(::CloudConnector::ServiceAccessToken)
          log "Skipping Token check: ::CloudConnector::ServiceAccessToken is not available."
          return
        end

        last_token = ::CloudConnector::ServiceAccessToken.last

        return failure(MISSING_ACCESS_TOKEN_TEXT) unless last_token

        if @debug
          log_debug("Token created_at: #{last_token.created_at}")
          log_debug("Token expired: #{last_token.expires_at.past?}")
          begin
            token = JWT.decode(last_token.token, nil, false).first
            log_debug("Token decode: Successful")
            log_debug("Token details: #{JSON.pretty_generate(token)}")
          rescue JWT::DecodeError => e
            log_debug("Token decode: Failed with message: #{e.message}")
          end
        end

        return failure(EXPIRED_ACCESS_TOKEN_TEXT) if last_token.expires_at.past?
        success("Access Credentials are correct.")
      rescue StandardError => e
        failure(e.message)
      end

      def check_license
        log "\nRunning License Check..."
        license = License.current
        return failure(MISSING_LICENSE_TEXT) unless license

        errors = []
        errors << 'License is not an online cloud license' unless license.online_cloud_license?
        errors << 'License grace period has been expired' if license.grace_period_expired?
        errors << 'License can\'t be on trial' if license.trial?
        errors << 'License has no expiration date' unless license.expires_at
        errors.each { |error| log_debug(error) }
        log_debug("License is on #{license.plan} plan.")

        return failure(WRONG_LICENSE_TEXT) unless errors.empty?

        success("License is valid.")
      rescue StandardError => e
        failure(e.message)
      end

      def check_host(url)
        log "\nRunning Host Check..."
        succeeded, message = connection_succeeded?(url)
        succeeded ? success(message) : failure(message)
      rescue StandardError => e
        failure(e.message)
      end

      def check_access_to_features
        log "\nRunning access to features check..."

        unless defined?(::CloudConnector::AvailableServices)
          log "Skipping Access to features check: ::CloudConnector::AvailableServices is not available."
          return
        end

        ::CloudConnector::AvailableServices.available_services.each do |service_name, service|
          log_debug("#{service_name}:")
          purchased = false
          log_debug("  cut_off_date: #{service.cut_off_date}")
          purchased = if service.respond_to?(:purchased?)
                        service.purchased?
                      else
                        service.allowed_for?(nil)
                      end
          log_debug("  purchased: #{purchased}") 

          user_allowed = true
          if @user
            user_allowed = service.allowed_for?(@user)
            log_debug("  #{@username} is #{user_allowed ? '' : 'not '}assigned to a seat.")
          else
            log_debug("Use --username option to check if user is assigned to a seat.")
          end

          if service.free_access? || (purchased && user_allowed)
            success(format(SERVICE_HAS_ACCESS_TEXT, service_name: service_name))
          else
            failure(format(SERVICE_HAS_NO_ACCESS_TEXT, service_name: service_name))
          end
        end

        log_debug_add_ons if @debug
      rescue StandardError => e
        failure(e.message)
      end

      def log_debug_add_ons
        add_on_purchases = GitlabSubscriptions::AddOnPurchase.active
        log_debug("Purchased add-ons:")
        add_on_purchases.each do |add_on_purchase|
          log_debug("  - #{add_on_name(add_on_purchase.add_on)}")
        end
      end

      def check_end_to_end
        log "\nRunning end to end check..."
        unless defined?(::Gitlab::Llm::AiGateway::CodeSuggestionsClient)
          log "Skipping end to end check: ::Gitlab::Llm::AiGateway::CodeSuggestionsClient is not available."
          return
        end
        error = ::Gitlab::Llm::AiGateway::CodeSuggestionsClient.new(@user).test_completion
        return failure(format(TEST_COMPLETIONS_ERROR_TEXT, error: error)) if error.present?

        success(TEST_COMPLETIONS_TEXT)
      rescue StandardError => e
        failure(e.message)
      end

      def add_on_name(add_on)
        add_on.name == 'code_suggestions' ? 'duo_pro' : add_on.name
      end

      def connection_succeeded?(url)
        uri = URI.parse(url)
        host = uri.host
        port = uri.port
        TCPSocket.new(host, port).close
        [true, format(HOST_REACHABLE_TEXT, host: host)]
      rescue Errno::ENETUNREACH, Errno::EHOSTUNREACH
        [false, format(HOST_UNREACHABLE_TEXT, host: host)]
      rescue StandardError => e
        log_debug(format(CONNECTION_FAILED_DEBUG_TEXT, host: host, error: e))
        [false, format(CONNECTION_FAILED_TEST, host: host)]
      end

      def success(message)
        log("\e[32m✔ Success:\e[0m #{message}")
      end

      def failure(message)
        log("\e[31m✖ Failure:\e[0m #{message}")
      end

      def log_debug(message)
        log("  \e[34mDEBUG:\e[0m #{message}") if @debug
      end
    end
  end
end

return unless  $0 == __FILE__

TEST_OPTIONS = %i[access_data token license host features end_to_end].freeze

options = {}

OptionParser.new do |opts|
  opts.banner = "Usage: bin/rails runner cloud_connector"

  opts.on("--debug", "Enable debug mode") do
    options[:debug] = true
  end

  opts.on("--output-file FILE", "Write report to FILE") do |file|
    options[:output_file] = file
  end

  opts.on("--username USERNAME", "Provide a username to test seat assignments") do |username|
    options[:username] = username
  end

  opts.on("--skip [CHECK]", "Skip specific check (options: #{TEST_OPTIONS.join(', ')})") do |check|
    options[:skips] ||= []
    options[:skips] << check
  end
end.parse!

# Perform health check
health_check = Tasks::CloudConnector::HealthCheck.new(options)
health_check.perform_check