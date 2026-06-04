const BASE_URL = "http://localhost:5000";

async function apiFetch(path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const defaultOptions = {
    headers: { "Content-Type": "application/json" },
  };
  const response = await fetch(url, { ...defaultOptions, ...options });
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: response.statusText }));
    throw new Error(err.error || `HTTP ${response.status}`);
  }
  return response.json();
}
