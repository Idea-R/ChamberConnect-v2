import { APP_CONFIG } from '../../config/app.config';

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  FATAL = 4,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  data?: any;
  timestamp: Date;
  source?: string;
  userId?: string;
  sessionId?: string;
}

export interface LoggerConfig {
  level: LogLevel;
  enableConsole: boolean;
  enableRemote: boolean;
  maxEntries: number;
  remoteEndpoint?: string;
}

class LoggerService {
  private config: LoggerConfig;
  private entries: LogEntry[] = [];
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.config = {
      level: this.getLogLevelFromConfig(),
      enableConsole: true,
      enableRemote: APP_CONFIG.environment === 'production',
      maxEntries: 1000,
      remoteEndpoint: `${APP_CONFIG.api.baseUrl}/logs`,
    };
  }

  private getLogLevelFromConfig(): LogLevel {
    const configLevel = APP_CONFIG.dev.logLevel;
    switch (configLevel) {
      case 'debug': return LogLevel.DEBUG;
      case 'info': return LogLevel.INFO;
      case 'warn': return LogLevel.WARN;
      case 'error': return LogLevel.ERROR;
      case 'fatal': return LogLevel.FATAL;
      default: return LogLevel.INFO;
    }
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.config.level;
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    const levelStr = LogLevel[level].padEnd(5);
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] ${levelStr} | ${message}${dataStr}`;
  }

  private addEntry(level: LogLevel, message: string, data?: any, source?: string): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      data,
      timestamp: new Date(),
      source,
      sessionId: this.sessionId,
    };

    this.entries.push(entry);

    // Maintain max entries limit
    if (this.entries.length > this.config.maxEntries) {
      this.entries = this.entries.slice(-this.config.maxEntries);
    }

    // Console logging
    if (this.config.enableConsole) {
      this.logToConsole(level, message, data);
    }

    // Remote logging for errors and fatal
    if (this.config.enableRemote && level >= LogLevel.ERROR) {
      this.logToRemote(entry).catch(error => {
        // Fallback to console if remote logging fails
        console.error('Failed to log to remote:', error);
      });
    }
  }

  private logToConsole(level: LogLevel, message: string, data?: any): void {
    const formattedMessage = this.formatMessage(level, message, data);

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedMessage);
        break;
      case LogLevel.INFO:
        console.info(formattedMessage);
        break;
      case LogLevel.WARN:
        console.warn(formattedMessage);
        break;
      case LogLevel.ERROR:
      case LogLevel.FATAL:
        console.error(formattedMessage);
        break;
    }
  }

  private async logToRemote(entry: LogEntry): Promise<void> {
    try {
      await fetch(this.config.remoteEndpoint!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      // Silently fail - we don't want logging to break the app
    }
  }

  // Public logging methods
  debug(message: string, data?: any, source?: string): void {
    this.addEntry(LogLevel.DEBUG, message, data, source);
  }

  info(message: string, data?: any, source?: string): void {
    this.addEntry(LogLevel.INFO, message, data, source);
  }

  warn(message: string, data?: any, source?: string): void {
    this.addEntry(LogLevel.WARN, message, data, source);
  }

  error(message: string, data?: any, source?: string): void {
    this.addEntry(LogLevel.ERROR, message, data, source);
  }

  fatal(message: string, data?: any, source?: string): void {
    this.addEntry(LogLevel.FATAL, message, data, source);
  }

  // Utility methods
  setUserId(userId: string): void {
    this.entries.forEach(entry => {
      if (!entry.userId) {
        entry.userId = userId;
      }
    });
  }

  setLogLevel(level: LogLevel): void {
    this.config.level = level;
  }

  getEntries(level?: LogLevel): LogEntry[] {
    if (level !== undefined) {
      return this.entries.filter(entry => entry.level === level);
    }
    return [...this.entries];
  }

  clearEntries(): void {
    this.entries = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.entries, null, 2);
  }

  // Performance logging
  time(label: string): void {
    console.time(label);
  }

  timeEnd(label: string): void {
    console.timeEnd(label);
  }

  // Group logging
  group(label: string): void {
    console.group(label);
  }

  groupEnd(): void {
    console.groupEnd();
  }

  // Table logging for objects
  table(data: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.table(data);
    }
  }

  // Async operation logging
  async logAsyncOperation<T>(
    operation: () => Promise<T>,
    operationName: string,
    context?: any
  ): Promise<T> {
    const startTime = Date.now();
    this.debug(`Starting ${operationName}`, context);

    try {
      const result = await operation();
      const duration = Date.now() - startTime;
      this.info(`Completed ${operationName}`, { duration, context });
      return result;
    } catch (error) {
      const duration = Date.now() - startTime;
      this.error(`Failed ${operationName}`, { error, duration, context });
      throw error;
    }
  }

  // HTTP request logging
  logHttpRequest(method: string, url: string, status?: number, duration?: number, data?: any): void {
    const level = status && status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.addEntry(level, `HTTP ${method} ${url}`, {
      status,
      duration,
      data,
    }, 'HTTP');
  }

  // User action logging
  logUserAction(action: string, details?: any): void {
    this.info(`User Action: ${action}`, details, 'USER');
  }

  // Performance metrics
  logPerformanceMetric(metric: string, value: number, unit: string = 'ms'): void {
    this.info(`Performance: ${metric}`, { value, unit }, 'PERFORMANCE');
  }
}

// Export singleton instance
export const Logger = new LoggerService();

// Export types and enums
export type { LogEntry, LoggerConfig };
export { LogLevel }; 