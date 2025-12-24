/**
 * 日志工具
 * 统一的日志记录系统
 */

import { isDevelopment } from './env'

export enum LogLevel {
  DEBUG = 'DEBUG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  context?: Record<string, any>
  error?: Error
}

class Logger {
  private isDev = isDevelopment()

  private formatMessage(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry
    let formatted = `[${timestamp}] [${level}] ${message}`

    if (context) {
      formatted += `\nContext: ${JSON.stringify(context, null, 2)}`
    }

    if (error) {
      formatted += `\nError: ${error.message}\nStack: ${error.stack}`
    }

    return formatted
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error,
    }

    const formatted = this.formatMessage(entry)

    // 开发环境输出到控制台
    if (this.isDev) {
      switch (level) {
        case LogLevel.DEBUG:
        case LogLevel.INFO:
          console.log(formatted)
          break
        case LogLevel.WARN:
          console.warn(formatted)
          break
        case LogLevel.ERROR:
          console.error(formatted)
          break
      }
    }

    // 生产环境可以发送到日志服务
    if (!this.isDev && (level === LogLevel.ERROR || level === LogLevel.WARN)) {
      this.sendToLogService(entry)
    }
  }

  private async sendToLogService(entry: LogEntry) {
    // TODO: 实现发送到日志服务的逻辑
    // 例如：发送到 Sentry, LogRocket 等
    try {
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry),
      // })
    } catch (error) {
      console.error('Failed to send log:', error)
    }
  }

  debug(message: string, context?: Record<string, any>) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log(LogLevel.ERROR, message, context, error)
  }
}

// 单例导出
export const logger = new Logger()

// 便捷的导出函数
export const log = {
  debug: (message: string, context?: Record<string, any>) => logger.debug(message, context),
  info: (message: string, context?: Record<string, any>) => logger.info(message, context),
  warn: (message: string, context?: Record<string, any>) => logger.warn(message, context),
  error: (message: string, error?: Error, context?: Record<string, any>) =>
    logger.error(message, error, context),
}
