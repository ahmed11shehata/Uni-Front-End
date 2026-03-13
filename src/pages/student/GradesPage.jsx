// src/pages/student/GradesPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./GradesPage.module.css";

/* ─── API LAYER ─────────────────────────────────
  TODO: GET /api/student/transcript?year=X&semester=Y
  TODO: GET /api/student/profile → { currentYear, currentSemester }
─────────────────────────────────────────────── */

/* ══════════════════════════════════════════
   STUDENT PROFILE  (mock — from API later)
══════════════════════════════════════════ */
const STUDENT = {
  name: "Omar Khaled",
  id: "20210423",
  department: "Computer Science",
  currentYear: 3,      // TODO: from API
  currentSemester: 2,  // 1 or 2
};

/* ══════════════════════════════════════════
   FULL ACADEMIC DATA
   Each year has 1 or 2 semesters.
   isCurrent = true  → results not published yet
   gpa = null        → not available yet
══════════════════════════════════════════ */
const ACADEMIC_DATA = [
  /* ─── Year 1 ─── */
  {
    year: 1, label: "First Year",
    semesters: [
      {
        id: "y1s1", label: "Semester 1", period: "Fall 2021",
        isCurrent: false, totalCredits: 18,
        semesterGpa: 3.45,
        courses: [
          { code:"CS101", name:"Introduction to Programming",  credits:3, grade:"A",  points:4.0, total:"92/100" },
          { code:"CS102", name:"Discrete Mathematics",         credits:3, grade:"B+", points:3.5, total:"85/100" },
          { code:"CS103", name:"Digital Logic Design",         credits:3, grade:"A-", points:3.7, total:"88/100" },
          { code:"GE101", name:"Technical English",            credits:2, grade:"A",  points:4.0, total:"94/100" },
          { code:"MA101", name:"Calculus I",                   credits:3, grade:"B",  points:3.0, total:"78/100" },
          { code:"PH101", name:"Physics for Engineers",        credits:4, grade:"B+", points:3.5, total:"83/100" },
        ],
      },
      {
        id: "y1s2", label: "Semester 2", period: "Spring 2022",
        isCurrent: false, totalCredits: 18,
        semesterGpa: 3.62,
        courses: [
          { code:"CS111", name:"Data Structures",              credits:3, grade:"A",  points:4.0, total:"95/100" },
          { code:"CS112", name:"Object-Oriented Programming",  credits:3, grade:"A-", points:3.7, total:"89/100" },
          { code:"CS113", name:"Computer Organization",        credits:3, grade:"B+", points:3.5, total:"84/100" },
          { code:"GE102", name:"Technical Writing",            credits:2, grade:"A",  points:4.0, total:"96/100" },
          { code:"MA102", name:"Calculus II",                  credits:3, grade:"B",  points:3.0, total:"76/100" },
          { code:"ST101", name:"Probability & Statistics",     credits:4, grade:"A-", points:3.7, total:"88/100" },
        ],
      },
    ],
  },
  /* ─── Year 2 ─── */
  {
    year: 2, label: "Second Year",
    semesters: [
      {
        id: "y2s1", label: "Semester 1", period: "Fall 2022",
        isCurrent: false, totalCredits: 18,
        semesterGpa: 3.55,
        courses: [
          { code:"CS201", name:"Algorithms & Complexity",      credits:3, grade:"A-", points:3.7, total:"88/100" },
          { code:"CS202", name:"Operating Systems I",          credits:3, grade:"B+", points:3.5, total:"85/100" },
          { code:"CS203", name:"Database Systems",             credits:3, grade:"A",  points:4.0, total:"93/100" },
          { code:"CS204", name:"Computer Networks",            credits:3, grade:"B",  points:3.0, total:"77/100" },
          { code:"MA201", name:"Linear Algebra",               credits:3, grade:"B+", points:3.5, total:"84/100" },
          { code:"GE201", name:"Engineering Ethics",           credits:3, grade:"A",  points:4.0, total:"91/100" },
        ],
      },
      {
        id: "y2s2", label: "Semester 2", period: "Spring 2023",
        isCurrent: false, totalCredits: 18,
        semesterGpa: 3.78,
        courses: [
          { code:"CS211", name:"Software Engineering",         credits:3, grade:"A",  points:4.0, total:"94/100" },
          { code:"CS212", name:"Computer Architecture",        credits:3, grade:"A-", points:3.7, total:"90/100" },
          { code:"CS213", name:"Web Development",              credits:3, grade:"A",  points:4.0, total:"97/100" },
          { code:"CS214", name:"Automata & Formal Languages",  credits:3, grade:"B+", points:3.5, total:"83/100" },
          { code:"CS215", name:"Numerical Methods",            credits:3, grade:"A-", points:3.7, total:"87/100" },
          { code:"GE202", name:"Project Management",           credits:3, grade:"A",  points:4.0, total:"92/100" },
        ],
      },
    ],
  },
  /* ─── Year 3 ─── */
  {
    year: 3, label: "Third Year",
    semesters: [
      {
        id: "y3s1", label: "Semester 1", period: "Fall 2023",
        isCurrent: false, totalCredits: 18,
        semesterGpa: 3.67,
        courses: [
          { code:"CS301", name:"Artificial Intelligence",      credits:3, grade:"A",  points:4.0, total:"93/100" },
          { code:"CS302", name:"Machine Learning",             credits:3, grade:"A-", points:3.7, total:"89/100" },
          { code:"CS303", name:"Computer Vision",              credits:3, grade:"B+", points:3.5, total:"84/100" },
          { code:"CS304", name:"Distributed Systems",          credits:3, grade:"B+", points:3.5, total:"82/100" },
          { code:"CS305", name:"Information Security",         credits:3, grade:"A-", points:3.7, total:"88/100" },
          { code:"CS306", name:"Mobile App Development",       credits:3, grade:"A",  points:4.0, total:"95/100" },
        ],
      },
      {
        id: "y3s2", label: "Semester 2", period: "Spring 2025",
        isCurrent: true, totalCredits: 18,
        semesterGpa: null, // not published yet
        courses: [
          { code:"CS401", name:"Artificial Intelligence",          credits:3, grade:null, points:null, total:null },
          { code:"CS402", name:"Compiler Theory & Design",         credits:3, grade:null, points:null, total:null },
          { code:"CS403", name:"Digital Image Processing",         credits:3, grade:null, points:null, total:null },
          { code:"CS404", name:"Expert Systems",                   credits:3, grade:null, points:null, total:null },
          { code:"CS405", name:"Natural Language Databases",       credits:3, grade:null, points:null, total:null },
          { code:"CS406", name:"Theory of Operating Systems",      credits:3, grade:null, points:null, total:null },
        ],
      },
    ],
  },
];

