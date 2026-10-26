const USER_KEY = 'casa_current_user';
const LEGACY_USERS_KEY = 'casa_users';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  createdAt: number;
}

export function setCurrentUserId(id: string | null) {
  try {
    if (id) localStorage.setItem(USER_KEY, id);
    else localStorage.removeItem(USER_KEY);
  } catch {}
}

export function clearLegacyUserCredentials() {
  try {
    localStorage.removeItem(LEGACY_USERS_KEY);
  } catch {}
}

/**
 * Scope a localStorage key to the authenticated user or the guest session.
 */
export function scopedKey(base: string): string {
  let id: string | null = null;
  try {
    id = localStorage.getItem(USER_KEY);
  } catch {}
  return `${base}__${id ?? 'guest'}`;
}

export function scopedGet(base: string): string | null {
  try {
    return localStorage.getItem(scopedKey(base));
  } catch {
    return null;
  }
}

export function scopedSet(base: string, value: string) {
  try {
    localStorage.setItem(scopedKey(base), value);
  } catch {}
}

export function scopedRemove(base: string) {
  try {
    localStorage.removeItem(scopedKey(base));
  } catch {}
}
