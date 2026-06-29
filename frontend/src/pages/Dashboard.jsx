import React, { useEffect, useState } from "react";
import api from "../api";
import { Icon } from "../components/Icons";
import "./Dashboard.css";

const statConfig = [
  { key: "totalCustomers",        label: "Total Customers",        icon: "customers", accent: "#6b0f1a", iconBg: "rgba(107,15,26,0.09)", iconColor: "#6b0f1a" },
  { key: "upcomingBirthdays",     label: "Upcoming Birthdays",     icon: "calendar",  accent: "#9b1030", iconBg: "rgba(155,16,48,0.09)", iconColor: "#9b1030" },
  { key: "upcomingAnniversaries", label: "Upcoming Anniversaries", icon: "diamond",   accent: "#5a3e8a", iconBg: "rgba(90,62,138,0.09)", iconColor: "#5a3e8a" },
  { key: "pendingEmails",         label: "Pending Emails",         icon: "drafts",    accent: "#b45309", iconBg: "rgba(180,83,9,0.09)",  iconColor: "#b45309" },
  { key: "sentEmails",            label: "Emails Sent",            icon: "send",      accent: "#1e7e4a", iconBg: "rgba(30,126,74,0.09)", iconColor: "#1e7e4a" },
];

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [birthdays, setBirthdays] = useState([]);
  const [anniversaries, setAnniversaries] = useState([]);
  const [recentSent, setRecentSent] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [time, setTime] = useState(new Date());

  const loadDashboard = () => {
    api.get("/dashboard").then(r => {
      setStats(r.data);
      // Check for newly sent emails and add notifications
      if (r.data.recentSent?.length > 0) {
        const stored = JSON.parse(localStorage.getItem('notif_seen') || '[]');
        const newOnes = r.data.recentSent.filter(e => !stored.includes(e._id));
        if (newOnes.length > 0) {
          setNotifications(prev => [
            ...newOnes.map(e => ({
              id: e._id,
              message: `Email sent to ${e.customer?.name} (${e.occasion})`,
              time: e.sentAt ? new Date(e.sentAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''
            })),
            ...prev
          ].slice(0, 10));
        }
        setRecentSent(r.data.recentSent);
      }
    }).catch(() => {});
    api.get("/customers/upcoming/birthdays").then(r => setBirthdays(r.data)).catch(() => {});
    api.get("/customers/upcoming/anniversaries").then(r => setAnniversaries(r.data)).catch(() => {});
  };

  useEffect(() => {
    loadDashboard();
    const t = setInterval(() => setTime(new Date()), 60000);
    const r = setInterval(() => loadDashboard(), 30000); // refresh every 30s
    return () => { clearInterval(t); clearInterval(r); };
  }, []);

  const clearNotifications = () => {
    const ids = notifications.map(n => n.id);
    localStorage.setItem('notif_seen', JSON.stringify(ids));
    setNotifications([]);
    setShowNotif(false);
  };

  const hour = time.getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
  const dateStr = time.toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const timeStr = time.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });

  return (
    <div>
      <div className="dash-banner">
        <div className="dash-ring dash-ring-1" />
        <div className="dash-ring dash-ring-2" />
        <div className="dash-watermark">
          <Icon name="diamond" size={200} color="rgba(232,221,208,0.06)" />
        </div>
        <div className="dash-banner-left">
          <div className="dash-eyebrow">Admin Dashboard</div>
          <h2>{greeting}, Administrator</h2>
          <p>Here is an overview of your customer engagement activity.</p>
        </div>
        <div className="dash-banner-right">
          {/* Notification Bell */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: 8 }}>
            <button onClick={() => setShowNotif(!showNotif)} style={{
              background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
              borderRadius: 8, padding: "6px 10px", cursor: "pointer", position: "relative",
              display: "flex", alignItems: "center", gap: 6, color: "#e8ddd0"
            }}>
              <Icon name="mail" size={16} color="#e8ddd0" />
              {notifications.length > 0 && (
                <span style={{
                  position: "absolute", top: -6, right: -6, background: "#e53e3e",
                  color: "white", borderRadius: "50%", width: 18, height: 18,
                  fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center"
                }}>{notifications.length}</span>
              )}
            </button>
            {showNotif && (
              <div style={{
                position: "absolute", right: 0, top: 40, width: 300, background: "white",
                borderRadius: 10, boxShadow: "0 8px 32px rgba(0,0,0,0.18)", zIndex: 100,
                border: "1px solid var(--border)", overflow: "hidden"
              }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontWeight: 700, fontSize: 14, color: "var(--maroon)" }}>Email Notifications</span>
                  {notifications.length > 0 && (
                    <button onClick={clearNotifications} style={{ fontSize: 12, color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer" }}>
                      Clear all
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
                    No new notifications
                  </div>
                ) : (
                  notifications.map((n, i) => (
                    <div key={i} style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "flex-start", gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#1e7e4a", marginTop: 5, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontSize: 13, color: "var(--text)", fontWeight: 500 }}>{n.message}</div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>{n.time}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="dash-date-chip">
            <Icon name="calendar" size={13} color="#e8ddd0" />
            {dateStr}
          </div>
          <div className="dash-time">{timeStr}</div>
        </div>
      </div>

      <div className="stats-grid">
        {statConfig.map(cfg => (
          <div className="stat-card" key={cfg.key}>
            <div className="stat-bar" style={{ background: cfg.accent }} />
            <div className="stat-icon-wrap" style={{ background: cfg.iconBg }}>
              <Icon name={cfg.icon} size={19} color={cfg.iconColor} />
            </div>
            <div className="stat-value">{stats ? (stats[cfg.key] ?? 0) : "..."}</div>
            <div className="stat-label">{cfg.label}</div>
          </div>
        ))}
      </div>

      <div className="dash-tables">
        <div className="card">
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">Upcoming Birthdays</div>
              <div className="dash-card-sub">Next 7 days</div>
            </div>
            <span className="dash-card-badge">{birthdays.length} customers</span>
          </div>
          {birthdays.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon"><Icon name="calendar" size={22} color="#7a5c62" /></div>
              <p>No upcoming birthdays this week</p>
            </div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Customer</th><th>Date</th></tr></thead>
              <tbody>{birthdays.map(c => (
                <tr key={c._id}>
                  <td><div className="cust-name">{c.name}</div><div className="cust-email">{c.email}</div></td>
                  <td><span className="badge badge-birthday">{c.birthday}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>

        <div className="card">
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">Upcoming Anniversaries</div>
              <div className="dash-card-sub">Next 7 days</div>
            </div>
            <span className="dash-card-badge">{anniversaries.length} customers</span>
          </div>
          {anniversaries.length === 0 ? (
            <div className="dash-empty">
              <div className="dash-empty-icon"><Icon name="diamond" size={22} color="#7a5c62" /></div>
              <p>No upcoming anniversaries this week</p>
            </div>
          ) : (
            <table className="dash-table">
              <thead><tr><th>Customer</th><th>Date</th></tr></thead>
              <tbody>{anniversaries.map(c => (
                <tr key={c._id}>
                  <td><div className="cust-name">{c.name}</div><div className="cust-email">{c.email}</div></td>
                  <td><span className="badge badge-anniversary">{c.anniversary}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>

      {/* Recent Sent Emails */}
      {recentSent.length > 0 && (
        <div className="card" style={{ marginTop: 20 }}>
          <div className="dash-card-header">
            <div>
              <div className="dash-card-title">Recently Sent Emails</div>
              <div className="dash-card-sub">Last 5 emails</div>
            </div>
            <span className="dash-card-badge" style={{ background: "rgba(30,126,74,0.1)", color: "#1e7e4a" }}>
              {recentSent.length} sent
            </span>
          </div>
          <table className="dash-table">
            <thead><tr><th>Customer</th><th>Occasion</th><th>Subject</th><th>Sent At</th></tr></thead>
            <tbody>{recentSent.map(e => (
              <tr key={e._id}>
                <td>
                  <div className="cust-name">{e.customer?.name}</div>
                  <div className="cust-email">{e.customer?.email}</div>
                </td>
                <td><span className={`badge badge-${e.occasion?.toLowerCase()}`}>{e.occasion}</span></td>
                <td style={{ fontSize: 13, color: "var(--text-muted)", maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{e.subject}</td>
                <td style={{ fontSize: 12, color: "var(--text-muted)" }}>
                  {e.sentAt ? new Date(e.sentAt).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                </td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}
