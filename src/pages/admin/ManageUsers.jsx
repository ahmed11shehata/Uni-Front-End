// src/pages/admin/ManageUsers.jsx
import { useState } from "react";
import { motion } from "framer-motion";

const MOCK_USERS = [
  { id: 1, name: "Ahmed Hassan",   email: "ahmed@uni.edu",  role: "student",    status: "active"   },
  { id: 2, name: "Sara Mohamed",   email: "sara@uni.edu",   role: "student",    status: "active"   },
  { id: 3, name: "Dr. Khaled Ali", email: "khaled@uni.edu", role: "instructor", status: "active"   },
  { id: 4, name: "Nour Ibrahim",   email: "nour@uni.edu",   role: "student",    status: "inactive" },
  { id: 5, name: "Dr. Mona Samir", email: "mona@uni.edu",   role: "instructor", status: "active"   },
];

const ROLE_STYLE = {
  student:    { bg: "rgba(139,124,248,0.12)", color: "#a99ff5", border: "rgba(139,124,248,0.25)" },
  instructor: { bg: "rgba(91,164,207,0.12)",  color: "#7ec8e3", border: "rgba(91,164,207,0.25)"  },
  admin:      { bg: "rgba(224,123,106,0.12)", color: "#e9b4a8", border: "rgba(224,123,106,0.25)" },
};

export default function ManageUsers() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_USERS.filter(u => {
    const q = search.toLowerCase();
    const matchSearch = u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q);
    const matchFilter = filter === "all" || u.role === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ padding: "32px 36px", minHeight: "100vh", background: "#f8fafc" }}>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.38 }}
        style={{ marginBottom: 26 }}
      >
        <h1 style={{ fontSize: 25, fontWeight: 800, color: "#0f172a", margin: 0, letterSpacing: "-0.3px" }}>
          Manage Users
        </h1>
        <p style={{ color: "#64748b", marginTop: 4, fontSize: 13.5 }}>
          {MOCK_USERS.length} total users registered in the system
        </p>
      </motion.div>

      {/* Controls */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.35 }}
        style={{ display: "flex", gap: 10, marginBottom: 18, flexWrap: "wrap" }}
      >
        <input
          type="text"
          placeholder="Search name or email…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            flex: 1, minWidth: 200, padding: "8px 14px",
            borderRadius: 10, border: "1px solid #e2e8f0",
            fontSize: 13.5, color: "#334155", background: "white",
            outline: "none", boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          }}
        />
        {["all", "student", "instructor"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px", borderRadius: 10, cursor: "pointer",
              border: filter === f ? "1.5px solid #6366f1" : "1px solid #e2e8f0",
              background: filter === f ? "#6366f1" : "white",
              color: filter === f ? "white" : "#64748b",
              fontWeight: 600, fontSize: 13, transition: "all 0.15s",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12, duration: 0.38 }}
        style={{
          background: "white", borderRadius: 16,
          border: "1px solid #e2e8f0", overflow: "hidden",
          boxShadow: "0 2px 14px rgba(0,0,0,0.05)",
        }}
      >
        {/* Head */}
        <div style={{
          display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
          padding: "11px 20px", background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
          fontSize: 11, fontWeight: 700, color: "#94a3b8",
          letterSpacing: "0.8px", textTransform: "uppercase",
        }}>
          <span>Name</span><span>Email</span><span>Role</span><span>Status</span><span>Actions</span>
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div style={{ padding: "28px", textAlign: "center", color: "#94a3b8", fontSize: 14 }}>
            No users found.
          </div>
        ) : filtered.map((u, i) => {
          const rs = ROLE_STYLE[u.role] || ROLE_STYLE.student;
          return (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.04 * i, duration: 0.28 }}
              style={{
                display: "grid", gridTemplateColumns: "2fr 2fr 1fr 1fr 1fr",
                padding: "13px 20px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "1px solid #f1f5f9" : "none",
              }}
            >
              {/* Name */}
              <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                <div style={{
                  width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                  background: `linear-gradient(135deg, ${rs.color}cc, ${rs.color}66)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 13, fontWeight: 800, color: "white",
                }}>
                  {u.name.charAt(0)}
                </div>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: "#1e293b" }}>{u.name}</span>
              </div>

              {/* Email */}
              <span style={{ fontSize: 13, color: "#64748b" }}>{u.email}</span>

              {/* Role chip */}
              <span style={{
                display: "inline-block", padding: "3px 10px", borderRadius: 20,
                fontSize: 11, fontWeight: 700, width: "fit-content",
                background: rs.bg, color: rs.color, border: `1px solid ${rs.border}`,
              }}>
                {u.role}
              </span>

              {/* Status */}
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                  background: u.status === "active" ? "#4ade80" : "#cbd5e1",
                }}/>
                <span style={{
                  fontSize: 12.5, fontWeight: 600,
                  color: u.status === "active" ? "#16a34a" : "#94a3b8",
                }}>
                  {u.status}
                </span>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 6 }}>
                <button style={{
                  padding: "5px 11px", borderRadius: 7, cursor: "pointer",
                  border: "1px solid #e2e8f0", background: "white",
                  color: "#6366f1", fontSize: 12, fontWeight: 600,
                }}>
                  Edit
                </button>
                <button style={{
                  padding: "5px 11px", borderRadius: 7, cursor: "pointer",
                  border: "1px solid #fee2e2", background: "white",
                  color: "#ef4444", fontSize: 12, fontWeight: 600,
                }}>
                  Remove
                </button>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}