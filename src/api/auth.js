import { apiClient } from './client';

function decodeAccessToken(accessToken) {
  try {
    const payload = accessToken.split('.')[1];

    if (!payload) {
      return null;
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padding = '='.repeat((4 - (normalized.length % 4)) % 4);
    const decoded = window.atob(`${normalized}${padding}`);
    return JSON.parse(decoded);
  } catch {
    return null;
  }
}

export async function login(credentials) {
  const { data } = await apiClient.post('/api/auth/login', credentials);

  const accessToken = data.accessToken;
  const refreshToken = data.refreshToken;

  if (!accessToken || !refreshToken) {
    throw new Error('Login response did not include the expected tokens.');
  }

  const payload = decodeAccessToken(accessToken);

  return {
    user: {
      id: payload?.id ?? '',
      email: payload?.email ?? credentials.email,
      role: data.role ?? payload?.role ?? 'SUPERVISOR',
    },
    tokens: { accessToken, refreshToken },
  };
}

export async function logout() {
  const refreshToken = localStorage.getItem('refreshToken');

  if (refreshToken) {
    await apiClient.post('/api/auth/logout', { refreshToken }).catch(() => {});
  }

  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
}