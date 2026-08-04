/**
 * ShieldSight AI - Application Constants
 */

export const APP_INFO = {
  NAME: 'ShieldSight AI',
  TAGLINE: 'AI Protection for Safer Browsing',
  VERSION: '1.0',
} as const;

export const STORAGE_KEYS = {
  PROTECTION_ENABLED: 'isProtectionEnabled',
} as const;

export const DEFAULT_SETTINGS = {
  IS_PROTECTION_ENABLED: true,
} as const;
