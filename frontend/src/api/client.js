// Central place for every backend call the UI makes.
// Base URLs match the existing services — nothing here changes the backend.
const AUTH_API = "http://localhost:8081/api/auth";
const PG_API = "http://localhost:8082/api/pgs";
const COLLEGE_API = "http://localhost:8082/api/colleges";

async function readErrorMessage(response, fallback) {
  try {
    const text = await response.text();
    if (text) {
      try {
        const parsed = JSON.parse(text);
        return parsed.message || parsed.error || text;
      } catch {
        return text;
      }
    }
  } catch {
    // ignore
  }
  return fallback;
}

export async function login({ email, password }) {
  const response = await fetch(`${AUTH_API}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Invalid email or password."));
  }

  return response.json();
}

export async function register({ name, email, password, role }) {
  const response = await fetch(`${AUTH_API}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Registration failed."));
  }

  return response.json();
}

export async function getAllPGs() {
  const response = await fetch(PG_API);
  if (!response.ok) throw new Error("Unable to load PG listings.");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function searchPGs({ city, minRent, maxRent, gender, minRooms }) {
  const params = new URLSearchParams();
  if (city) params.append("city", city);
  if (minRent) params.append("minRent", minRent);
  if (maxRent) params.append("maxRent", maxRent);
  if (gender) params.append("gender", gender);
  if (minRooms) params.append("minRooms", minRooms);

  const url = params.toString() ? `${PG_API}/search?${params}` : PG_API;
  const response = await fetch(url);
  if (!response.ok) throw new Error("Unable to search PG listings.");
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function searchColleges(name) {
  if (!name || !name.trim()) return [];
  const response = await fetch(
    `${COLLEGE_API}/search?name=${encodeURIComponent(name.trim())}`
  );
  if (!response.ok) return [];
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}

export async function findNearbyHostelsByInstitution(institution, radiusMeters) {
  const params = new URLSearchParams({
    institution,
    radius: String(radiusMeters),
  });
  const response = await fetch(`${PG_API}/nearby-by-institution?${params}`);
  if (!response.ok) {
    throw new Error(
      await readErrorMessage(response, "We couldn't find hostels around you right now.")
    );
  }
  const data = await response.json();
  return Array.isArray(data) ? data : [];
}
