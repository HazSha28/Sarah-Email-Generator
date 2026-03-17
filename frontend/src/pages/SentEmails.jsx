import React, { useEffect, useState } from "react";
import api from "../api";
import { Icon } from "../components/Icons";

export default function SentEmails() {
  const [emails, setEmails] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => { api.get("/emails/sent").then(r => setEmails(r.data)); }, []);

  return (
    <div>
      <div className="page-header">
        <h2>Sent Emails <span style={{ fontSize: 16, color: "var(--text-muted)", fontFamily: "Inter", fontWeight: 400 }}>({emails.length} total)</span></h2>
      </div>
      <div className="card">
        <table>
          <thead>
            <tr><th>Customer</th><th>Email</th><th>Occasion</th><th>Subject</th><th>Sent At</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {emails.map(e => (
              <tr key={e.id}>
                <td style={{ fontWeight: 600 }}>{e.customer?.name}</td>
                <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{e.customer?.email}</td>
                <td><span className={`badge badge-${e.occasion?.toLowerCase()}`}>{e.occasion}</span></td>
                <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, color: "var(--text-muted)" }}>{e.subject}</td>
                <td style={{ fontSize: 13 }}>{e.sentAt ? new Date(e.sentAt).toLocaleString("en-IN") : "—"}</td>
                <td>
                  <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setPreview(e)}>
                    <Icon name="eye" size={13} color="currentColor" /> View
                  </button>
                </td>
              </tr>
            ))}
            {emails.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>No emails sent yet</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {preview && (
        <div className="modal-overlay" onClick={() => setPreview(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Sent Email Details</h3>
              <button className="close-btn" onClick={() => setPreview(null)}><Icon name="close" size={16} color="currentColor" /></button>
            </div>
            <div style={{ background: "var(--cream)", borderRadius: 8, padding: "12px 16px", marginBottom: 16, fontSize: 13 }}>
              <div><strong style={{ color: "var(--maroon)" }}>To:</strong> {preview.customer?.name} &lt;{preview.customer?.email}&gt;</div>
              <div style={{ marginTop: 4 }}><strong style={{ color: "var(--maroon)" }}>Subject:</strong> {preview.subject}</div>
              <div style={{ marginTop: 4 }}><strong style={{ color: "var(--maroon)" }}>Sent:</strong> {preview.sentAt ? new Date(preview.sentAt).toLocaleString("en-IN") : "—"}</div>
            </div>
            <div style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 20, background: "#fafafa" }}
              dangerouslySetInnerHTML={{ __html: preview.body }} />
            <div style={{ marginTop: 16, textAlign: "right" }}>
              <button className="btn btn-outline" onClick={() => setPreview(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
