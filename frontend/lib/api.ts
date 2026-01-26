export const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

import { getTokens, setTokens } from './auth';

async function tryRefresh() {
  const tokens = getTokens();
  if (!tokens?.refreshToken) return null;
  const res = await fetch(`${apiBase}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tokens.refreshToken }),
  });
  if (!res.ok) return null;
  const json = await res.json();
  const next = json.data || json;
  if (next?.accessToken && next?.refreshToken) {
    setTokens({ accessToken: next.accessToken, refreshToken: next.refreshToken });
    return next.accessToken;
  }
  return null;
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const tokens = getTokens();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  };
  if (tokens?.accessToken) headers.Authorization = `Bearer ${tokens.accessToken}`;
  const res = await fetch(`${apiBase}${path}`, { ...init, headers });
  if (res.status === 401) {
    const newAccess = await tryRefresh();
    if (newAccess) {
      const retryHeaders = { ...headers, Authorization: `Bearer ${newAccess}` };
      const retry = await fetch(`${apiBase}${path}`, { ...init, headers: retryHeaders });
      if (!retry.ok) throw new Error('Request failed');
      const retryJson = await retry.json();
      return retryJson.data;
    }
  }
  if (!res.ok) throw new Error('Request failed');
  const data = await res.json();
  return data.data;
}

export async function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { cache: 'no-store' });
}

export async function apiPost<T>(path: string, body?: any): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body: JSON.stringify(body || {}) });
}

export async function apiPatch<T>(path: string, body?: any): Promise<T> {
  return apiFetch<T>(path, { method: 'PATCH', body: JSON.stringify(body || {}) });
}
