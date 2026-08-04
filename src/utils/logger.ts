/**
 * ShieldSight AI - Central Logger Utility
 * Handles structured environment-aware logging.
 * In Development / Test (DEBUG = true): Verbose telemetry logging.
 * In Production (DEBUG = false): Suppresses verbose logs; emits only warnings and errors.
 */

const isDevelopment = (): boolean => {
  if (typeof process !== 'undefined' && process.env) {
    const env = process.env.NODE_ENV;
    if (env === 'production') {
      return false;
    }
    return true;
  }
  return true;
};

let DEBUG_FLAG: boolean = isDevelopment();

export const setDebugLogging = (enabled: boolean): void => {
  DEBUG_FLAG = enabled;
};

export const isDebugEnabled = (): boolean => DEBUG_FLAG;

export const logger = {
  debug: (...args: unknown[]): void => {
    if (DEBUG_FLAG) {
      console.log('[ShieldSight DEBUG]', ...args);
    }
  },

  info: (...args: unknown[]): void => {
    if (DEBUG_FLAG) {
      console.log('[ShieldSight AI]', ...args);
    }
  },

  warn: (...args: unknown[]): void => {
    console.warn('[ShieldSight Warning]', ...args);
  },

  error: (...args: unknown[]): void => {
    console.error('[ShieldSight Error]', ...args);
  },

  styled: (prefix: string, message: string, stylePrefix: string, styleMessage: string, ...extra: unknown[]): void => {
    if (DEBUG_FLAG) {
      console.log(`%c${prefix}%c ${message}`, stylePrefix, styleMessage, ...extra);
    }
  },
};
