// src/pages/student/CoursesPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./CoursesPage.module.css";

/* ─────────────────────────────────────────────────
   API LAYER
   TODO: uncomment real calls when backend is ready
───────────────────────────────────────────────── */
const BASE_URL = "http://localhost:8000/api";

async function fetchEnrolledCourses(token) {
  // const res = await fetch(`${BASE_URL}/student/courses`, {
  //   headers: { Authorization: `Bearer ${token}` }
  // });
  // return res.json();

  await new Promise(r => setTimeout(r, 700));
  return [
    { id: 1, code: "CS401", name: "Artificial Intelligence",     instructor: "Dr. Mohamed Farouk",  level: 3, credits: 3, progress: 100, color: "#e8a838", pattern: "mosaic"   },
    { id: 2, code: "CS402", name: "Compiler Theory & Design",    instructor: "Dr. Heba Nasser",     level: 3, credits: 3, progress: 100, color: "#7c6fc4", pattern: "circles"  },
    { id: 3, code: "CS403", name: "Digital Image Processing",    instructor: "Dr. Amr Saleh",       level: 3, credits: 3, progress: 100, color: "#78909c", pattern: "squares"  },
    { id: 4, code: "CS404", name: "Expert Systems",              instructor: "Dr. Dina Mahmoud",    level: 3, credits: 3, progress: 72,  color: "#e05c8a", pattern: "mosaic"   },
    { id: 5, code: "CS405", name: "Natural Language Databases",  instructor: "Dr. Khaled Ibrahim",  level: 3, credits: 3, progress: 45,  color: "#5b9fb5", pattern: "squares"  },
    { id: 6, code: "CS406", name: "Theory of Operating Systems", instructor: "Dr. Rania Hassan",    level: 3, credits: 3, progress: 88,  color: "#3d8fe0", pattern: "diamonds" },
  ];
}

/* ── SVG pattern backgrounds ── */
function getPatternBg(pattern, color) {
  const enc = encodeURIComponent;
  const c = color;
  const patterns = {
    mosaic:   `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect x='2' y='2' width='24' height='24' rx='3' fill='${enc(c)}' opacity='.5'/%3E%3Crect x='30' y='2' width='24' height='24' rx='3' fill='${enc(c)}' opacity='.3'/%3E%3Crect x='2' y='30' width='24' height='24' rx='3' fill='${enc(c)}' opacity='.3'/%3E%3Crect x='30' y='30' width='24' height='24' rx='3' fill='${enc(c)}' opacity='.5'/%3E%3C/svg%3E")`,
    circles:  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='28' fill='none' stroke='${enc(c)}' stroke-width='18' opacity='.3'/%3E%3Ccircle cx='0' cy='0' r='18' fill='none' stroke='${enc(c)}' stroke-width='12' opacity='.2'/%3E%3Ccircle cx='80' cy='80' r='18' fill='none' stroke='${enc(c)}' stroke-width='12' opacity='.2'/%3E%3C/svg%3E")`,
    squares:  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Crect x='8' y='8' width='56' height='56' fill='none' stroke='${enc(c)}' stroke-width='3' opacity='.22'/%3E%3Crect x='18' y='18' width='36' height='36' fill='none' stroke='${enc(c)}' stroke-width='2.5' opacity='.18'/%3E%3Crect x='28' y='28' width='16' height='16' fill='none' stroke='${enc(c)}' stroke-width='2' opacity='.15'/%3E%3C/svg%3E")`,
    diamonds: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32,4 60,32 32,60 4,32' fill='none' stroke='${enc(c)}' stroke-width='3' opacity='.26'/%3E%3Cpolygon points='32,16 48,32 32,48 16,32' fill='none' stroke='${enc(c)}' stroke-width='2.5' opacity='.2'/%3E%3C/svg%3E")`,
  };
  return patterns[pattern] || patterns.mosaic;
}

/* ── Progress ring SVG ── */
function ProgressRing({ pct, color, size = 52, stroke = 3.5 }) {
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={stroke}/>
        <motion.circle
          cx={size/2} cy={size/2} r={r}
          fill="none" stroke="white" strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ * (1 - pct / 100) }}
          transition={{ duration: 1.1, ease: "easeOut", delay: 0.2 }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        gap: 0,
      }}>
        <span style={{ fontSize: 11, fontWeight: 800, color: "white", lineHeight: 1 }}>{pct}%</span>
      </div>
    </div>
  );
}

