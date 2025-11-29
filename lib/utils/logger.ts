// 📝 日志系统（生产级）

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  /**
   * 格式化日志
   */
  private formatLog(entry: LogEntry): string {
    const { level, message, timestamp, context } = entry;
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`;
  }

  /**
   * 发送日志到外部服务（如 Sentry）
   */
  private async sendToExternalService(entry: LogEntry): Promise<void> {
    // TODO: 集成 Sentry / CloudWatch / Datadog
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
      // 发送到 Sentry
    }
  }

  /**
   * Debug 日志（仅开发环境）
   */
  debug(message: string, context?: Record<string, any>): void {
    if (!this.isDevelopment) return;

    const entry: LogEntry = {
      level: 'debug',
      message,
      timestamp: new Date().toISOString(),
      context
    };

    console.debug(this.formatLog(entry));
  }

  /**
   * Info 日志
   */
  info(message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level: 'info',
      message,
      timestamp: new Date().toISOString(),
      context
    };

    console.info(this.formatLog(entry));
  }

  /**
   * Warning 日志
   */
  warn(message: string, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level: 'warn',
      message,
      timestamp: new Date().toISOString(),
      context
    };

    console.warn(this.formatLog(entry));
    this.sendToExternalService(entry);
  }

  /**
   * Error 日志
   */
  error(message: string, error?: Error, context?: Record<string, any>): void {
    const entry: LogEntry = {
      level: 'error',
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };

    console.error(this.formatLog(entry));

    if (error) {
      console.error('Error stack:', error.stack);
    }

    this.sendToExternalService(entry);
  }

  /**
   * API 请求日志
   */
  apiRequest(method: string, path: string, context?: Record<string, any>): void {
    this.info(`API ${method} ${path}`, context);
  }

  /**
   * API 响应日志
   */
  apiResponse(method: string, path: string, status: number, duration: number): void {
    const level = status >= 500 ? 'error' : status >= 400 ? 'warn' : 'info';

    const entry: LogEntry = {
      level,
      message: `API ${method} ${path} - ${status}`,
      timestamp: new Date().toISOString(),
      context: { status, duration }
    };

    console.log(this.formatLog(entry));
  }
}

// 导出单例
export const logger = new Logger();
