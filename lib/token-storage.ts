// Bearer tokens live in localStorage on web (there's no secure-enclave
// equivalent to expo-secure-store in a browser). All access is guarded for
// SSR since Next.js renders this on the server too, where `window` is
// undefined.
export const tokenStorage = {
  getItem(key: string): string | null {
    if (typeof window === "undefined") return null;
    try {
      return window.localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(key, value);
    } catch {
      // storage unavailable (private browsing, quota, etc.) -- fail silently,
      // same as the mobile app's secureStorage wrapper
    }
  },
  removeItem(key: string): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
};
