import { requireNativeModule } from 'expo-modules-core';

export type AppInfo = {
  name: string;
  packageName: string;
};

// It loads the native module object from the JSI or falls back to
// the bridge module (from NativeModulesProxy) if the remote debugger is on.
const BlockDistractionsModule = requireNativeModule('BlockDistractions');

export function getInstalledApps(): AppInfo[] {
  return BlockDistractionsModule.getInstalledApps();
}

export function openAccessibilitySettings(): void {
  return BlockDistractionsModule.openAccessibilitySettings();
}

export function hasOverlayPermission(): boolean {
  return BlockDistractionsModule.hasOverlayPermission();
}

export function openOverlaySettings(): void {
  return BlockDistractionsModule.openOverlaySettings();
}

export function setBlockedApps(apps: string[]): void {
  return BlockDistractionsModule.setBlockedApps(apps);
}

export function getBlockedApps(): string[] {
  return BlockDistractionsModule.getBlockedApps();
}

export function setPendingTasks(tasks: string): void {
  return BlockDistractionsModule.setPendingTasks(tasks);
}