/* ── Course Card ── */
function CourseCard({ course, index }) {
  const navigate = useNavigate();
  const pat = getPatternBg(course.pattern, course.color);

  const statusLabel = course.progress === 100 ? "Completed" : course.progress > 0 ? "In Progress" : "Not Started";
  const statusColor = course.progress === 100 ? "#22c55e" : course.progress > 0 ? course.color : "#94a3b8";

  return (
    <motion.article
      className={styles.card}
      initial={{ opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.05 * index, duration: 0.48, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      onClick={() => navigate(`/student/courses/${course.id}`)}
    >
      {/* ── Cover ── */}
      <div
        className={styles.cover}
        style={{
          background: course.color,
          backgroundImage: pat,
          backgroundSize: "64px 64px",
        }}
      >
        {/* Dark overlay for readability */}
        <div className={styles.coverDark} />

        {/* Top row */}
        <div className={styles.coverTop}>
          <span className={styles.codeTag}>{course.code}</span>
          <ProgressRing pct={course.progress} color={course.color} size={52} />
        </div>

        {/* Status */}
        <div className={styles.coverBottom}>
          <span
            className={styles.statusDot}
            style={{ background: course.progress === 100 ? "#22c55e" : "white" }}
          />
          <span className={styles.statusLabel}>{statusLabel}</span>
        </div>
      </div>

      {/* ── Body ── */}
      <div className={styles.cardBody}>
        <h3 className={styles.courseName}>{course.name}</h3>
        <p className={styles.instructorName}>👨‍🏫 {course.instructor}</p>

        <div className={styles.metaRow}>
          <span className={styles.metaChip}>Level {course.level}</span>
          <span className={styles.metaChip}>{course.credits} Credits</span>
        </div>

        {/* Progress bar */}
        <div className={styles.progressSection}>
          <div className={styles.progressTrack}>
            <motion.div
              className={styles.progressFill}
              style={{ background: `linear-gradient(90deg, ${course.color}bb, ${course.color})` }}
              initial={{ width: 0 }}
              animate={{ width: `${course.progress}%` }}
              transition={{ delay: 0.12 + 0.05 * index, duration: 1, ease: "easeOut" }}
            />
          </div>
          <span className={styles.progressTxt} style={{ color: course.color }}>
            {course.progress}%
          </span>
        </div>

        {/* CTA */}
        <motion.div
          className={styles.cardCta}
          style={{ borderColor: `${course.color}30`, color: course.color }}
          whileHover={{ background: `${course.color}12` }}
        >
          {course.progress === 100 ? "View Materials" : "Continue Course"} →
        </motion.div>
      </div>
    </motion.article>
  );
}

/* ── Page ── */
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState("");
  const [sortBy,  setSortBy]  = useState("name");
  const [filter,  setFilter]  = useState("all"); // all | done | progress

  useEffect(() => {
    fetchEnrolledCourses()
      .then(setCourses)
      .finally(() => setLoading(false));
  }, []);

  const displayed = courses
    .filter(c => {
      const q = search.toLowerCase();
      const matchSearch = c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q);
      const matchFilter =
        filter === "all"      ? true :
        filter === "done"     ? c.progress === 100 :
        filter === "progress" ? c.progress > 0 && c.progress < 100 : true;
      return matchSearch && matchFilter;
    })
    .sort((a, b) =>
      sortBy === "name"     ? a.name.localeCompare(b.name) :
      sortBy === "progress" ? b.progress - a.progress : 0
    );

  const stats = {
    total:    courses.length,
    done:     courses.filter(c => c.progress === 100).length,
    ongoing:  courses.filter(c => c.progress > 0 && c.progress < 100).length,
    credits:  courses.reduce((s, c) => s + c.credits, 0),
  };

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <motion.div
        className={styles.pageHeader}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42 }}
      >
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>My Courses</h1>
          <p className={styles.pageSubtitle}>Spring 2025 — Course overview</p>
        </div>
      </motion.div>

      {/* ── Stats strip ── */}
      <motion.div
        className={styles.statsRow}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.38 }}
      >
        {[
          { label: "Enrolled",   value: stats.total,   color: "#6366f1" },
          { label: "Completed",  value: stats.done,    color: "#22c55e" },
          { label: "In Progress",value: stats.ongoing, color: "#f59e0b" },
          { label: "Credits",    value: stats.credits, color: "#0ea5e9" },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            className={styles.statCard}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.06, type: "spring", stiffness: 380, damping: 24 }}
          >
            <span className={styles.statValue} style={{ color: s.color }}>{s.value}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Controls ── */}
      <motion.div
        className={styles.controls}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16, duration: 0.34 }}
      >
        {/* Search */}
        <div className={styles.searchBox}>
          <svg className={styles.searchIco} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            className={styles.searchInput}
            placeholder="Search courses…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Filter pills */}
        <div className={styles.filterPills}>
          {[
            { key: "all",      label: "All" },
            { key: "progress", label: "In Progress" },
            { key: "done",     label: "Completed" },
          ].map(f => (
            <button
              key={f.key}
              className={`${styles.pill} ${filter === f.key ? styles.pillActive : ""}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select className={styles.sortSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Sort by name</option>
          <option value="progress">Sort by progress</option>
        </select>
      </motion.div>

      {/* ── Grid ── */}
      {loading ? (
        <div className={styles.grid}>
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i} className={styles.skeleton}
              animate={{ opacity: [0.45, 0.8, 0.45] }}
              transition={{ duration: 1.5, delay: i * 0.1, repeat: Infinity }}
            />
          ))}
        </div>
      ) : displayed.length === 0 ? (
        <motion.div className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <span style={{ fontSize: 52 }}>📚</span>
          <p>No courses match your search</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div key={filter + sortBy} className={styles.grid}>
            {displayed.map((c, i) => <CourseCard key={c.id} course={c} index={i} />)}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}