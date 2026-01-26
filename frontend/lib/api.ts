export const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Request failed');
  const data = await res.json();
  return data.data;
}