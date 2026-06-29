import React, { useEffect, useState } from "react";
import api from "../api";
import { Icon } from "../components/Icons";

export default function SentEmails() {
  const [emails, setEmails] = useState([]);
  const [preview, setPreview] = useState(null);
  const [tab, setTab] = useState('drafts'); // 'drafts' | 'broadcast'

  useEffect(() => { api.get("/emails/sent").then(r => setEmails(r.data)); }, []);

  const draftEmails = emails.filter(e => e.type !== 'BROADCAST');
  const broadcastEmails = emails.filter(e => e.type === 'BROADCAST');
  const current = tab === 'drafts' ? draftEmails : broadcastEmails;

  return (
    <div>
      <div className="page-header">
        <h2>Sent Emails <span style={{ fontSize: 16, color: "var(--text-muted)", fontFamily: "Inter", fontWeight: 400 }}>({emails.length} total)</span></h2>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden', width: 'fit-content', background: 'white' }}>
        <button
          onClick={() => setTab('drafts')}
          style={{
            padding: '10px 24px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: tab === 'drafts' ? 'var(--maroon)' : 'white',
            color: tab === 'drafts' ? 'white' : 'var(--text-muted)',
            fontFamily: 'Inter', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 7
          }}>
          <Icon name="mail" size={14} color={tab === 'drafts' ? 'white' : 'var(--text-muted)'} />
          Individual Emails
          <span style={{
            background: tab === 'drafts' ? 'rgba(255,255,255,0.2)' : 'var(--cream-dark)',
            color: tab === 'drafts' ? 'white' : 'var(--text-muted)',
            borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700
          }}>{draftEmails.length}</span>
        </button>
        <button
          onClick={() => setTab('broadcast')}
          style={{
            padding: '10px 24px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
            background: tab === 'broadcast' ? 'var(--maroon)' : 'white',
            color: tab === 'broadcast' ? 'white' : 'var(--text-muted)',
            fontFamily: 'Inter', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: 7
          }}>
          <Icon name="broadcast" size={14} color={tab === 'broadcast' ? 'white' : 'var(--text-muted)'} />
          Broadcast Emails
          <span style={{
            background: tab === 'broadcast' ? 'rgba(255,255,255,0.2)' : 'var(--cream-dark)',
            color: tab === 'broadcast' ? 'white' : 'var(--text-muted)',
            borderRadius: 20, padding: '1px 8px', fontSize: 11, fontWeight: 700
          }}>{broadcastEmails.length}</span>
        </button>
      </div>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Email</th>
              {tab === 'drafts' && <th>Occasion</th>}
              <th>Subject</th>
              <th>Sent At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {current.map(e => (
              <tr key={e._id}>
                <td style={{ fontWeight: 600 }}>{e.customer?.name}</td>
                <td style={{ color: "var(--text-muted)", fontSize: 13 }}>{e.customer?.email}</td>
                {tab === 'drafts' && (
                  <td><span className={`badge badge-${e.occasion?.toLowerCase()}`}>{e.occasion}</span></td>
                )}
                <td style={{ maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontSize: 13, color: "var(--text-muted)" }}>{e.subject}</td>
                <td style={{ fontSize: 13 }}>{e.sentAt ? new Date(e.sentAt).toLocaleString("en-IN") : "—"}</td>
                <td>
                  <button className="btn btn-outline" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => setPreview(e)}>
                    <Icon name="eye" size={13} color="currentColor" /> View
                  </button>
                </td>
              </tr>
            ))}
            {current.length === 0 && (
              <tr>
                <td colSpan={tab === 'drafts' ? 6 : 5} style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
                  No {tab === 'drafts' ? 'individual' : 'broadcast'} emails sent yet
                </td>
              </tr>
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
              {preview.type === 'BROADCAST' && (
                <div style={{ marginTop: 6 }}><span className="badge" style={{ background: 'rgba(90,62,138,0.1)', color: '#5a3e8a' }}>Broadcast</span></div>
              )}
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
