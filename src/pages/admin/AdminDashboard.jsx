// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useRegistration } from "../../context/RegistrationContext";
import styles from "./AdminDashboard.module.css";

/* ── animated counter ── */
function Counter({ to, duration = 1.6 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 72;
    const inc = to / steps;
    const id = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, (duration * 1000) / steps);
    return () => clearInterval(id);
  }, [to]);
  return <>{val.toLocaleString()}</>;
}

/* ── Radial arc SVG ── */
function ArcMeter({ pct, color, size = 90 }) {
  const r = (size - 12) / 2;
  const cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--prog-track)" strokeWidth="9" />
      <motion.circle cx={cx} cy={cy} r={r} fill="none"
        stroke={color} strokeWidth="9" strokeLinecap="round"
        strokeDasharray={circ}
        initial={{ strokeDashoffset: circ }}
        animate={{ strokeDashoffset: circ - (pct / 100) * circ }}
        transition={{ delay: 0.5, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

const STATS = [
  { id: "students",    label: "Total Students",  value: 1248, icon: "👥", bg: "linear-gradient(135deg,#4f46e5,#818cf8)", sub: "Enrolled this year",   trend: "+12%",  up: true  },
  { id: "registered",  label: "Registered",       value: 842,  icon: "✅", bg: "linear-gradient(135deg,#15803d,#22c55e)", sub: "Course registrations", trend: "+8%",   up: true  },
  { id: "instructors", label: "Instructors",       value: 64,   icon: "🎓", bg: "linear-gradient(135deg,#1d4ed8,#3b82f6)", sub: "Active faculty",       trend: "+2",    up: true  },
  { id: "courses",     label: "Active Courses",    value: 38,   icon: "📚", bg: "linear-gradient(135deg,#b45309,#f59e0b)", sub: "This semester",        trend: "stable",up: null  },
];

const ACTIONS = [
  { label: "Register User",        desc: "Add student or instructor",       path: "/admin/register",      icon: "👤", color: "#818cf8" },
  { label: "Manage Users",         desc: "View & control accounts",         path: "/admin/manage-users",  icon: "⚙️", color: "#22c55e" },
  { label: "Registration Manager", desc: "Open / close course registration",path: "/admin/registration",  icon: "📋", color: "#f59e0b" },
  { label: "Email Manager",        desc: "Create & manage emails",          path: "/admin/email-manager", icon: "✉️", color: "#ef4444" },
  { label: "Schedule Manager",     desc: "Build weekly & exam schedules",   path: "/admin/schedule",      icon: "🗓️", color: "#14b8a6" },
  { label: "Themes",               desc: "Customize appearance",            path: "/admin/themes",        icon: "🎨", color: "#ec4899" },
];

const RECENT = [
  { name: "Ahmed Mohamed Ali",   action: "Registered 6 courses",  time: "2m ago",  color: "#22c55e", icon: "📝" },
  { name: "Sara Khaled Ibrahim", action: "Dropped CS103",          time: "14m ago", color: "#ef4444", icon: "🗑️" },
  { name: "Omar Hassan Farouk",  action: "GPA updated → 2.7",     time: "1h ago",  color: "#f59e0b", icon: "📊" },
  { name: "Nour El-Din Samir",   action: "Email created",          time: "2h ago",  color: "#818cf8", icon: "✉️" },
  { name: "Dina Mahmoud Saad",   action: "Schedule published",     time: "Yesterday",color: "#14b8a6",icon: "🗓️" },
];

const GPA_RULES = [
  { label: "Excellent",  range: "GPA ≥ 3.5", hrs: 21, color: "#22c55e", icon: "⭐" },
  { label: "Very Good",  range: "GPA ≥ 3.0", hrs: 18, color: "#4ade80", icon: "✨" },
  { label: "Good",       range: "GPA ≥ 2.5", hrs: 18, color: "#86efac", icon: "👍" },
  { label: "Pass",       range: "GPA ≥ 2.0", hrs: 15, color: "#f59e0b", icon: "📊" },
  { label: "Warning",    range: "GPA ≥ 1.5", hrs: 12, color: "#f97316", icon: "⚠️" },
  { label: "Probation",  range: "GPA < 1.5",  hrs: 9,  color: "#ef4444", icon: "🚨" },
];

const ease = [0.22, 1, 0.36, 1];
const stagger = { show: { transition: { staggerChildren: 0.08 } } };
const fadeUp = { hidden: { opacity: 0, y: 22 }, show: { opacity: 1, y: 0, transition: { duration: 0.48, ease } } };

export default function AdminDashboard() {
  const { user } = useAuth();
  const { regWindow } = useRegistration();
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const greeting = () => {
    const h = time.getHours();
    if (h < 12) return "Good Morning";
    if (h < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const daysLeft = regWindow.deadline
    ? Math.max(0, Math.ceil((new Date(regWindow.deadline) - time) / 86400000))
    : null;

  const firstName = (user?.name || "Admin").split(" ")[0];
  const regPct = Math.round((842 / 1248) * 100);

  return (
    <div className={styles.page}>

      {/* ══ HERO ══════════════════════════════════════════════════ */}
      <motion.div className={styles.hero}
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease }}>

        {/* Left — greeting */}
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroPulse} />
            Admin Control Panel
          </div>
          <h1 className={styles.heroTitle}>
            {greeting()}, <span className={styles.heroAccent}>{firstName}</span> 👋
          </h1>
          <p className={styles.heroSub}>
            <span className={styles.heroDate}>
              {time.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
            </span>
            <span className={styles.heroDot} />
            <span className={styles.heroClock}>
              {time.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
            </span>
          </p>
        </div>

        {/* Right — registration status */}
        <motion.div
          className={`${styles.regCard} ${regWindow.isOpen ? styles.regOpen : styles.regClosed}`}
          animate={regWindow.isOpen
            ? { boxShadow: ["0 0 0 0 rgba(34,197,94,.3)", "0 0 0 14px rgba(34,197,94,0)", "0 0 0 0 rgba(34,197,94,0)"] }
            : {}}
          transition={{ duration: 2.8, repeat: Infinity }}>
          <div className={styles.regCardIcon}>
            {regWindow.isOpen
              ? <motion.span animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 1.8, repeat: Infinity }}>🟢</motion.span>
              : "🔴"
            }
          </div>
          <div className={styles.regCardBody}>
            <span className={styles.regCardTitle}>
              Registration {regWindow.isOpen ? "Open" : "Closed"}
            </span>
            <span className={styles.regCardSub}>
              {regWindow.isOpen && daysLeft !== null
                ? daysLeft === 0 ? "⚡ Closes today!" : `${daysLeft} days remaining · ${regWindow.semester}`
                : "Students cannot register courses"}
            </span>
          </div>
          <motion.button className={styles.regCardBtn}
            onClick={() => navigate("/admin/registration")}
            whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}>
            Manage →
          </motion.button>
        </motion.div>
      </motion.div>

      {/* ══ STATS ═════════════════════════════════════════════════ */}
      <motion.div className={styles.statsRow}
        variants={stagger} initial="hidden" animate="show">
        {STATS.map((s, i) => (
          <motion.div key={s.id} className={styles.statCard} variants={fadeUp}
            style={{ background: s.bg }}
            whileHover={{ y: -5, boxShadow: "0 16px 40px rgba(0,0,0,.25)" }}>
            {/* Corner glow */}
            <div className={styles.statGlow} />

            {/* Top row */}
            <div className={styles.statTop}>
              <div className={styles.statIconBox}>
                {s.icon}
              </div>
              {s.up !== null && (
                <span className={`${styles.statBadge} ${s.up ? styles.badgeUp : styles.badgeDown}`}>
                  {s.up ? "↑" : "↓"} {s.trend}
                </span>
              )}
              {s.up === null && (
                <span className={styles.statBadgeNeutral}>→ {s.trend}</span>
              )}
            </div>

            {/* Value */}
            <div className={styles.statValue}>
              <Counter to={s.value} />
            </div>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statSub}>{s.sub}</div>

            {/* Bottom bar */}
            <motion.div className={styles.statBar}
              style={{ background: `linear-gradient(90deg, ${s.color}, ${s.color}44)` }}
              initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
              transition={{ delay: 0.35 + i * 0.09, duration: 0.9, ease: "easeOut" }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ══ MIDDLE GRID ═══════════════════════════════════════════ */}
      <div className={styles.midGrid}>

        {/* Quick Actions */}
        <motion.div className={styles.card}
          initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.28, duration: 0.5, ease }}>
          <div className={styles.cardHead}>
            <div>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
              <p className={styles.cardSub}>Navigate to any admin section</p>
            </div>
            <span className={styles.cardCount}>{ACTIONS.length}</span>
          </div>
          <div className={styles.actGrid}>
            {ACTIONS.map((a, i) => (
              <motion.button key={a.label}
                className={styles.actBtn}
                style={{ "--ac": a.color }}
                onClick={() => navigate(a.path)}
                initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.34 + i * 0.055, ease }}
                whileHover={{ scale: 1.025, y: -3 }} whileTap={{ scale: 0.97 }}>
                <div className={styles.actIcon} style={{ background: a.color, color: "#fff" }}>
                  {a.icon}
                </div>
                <div className={styles.actText}>
                  <span className={styles.actLabel}>{a.label}</span>
                  <span className={styles.actDesc}>{a.desc}</span>
                </div>
                <motion.span className={styles.actArrow}
                  whileHover={{ x: 4, color: a.color }}
                  style={{ color: "var(--text-muted)" }}>›</motion.span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right side */}
        <div className={styles.rightStack}>

          {/* System Overview */}
          <motion.div className={styles.card}
            initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.32, duration: 0.5, ease }}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>System Overview</h2>
            </div>
            <div className={styles.ovLayout}>
              {/* Arc meter */}
              <div className={styles.ovArcWrap}>
                <ArcMeter pct={regPct} color="#22c55e" size={100} />
                <div className={styles.ovArcCenter}>
                  <span className={styles.ovPct} style={{ color: "#22c55e" }}>{regPct}%</span>
                  <span className={styles.ovPctLbl}>Registered</span>
                </div>
              </div>
              {/* Stats list */}
              <div className={styles.ovList}>
                {[
                  { label: "Registered",  val: 842,  color: "#22c55e", pct: 67 },
                  { label: "Pending",     val: 406,  color: "#f59e0b", pct: 33 },
                  { label: "Instructors", val: 64,   color: "#3b82f6", pct: 5  },
                  { label: "Courses",     val: 38,   color: "#818cf8", pct: 3  },
                ].map((item, i) => (
                  <div key={item.label} className={styles.ovRow}>
                    <div className={styles.ovRowLeft}>
                      <span className={styles.ovDot} style={{ background: item.color }} />
                      <span className={styles.ovLabel}>{item.label}</span>
                    </div>
                    <span className={styles.ovVal} style={{ color: item.color }}>{item.val.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div className={styles.card}
            initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5, ease }}>
            <div className={styles.cardHead}>
              <h2 className={styles.cardTitle}>Recent Activity</h2>
              <span className={styles.liveDot}>
                <motion.span className={styles.livePulse}
                  animate={{ scale: [1, 2, 1], opacity: [1, 0, 1] }}
                  transition={{ duration: 2, repeat: Infinity }} />
                Live
              </span>
            </div>
            <div className={styles.feedList}>
              {RECENT.map((r, i) => (
                <motion.div key={i} className={styles.feedRow}
                  initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.48 + i * 0.07, ease }}>
                  <div className={styles.feedAvatar} style={{ background: r.color, color: "#fff" }}>
                    {r.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div className={styles.feedInfo}>
                    <span className={styles.feedName}>{r.name}</span>
                    <span className={styles.feedAction}>
                      <span className={styles.feedActionIcon}>{r.icon}</span>
                      {r.action}
                    </span>
                  </div>
                  <span className={styles.feedTime}>{r.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══ GPA CREDIT RULES ═════════════════════════════════════ */}
      <div className={styles.gpaSection}>
      <motion.div className={styles.card}
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.52, ease }}>
        <div className={styles.cardHead}>
          <div>
            <h2 className={styles.cardTitle}>Credit Hour Rules</h2>
            <p className={styles.cardSub}>Applied automatically based on GPA — 133 credit hours program</p>
          </div>
          <span className={styles.gpaTag}>GPA System</span>
        </div>

        <div className={styles.gpaGrid}>
          {GPA_RULES.map((r, i) => (
            <motion.div key={r.label} className={styles.gpaCard}
              style={{ background: `linear-gradient(135deg, ${r.color}dd, ${r.color}88)` }}
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.58 + i * 0.065, ease }}
              whileHover={{ y: -4 }}>
              <div className={styles.gpaTop}>
                <span className={styles.gpaEmoji}>{r.icon}</span>
                <div className={styles.gpaHrsBox}>
                  <span className={styles.gpaHrs}>{r.hrs}</span>
                  <span className={styles.gpaHrsSub}>hrs</span>
                </div>
              </div>
              <div className={styles.gpaLabel}>{r.label}</div>
              <div className={styles.gpaRange}>{r.range}</div>
              <div className={styles.gpaBarWrap}>
                <motion.div className={styles.gpaBar}
                  style={{ background: "rgba(255,255,255,.65)" }}
                  initial={{ scaleX: 0 }} animate={{ scaleX: r.hrs / 21 }}
                  transition={{ delay: 0.72 + i * 0.065, duration: 0.75, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      </div>

    </div>
  );
}
