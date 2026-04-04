/**
 * Detect if running in React Native or Web environment.
 */
export const isNative =
  typeof navigator !== 'undefined' && navigator.product === 'ReactNative';
