import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Sidebar.module.css";

/* ── Icons ─────────────────────────────────────── */
const IC = {
  home:        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  courses:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  grades:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  timetable:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  quizzes:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>,
  assignments: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  ai:          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2V4a2 2 0 012-2z"/><path d="M12 16a2 2 0 012 2v2a2 2 0 01-2 2 2 2 0 01-2-2v-2a2 2 0 012-2z"/><path d="M2 12a2 2 0 012-2h2a2 2 0 012 2 2 2 0 01-2 2H4a2 2 0 01-2-2z"/><path d="M16 12a2 2 0 012-2h2a2 2 0 012 2 2 2 0 01-2 2h-2a2 2 0 01-2-2z"/><circle cx="12" cy="12" r="2"/></svg>,
  register:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>,
  quiz_build:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  upload:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0018 9h-1.26A8 8 0 103 16.3"/></svg>,
  users:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  logout:      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
  chevL:       <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
};

const NAV = {
  student: [
    { label: "Home",                path: "/student/dashboard",        icon: IC.home,        badge: null  },
    { label: "My Courses",          path: "/student/courses",          icon: IC.courses,     badge: "6"   },
    { label: "Grades",              path: "/student/grades",           icon: IC.grades,      badge: null  },
    { label: "Timetable",           path: "/student/timetable",        icon: IC.timetable,   badge: null  },
    { label: "Quizzes",             path: "/student/quizzes",          icon: IC.quizzes,     badge: "2"   },
    { label: "Assignments",         path: "/student/assignments",      icon: IC.assignments, badge: "3"   },
    { label: "AI Tools",            path: "/student/ai-tools",         icon: IC.ai,          badge: "NEW" },
    { label: "Course Registration", path: "/student/register-courses", icon: IC.register,    badge: null  },
  ],
  instructor: [
    { label: "Home",            path: "/instructor/dashboard",    icon: IC.home,        badge: null },
    { label: "Quiz Builder",    path: "/instructor/quiz-builder", icon: IC.quiz_build,  badge: null },
    { label: "Assignments",     path: "/instructor/assignments",  icon: IC.assignments, badge: null },
    { label: "Upload Lectures", path: "/instructor/lectures",     icon: IC.upload,      badge: null },
    { label: "Grades",          path: "/instructor/grades",       icon: IC.grades,      badge: null },
  ],
  admin: [
    { label: "Home",          path: "/admin/dashboard", icon: IC.home,     badge: null },
    { label: "Register User", path: "/admin/register",  icon: IC.register, badge: null },
    { label: "Manage Users",  path: "/admin/dashboard", icon: IC.users,    badge: null },
  ],
};

const ROLES = {
  student:    { label: "Student",    accent: "#8b7cf8" },
  instructor: { label: "Instructor", accent: "#5ba4cf" },
  admin:      { label: "Admin",      accent: "#e07b6a" },
};

