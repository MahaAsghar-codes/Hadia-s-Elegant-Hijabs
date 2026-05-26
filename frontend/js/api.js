const tokenKey = 'hadia_token';

const api = {
  token() {
    return localStorage.getItem(tokenKey);
  },
  setToken(token) {
    if (token) localStorage.setItem(tokenKey, token);
  },
  clearToken() {
    localStorage.removeItem(tokenKey);
  },
  async request(path, options = {}) {
    const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
    const token = this.token();
    if (token) headers.Authorization = 'Bearer ' + token;

    const response = await fetch(`${window.API_BASE_URL}${path}`, {
      ...options,
      headers
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || 'Request failed');
    return data;
  }
};

window.hadiaApi = api;
