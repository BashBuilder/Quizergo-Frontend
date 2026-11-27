// Bearer tokens live in cookies for security (HttpOnly when possible).
// Cookies are automatically included in requests to the same origin.
// We use document.cookie for client-side JS, which works for non-HttpOnly cookies.
// HttpOnly cookies cannot be read by JS - the backend will need to handle those.
export const tokenStorage = {
  // Cookie-based storage (works with SameSite=Lax cookies)
  getItem(key: string): string | null {
    if (typeof document === "undefined") return null;
    try {
      const name = key + "=";
      const decoded = decodeURIComponent(document.cookie);
      const cookies = decoded.split("; ");
      for (const cookie of cookies) {
        if (cookie.startsWith(name)) {
          return cookie.substring(name.length);
        }
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem(key: string, value: string): void {
    if (typeof document === "undefined") return;
    try {
      // Set cookie with 7-day expiry, HttpOnly is set by server
      // For XSS mitigation, prefer server-set HttpOnly cookies
      const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `${key}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
    } catch {
      // storage unavailable -- fail silently
    }
  },
  removeItem(key: string): void {
    if (typeof document === "undefined") return;
    try {
      document.cookie = `${key}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
    } catch {
      // ignore
    }
  },
};