/* ── Nav Item ────────────────────────────────────── */
function NavItem({ item, collapsed, index }) {
  const [tip, setTip] = useState(false);

  return (
    <motion.div
      style={{ position: "relative" }}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.04 + index * 0.04, duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => collapsed && setTip(true)}
      onMouseLeave={() => setTip(false)}
    >
      <NavLink
        to={item.path}
        className={({ isActive }) => `${styles.navItem} ${isActive ? styles.navActive : ""}`}
      >
        {({ isActive }) => (
          <>
            {/* Sliding active background */}
            {isActive && (
              <motion.div
                className={styles.activeBg}
                layoutId="activeBg"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}

            {/* Icon */}
            <motion.div
              className={styles.iconWrap}
              whileHover={{ scale: 1.1 }}
              animate={isActive ? { scale: 1 } : { scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              {item.icon}
            </motion.div>

            {/* Label */}
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  className={styles.navLabel}
                  initial={{ opacity: 0, x: -10, width: 0 }}
                  animate={{ opacity: 1, x: 0, width: "auto" }}
                  exit={{ opacity: 0, x: -8, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Badge */}
            <AnimatePresence>
              {!collapsed && item.badge && (
                <motion.span
                  className={`${styles.badge} ${item.badge === "NEW" ? styles.badgeNew : styles.badgeNum}`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 480, damping: 22 }}
                >
                  {item.badge}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Active left indicator */}
            {isActive && (
              <motion.div
                className={styles.activeBar}
                layoutId="activeBar"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
          </>
        )}
      </NavLink>

      {/* Tooltip when collapsed */}
      <AnimatePresence>
        {collapsed && tip && (
          <motion.div
            className={styles.tooltip}
            initial={{ opacity: 0, x: -8, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -5, scale: 0.92 }}
            transition={{ duration: 0.14 }}
          >
            {item.label}
            {item.badge && <span className={styles.tipBadge}>{item.badge}</span>}
            <div className={styles.tipArrow} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ── Sidebar ─────────────────────────────────────── */
export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showLogout, setShowLogout] = useState(false);
  const [time, setTime] = useState(new Date());

  const items  = NAV[user?.role] || [];
  const role   = ROLES[user?.role] || ROLES.student;
  const letter = user?.name?.charAt(0)?.toUpperCase() || "?";
  // Shorten name: first + first word of last
  const displayName = (() => {
    const parts = (user?.name || "").trim().split(" ");
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1]}`;
  })();

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  const hhmm = time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <motion.aside
      className={styles.sidebar}
      style={{ "--accent": role.accent }}
      animate={{ width: collapsed ? 70 : 252 }}
      transition={{ type: "spring", stiffness: 280, damping: 30 }}
    >
      {/* Subtle top glow */}
      <div
        className={styles.topGlow}
        style={{ background: `radial-gradient(ellipse 100% 40% at 50% 0%, ${role.accent}18, transparent)` }}
      />

      {/* ══ LOGO ══ */}
      <div className={styles.logoRow}>
        <motion.div
          className={styles.logoMark}
          whileHover={{ rotate: 180, scale: 1.05 }}
          transition={{ duration: 0.55, ease: "easeInOut" }}
        >
          <svg viewBox="0 0 36 36" fill="none">
            <rect x="1" y="1" width="34" height="34" rx="10" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            <polygon points="18,8 28,14 28,22 18,28 8,22 8,14" fill="white" opacity="0.9"/>
            <circle cx="18" cy="18" r="3.5" fill={role.accent}/>
          </svg>
        </motion.div>

        <AnimatePresence>
          {!collapsed && (
            <motion.div
              className={styles.logoText}
              initial={{ opacity: 0, x: -14 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
            >
              <span className={styles.logoMain}>AKHBAR ELYOM</span>
              <span className={styles.logoSub}>Academy</span>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          className={styles.toggleBtn}
          onClick={onToggle}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.88 }}
        >
          <motion.span
            style={{ display: "flex" }}
            animate={{ rotate: collapsed ? 180 : 0 }}
            transition={{ type: "spring", stiffness: 280, damping: 24 }}
          >
            {IC.chevL}
          </motion.span>
        </motion.button>
      </div>

      {/* ══ USER CARD ══ */}
      <div className={styles.userSection}>
        <AnimatePresence mode="wait">
          {!collapsed ? (
            <motion.div
              key="full"
              className={styles.userCard}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.24 }}
            >
              <div className={styles.userCardInner}>
                {/* Avatar */}
                <motion.div
                  className={styles.avatar}
                  style={{ background: `linear-gradient(135deg, ${role.accent}cc, ${role.accent}66)` }}
                  whileHover={{ scale: 1.06 }}
                >
                  {letter}
                  <span className={styles.onlineDot} />
                </motion.div>

                {/* Info */}
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{displayName}</span>
                  <span className={styles.userRole} style={{ color: role.accent }}>
                    {role.label}
                  </span>
                </div>

                {/* Time */}
                <span className={styles.timeTag}>{hhmm}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="mini"
              className={styles.userMini}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.div
                className={styles.avatarMini}
                style={{ background: `linear-gradient(135deg, ${role.accent}cc, ${role.accent}66)` }}
                whileHover={{ scale: 1.08 }}
              >
                {letter}
                <span className={styles.onlineDot} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ SEPARATOR ══ */}
      <div className={styles.sep}>
        <motion.div
          className={styles.sepLine}
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
      </div>

      {/* Section label */}
      <AnimatePresence>
        {!collapsed && (
          <motion.span
            className={styles.sectionLabel}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          >
            MENU
          </motion.span>
        )}
      </AnimatePresence>

      {/* ══ NAV ══ */}
      <nav className={styles.nav}>
        {items.map((item, i) => (
          <NavItem key={item.label} item={item} collapsed={collapsed} index={i} />
        ))}
      </nav>

      {/* ══ BOTTOM ══ */}
      <div className={styles.bottom}>
        <div className={styles.sep}>
          <motion.div
            className={styles.sepLine}
            initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          />
        </div>

        {/* Logout confirm */}
        <AnimatePresence>
          {showLogout && (
            <motion.div
              className={styles.logoutBox}
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 380, damping: 28 }}
            >
              {!collapsed && <p className={styles.logoutQuestion}>Sign out of your account?</p>}
              <div className={styles.logoutBtns}>
                <motion.button
                  className={styles.btnConfirm}
                  onClick={() => { logout(); navigate("/login"); }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <span className={styles.btnIcon}>{IC.logout}</span>
                  {!collapsed && "Sign Out"}
                </motion.button>
                <motion.button
                  className={styles.btnCancel}
                  onClick={() => setShowLogout(false)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.96 }}
                >
                  {collapsed ? "✕" : "Cancel"}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Logout trigger */}
        <motion.button
          className={`${styles.logoutBtn} ${showLogout ? styles.logoutOpen : ""}`}
          onClick={() => setShowLogout(v => !v)}
          whileHover="hov"
          whileTap={{ scale: 0.96 }}
        >
          <motion.div
            className={styles.logoutHoverBg}
            variants={{ hov: { opacity: 1 } }}
            initial={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
          />
          <motion.span
            className={styles.logoutIconWrap}
            variants={{ hov: { x: 2 } }}
            transition={{ duration: 0.2 }}
          >
            {IC.logout}
          </motion.span>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                className={styles.logoutLabel}
                initial={{ opacity: 0, x: -10, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -8, width: 0 }}
                transition={{ duration: 0.18 }}
              >
                Sign Out
              </motion.span>
            )}
          </AnimatePresence>
          {/* subtle red dot */}
          <motion.span
            className={styles.logoutDot}
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />
        </motion.button>
      </div>
    </motion.aside>
  );
}