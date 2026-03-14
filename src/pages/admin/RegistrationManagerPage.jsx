// src/pages/admin/RegistrationManagerPage.jsx
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRegistration } from "../../context/RegistrationContext";
import { COURSE_DB } from "../../services/mock/mockData";
import styles from "./RegistrationManagerPage.module.css";

/* ─────────────── SVG icons ─────────────── */
const I = {
  play:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  stop:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/></svg>,
  save:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  lock:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  clock:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  cal:     <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  check:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
  book:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,
  warn:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  users:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
  info:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
};

/* ─── patterns (same CoursesPage style) ─── */
function pat(type, color) {
  const c = encodeURIComponent(color);
  const p = {
    mosaic:   `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect x='2' y='2' width='24' height='24' rx='3' fill='${c}' opacity='.45'/%3E%3Crect x='30' y='2' width='24' height='24' rx='3' fill='${c}' opacity='.25'/%3E%3Crect x='2' y='30' width='24' height='24' rx='3' fill='${c}' opacity='.25'/%3E%3Crect x='30' y='30' width='24' height='24' rx='3' fill='${c}' opacity='.45'/%3E%3C/svg%3E")`,
    circles:  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='28' fill='none' stroke='${c}' stroke-width='18' opacity='.28'/%3E%3Ccircle cx='0' cy='0' r='18' fill='none' stroke='${c}' stroke-width='12' opacity='.18'/%3E%3Ccircle cx='80' cy='80' r='18' fill='none' stroke='${c}' stroke-width='12' opacity='.18'/%3E%3C/svg%3E")`,
    squares:  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Crect x='8' y='8' width='56' height='56' fill='none' stroke='${c}' stroke-width='3' opacity='.22'/%3E%3Crect x='18' y='18' width='36' height='36' fill='none' stroke='${c}' stroke-width='2.5' opacity='.18'/%3E%3C/svg%3E")`,
    diamonds: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32,4 60,32 32,60 4,32' fill='none' stroke='${c}' stroke-width='3' opacity='.26'/%3E%3C/svg%3E")`,
    waves:    `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Cpath d='M0 20 Q20 0 40 20 Q60 40 80 20' fill='none' stroke='${c}' stroke-width='3' opacity='.25'/%3E%3C/svg%3E")`,
    dots:     `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='4' cy='4' r='2.5' fill='${c}' opacity='.35'/%3E%3Ccircle cx='20' cy='20' r='2.5' fill='${c}' opacity='.35'/%3E%3C/svg%3E")`,
  };
  return p[type] || p.mosaic;
}

