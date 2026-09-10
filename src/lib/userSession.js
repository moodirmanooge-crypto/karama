const KEY = "karama_user_session";

export function saveUserSession(user) {
  sessionStorage.setItem(KEY, JSON.stringify(user));
}

export function getUserSession() {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearUserSession() {
  sessionStorage.removeItem(KEY);
}