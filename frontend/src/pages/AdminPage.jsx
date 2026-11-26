import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";
import {
  getAdminUsers,
  deleteAdminUser,
  getPendingPGs,
  getApprovedPGsAdmin,
  getRejectedPGsAdmin,
  approvePGAdmin,
  rejectPGAdmin,
  addPGAdmin,
  deletePGAdmin,
} from "../api/client";
import {
  ShieldIcon,
  ClockIcon,
  CheckCircleIcon,
  CloseIcon,
  TrashIcon,
  PlusIcon,
  GraduationCapIcon,
  BriefcaseIcon,
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

const CONFIRM_COPY = {
  deleteUser: (target) => ({
    title: "Delete this user?",
    body: `This will permanently remove ${target.name} (${target.email}). This can't be undone.`,
    actionLabel: "Delete User",
  }),
  reject: (target) => ({
    title: "Reject this listing?",
    body: `"${target.name}" will be marked as rejected and hidden from students.`,
    actionLabel: "Reject Listing",
  }),
  deletePG: (target) => ({
    title: "Delete this listing?",
    body: `"${target.name}" will be permanently removed. This can't be undone.`,
    actionLabel: "Delete Listing",
  }),
};

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "pending", label: "Pending Listings" },
  { key: "approved", label: "Approved Listings" },
  { key: "rejected", label: "Rejected Listings" },
  { key: "users", label: "Manage Users" },
];

function OverviewTab({ pending, users }) {
  return (
    <div className="admin-overview">
      <h2>Welcome back, Admin</h2>
      <p className="section-sub">Here's what's happening across CampusNest right now.</p>

      {pending.length > 0 ? (
        <div className="admin-overview-cta">
          <span className="admin-overview-cta-icon">
            <ClockIcon />
          </span>
          <div>
            <strong>
              {pending.length} listing{pending.length > 1 ? "s" : ""} waiting for review
            </strong>
           
          </div>
        </div>
      ) : (
        <div className="admin-overview-cta admin-overview-cta-clear">
          <span className="admin-overview-cta-icon">
            <CheckCircleIcon />
          </span>
          <div>
            <strong>All caught up</strong>
            <p>No PG listings are waiting for approval right now.</p>
          </div>
        </div>
      )}

      <p className="admin-overview-note">
        {users.length} registered account{users.length === 1 ? "" : "s"} in total.
      </p>
    </div>
  );
}

