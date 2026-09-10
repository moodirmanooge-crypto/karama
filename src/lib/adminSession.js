const KEY = "karama_admin_session";

export function saveAdminSession(admin) {
  sessionStorage.setItem(KEY, JSON.stringify(admin));
}

export function getAdminSession() {
  const raw = sessionStorage.getItem(KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearAdminSession() {
  sessionStorage.removeItem(KEY);
}
