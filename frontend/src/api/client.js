// Central place for every backend call the UI makes.
// Base URLs match the existing services — nothing here changes the backend.
const AUTH_API = "http://localhost:8081/api/auth";
const ADMIN_API = "http://localhost:8081/api/admin";
const PG_API = "http://localhost:8082/api/pgs";
const COLLEGE_API = "http://localhost:8082/api/colleges";

function authHeaders(token) {
  return { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
}

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

  // The backend returns a plain confirmation string, not JSON — nothing to parse.
  return true;
}

export async function updateProfile(id, { name, email }) {
  const response = await fetch(`${AUTH_API}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Unable to update profile."));
  }

  return response.json();
}

export async function changePassword(id, { currentPassword, newPassword }) {
  const response = await fetch(`${AUTH_API}/users/${id}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Unable to change password."));
  }

  return response.json();
}

export async function forgotPassword(email) {
  const response = await fetch(`${AUTH_API}/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Unable to send reset email."));
  }

  return response.json();
}

export async function resetPassword(token, newPassword) {
  const response = await fetch(`${AUTH_API}/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token, newPassword }),
  });

  if (!response.ok) {
    throw new Error(await readErrorMessage(response, "Unable to reset password."));
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

// --------------------------------------------------
// ADMIN
// --------------------------------------------------

export async function getAdminUsers(token) {
  const response = await fetch(`${ADMIN_API}/users`, { headers: authHeaders(token) });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Unable to load users."));
  return response.json();
}

export async function deleteAdminUser(token, id) {
  const response = await fetch(`${ADMIN_API}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Unable to delete user."));
  // The backend returns a plain confirmation string, not JSON — nothing to parse.
  return true;
}

export async function getPendingPGs(token) {
  const response = await fetch(`${PG_API}/admin/pending`, { headers: authHeaders(token) });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to load pending listings."));
  return response.json();
}

export async function getApprovedPGsAdmin(token) {
  const response = await fetch(`${PG_API}/admin/approved`, { headers: authHeaders(token) });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to load approved listings."));
  return response.json();
}

export async function getRejectedPGsAdmin(token) {
  const response = await fetch(`${PG_API}/admin/rejected`, { headers: authHeaders(token) });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to load rejected listings."));
  return response.json();
}

export async function approvePGAdmin(token, id) {
  const response = await fetch(`${PG_API}/admin/approve/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
  });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to approve this listing."));
  return response.json();
}

export async function rejectPGAdmin(token, id) {
  const response = await fetch(`${PG_API}/admin/reject/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
  });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to reject this listing."));
  return response.json();
}

export async function addPGAdmin(token, pg) {
  const response = await fetch(`${PG_API}/admin/add`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(pg),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Unable to add this PG."));
  return response.json();
}

export async function deletePGAdmin(token, id) {
  const response = await fetch(`${PG_API}/admin/delete/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to delete this listing."));
  return true;
}

export async function getMyPGs(token) {
  const response = await fetch(`${PG_API}/owner/mine`, { headers: authHeaders(token) });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to load your listings."));
  return response.json();
}

export async function addOwnerPG(token, pg) {
  const response = await fetch(`${PG_API}/owner/add`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(pg),
  });
  if (!response.ok) throw new Error(await readErrorMessage(response, "Unable to add this PG."));
  return response.json();
}

export async function updateOwnerPG(token, id, pg) {
  const response = await fetch(`${PG_API}/owner/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(pg),
  });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to update this listing."));
  return response.json();
}

export async function deleteOwnerPG(token, id) {
  const response = await fetch(`${PG_API}/owner/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
  if (!response.ok)
    throw new Error(await readErrorMessage(response, "Unable to delete this listing."));
  return true;
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
