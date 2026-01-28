FROM nginx:1.27-alpine

# Install certbot for SSL certificates
RUN apk add --no-cache certbot certbot-nginx

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create directories for certbot
RUN mkdir -p /var/www/certbot /etc/letsencrypt

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/health || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
