const API_BASE_URL = "http://localhost:5000/api";

export async function checkBackendHealth() {
  const res = await fetch(`${API_BASE_URL}/health`);
  if (!res.ok) throw new Error("Backend not reachable");
  return res.json();
}