/* ════════════════ HELPERS ════════════════ */
function gradeColor(g) {
  if (!g) return "#94a3b8";
  if (g.startsWith("A")) return "#16a34a";
  if (g.startsWith("B")) return "#2563eb";
  if (g.startsWith("C")) return "#d97706";
  return "#dc2626";
}

// compute cumulative GPA up to (including) a given year/semester
function computeCumulativeGpa(upToYear, upToSemId) {
  let gpas = [], found = false;
  for (const yr of ACADEMIC_DATA) {
    for (const sem of yr.semesters) {
      if (sem.semesterGpa !== null) gpas.push(sem.semesterGpa);
      if (sem.id === upToSemId) { found = true; break; }
    }
    if (found) break;
  }
  if (!gpas.length) return null;
  return (gpas.reduce((a, b) => a + b, 0) / gpas.length).toFixed(2);
}

// total credit hours earned across completed semesters up to and including given sem
function computeTotalCredits(upToSemId) {
  let total = 0, found = false;
  for (const yr of ACADEMIC_DATA) {
    for (const sem of yr.semesters) {
      if (!sem.isCurrent) total += sem.totalCredits;
      if (sem.id === upToSemId) { found = true; break; }
    }
    if (found) break;
  }
  return total;
}

function Bar({ pct, color, delay = 0 }) {
  return (
    <div className={styles.miniBarTrack}>
      <motion.div className={styles.miniBarFill}
        style={{ background: color }}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ delay, duration: 0.75, ease: "easeOut" }}/>
    </div>
  );
}

