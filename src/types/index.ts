/**
 * ShieldSight AI - Type Definitions
 * Modular type specifications for Chrome extension state, messaging, storage, and image discovery.
 */

export interface ExtensionState {
  /** Indicates whether the visual protection engine is currently active */
  isProtectionEnabled: boolean;
  /** Application version string */
  version: string;
}

export type MessageType =
  | 'TOGGLE_PROTECTION'
  | 'GET_PROTECTION_STATUS'
  | 'PROTECTION_STATUS_CHANGED';

export interface BaseMessage {
  type: MessageType;
}

export interface ToggleProtectionMessage extends BaseMessage {
  type: 'TOGGLE_PROTECTION';
  payload: {
    enabled: boolean;
  };
}

export interface GetProtectionStatusMessage extends BaseMessage {
  type: 'GET_PROTECTION_STATUS';
}

export interface ProtectionStatusChangedMessage extends BaseMessage {
  type: 'PROTECTION_STATUS_CHANGED';
  payload: {
    enabled: boolean;
  };
}

export type ExtensionMessage =
  | ToggleProtectionMessage
  | GetProtectionStatusMessage
  | ProtectionStatusChangedMessage;

export interface StorageSchema {
  isProtectionEnabled: boolean;
}

/** Source of image discovery */
export type DiscoverySource = 'initial_scan' | 'mutation' | 'shadow_dom';

/** Metadata record for a discovered webpage image */
export interface DiscoveredImage {
  /** Unique assigned identifier */
  id: string;
  /** Reference to the DOM HTMLImageElement */
  element: HTMLImageElement;
  /** Image source URL */
  src: string;
  /** Image natural width in pixels */
  naturalWidth: number;
  /** Image natural height in pixels */
  naturalHeight: number;
  /** Discovery source origin */
  discoverySource: DiscoverySource;
  /** Epoch timestamp of discovery */
  timestamp: number;
}
