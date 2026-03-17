import React, { useEffect, useState } from "react";
import api from "../api";
import toast from "react-hot-toast";
import { Icon } from "../components/Icons";
import EmailEditor from "../components/EmailEditor";

export default function EmailDrafts() {
  const [drafts, setDrafts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);

  const load = () => api.get("/emails/drafts").then(r => setDrafts(r.data));
  useEffect(() => { load(); }, []);

  const generateBirthdays = async () => {
    await api.post("/emails/generate/birthdays");
    toast.success("Birthday drafts generated");
    load();
  };

  const generateAnniversaries = async () => {
    await api.post("/emails/generate/anniversaries");
    toast.success("Anniversary drafts generated");
    load();
  };

  const sendDraft = async (id) => {
    try {
      await api.post(`/emails/drafts/${id}/send`);
      toast.success("Email sent successfully");
      load();
    } catch (e) {
      toast.error(e.response?.data?.error || "Send failed");
    }
  };

  const deleteDraft = async (id) => {
    if (!window.confirm("Delete this draft?")) return;
    await api.delete(`/emails/drafts/${id}`);
    toast.success("Draft deleted");
    load();
  };

  return (
    <div>
      <div className="page-header">
        <h2>Email Drafts <span style={{ fontSize: 16, color: "var(--text-muted)", fontFamily: "Inter", fontWeight: 400 }}>({drafts.length} pending)</span></h2>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-outline" onClick={generateBirthdays}>
            <Icon name="calendar" size={14} color="currentColor" />
            Generate Birthdays
          </button>
          <button className="btn btn-outline" onClick={generateAnniversaries}>
            <Icon name="diamond" size={14} color="currentColor" />
            Generate Anniversaries
          </button>
        </div>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr><th>Customer</th><th>Email</th><th>Occasion</th><th>Subject</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {drafts.map(d => (
              <tr key={d.id}>
                <td style={{ fontWeight: 600 }}>{d.customer?.name}</td>
                <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{d.customer?.email}</td>
                <td><span className={`badge badge-${d.occasion?.toLowerCase()}`}>{d.occasion}</span></td>
                <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "var(--text-muted)", fontSize: 13 }}>{d.subject}</td>
                <td><span className={`badge badge-${d.status?.toLowerCase()}`}>{d.status}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 5 }}>
                    <button className="btn btn-outline" style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => setPreview(d)}>
                      <Icon name="eye" size={13} color="currentColor" /> Preview
                    </button>
                    <button className="btn btn-outline" style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => setSelected(d)}>
                      <Icon name="edit" size={13} color="currentColor" /> Edit
                    </button>
                    <button className="btn btn-success" style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => sendDraft(d.id)}>
                      <Icon name="send" size={13} color="white" /> Send
                    </button>
                    <button className="btn btn-danger" style={{ padding: "6px 11px", fontSize: 12 }} onClick={() => deleteDraft(d.id)}>
                      <Icon name="trash" size={13} color="white" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {drafts.length === 0 && (
              <tr>
                <td colSpan={6}>
                  <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--cream-dark)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                      <Icon name="drafts" size={22} color="var(--text-muted)" />
                    </div>
                    <p style={{ fontWeight: 600, marginBottom: 6, color: "var(--text)" }}>No pending drafts</p>
                    <p style={{ fontSize: 13 }}>Click "Generate Birthdays" or "Generate Anniversaries" to create drafts for today.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {selected && (
        <EmailEditor draft={selected} onClose={() => setSelected(null)} onSaved={() => { setSelected(null); load(); }} />
      )}

      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 680 }}>
            <div className="modal-header">
              <h3>Email Preview</h3>
              <button className="close-btn" onClick={() => setPreview(null)}><Icon name="close" size={16} color="currentColor" /></button>
            </div>
            <div style={{ background: "var(--cream)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13 }}>
              <div><strong style={{ color: "var(--maroon)" }}>To:</strong> {preview.customer?.name} &lt;{preview.customer?.email}&gt;</div>
              <div style={{ marginTop: 4 }}><strong style={{ color: "var(--maroon)" }}>Subject:</strong> {preview.subject}</div>
              <div style={{ marginTop: 6 }}><span className={`badge badge-${preview.occasion?.toLowerCase()}`}>{preview.occasion}</span></div>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 20, background: "#fafafa" }}
              dangerouslySetInnerHTML={{ __html: preview.body }} />
            <div style={{ marginTop: 20, display: "flex", justifyContent: "flex-end", gap: 10 }}>
              <button className="btn btn-outline" onClick={() => setPreview(null)}>Close</button>
              <button className="btn btn-success" onClick={() => { sendDraft(preview.id); setPreview(null); }}>
                <Icon name="send" size={14} color="white" /> Send Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
