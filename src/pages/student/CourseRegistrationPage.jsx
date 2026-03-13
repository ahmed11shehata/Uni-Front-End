import { useState, useMemo } from "react";
import styles from "./CourseRegistrationPage.module.css";

const MOCK_COURSES = [
  { id: 1, code: "CS101", name: "Introduction to Programming",    instructor: "Dr. Ahmed Hassan",  schedule: "Sun/Tue 10:00–11:30",  credits: 3, capacity: 50, enrolled: 35, status: "registered", locked: null },
  { id: 2, code: "CS102", name: "Discrete Mathematics",           instructor: "Dr. Sara Khalil",   schedule: "Mon/Wed 12:00–13:30",  credits: 3, capacity: 50, enrolled: 48, status: "available",  locked: null },
  { id: 3, code: "CS103", name: "Digital Logic Design",           instructor: "Dr. Omar Farouk",   schedule: "Sun/Tue 14:00–15:30",  credits: 3, capacity: 40, enrolled: 40, status: "full",       locked: null },
  { id: 4, code: "CS104", name: "Calculus I",                     instructor: "Dr. Mona Adel",     schedule: "Mon/Wed 08:00–09:30",  credits: 3, capacity: 60, enrolled: 22, status: "available",  locked: null },
  { id: 5, code: "CS105", name: "Data Structures",                instructor: "Dr. Khaled Nour",   schedule: "Sun/Tue 12:00–13:30",  credits: 3, capacity: 45, enrolled: 30, status: "locked",     locked: { reason: "Must pass CS101 first" } },
  { id: 6, code: "CS106", name: "Object Oriented Programming",    instructor: "Dr. Hana Mostafa",  schedule: "Wed/Thu 10:00–11:30",  credits: 3, capacity: 50, enrolled: 18, status: "locked",     locked: { reason: "Must pass CS101 first" } },
  { id: 7, code: "CS107", name: "Computer Organization",          instructor: "Dr. Tarek Samir",   schedule: "Mon/Thu 14:00–15:30",  credits: 3, capacity: 45, enrolled: 32, status: "available",  locked: null },
  { id: 8, code: "MATH101", name: "Linear Algebra",               instructor: "Dr. Nadia Fouad",   schedule: "Sun/Wed 08:00–09:30",  credits: 3, capacity: 55, enrolled: 41, status: "registered", locked: null },
];

const STATUS_LABELS = {
  all:        "All",
  available:  "Available",
  registered: "Registered",
  locked:     "Locked",
  full:       "Full",
};

