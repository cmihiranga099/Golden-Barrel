export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export function getTokens(): Tokens | null {
  if (typeof window === 'undefined') return null;
  const accessToken = localStorage.getItem('gb_access');
  const refreshToken = localStorage.getItem('gb_refresh');
  if (!accessToken || !refreshToken) return null;
  return { accessToken, refreshToken };
}

export function setTokens(tokens: Tokens) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('gb_access', tokens.accessToken);
  localStorage.setItem('gb_refresh', tokens.refreshToken);
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('gb_access');
  localStorage.removeItem('gb_refresh');
  localStorage.removeItem('gb_role');
  document.cookie = 'gb_role=; Max-Age=0; path=/';
}

export function decodeJwt(token: string): any {
  try {
    const payload = token.split('.')[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export function setRoleFromToken(token: string) {
  const payload = decodeJwt(token);
  const role = payload?.role;
  if (role) {
    localStorage.setItem('gb_role', role);
    document.cookie = `gb_role=${role}; path=/`;
  }
}