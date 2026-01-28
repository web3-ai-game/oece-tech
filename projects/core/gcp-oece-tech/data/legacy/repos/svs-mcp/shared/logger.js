import winston from 'winston';
import fs from 'fs';
import path from 'path';

/**
 * Create a Winston logger instance with file and console transports
 * @param {string} serviceName - Name of the service for log identification
 * @param {string} logLevel - Logging level (default: 'info')
 * @returns {winston.Logger} Configured logger instance
 */
export function createLogger(serviceName, logLevel = 'info') {
  // Ensure logs directory exists
  const logsDir = process.env.LOGS_DIR || path.join(process.cwd(), '../../../logs');
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }

  const logger = winston.createLogger({
    level: logLevel,
    format: winston.format.combine(
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: serviceName },
    transports: [
      // Console transport with colorized output
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(
            ({ timestamp, level, message, service, ...meta }) => {
              let msg = `${timestamp} [${service}] ${level}: ${message}`;
              if (Object.keys(meta).length > 0) {
                msg += ` ${JSON.stringify(meta)}`;
              }
              return msg;
            }
          )
        ),
      }),
      // Error log file
      new winston.transports.File({
        filename: path.join(logsDir, `${serviceName}-error.log`),
        level: 'error',
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      }),
      // Combined log file
      new winston.transports.File({
        filename: path.join(logsDir, `${serviceName}-combined.log`),
        maxsize: 10485760, // 10MB
        maxFiles: 5,
      }),
    ],
  });

  return logger;
}

/**
 * Express middleware for request logging
 * @param {winston.Logger} logger - Logger instance
 * @returns {Function} Express middleware
 */
export function requestLogger(logger) {
  return (req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info('HTTP Request', {
        method: req.method,
        url: req.url,
        status: res.statusCode,
        duration: `${duration}ms`,
        ip: req.ip,
        userAgent: req.get('user-agent'),
      });
    });

    next();
  };
}

export default { createLogger, requestLogger };