/* ════════════════ SEMESTER VIEW ════════════════ */
function SemesterView({ semester, yearColor }) {
  const cumGpa     = computeCumulativeGpa(null, semester.id);
  const totalCreds = computeTotalCredits(semester.id);
  const isNA       = semester.isCurrent;

  return (
    <motion.div className={styles.semView}
      key={semester.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>

      {/* ── Top stat cards ── */}
      <div className={styles.statCards}>

        {/* Semester GPA */}
        <motion.div className={styles.statCard}
          initial={{ opacity:0, scale:.93 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:.05 }}>
          <div className={styles.statCardIcon} style={{ background:`${yearColor}18`, color:yearColor }}>
            📈
          </div>
          <div className={styles.statCardBody}>
            <div className={styles.statCardVal}
              style={{ color: isNA ? "#94a3b8" : yearColor }}>
              {isNA ? "—" : semester.semesterGpa?.toFixed(2)}
            </div>
            <div className={styles.statCardLabel}>Semester GPA</div>
            {isNA && <div className={styles.naTag}>Not Available Yet</div>}
          </div>
        </motion.div>

        {/* Cumulative GPA */}
        <motion.div className={styles.statCard}
          initial={{ opacity:0, scale:.93 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:.1 }}>
          <div className={styles.statCardIcon} style={{ background:"#6366f118", color:"#6366f1" }}>
            🎓
          </div>
          <div className={styles.statCardBody}>
            <div className={styles.statCardVal}
              style={{ color: cumGpa && !isNA ? "#6366f1" : "#94a3b8" }}>
              {isNA ? "—" : (cumGpa || "—")}
            </div>
            <div className={styles.statCardLabel}>Cumulative GPA</div>
            {isNA && <div className={styles.naTag}>Not Available Yet</div>}
          </div>
        </motion.div>

        {/* Credit hours */}
        <motion.div className={styles.statCard}
          initial={{ opacity:0, scale:.93 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:.15 }}>
          <div className={styles.statCardIcon} style={{ background:"#0ea5e918", color:"#0ea5e9" }}>
            📚
          </div>
          <div className={styles.statCardBody}>
            <div className={styles.statCardVal} style={{ color:"#0ea5e9" }}>
              {semester.totalCredits}
            </div>
            <div className={styles.statCardLabel}>Credit Hours</div>
            <div className={styles.statCardSub}>{totalCreds} total earned</div>
          </div>
        </motion.div>

        {/* Courses */}
        <motion.div className={styles.statCard}
          initial={{ opacity:0, scale:.93 }} animate={{ opacity:1, scale:1 }}
          transition={{ delay:.2 }}>
          <div className={styles.statCardIcon} style={{ background:"#22c55e18", color:"#22c55e" }}>
            📋
          </div>
          <div className={styles.statCardBody}>
            <div className={styles.statCardVal} style={{ color:"#22c55e" }}>
              {semester.courses.length}
            </div>
            <div className={styles.statCardLabel}>Courses</div>
            <div className={styles.statCardSub}>{semester.period}</div>
          </div>
        </motion.div>
      </div>

      {/* ── Courses Table ── */}
      <div className={styles.coursesTable}>

        {/* Header */}
        <div className={styles.tableHead}>
          <span>Course</span>
          <span className={styles.thCenter}>Credits</span>
          <span className={styles.thCenter}>Grade</span>
          <span className={styles.thCenter}>Progress</span>
        </div>

        {/* Rows */}
        {semester.courses.map((course, i) => {
          const gc  = gradeColor(course.grade);
          const pct = course.points !== null ? (course.points / 4) * 100 : 0;
          return (
            <motion.div key={i} className={`${styles.tableRow} ${isNA ? styles.tableRowNA : ""}`}
              initial={{ opacity:0, x:-14 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:.18+i*.05, duration:.3, ease:[.22,1,.36,1] }}>

              <div className={styles.tdCourse}>
                <span className={styles.courseCode} style={{ color: yearColor }}>
                  {course.code}
                </span>
                <span className={styles.courseName}>{course.name}</span>
              </div>

              <span className={styles.tdCredits}>{course.credits} hrs</span>

              <span className={styles.tdGrade}>
                {course.grade ? (
                  <span className={styles.gradePill} style={{ background:`${gc}15`, color:gc }}>
                    {course.grade}
                  </span>
                ) : (
                  <span className={styles.naPill}>Not Available Yet</span>
                )}
              </span>

              <div className={styles.tdBar}>
                {course.points !== null ? (
                  <Bar pct={pct} color={gc} delay={.22+i*.05}/>
                ) : (
                  <span className={styles.tdBarNA}>—</span>
                )}
              </div>

            </motion.div>
          );
        })}
      </div>

      {/* NA notice for current semester */}
      {isNA && (
        <motion.div className={styles.naNotice}
          initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
          transition={{ delay:.4 }}>
          <div className={styles.naNoticeIcon}>⏳</div>
          <div>
            <div className={styles.naNoticeTitle}>Results Not Published Yet</div>
            <div className={styles.naNoticeSub}>
              This semester is currently in progress. Your final grades and GPA will be available after the examination period.
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}

/* ════════════════ PAGE ════════════════ */
const YEAR_COLORS = ["#e8a838", "#7c6fc4", "#3d9e8a", "#e05c8a"];
const YEAR_ORDINALS = ["1st", "2nd", "3rd", "4th"];

export default function GradesPage() {
  // Only show years up to student's current year
  const availableYears = ACADEMIC_DATA.filter(y => y.year <= STUDENT.currentYear);

  const [selectedYear, setSelectedYear]   = useState(STUDENT.currentYear);
  const [selectedSemId, setSelectedSemId] = useState(
    // default: current semester
    ACADEMIC_DATA
      .find(y => y.year === STUDENT.currentYear)
      ?.semesters.find(s => s.isCurrent)?.id
    ||
    ACADEMIC_DATA
      .find(y => y.year === STUDENT.currentYear)
      ?.semesters.slice(-1)[0]?.id
  );

  const yearData     = ACADEMIC_DATA.find(y => y.year === selectedYear);
  const yearColor    = YEAR_COLORS[selectedYear - 1] || "#6366f1";
  const semesterData = yearData?.semesters.find(s => s.id === selectedSemId)
                    || yearData?.semesters[0];

  // Overall cumulative GPA (all completed semesters)
  const allCompletedGpas = ACADEMIC_DATA
    .flatMap(y => y.semesters)
    .filter(s => s.semesterGpa !== null)
    .map(s => s.semesterGpa);
  const overallGpa = allCompletedGpas.length
    ? (allCompletedGpas.reduce((a,b)=>a+b,0)/allCompletedGpas.length).toFixed(2)
    : "—";
  const totalEarnedCredits = ACADEMIC_DATA
    .flatMap(y => y.semesters)
    .filter(s => !s.isCurrent)
    .reduce((a,s) => a + s.totalCredits, 0);

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <motion.div className={styles.header}
        initial={{ opacity:0, y:-14 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:.36 }}>
        <div className={styles.headerLeft}>
          <h1 className={styles.pageTitle}>My Grades</h1>
          <p className={styles.pageSubtitle}>
            {STUDENT.name} · {STUDENT.id} · {STUDENT.department}
          </p>
        </div>
        <div className={styles.headerSummary}>
          <div className={styles.summaryItem}>
            <span className={styles.summaryVal} style={{ color:"#6366f1" }}>{overallGpa}</span>
            <span className={styles.summaryLabel}>Overall GPA</span>
          </div>
          <div className={styles.summaryDivider}/>
          <div className={styles.summaryItem}>
            <span className={styles.summaryVal} style={{ color:"#0ea5e9" }}>{totalEarnedCredits}</span>
            <span className={styles.summaryLabel}>Credits Earned</span>
          </div>
          <div className={styles.summaryDivider}/>
          <div className={styles.summaryItem}>
            <span className={styles.summaryVal} style={{ color:"#22c55e" }}>
              {STUDENT.currentYear}{["st","nd","rd","th"][STUDENT.currentYear-1]}
            </span>
            <span className={styles.summaryLabel}>Current Year</span>
          </div>
        </div>
      </motion.div>

      {/* ── Year Tabs ── */}
      <div className={styles.yearTabs}>
        {availableYears.map((yr, i) => {
          const isActive = yr.year === selectedYear;
          const yc = YEAR_COLORS[yr.year - 1];
          return (
            <motion.button key={yr.year}
              className={`${styles.yearTab} ${isActive ? styles.yearTabActive : ""}`}
              style={isActive ? { background:yc, borderColor:yc, color:"#fff" } : {}}
              onClick={() => {
                setSelectedYear(yr.year);
                setSelectedSemId(yr.semesters[0].id);
              }}
              whileHover={{ scale:1.03 }} whileTap={{ scale:.97 }}>
              <span className={styles.yearTabOrd}>{YEAR_ORDINALS[yr.year-1]}</span>
              <span className={styles.yearTabLabel}>{yr.label}</span>
              {yr.semesters.some(s=>s.isCurrent) && (
                <span className={styles.currentDot}/>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── Semester Selector ── */}
      <AnimatePresence mode="wait">
        <motion.div key={selectedYear} className={styles.semSelector}
          initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
          exit={{ opacity:0 }} transition={{ duration:.2 }}>
          {yearData?.semesters.map(sem => (
            <button key={sem.id}
              className={`${styles.semBtn} ${semesterData?.id===sem.id ? styles.semBtnActive : ""}`}
              style={semesterData?.id===sem.id ? { borderColor:yearColor, color:yearColor } : {}}
              onClick={() => setSelectedSemId(sem.id)}>
              {sem.label}
              {sem.isCurrent && <span className={styles.semCurrentTag}>Current</span>}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* ── Semester Content ── */}
      <div className={styles.content}>
        <AnimatePresence mode="wait">
          {semesterData && (
            <SemesterView
              key={semesterData.id}
              semester={semesterData}
              yearColor={yearColor}/>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}