const YEAR_LABELS  = ["","First Year","Second Year","Third Year","Fourth Year"];
const YEAR_COLORS  = ["","#818cf8","#22c55e","#f59e0b","#ef4444"];
const YEAR_COUNTS  = [0,0,0,0,0].map((_,i) => COURSE_DB.filter(c=>c.year===i).length);

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function RegistrationManagerPage() {
  const { regWindow, startRegistration, stopRegistration, updateSettings } = useRegistration();

  /* ── Step state (1 = settings, 2 = choose courses) ── */
  const [step, setStep] = useState(regWindow.isOpen ? 2 : 1);

  /* ── Form ── */
  const [form, setForm] = useState({
    semester:     regWindow.semester     || "Semester 1",
    academicYear: regWindow.academicYear || "2025/2026",
    startDate:    regWindow.startDate    || "",
    deadline:     regWindow.deadline     || "",
  });

  /* ── Which years are selected ── */
  const [selectedYears, setSelectedYears] = useState(regWindow.openYears?.length ? regWindow.openYears : []);

  /* ── Which course codes are toggled on ── */
  const [enabled, setEnabled] = useState(() => new Set(regWindow.enabledCourses || []));

  /* ── UI state ── */
  const [activeYear,  setActiveYear]  = useState(selectedYears[0] || 1);
  const [semFilter,   setSemFilter]   = useState(0); // 0=all,1,2
  const [typeFilter,  setTypeFilter]  = useState("all");
  const [search,      setSearch]      = useState("");
  const [confirmStop, setConfirmStop] = useState(false);
  const [toast,       setToast]       = useState(null);

  /* keep activeYear in sync */
  useEffect(() => {
    if (selectedYears.length && !selectedYears.includes(activeYear))
      setActiveYear(selectedYears[0]);
  }, [selectedYears]);

  const showToast = (msg, type="success") => {
    setToast({msg,type});
    setTimeout(()=>setToast(null),3200);
  };

  /* ── Stats ── */
  const enabledCount = enabled.size;
  const deadlineDate = regWindow.deadline ? new Date(regWindow.deadline) : null;
  const daysLeft = deadlineDate
    ? Math.max(0, Math.ceil((deadlineDate - new Date()) / 86400000)) : null;

  /* ── Filtered courses for active year tab ── */
  const visibleCourses = useMemo(() => {
    let list = COURSE_DB.filter(c => c.year === activeYear);
    if (semFilter)        list = list.filter(c => c.semester === semFilter);
    if (typeFilter!=="all") list = list.filter(c => c.type === typeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q)
      );
    }
    return list;
  }, [activeYear, semFilter, typeFilter, search]);

  const toggleYear = (yr) => {
    setSelectedYears(p => {
      const next = p.includes(yr) ? p.filter(y=>y!==yr) : [...p,yr];
      // auto-enable all courses for newly added year
      if (!p.includes(yr)) {
        const yrCodes = COURSE_DB.filter(c=>c.year===yr).map(c=>c.code);
        setEnabled(prev => { const s=new Set(prev); yrCodes.forEach(cd=>s.add(cd)); return s; });
      }
      return next;
    });
    if (!selectedYears.includes(yr)) setActiveYear(yr);
  };

  const toggleCourse = (code) => {
    setEnabled(p => {
      const s = new Set(p);
      s.has(code) ? s.delete(code) : s.add(code);
      return s;
    });
  };

  const toggleAll = (enable) => {
    const codes = COURSE_DB.filter(c=>c.year===activeYear).map(c=>c.code);
    setEnabled(p => {
      const s = new Set(p);
      codes.forEach(cd => enable ? s.add(cd) : s.delete(cd));
      return s;
    });
  };

  const handleProceed = () => {
    if (!form.deadline) { showToast("Please set a deadline first","error"); return; }
    if (!selectedYears.length) { showToast("Select at least one year batch","error"); return; }
    updateSettings({ ...form, openYears: selectedYears, enabledCourses: [...enabled] });
    setStep(2);
    showToast("Settings saved — now choose which courses to open");
  };

  const handleStart = () => {
    if (!enabled.size) { showToast("Enable at least one course","error"); return; }
    startRegistration({
      ...form,
      openYears:      selectedYears,
      enabledCourses: [...enabled],
    });
    showToast("🎉 Registration is now OPEN for students!");
  };

  const handleStop = () => {
    stopRegistration();
    setConfirmStop(false);
    setStep(1);
    showToast("Registration closed","info");
  };

  const handleSaveDraft = () => {
    updateSettings({ ...form, openYears: selectedYears, enabledCourses: [...enabled] });
    showToast("Draft saved ✓");
  };

  const isOpen = regWindow.isOpen;

  return (
    <div className={styles.page}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}
            initial={{opacity:0,y:-20,x:"-50%",scale:0.92}}
            animate={{opacity:1,y:0,x:"-50%",scale:1}}
            exit={{opacity:0,y:-12,x:"-50%"}}
            transition={{type:"spring",stiffness:440,damping:28}}>
            <span className={styles.toastDot}/>{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Confirm Stop Modal ── */}
      <AnimatePresence>
        {confirmStop && (
          <motion.div className={styles.overlay}
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            onClick={()=>setConfirmStop(false)}>
            <motion.div className={styles.modal}
              initial={{scale:0.86,y:24}} animate={{scale:1,y:0}}
              exit={{scale:0.9,opacity:0}}
              transition={{type:"spring",stiffness:380,damping:26}}
              onClick={e=>e.stopPropagation()}>
              <div className={styles.modalRing}>{I.warn}</div>
              <h3 className={styles.modalTitle}>Close Registration?</h3>
              <p className={styles.modalSub}>Students will immediately lose access. All current registrations are preserved.</p>
              <div className={styles.modalRow}>
                <button className={styles.btnGhost} onClick={()=>setConfirmStop(false)}>Cancel</button>
                <button className={styles.btnDanger} onClick={handleStop}>Yes, Close It</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ HEADER ═══ */}
      <motion.div className={styles.header}
        initial={{opacity:0,y:-14}} animate={{opacity:1,y:0}}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>{I.cal}</div>
          <div>
            <h1 className={styles.headerTitle}>Registration Manager</h1>
            <p className={styles.headerSub}>Control which students can register and which courses are available</p>
          </div>
        </div>

        <div className={`${styles.statusPill} ${isOpen ? styles.statusOpen : styles.statusClosed}`}>
          <span className={styles.statusDot}/>
          {isOpen ? "Registration Open" : "Registration Closed"}
          {isOpen && daysLeft !== null && (
            <span className={`${styles.daysTag} ${daysLeft<=2?styles.daysUrgent:""}`}>
              {daysLeft === 0 ? "Closes Today" : `${daysLeft}d left`}
            </span>
          )}
        </div>
      </motion.div>

      {/* ═══ LIVE BANNER (when open) ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div className={styles.liveBanner}
            initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}}
            exit={{opacity:0,height:0}}>
            <div className={styles.liveBannerLeft}>
              <span className={styles.livePulse}/>
              <span className={styles.liveText}>
                Live — <strong>{regWindow.semester}</strong> · <strong>{regWindow.academicYear}</strong>
                {" · "}Years: <strong>{regWindow.openYears?.map(y=>`Y${y}`).join(", ")}</strong>
                {" · "}<strong>{regWindow.enabledCourses?.length}</strong> courses open
              </span>
            </div>
            <button className={styles.stopBtn} onClick={()=>setConfirmStop(true)}>
              {I.stop} Close Registration
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ STEPPER ═══ */}
      {!isOpen && (
        <motion.div className={styles.stepper}
          initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.08}}>
          {[
            {n:1, label:"Configure Settings"},
            {n:2, label:"Select Courses"},
          ].map((s,i) => (
            <div key={s.n} className={styles.stepperItem}>
              <div className={`${styles.stepCircle} ${step>=s.n?styles.stepDone:""}`}
                onClick={()=>step>=s.n&&setStep(s.n)}>
                {step > s.n ? I.check : s.n}
              </div>
              <span className={`${styles.stepLabel} ${step===s.n?styles.stepLabelActive:""}`}>{s.label}</span>
              {i < 1 && <div className={`${styles.stepLine} ${step>s.n?styles.stepLineDone:""}`}/>}
            </div>
          ))}
        </motion.div>
      )}

      {/* ═══ STEP 1: SETTINGS ═══ */}
      <AnimatePresence mode="wait">
        {!isOpen && step === 1 && (
          <motion.div key="step1"
            initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
            transition={{duration:0.38,ease:[0.22,1,0.36,1]}}
            className={styles.stepPanel}>

            {/* Form fields */}
            <div className={styles.settingsGrid}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Semester</label>
                <select className={styles.formField} value={form.semester}
                  onChange={e=>setForm(p=>({...p,semester:e.target.value}))}>
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                  <option>Summer Semester</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Academic Year</label>
                <select className={styles.formField} value={form.academicYear}
                  onChange={e=>setForm(p=>({...p,academicYear:e.target.value}))}>
                  <option>2025/2026</option>
                  <option>2026/2027</option>
                  <option>2027/2028</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Start Date</label>
                <input type="datetime-local" className={styles.formField}
                  value={form.startDate}
                  onChange={e=>setForm(p=>({...p,startDate:e.target.value}))}/>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>Deadline <span className={styles.req}>*</span></label>
                <input type="datetime-local" className={styles.formField}
                  value={form.deadline}
                  onChange={e=>setForm(p=>({...p,deadline:e.target.value}))}/>
              </div>
            </div>

            {/* Year batch selector */}
            <div className={styles.batchSection}>
              <div className={styles.batchTitle}>
                {I.users}
                <span>Select Student Batches</span>
                <span className={styles.batchHint}>Choose which year(s) can register this semester</span>
              </div>
              <div className={styles.batchGrid}>
                {[1,2,3,4].map(yr => {
                  const on = selectedYears.includes(yr);
                  return (
                    <motion.button key={yr}
                      className={`${styles.batchCard} ${on?styles.batchCardOn:""}`}
                      style={{"--bc": YEAR_COLORS[yr]}}
                      onClick={()=>toggleYear(yr)}
                      whileHover={{scale:1.03}} whileTap={{scale:0.96}}>
                      <div className={styles.batchCardTop}>
                        <span className={styles.batchYearNum} style={{color: on ? YEAR_COLORS[yr] : "var(--text-muted)"}}>
                          Year {yr}
                        </span>
                        <motion.div className={`${styles.batchCheck} ${on?styles.batchCheckOn:""}`}
                          style={on?{background:YEAR_COLORS[yr],borderColor:YEAR_COLORS[yr]}:{}}>
                          {on && <span style={{color:"#fff"}}>{I.check}</span>}
                        </motion.div>
                      </div>
                      <div className={styles.batchLabel}>{YEAR_LABELS[yr]}</div>
                      <div className={styles.batchCount}>{YEAR_COUNTS[yr]} courses</div>
                      {on && (
                        <motion.div className={styles.batchGlow}
                          style={{background: YEAR_COLORS[yr]}}
                          initial={{opacity:0}} animate={{opacity:0.06}}/>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* GPA note */}
            <div className={styles.gpaNote}>
              {I.info}
              <span>Credit hour limits are <strong>automatically set per student GPA</strong> — Excellent (≥3.5)→21hrs · Very Good (≥3.0)→18hrs · Good (≥2.5)→18hrs · Pass (≥2.0)→15hrs · Warning (≥1.5)→12hrs · Probation (&lt;1.5)→9hrs</span>
            </div>

            {/* Proceed */}
            <div className={styles.stepActions}>
              <motion.button className={styles.btnPrimary} onClick={handleProceed}
                whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                Next — Choose Courses →
              </motion.button>
            </div>
          </motion.div>
        )}

        {/* ═══ STEP 2: COURSES ═══ */}
        {(step === 2 || isOpen) && (
          <motion.div key="step2"
            initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-40}}
            transition={{duration:0.38,ease:[0.22,1,0.36,1]}}
            className={styles.stepPanel}>

            {/* Summary bar */}
            <div className={styles.summaryBar}>
              <div className={styles.summaryLeft}>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryNum} style={{color:"#818cf8"}}>{selectedYears.length || regWindow.openYears?.length}</span>
                  <span className={styles.summaryLbl}>Year{(selectedYears.length||1)!==1?"s":""} Selected</span>
                </div>
                <div className={styles.summaryDivider}/>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryNum} style={{color:"#22c55e"}}>{enabledCount}</span>
                  <span className={styles.summaryLbl}>Courses Enabled</span>
                </div>
                <div className={styles.summaryDivider}/>
                <div className={styles.summaryItem}>
                  <span className={styles.summaryNum} style={{color:"#f59e0b"}}>{form.semester || regWindow.semester}</span>
                  <span className={styles.summaryLbl}>{form.academicYear || regWindow.academicYear}</span>
                </div>
              </div>
              <div className={styles.summaryActions}>
                {!isOpen && (
                  <>
                    <button className={styles.btnGhost} onClick={()=>setStep(1)}>← Back</button>
                    <button className={styles.btnGhost} onClick={handleSaveDraft}>{I.save} Save Draft</button>
                    <motion.button className={styles.btnStart} onClick={handleStart}
                      whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                      {I.play} Start Registration
                    </motion.button>
                  </>
                )}
                {isOpen && (
                  <button className={styles.btnDanger} onClick={()=>setConfirmStop(true)}>
                    {I.stop} Close Registration
                  </button>
                )}
              </div>
            </div>

            {/* Year tabs */}
            <div className={styles.yearTabRow}>
              {(selectedYears.length ? selectedYears : regWindow.openYears || []).sort().map(yr => (
                <button key={yr}
                  className={`${styles.yearTab} ${activeYear===yr?styles.yearTabOn:""}`}
                  style={activeYear===yr?{"--ytc":YEAR_COLORS[yr]}:{}}
                  onClick={()=>setActiveYear(yr)}>
                  <span className={styles.yearTabDot}
                    style={{background: activeYear===yr ? YEAR_COLORS[yr] : "var(--border)"}}/>
                  <span style={{color: activeYear===yr ? YEAR_COLORS[yr] : "inherit"}}>
                    Year {yr} — {YEAR_LABELS[yr]}
                  </span>
                  <span className={styles.yearTabCount}>
                    {COURSE_DB.filter(c=>c.year===yr&&enabled.has(c.code)).length}/
                    {COURSE_DB.filter(c=>c.year===yr).length}
                  </span>
                </button>
              ))}
            </div>

            {/* Filter bar */}
            <div className={styles.filterBar}>
              <div className={styles.filterGroup}>
                {[0,1,2].map(s => (
                  <button key={s}
                    className={`${styles.chip} ${semFilter===s?styles.chipOn:""}`}
                    onClick={()=>setSemFilter(s)}>
                    {s===0?"All Sems":s===1?"Semester 1":"Semester 2"}
                  </button>
                ))}
              </div>
              <div className={styles.filterGroup}>
                {["all","mandatory","elective"].map(t => (
                  <button key={t}
                    className={`${styles.chip} ${typeFilter===t?styles.chipOn:""}`}
                    onClick={()=>setTypeFilter(t)}>
                    {t==="all"?"All Types":t==="mandatory"?"Mandatory":"Elective"}
                  </button>
                ))}
              </div>
              <div className={styles.searchBox}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                <input className={styles.searchIn} placeholder="Search courses…"
                  value={search} onChange={e=>setSearch(e.target.value)}/>
              </div>
              <div className={styles.bulkRow}>
                <button className={styles.bulkBtn} onClick={()=>toggleAll(true)}>Enable All</button>
                <button className={`${styles.bulkBtn} ${styles.bulkOff}`} onClick={()=>toggleAll(false)}>Disable All</button>
              </div>
            </div>

            {/* Course grid */}
            <motion.div className={styles.courseGrid}
              initial="hidden" animate="show"
              variants={{show:{transition:{staggerChildren:0.04}}}}>
              {visibleCourses.map((c, i) => (
                <CourseToggleCard key={c.code} course={c}
                  enabled={enabled.has(c.code)} locked={isOpen}
                  onToggle={()=>!isOpen&&toggleCourse(c.code)}
                  index={i}/>
              ))}
              {visibleCourses.length === 0 && (
                <div className={styles.emptyGrid}>
                  <div className={styles.emptyIcon}>{I.book}</div>
                  <p>No courses match filters</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   COURSE TOGGLE CARD
═══════════════════════════════════════════════════════════ */
function CourseToggleCard({ course, enabled, locked, onToggle, index }) {
  const bg = pat(course.pattern, course.color);

  return (
    <motion.article
      className={`${styles.cCard} ${enabled ? styles.cCardOn : styles.cCardOff}`}
      variants={{hidden:{opacity:0,y:20},show:{opacity:1,y:0,transition:{duration:0.38,ease:[0.22,1,0.36,1]}}}}
      layout
      whileHover={!locked ? {y:-5} : {}}
    >
      {/* Cover */}
      <div className={styles.cCover}
        style={{
          background: course.color,
          backgroundImage: bg,
          backgroundSize: "64px 64px",
          opacity: enabled ? 1 : 0.5,
        }}>
        <div className={styles.cCoverDark}/>
        <div className={styles.cCoverTop}>
          <span className={styles.cCode}>{course.code}</span>
          <span className={styles.cCr}>{course.credits} cr</span>
        </div>
        <div className={styles.cCoverBot}>
          <span className={`${styles.cTypeBadge} ${course.type==="elective"?styles.cTypeBadgeElec:""}`}>
            {course.type==="mandatory"?"Mandatory":"Elective"}
          </span>
          {/* Toggle */}
          {!locked ? (
            <motion.button className={`${styles.cToggle} ${enabled?styles.cToggleOn:""}`}
              style={enabled?{background:course.color,borderColor:course.color}:{}}
              onClick={onToggle} whileTap={{scale:0.88}}>
              <motion.div className={styles.cThumb} layout
                transition={{type:"spring",stiffness:500,damping:30}}/>
            </motion.button>
          ) : (
            <span className={`${styles.cStatusDot} ${enabled?styles.cStatusOn:styles.cStatusOff}`}>
              {enabled ? "Open" : "Closed"}
            </span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className={styles.cBody}>
        <h3 className={styles.cName}>{course.name}</h3>
        <div className={styles.cMeta}>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          {course.instructor}
        </div>
        {course.prereqs?.length > 0 && (
          <div className={styles.cPrereq}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
            {course.prereqs.join(", ")}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`${styles.cFoot} ${enabled?styles.cFootOn:styles.cFootOff}`}>
        <span className={styles.cFootDot}
          style={{background: enabled?"#22c55e":"#6b7280",
            boxShadow: enabled?"0 0 6px #22c55e":""}}/>
        {enabled ? "Enabled for registration" : "Disabled this semester"}
      </div>
    </motion.article>
  );
}
