const BASE = '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(body.error?.code || 'REQUEST_FAILED');
    err.status = res.status;
    err.detail = body.error?.message;
    throw err;
  }
  return body;
}

export const api = {
  createGame: (body = {}) => request('/games', { method: 'POST', body: JSON.stringify(body) }),
  listGames: () => request('/games'),
  getGame: (id) => request(`/games/${id}`),
  makeMove: (id, { from, to, promotion }) =>
    request(`/games/${id}/move`, { method: 'POST', body: JSON.stringify({ from, to, promotion }) }),
  deleteGame: (id) => request(`/games/${id}`, { method: 'DELETE' })
};
