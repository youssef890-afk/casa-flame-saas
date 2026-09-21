const USER_KEY = 'casa_current_user';
const USERS_KEY = 'casa_users';

export interface StoredUser {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: number;
}

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

function writeUsers(users: StoredUser[]) {
  try { localStorage.setItem(USERS_KEY, JSON.stringify(users)); } catch {}
}

export function getCurrentUserId(): string | null {
  try { return localStorage.getItem(USER_KEY); } catch { return null; }
}

export function setCurrentUserId(id: string | null) {
  try {
    if (id) localStorage.setItem(USER_KEY, id);
    else localStorage.removeItem(USER_KEY);
  } catch {}
}

export function signupUser(name: string, email: string, password: string): { ok: boolean; error?: string; user?: StoredUser } {
  const users = readUsers();
  const normalized = email.trim().toLowerCase();
  if (users.some((u) => u.email === normalized)) {
    return { ok: false, error: 'Email already registered' };
  }
  const user: StoredUser = {
    id: 'u-' + Date.now(),
    name: name.trim(),
    email: normalized,
    password,
    createdAt: Date.now(),
  };
  writeUsers([...users, user]);
  setCurrentUserId(user.id);
  return { ok: true, user };
}

export function loginUser(email: string, password: string): { ok: boolean; error?: string; user?: StoredUser } {
  const normalized = email.trim().toLowerCase();
  const users = readUsers();
  const found = users.find((u) => u.email === normalized && u.password === password);
  if (!found) return { ok: false, error: 'Email or password incorrect' };
  setCurrentUserId(found.id);
  return { ok: true, user: found };
}

export function logoutUser() {
  setCurrentUserId(null);
}

export function getCurrentUser(): StoredUser | null {
  const id = getCurrentUserId();
  if (!id) return null;
  return readUsers().find((u) => u.id === id) ?? null;
}

/**
 * Scope a localStorage key to the current user.
 * If no user is logged in, returns a guest key.
 */
export function scopedKey(base: string): string {
  const id = getCurrentUserId() ?? 'guest';
  return base + '__' + id;
}

export function scopedGet(base: string): string | null {
  try { return localStorage.getItem(scopedKey(base)); } catch { return null; }
}

export function scopedSet(base: string, value: string) {
  try { localStorage.setItem(scopedKey(base), value); } catch {}
}

export function scopedRemove(base: string) {
  try { localStorage.removeItem(scopedKey(base)); } catch {}
}