export default function CourseRegistrationPage() {
  const [courses, setCourses] = useState(MOCK_COURSES);
  const [filter, setFilter]   = useState("all");
  const [search, setSearch]   = useState("");
  const [toast, setToast]     = useState(null);

  const allowedCredits    = 21;
  const registeredCredits = useMemo(
    () => courses.filter(c => c.status === "registered").reduce((sum, c) => sum + c.credits, 0),
    [courses]
  );

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleRegister = (id) => {
    const course = courses.find(c => c.id === id);
    if (registeredCredits + course.credits > allowedCredits) {
      showToast("Credit limit exceeded!", "error"); return;
    }
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: "registered", enrolled: c.enrolled + 1 } : c));
    showToast(`${course.code} registered successfully ✓`);
  };

  const handleDrop = (id) => {
    const course = courses.find(c => c.id === id);
    setCourses(prev => prev.map(c => c.id === id ? { ...c, status: "available", enrolled: c.enrolled - 1 } : c));
    showToast(`${course.code} dropped`, "info");
  };

  const filtered = useMemo(() => courses.filter(c => {
    const matchFilter = filter === "all" || c.status === filter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  }), [courses, filter, search]);

  const pct           = Math.round((registeredCredits / allowedCredits) * 100);
  const progressColor = pct >= 90 ? "#ef4444" : pct >= 70 ? "#f59e0b" : "var(--accent)";

  return (
    <div className={styles.page}>
      {toast && <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.msg}</div>}

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <div>
            <h1 className={styles.title}>Course Registration</h1>
            <p className={styles.subtitle}>Year 1 — Semester 1 &nbsp;|&nbsp; 2025/2026</p>
          </div>
          <div className={styles.creditBadge}>
            <span className={styles.creditNum} style={{ color: progressColor }}>{registeredCredits}</span>
            <span className={styles.creditSlash}>/</span>
            <span className={styles.creditTotal}>{allowedCredits}</span>
            <span className={styles.creditLabel}>Credits</span>
          </div>
        </div>

        <div className={styles.progressWrap}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${pct}%`, background: progressColor }} />
          </div>
          <span className={styles.progressPct}>{pct}%</span>
        </div>

        <div className={styles.statsRow}>
          {[
            { label: "Registered", value: courses.filter(c => c.status === "registered").length, color: "var(--accent)" },
            { label: "Available",  value: courses.filter(c => c.status === "available").length,  color: "#22c55e" },
            { label: "Locked",     value: courses.filter(c => c.status === "locked").length,     color: "#f59e0b" },
            { label: "Full",       value: courses.filter(c => c.status === "full").length,       color: "#6b7280" },
          ].map(s => (
            <div key={s.label} className={styles.statChip}>
              <span className={styles.statVal} style={{ color: s.color }}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className={styles.controls}>
        <div className={styles.filterTabs}>
          {Object.entries(STATUS_LABELS).map(([key, label]) => (
            <button
              key={key}
              className={`${styles.filterBtn} ${filter === key ? styles.active : ""}`}
              onClick={() => setFilter(key)}
            >
              {label}
              <span className={styles.filterCount}>
                {key === "all" ? courses.length : courses.filter(c => c.status === key).length}
              </span>
            </button>
          ))}
        </div>
        <div className={styles.searchWrap}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Grid */}
      <div className={styles.grid}>
        {filtered.map(course => (
          <CourseCard
            key={course.id}
            course={course}
            onRegister={handleRegister}
            onDrop={handleDrop}
            remainingCredits={allowedCredits - registeredCredits}
          />
        ))}
        {filtered.length === 0 && (
          <div className={styles.empty}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
              <rect x="9" y="3" width="6" height="4" rx="1"/>
            </svg>
            <p>No courses found</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CourseCard({ course, onRegister, onDrop, remainingCredits }) {
  const capacityPct  = Math.round((course.enrolled / course.capacity) * 100);
  const isLocked     = course.status === "locked";
  const isFull       = course.status === "full";
  const isRegistered = course.status === "registered";
  const canRegister  = course.credits <= remainingCredits;

  const statusLabel = { available: "Available", registered: "Registered", full: "Full", locked: "Locked" }[course.status];

  return (
    <div className={`${styles.card} ${styles[course.status]}`}>
      <div className={styles.cardTop}>
        <div className={styles.codeWrap}>
          <span className={styles.code}>{course.code}</span>
          {isLocked && (
            <span className={styles.lockIcon}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </span>
          )}
          <span className={`${styles.statusBadge} ${styles[`badge_${course.status}`]}`}>{statusLabel}</span>
        </div>
        <span className={styles.credits}>{course.credits} Credits</span>
      </div>

      <h3 className={styles.courseName}>{course.name}</h3>

      <div className={styles.infoList}>
        <div className={styles.infoRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
          <span>{course.instructor}</span>
        </div>
        <div className={styles.infoRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
          <span>{course.schedule}</span>
        </div>
        <div className={styles.infoRow}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>Capacity: {course.enrolled}/{course.capacity}</span>
          <div className={styles.capBar}>
            <div className={styles.capFill} style={{
              width: `${capacityPct}%`,
              background: capacityPct >= 90 ? "#ef4444" : capacityPct >= 70 ? "#f59e0b" : "#22c55e"
            }}/>
          </div>
        </div>
      </div>

      {isLocked && (
        <div className={styles.lockReason}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          {course.locked.reason}
        </div>
      )}

      <div className={styles.cardAction}>
        {isRegistered && (
          <button className={styles.btnDrop} onClick={() => onDrop(course.id)}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
            </svg>
            Drop Course
          </button>
        )}
        {course.status === "available" && (
          <button
            className={`${styles.btnRegister} ${!canRegister ? styles.btnDisabledCredit : ""}`}
            onClick={() => onRegister(course.id)}
            disabled={!canRegister}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {canRegister ? "Register" : "Not Enough Credits"}
          </button>
        )}
        {isFull   && <button className={styles.btnFull}   disabled>Course Full</button>}
        {isLocked && (
          <button className={styles.btnLocked} disabled>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Locked
          </button>
        )}
      </div>
    </div>
  );
}