function PGList({ items, emptyText, renderActions, onDelete, busyId }) {
  if (items.length === 0) {
    return (
      <div className="nearby-panel">
        <p>{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="admin-pg-list">
      {items.map((pg) => (
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
              {pg.restrictedToCollege && <span>🎓 {pg.restrictedToCollege}</span>}
            </div>
          </div>

          <div className="admin-pg-row-actions">
            {renderActions ? (
              renderActions(pg)
            ) : (
              <span className={`badge-status badge-status-${(pg.status || "").toLowerCase()}`}>
                {pg.status}
              </span>
            )}
            <button
              type="button"
              className="btn btn-outline btn-sm admin-btn-danger"
              disabled={busyId === pg.id}
              onClick={() => onDelete(pg)}
              aria-label={`Delete ${pg.name}`}
              title="Delete permanently"
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function UsersTable({ users, busyId, onDelete }) {
  if (users.length === 0) {
    return (
      <div className="nearby-panel">
        <p>No registered users yet.</p>
      </div>
    );
  }

  return (
    <div className="admin-user-list">
      {users.map((u) => (
        <div className="admin-user-row" key={u.id}>
          <span className="admin-user-avatar">{(u.name || "U").charAt(0).toUpperCase()}</span>
          <div className="admin-user-row-main">
            <strong>{u.name}</strong>
            <span>{u.email}</span>
          </div>
          <span className={`badge-role badge-role-${(u.role || "").toLowerCase()}`}>
            {u.role}
          </span>
          {u.role !== "ADMIN" && (
            <button
              type="button"
              className="btn btn-outline btn-sm admin-btn-danger"
              disabled={busyId === u.id}
              onClick={() => onDelete(u)}
              aria-label={`Delete ${u.name}`}
            >
              <TrashIcon />
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "ADMIN") {
      navigate("/");
    }
  }, [user, navigate]);

  const [activeTab, setActiveTab] = useState("overview");

  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [approved, setApproved] = useState([]);
  const [rejected, setRejected] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [confirm, setConfirm] = useState(null); // { type: "deleteUser" | "reject" | "deletePG", target }

  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_PG_FORM);
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  useEffect(() => {
    if (!user || user.role !== "ADMIN") return;

    let cancelled = false;

    async function loadAll() {
      setLoading(true);
      setError("");
      try {
        const [u, p, a, r] = await Promise.all([
          getAdminUsers(user.token),
          getPendingPGs(user.token),
          getApprovedPGsAdmin(user.token),
          getRejectedPGsAdmin(user.token),
        ]);
        if (cancelled) return;
        setUsers(u);
        setPending(p);
        setApproved(a);
        setRejected(r);
      } catch (err) {
        if (!cancelled) setError(err.message || "Unable to load admin data.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadAll();
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleApprove = async (pg) => {
    setActionError("");
    setBusyId(pg.id);
    try {
      await approvePGAdmin(user.token, pg.id);
      setPending((list) => list.filter((item) => item.id !== pg.id));
      setApproved((list) => [{ ...pg, status: "APPROVED" }, ...list]);
    } catch (err) {
      setActionError(err.message || "Unable to approve this listing.");
    } finally {
      setBusyId(null);
    }
  };

  const handleReject = async (pg) => {
    setActionError("");
    setBusyId(pg.id);
    try {
      await rejectPGAdmin(user.token, pg.id);
      setPending((list) => list.filter((item) => item.id !== pg.id));
      setRejected((list) => [{ ...pg, status: "REJECTED" }, ...list]);
    } catch (err) {
      setActionError(err.message || "Unable to reject this listing.");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  const handleDeleteUser = async (target) => {
    setActionError("");
    setBusyId(target.id);
    try {
      await deleteAdminUser(user.token, target.id);
      setUsers((list) => list.filter((item) => item.id !== target.id));
    } catch (err) {
      setActionError(err.message || "Unable to delete this user.");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  const handleDeletePG = async (pg) => {
    setActionError("");
    setBusyId(pg.id);
    try {
      await deletePGAdmin(user.token, pg.id);
      setPending((list) => list.filter((item) => item.id !== pg.id));
      setApproved((list) => list.filter((item) => item.id !== pg.id));
      setRejected((list) => list.filter((item) => item.id !== pg.id));
    } catch (err) {
      setActionError(err.message || "Unable to delete this listing.");
    } finally {
      setBusyId(null);
      setConfirm(null);
    }
  };

  const CONFIRM_HANDLERS = {
    deleteUser: handleDeleteUser,
    reject: handleReject,
    deletePG: handleDeletePG,
  };

  const resetAddForm = () => {
    setAddForm(EMPTY_PG_FORM);
    setAddError("");
  };

  const handleAddPG = async (e) => {
    e.preventDefault();
    setAddError("");

    const name = addForm.name.trim();
    const city = addForm.city.trim();
    const rent = Number(addForm.rent);
    const availableRooms = Number(addForm.availableRooms);

    if (!name) return setAddError("Please enter a PG name.");
    if (!city) return setAddError("Please enter a city.");
    if (!addForm.rent || Number.isNaN(rent) || rent <= 0) {
      return setAddError("Please enter a valid rent amount.");
    }
    if (!addForm.availableRooms || Number.isNaN(availableRooms) || availableRooms < 0) {
      return setAddError("Please enter a valid number of available rooms.");
    }

    const payload = {
      name,
      address: addForm.address.trim() || null,
      city,
      rent,
      availableRooms,
      gender: addForm.gender,
      type: addForm.type,
      phone: addForm.phone.trim() || null,
      restrictedToCollege: addForm.restrictedToCollege.trim() || null,
      amenities: addForm.amenities.trim() || null,
      description: addForm.description.trim() || null,
      latitude: addForm.latitude ? Number(addForm.latitude) : null,
      longitude: addForm.longitude ? Number(addForm.longitude) : null,
    };

    setAddLoading(true);
    try {
      const created = await addPGAdmin(user.token, payload);
      setApproved((list) => [created, ...list]);
      setShowAddForm(false);
      resetAddForm();
      setActiveTab("approved");
    } catch (err) {
      setAddError(err.message || "Unable to add this PG.");
    } finally {
      setAddLoading(false);
    }
  };

  if (!user || user.role !== "ADMIN") {
    return null;
  }

  const stats = [
    {
      key: "users",
      label: "Students",
      value: users.filter((u) => u.role === "USER").length,
      icon: <GraduationCapIcon />,
      tone: "feature-blue",
    },
    {
      key: "owners",
      label: "PG Owners",
      value: users.filter((u) => u.role === "OWNER").length,
      icon: <BriefcaseIcon />,
      tone: "feature-purple",
    },
    {
      key: "pending",
      label: "Pending Listings",
      value: pending.length,
      icon: <ClockIcon />,
      tone: "feature-yellow",
    },
    {
      key: "approved",
      label: "Approved Listings",
      value: approved.length,
      icon: <CheckCircleIcon />,
      tone: "feature-green",
    },
  ];

  return (
    <div className="page">
      <Navbar minimal />

      <section className="admin-page">
        <div className="admin-header">
          <span className="admin-header-icon">
            <ShieldIcon />
          </span>
          <div>
            <h1>Admin Panel</h1>
            <p className="section-sub">Review PG listings and manage registered users.</p>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {actionError && <div className="alert alert-error">{actionError}</div>}

        {loading ? (
          <div className="nearby-panel">
            <span className="spinner" />
            <p>Loading admin data…</p>
          </div>
        ) : (
          <>
            <div className="admin-stats">
              {stats.map((stat) => (
                <div className="admin-stat-card" key={stat.key}>
                  <span className={`admin-stat-icon ${stat.tone}`}>{stat.icon}</span>
                  <div>
                    <strong>{stat.value}</strong>
                    <span>{stat.label}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-tabs-row">
              <div className="admin-tabs">
                {TABS.map((tab) => (
                  <button
                    type="button"
                    key={tab.key}
                    className={`admin-tab ${activeTab === tab.key ? "admin-tab-active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                    {tab.key === "pending" && pending.length > 0 && (
                      <span className="admin-tab-badge">{pending.length}</span>
                    )}
                  </button>
                ))}
              </div>

              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowAddForm(true)}
              >
                <PlusIcon /> Add PG
              </button>
            </div>

            <div className="admin-panel-card">
              {activeTab === "overview" && <OverviewTab pending={pending} users={users} />}

              {activeTab === "pending" && (
                <PGList
                  items={pending}
                  emptyText="No listings waiting for review."
                  busyId={busyId}
                  onDelete={(pg) => setConfirm({ type: "deletePG", target: pg })}
                  renderActions={(pg) => (
                    <>
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={busyId === pg.id}
                        onClick={() => handleApprove(pg)}
                      >
                        <CheckCircleIcon /> Approve
                      </button>
                      <button
                        type="button"
                        className="btn btn-outline btn-sm admin-btn-danger"
                        disabled={busyId === pg.id}
                        onClick={() => setConfirm({ type: "reject", target: pg })}
                      >
                        <CloseIcon /> Reject
                      </button>
                    </>
                  )}
                />
              )}

              {activeTab === "approved" && (
                <PGList
                  items={approved}
                  emptyText="No approved listings yet."
                  busyId={busyId}
                  onDelete={(pg) => setConfirm({ type: "deletePG", target: pg })}
                />
              )}

              {activeTab === "rejected" && (
                <PGList
                  items={rejected}
                  emptyText="No rejected listings."
                  busyId={busyId}
                  onDelete={(pg) => setConfirm({ type: "deletePG", target: pg })}
                />
              )}

              {activeTab === "users" && (
                <UsersTable
                  users={users}
                  busyId={busyId}
                  onDelete={(target) => setConfirm({ type: "deleteUser", target })}
                />
              )}
            </div>
          </>
        )}
      </section>

      <Footer />

      {confirm && (() => {
        const copy = CONFIRM_COPY[confirm.type](confirm.target);
        return (
          <div className="modal-overlay" onClick={() => setConfirm(null)}>
            <div className="modal-card admin-confirm-card" onClick={(e) => e.stopPropagation()}>
              <h3>{copy.title}</h3>
              <p className="modal-description">{copy.body}</p>
              <div className="admin-confirm-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => setConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary btn-sm admin-btn-danger-solid"
                  disabled={busyId === confirm.target.id}
                  onClick={() => CONFIRM_HANDLERS[confirm.type](confirm.target)}
                >
                  {copy.actionLabel}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {showAddForm && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowAddForm(false);
            resetAddForm();
          }}
        >
          <div className="modal-card admin-form-card" onClick={(e) => e.stopPropagation()}>
            <h3>Add New PG</h3>
            <p className="modal-description">
              This listing goes live immediately — no approval needed since you're adding it as
              admin.
            </p>

            {addError && <div className="alert alert-error">{addError}</div>}

            <form onSubmit={handleAddPG} className="admin-form-grid">
              <div className="field admin-form-span-2">
                <label>PG / Hostel Name</label>
                <input
                  type="text"
                  value={addForm.name}
                  onChange={(e) => setAddForm({ ...addForm, name: e.target.value })}
                />
              </div>

              <div className="field admin-form-span-2">
                <label>Address</label>
                <input
                  type="text"
                  value={addForm.address}
                  onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                />
              </div>

              <div className="field">
                <label>City</label>
                <input
                  type="text"
                  value={addForm.city}
                  onChange={(e) => setAddForm({ ...addForm, city: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Phone</label>
                <input
                  type="text"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Rent (₹/month)</label>
                <input
                  type="number"
                  min="0"
                  value={addForm.rent}
                  onChange={(e) => setAddForm({ ...addForm, rent: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Available Rooms</label>
                <input
                  type="number"
                  min="0"
                  value={addForm.availableRooms}
                  onChange={(e) => setAddForm({ ...addForm, availableRooms: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Gender</label>
                <select
                  value={addForm.gender}
                  onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                >
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                </select>
              </div>

              <div className="field">
                <label>Type</label>
                <select
                  value={addForm.type}
                  onChange={(e) => setAddForm({ ...addForm, type: e.target.value })}
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
                  value={addForm.latitude}
                  onChange={(e) => setAddForm({ ...addForm, latitude: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Longitude (optional)</label>
                <input
                  type="number"
                  step="any"
                  value={addForm.longitude}
                  onChange={(e) => setAddForm({ ...addForm, longitude: e.target.value })}
                />
              </div>

              <div className="field admin-form-span-2">
                <label>Restricted to College (optional)</label>
                <input
                  type="text"
                  placeholder="Leave blank if open to any nearby student"
                  value={addForm.restrictedToCollege}
                  onChange={(e) =>
                    setAddForm({ ...addForm, restrictedToCollege: e.target.value })
                  }
                />
              </div>

              <div className="field admin-form-span-2">
                <label>Amenities (comma separated)</label>
                <input
                  type="text"
                  placeholder="WiFi, Food, Laundry, Power Backup"
                  value={addForm.amenities}
                  onChange={(e) => setAddForm({ ...addForm, amenities: e.target.value })}
                />
              </div>

              <div className="field admin-form-span-2">
                <label>Description</label>
                <textarea
                  rows={3}
                  value={addForm.description}
                  onChange={(e) => setAddForm({ ...addForm, description: e.target.value })}
                />
              </div>

              <div className="admin-form-span-2 admin-confirm-actions">
                <button
                  type="button"
                  className="btn btn-outline btn-sm"
                  onClick={() => {
                    setShowAddForm(false);
                    resetAddForm();
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={addLoading}>
                  {addLoading ? "Adding…" : "Add PG"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
