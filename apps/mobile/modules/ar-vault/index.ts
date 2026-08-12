import { requireOptionalNativeModule, requireNativeViewManager } from 'expo-modules-core';
import type * as React from 'react';
import type { ViewStyle } from 'react-native';

/**
 * ARKit / RealityKit vault visualisation.
 *
 * Everything native is resolved LAZILY behind a try/catch. `requireNativeModule`
 * throws when the native module is absent (Expo Go, or the web build), and a
 * throw at module scope would take down every screen that imports this file --
 * exactly the failure mode that made only the Verification screen render when
 * expo-crypto pulled in a missing ExpoCryptoAES. Callers get `isSupported() ===
 * false` and render a fallback instead.
 */

export type ARVaultKind = 'gold' | 'land' | 'tower' | 'shield';

export interface ARVaultItem {
  id: string;
  label: string;
  /**
   * 0..1, normalised against the largest holding — NOT an absolute value.
   * An absolute scale makes a large property a 3-metre tower and a small cash
   * entry invisible.
   */
  magnitude: number;
  kind: ARVaultKind;
}

export interface ARVaultViewProps {
  items: ARVaultItem[];
  style?: ViewStyle;
}

let nativeModule: { isSupported: () => boolean } | null | undefined;
let nativeView: React.ComponentType<ARVaultViewProps> | null | undefined;

function getNativeModule() {
  if (nativeModule !== undefined) return nativeModule;
  // requireOptionalNativeModule returns null rather than throwing, which is
  // exactly the semantics we want; requireNativeModule throws
  // "Cannot find native module 'ARVault'" and would break every importer.
  nativeModule = requireOptionalNativeModule('ARVault') ?? null;
  return nativeModule;
}

/**
 * Whether the native module is linked at all — false in Expo Go, in the
 * Simulator's Expo Go, and on web.
 *
 * Use this rather than checking `getARVaultView()`: `requireNativeViewManager`
 * returns a stub component instead of throwing when the view is unregistered,
 * so a truthy view says nothing about whether AR is really available.
 */
export function isNativeModuleAvailable(): boolean {
  return getNativeModule() !== null;
}

/** True only on a real ARKit-capable device in a dev/production build. */
export function isSupported(): boolean {
  const mod = getNativeModule();
  if (!mod) return false;
  try {
    return mod.isSupported();
  } catch {
    return false;
  }
}

/** Null when the native module is unavailable — check before rendering. */
export function getARVaultView(): React.ComponentType<ARVaultViewProps> | null {
  if (nativeView !== undefined) return nativeView;
  // Gate on the module: asking for an unregistered view manager logs a
  // "may not render correctly" warning and hands back a stub that renders
  // nothing, which is worse than not asking.
  if (!isNativeModuleAvailable()) {
    nativeView = null;
    return nativeView;
  }
  try {
    nativeView = requireNativeViewManager('ARVault');
  } catch {
    nativeView = null;
  }
  return nativeView;
}
