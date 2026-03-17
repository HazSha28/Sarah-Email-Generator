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
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    api.get("/dashboard").then(r => setStats(r.data)).catch(() => {});
    api.get("/customers/upcoming/birthdays").then(r => setBirthdays(r.data)).catch(() => {});
    api.get("/customers/upcoming/anniversaries").then(r => setAnniversaries(r.data)).catch(() => {});
    const t = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(t);
  }, []);

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
                <tr key={c.id}>
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
                <tr key={c.id}>
                  <td><div className="cust-name">{c.name}</div><div className="cust-email">{c.email}</div></td>
                  <td><span className="badge badge-anniversary">{c.anniversary}</span></td>
                </tr>
              ))}</tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
