import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";
import { getMyPGs, addOwnerPG, updateOwnerPG, deleteOwnerPG } from "../api/client";
import {
  BriefcaseIcon,
  PlusIcon,
  TrashIcon,
  MapPinIcon,
} from "../components/icons";

const EMPTY_PG_FORM = {
  name: "",
  address: "",
  city: "Ahmedabad",
  rent: "",
  availableRooms: "",
  gender: "MALE",
  type: "PG",
  phone: "",
  restrictedToCollege: "",
  amenities: "",
  description: "",
  latitude: "",
  longitude: "",
};

function pgToForm(pg) {
  return {
    name: pg.name || "",
    address: pg.address || "",
    city: pg.city || "Ahmedabad",
    rent: pg.rent ?? "",
    availableRooms: pg.availableRooms ?? "",
    gender: pg.gender || "MALE",
    type: pg.type || "PG",
    phone: pg.phone || "",
    restrictedToCollege: pg.restrictedToCollege || "",
    amenities: pg.amenities || "",
    description: pg.description || "",
    latitude: pg.latitude ?? "",
    longitude: pg.longitude ?? "",
  };
}

function OwnerDashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "OWNER") {
      navigate("/");
    }
  }, [user, navigate]);

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // the PG pending delete confirmation

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null => adding a new PG
  const [form, setForm] = useState(EMPTY_PG_FORM);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "OWNER") return;

    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const mine = await getMyPGs(user.token);
        if (!cancelled) setListings(mine);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load your listings.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_PG_FORM);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (pg) => {
    setEditingId(pg.id);
    setForm(pgToForm(pg));
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_PG_FORM);
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    const name = form.name.trim();
    const city = form.city.trim();
    const rent = Number(form.rent);
    const availableRooms = Number(form.availableRooms);

    if (!name) return setFormError("Please enter a PG name.");
    if (!city) return setFormError("Please enter a city.");
    if (!form.rent || Number.isNaN(rent) || rent <= 0) {
      return setFormError("Please enter a valid rent amount.");
    }
    if (!form.availableRooms || Number.isNaN(availableRooms) || availableRooms < 0) {
      return setFormError("Please enter a valid number of available rooms.");
    }

    const payload = {
      name,
      address: form.address.trim() || null,
      city,
      rent,
      availableRooms,
      gender: form.gender,
      type: form.type,
      phone: form.phone.trim() || null,
      restrictedToCollege: form.restrictedToCollege.trim() || null,
      amenities: form.amenities.trim() || null,
      description: form.description.trim() || null,
      latitude: form.latitude ? Number(form.latitude) : null,
      longitude: form.longitude ? Number(form.longitude) : null,
    };

    setFormLoading(true);
    try {
      if (editingId) {
        const updated = await updateOwnerPG(user.token, editingId, payload);
        setListings((list) => list.map((item) => (item.id === editingId ? updated : item)));
      } else {
        const created = await addOwnerPG(user.token, payload);
        setListings((list) => [created, ...list]);
      }
      closeForm();
    } catch (err) {
      setFormError(err.message || "Unable to save this listing.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (pg) => {
    setActionError("");
    setBusyId(pg.id);
    try {
      await deleteOwnerPG(user.token, pg.id);
      setListings((list) => list.filter((item) => item.id !== pg.id));
    } catch (err) {
      setActionError(err.message || "Unable to delete this listing.");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  if (!user || user.role !== "OWNER") {
    return null;
  }

  return (
    <div className="page">
      <Navbar minimal />

      <section className="admin-page">
        <div className="admin-header">
          <span className="admin-header-icon">
            <BriefcaseIcon />
          </span>
          <div>
            <h1>My Listings</h1>
            <p className="section-sub">
              Add, edit and manage the PGs you've listed on CampusNest.
            </p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {actionError && <div className="alert alert-error">{actionError}</div>}

        {loading ? (
          <div className="nearby-panel">
            <span className="spinner" />
            <p>Loading your listings…</p>
          </div>
        ) : (
          <>
            <div className="admin-tabs-row">
              <p className="section-sub">
                {listings.length} listing{listings.length === 1 ? "" : "s"} total. New listings
                and edits are reviewed by an admin before they go live.
              </p>

              <button type="button" className="btn btn-primary btn-sm" onClick={openAddForm}>
                <PlusIcon /> Add PG
              </button>
            </div>

            <div className="admin-panel-card">
              {listings.length === 0 ? (
                <div className="nearby-panel">
                  <p>You haven't listed any PGs yet. Click "Add PG" to create your first one.</p>
                </div>
              ) : (
                <div className="admin-pg-list">
                  {listings.map((pg) => (
                    <div className="admin-pg-row" key={pg.id}>
                      <div className="admin-pg-row-main">
                        <strong>{pg.name}</strong>
                        <span className="pg-location">
                          <MapPinIcon />
                          {pg.address ? `${pg.address}, ` : ""}
                          {pg.city}
                        </span>
                        <div className="admin-pg-row-meta">
                          <span>₹{pg.rent}/mo</span>
                          <span>{pg.availableRooms} rooms</span>
                          <span>{pg.gender}</span>
                        </div>
                      </div>

                      <div className="admin-pg-row-actions">
                        <span
                          className={`badge-status badge-status-${(pg.status || "").toLowerCase()}`}
                        >
                          {pg.status}
                        </span>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm"
                          disabled={busyId === pg.id}
                          onClick={() => openEditForm(pg)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline btn-sm admin-btn-danger"
                          disabled={busyId === pg.id}
                          onClick={() => setConfirm(pg)}
                          aria-label={`Delete ${pg.name}`}
                          title="Delete permanently"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </section>

      <Footer />

      {confirm && (
        <div className="modal-overlay" onClick={() => setConfirm(null)}>
          <div className="modal-card admin-confirm-card" onClick={(e) => e.stopPropagation()}>
            <h3>Delete this listing?</h3>
            <p className="modal-description">
              "{confirm.name}" will be permanently removed. This can't be undone.
            </p>
            <div className="admin-confirm-actions">
              <button type="button" className="btn btn-outline btn-sm" onClick={() => setConfirm(null)}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm admin-btn-danger-solid"
                disabled={busyId === confirm.id}
                onClick={() => handleDelete(confirm)}
              >
                Delete Listing
              </button>
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={closeForm}>
          <div className="modal-card admin-form-card" onClick={(e) => e.stopPropagation()}>
            <h3>{editingId ? "Edit Listing" : "Add New PG"}</h3>
            <p className="modal-description">
              {editingId
                ? "Changes will be re-reviewed by an admin before they go live again."
                : "Your listing will be reviewed by an admin before it appears in search."}
            </p>

            {formError && <div className="alert alert-error">{formError}</div>}

            <form onSubmit={handleSubmit} className="admin-form-grid">
              <div className="field admin-form-span-2">
                <label>PG / Hostel Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="field admin-form-span-2">
                <label>Address</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>

              <div className="field">
                <label>City</label>
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Phone</label>
                <input
                  type="text"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Rent (₹/month)</label>
                <input
                  type="number"
                  min="0"
                  value={form.rent}
                  onChange={(e) => setForm({ ...form, rent: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Available Rooms</label>
                <input
                  type="number"
                  min="0"
                  value={form.availableRooms}
                  onChange={(e) => setForm({ ...form, availableRooms: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Gender</label>
                <select
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div className="field">
                <label>Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  <option value="PG">PG</option>
                  <option value="HOSTEL">Hostel</option>
                </select>
              </div>

              <div className="field">
                <label>Latitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={form.latitude}
                  onChange={(e) => setForm({ ...form, latitude: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Longitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={form.longitude}
                  onChange={(e) => setForm({ ...form, longitude: e.target.value })}
                />
              </div>

              <div className="field admin-form-span-2">
                <label>Restricted to College (optional)</label>
                <input
                  type="text"
                  placeholder="Leave blank if open to any nearby student"
                  value={form.restrictedToCollege}
                  onChange={(e) => setForm({ ...form, restrictedToCollege: e.target.value })}
                />
              </div>

              <div className="field admin-form-span-2">
                <label>Amenities (comma separated)</label>
                <input
                  type="text"
                  placeholder="WiFi, Food, Laundry, Power Backup"
                  value={form.amenities}
                  onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                />
              </div>

              <div className="field admin-form-span-2">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="admin-form-span-2 admin-confirm-actions">
                <button type="button" className="btn btn-outline btn-sm" onClick={closeForm}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={formLoading}>
                  {formLoading ? "Saving…" : editingId ? "Save Changes" : "Add PG"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OwnerDashboardPage;
