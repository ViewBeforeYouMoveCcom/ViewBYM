const STORAGE_KEY = "vbym-cookie-consent";
const EVENT_NAME = "vbym-cookie-consent-changed";

export type CookieConsent = "accepted" | "rejected";

export function getCookieConsent(): CookieConsent | null {
  if (typeof window === "undefined") return null;
  const value = window.localStorage.getItem(STORAGE_KEY);
  return value === "accepted" || value === "rejected" ? value : null;
}

export function setCookieConsent(value: CookieConsent) {
  window.localStorage.setItem(STORAGE_KEY, value);
  window.dispatchEvent(new CustomEvent<CookieConsent | null>(EVENT_NAME, { detail: value }));
}

export function clearCookieConsent() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent<CookieConsent | null>(EVENT_NAME, { detail: null }));
}

export function onCookieConsentChange(handler: (value: CookieConsent | null) => void) {
  const listener = (e: Event) => handler((e as CustomEvent<CookieConsent | null>).detail);
  window.addEventListener(EVENT_NAME, listener);
  return () => window.removeEventListener(EVENT_NAME, listener);
}
