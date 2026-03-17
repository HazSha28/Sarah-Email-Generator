import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { Icon } from "../components/Icons";

const emptyForm = { name: "", email: "", phone: "", birthday: "", anniversary: "" };

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");

  const load = () => api.get("/customers").then(r => setCustomers(r.data));
  useEffect(() => { load(); }, []);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (c) => {
    setForm({ name: c.name, email: c.email, phone: c.phone || "", birthday: c.birthday || "", anniversary: c.anniversary || "" });
    setEditId(c.id);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await api.put(`/customers/${editId}`, form);
      else await api.post("/customers", form);
      toast.success(editId ? "Customer updated" : "Customer added");
      setShowModal(false);
      load();
    } catch { toast.error("Failed to save customer"); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this customer?")) return;
    await api.delete(`/customers/${id}`);
    toast.success("Customer deleted");
    load();
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await api.post("/customers/import", fd);
      toast.success(`Imported ${res.data.imported}, skipped ${res.data.skipped}`);
      load();
    } catch { toast.error("Import failed"); }
    e.target.value = "";
  };

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="page-header">
        <h2>Customers <span style={{ fontSize: 16, color: "var(--text-muted)", fontFamily: "Inter", fontWeight: 400 }}>({customers.length})</span></h2>
        <div style={{ display: "flex", gap: 10 }}>
          <label className="btn btn-outline" style={{ cursor: "pointer" }}>
            <Icon name="download" size={14} color="currentColor" />
            Import Excel
            <input type="file" accept=".xlsx" hidden onChange={handleImport} />
          </label>
          <button className="btn btn-primary" onClick={openAdd}>
            <Icon name="plus" size={14} color="white" />
            Add Customer
          </button>
        </div>
      </div>

      <div className="card">
        <div style={{ marginBottom: 18, position: "relative", maxWidth: 340 }}>
          <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
            <Icon name="search" size={15} color="#b09090" />
          </span>
          <input
            placeholder="Search by name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 38 }}
          />
        </div>
        <table>
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Birthday</th><th>Anniversary</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id}>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: "var(--text-muted)" }}>{c.email}</td>
                <td>{c.phone || "—"}</td>
                <td>{c.birthday ? <span className="badge badge-birthday">{c.birthday}</span> : "—"}</td>
                <td>{c.anniversary ? <span className="badge badge-anniversary">{c.anniversary}</span> : "—"}</td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => openEdit(c)}>
                      <Icon name="edit" size={13} color="currentColor" /> Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => handleDelete(c.id)}>
                      <Icon name="trash" size={13} color="white" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No customers found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editId ? "Edit Customer" : "Add New Customer"}</h3>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                <Icon name="close" size={16} color="currentColor" />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div className="form-group"><label>Full Name *</label><input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Priya Sharma" /></div>
                <div className="form-group"><label>Email Address *</label><input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="e.g. priya@email.com" /></div>
                <div className="form-group"><label>Phone Number</label><input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 9876543210" /></div>
                <div className="form-group"><label>Birthday</label><input type="date" value={form.birthday} onChange={e => setForm({ ...form, birthday: e.target.value })} /></div>
                <div className="form-group"><label>Anniversary</label><input type="date" value={form.anniversary} onChange={e => setForm({ ...form, anniversary: e.target.value })} /></div>
              </div>
              <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 8 }}>
                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  <Icon name="check" size={14} color="white" /> Save Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
