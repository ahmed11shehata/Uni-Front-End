// src/pages/admin/AdminSchedulePage.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { COURSE_DB } from "../../services/mock/mockData";
import styles from "./AdminSchedulePage.module.css";

/* ─── Constants ─── */
const DAYS  = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];
const HOURS = [8,9,10,11,12,13,14,15,16];
const PX_PER_HOUR = 80;
const YEAR_LABELS = ["","First Year","Second Year","Third Year","Fourth Year"];
const YEAR_COLORS = ["","#818cf8","#22c55e","#f59e0b","#ef4444"];

function fmtH(h) {
  const hr=Math.floor(h), m=h%1===0.5?"30":"00", ap=hr>=12?"PM":"AM";
  const d=hr>12?hr-12:hr===0?12:hr;
  return `${d}:${m} ${ap}`;
}

/* SVG icons */
const Ic = {
  cal:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  plus:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  trash: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  save:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>,
  exam:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>,
  close: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  users: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
};

const fadeUp = {hidden:{opacity:0,y:18},show:{opacity:1,y:0,transition:{duration:0.42,ease:[0.22,1,0.36,1]}}};

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function AdminSchedulePage() {
  const [selectedYear, setSelectedYear] = useState(3);
  const [selectedGroup,setSelectedGroup]= useState("A");
  const [view,         setView]         = useState("weekly"); // weekly | exams
  const [examType,     setExamType]     = useState("midterm");
  const [sessions,     setSessions]     = useState([]);   // weekly sessions
  const [exams,        setExams]        = useState([]);   // exam entries
  const [slotModal,    setSlotModal]    = useState(null); // {day,start} clicked slot
  const [examModal,    setExamModal]    = useState(false);
  const [addModal,     setAddModal]     = useState(false);  // free-form add session modal
  const [toast,        setToast]        = useState(null);

  const showToast = (msg, type="success") => { setToToast({msg,type}); setTimeout(()=>setToast(null),2800); };
  // workaround
  const setToToast = setToast;

  const availableCourses = useMemo(() =>
    COURSE_DB.filter(c => c.year === selectedYear),
  [selectedYear]);

  const visibleSessions = useMemo(() =>
    sessions.filter(s => s.year===selectedYear && s.group===selectedGroup),
  [sessions, selectedYear, selectedGroup]);

  const visibleExams = useMemo(() =>
    exams.filter(e => e.year===selectedYear && e.type===examType),
  [exams, selectedYear, examType]);

  const addSession = (data, keepOpen=false) => {
    setSessions(p => [...p, { id:Date.now()+Math.random(), year:selectedYear, ...data }]);
    if (!keepOpen) {
      setSlotModal(null);
      setToToast({msg:`${data.code} added for Group ${data.group}`,type:"success"});
      setTimeout(()=>setToast(null),2800);
    }
  };

  const removeSession = (id) => {
    setSessions(p => p.filter(s => s.id!==id));
  };

  const addExam = (data) => {
    setExams(p => [...p, { id:Date.now(), year:selectedYear, type:examType, ...data }]);
    setExamModal(false);
    setToToast({msg:`Exam added: ${data.code}`,type:"success"});
    setTimeout(()=>setToast(null),2800);
  };

  const removeExam = (id) => setExams(p => p.filter(e => e.id!==id));

  return (
    <div className={styles.page}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`}
            initial={{opacity:0,y:-20,x:"-50%",scale:0.92}}
            animate={{opacity:1,y:0,x:"-50%",scale:1}}
            exit={{opacity:0,x:"-50%"}}
            transition={{type:"spring",stiffness:440,damping:28}}>
            <span className={styles.toastDot}/>{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Slot picker modal */}
      <AnimatePresence>
        {slotModal && (
          <SlotModal
            slot={slotModal} courses={availableCourses}
            existing={visibleSessions}
            onAdd={addSession}
            onClose={()=>setSlotModal(null)}
          />
        )}
      </AnimatePresence>

      {/* Exam add modal */}
      <AnimatePresence>
        {examModal && (
          <ExamModal
            courses={availableCourses}
            onAdd={addExam}
            onClose={()=>setExamModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Free-form Add Session modal */}
      <AnimatePresence>
        {addModal && (
          <AddSessionModal
            courses={availableCourses}
            year={selectedYear}
            onAdd={addSession}
            onClose={()=>setAddModal(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <motion.div className={styles.header} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>{Ic.cal}</div>
          <div>
            <h1 className={styles.headerTitle}>Schedule Manager</h1>
            <p className={styles.headerSub}>Build weekly timetables and exam schedules for each year batch</p>
          </div>
        </div>
        <div style={{display:"flex",gap:10}}>
          {view==="weekly" && (
            <motion.button className={styles.addSessionBtn}
              whileHover={{scale:1.02}} whileTap={{scale:0.97}}
              onClick={()=>setAddModal(true)}>
              {Ic.plus} Add Session
            </motion.button>
          )}
          <motion.button className={styles.saveBtn}
            whileHover={{scale:1.02}} whileTap={{scale:0.97}}
            onClick={()=>{setToToast({msg:"Schedule saved ✓",type:"success"});setTimeout(()=>setToast(null),2800);}}>
            {Ic.save} Save Schedule
          </motion.button>
        </div>
      </motion.div>

      {/* ── Controls ── */}
      <div className={styles.controls}>
        {/* Year selector */}
        <div className={styles.controlGroup}>
          <span className={styles.controlLabel}>{Ic.users} Year Batch</span>
          <div className={styles.yearBtns}>
            {[1,2,3,4].map(yr=>(
              <motion.button key={yr}
                className={`${styles.yearBtn} ${selectedYear===yr?styles.yearBtnOn:""}`}
                style={selectedYear===yr?{"--yc":YEAR_COLORS[yr]}:{}}
                onClick={()=>setSelectedYear(yr)}
                whileHover={{scale:1.03}} whileTap={{scale:0.96}}>
                Year {yr}
                <span className={styles.yearBtnSub}>{YEAR_LABELS[yr]}</span>
              </motion.button>
            ))}
          </div>
        </div>

        {/* View + Group */}
        <div className={styles.controlRight}>
          <div className={styles.segmented}>
            {["weekly","exams"].map(v=>(
              <button key={v}
                className={`${styles.segBtn} ${view===v?styles.segBtnOn:""}`}
                onClick={()=>setView(v)}>
                {v==="weekly" ? "📅 Weekly" : "📝 Exams"}
              </button>
            ))}
          </div>
          {view==="weekly" && (
            <div className={styles.segmented}>
              {["A","B"].map(g=>(
                <button key={g}
                  className={`${styles.segBtn} ${selectedGroup===g?styles.segBtnOn:""}`}
                  onClick={()=>setSelectedGroup(g)}>
                  Group {g}
                </button>
              ))}
            </div>
          )}
          {view==="exams" && (
            <div className={styles.segmented}>
              {["midterm","final"].map(t=>(
                <button key={t}
                  className={`${styles.segBtn} ${examType===t?styles.segBtnOn:""}`}
                  onClick={()=>setExamType(t)}>
                  {t==="midterm"?"Midterm":"Final"}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── WEEKLY VIEW ── */}
      {view==="weekly" && (
        <motion.div className={styles.scheduleWrap}
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.08}}>

          {/* Legend */}
          <div className={styles.legend}>
            <div className={styles.legendItem}><span className={styles.legendDot} style={{background:"#818cf8"}}/> Lecture</div>
            <div className={styles.legendItem}><span className={styles.legendDot} style={{background:"#22c55e"}}/> Section / Lab</div>
            <div className={styles.legendHint}>Click any empty slot to add a session</div>
          </div>

          {/* Grid */}
          <div className={styles.grid}>
            {/* Time column */}
            <div className={styles.timeCol}>
              <div className={styles.timeColHeader}>Time</div>
              {HOURS.map(h=>(
                <div key={h} className={styles.timeSlot} style={{height:PX_PER_HOUR}}>
                  <span className={styles.timeLabel}>{fmtH(h)}</span>
                </div>
              ))}
            </div>

            {/* Day columns */}
            {DAYS.map(day=>(
              <DayColumn key={day} day={day}
                sessions={visibleSessions.filter(s=>s.day===day)}
                onClickSlot={(start)=>setSlotModal({day,start})}
                onRemove={removeSession}
              />
            ))}
          </div>

          {visibleSessions.length===0 && (
            <div className={styles.emptySchedule}>
              <div className={styles.emptyScheduleIcon}>{Ic.cal}</div>
              <p>No sessions yet for Year {selectedYear} Group {selectedGroup}</p>
              <p className={styles.emptyScheduleHint}>Click any slot in the grid above to add a session</p>
            </div>
          )}
        </motion.div>
      )}

      {/* ── EXAMS VIEW ── */}
      {view==="exams" && (
        <motion.div className={styles.examsSection}
          initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:0.08}}>
          <div className={styles.examsSectionHead}>
            <h2 className={styles.examsSectionTitle}>
              {examType==="midterm"?"Midterm":"Final"} Exams — Year {selectedYear}
            </h2>
            <motion.button className={styles.addExamBtn}
              onClick={()=>setExamModal(true)}
              whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
              {Ic.plus} Add Exam
            </motion.button>
          </div>

          {visibleExams.length===0 ? (
            <div className={styles.emptyExams}>
              {Ic.exam}
              <p>No {examType} exams added for Year {selectedYear}</p>
            </div>
          ) : (
            <motion.div className={styles.examsGrid}
              initial="hidden" animate="show"
              variants={{show:{transition:{staggerChildren:0.06}}}}>
              {visibleExams.map((ex,i)=>(
                <ExamCard key={ex.id} exam={ex} onRemove={()=>removeExam(ex.id)}/>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADD SESSION MODAL — free-form: pick course, day, time, duration
═══════════════════════════════════════════════════════════ */
function AddSessionModal({ courses, year, onAdd, onClose }) {
  const [courseCode, setCourseCode] = useState(courses[0]?.code || "");
  const [day,        setDay]        = useState("Saturday");
  const [startH,     setStartH]     = useState(8);
  const [startM,     setStartM]     = useState(0);
  const [duration,   setDuration]   = useState(1.5);
  const [type,       setType]       = useState("Lecture");
  const [room,       setRoom]       = useState("");
  const [groupMode,  setGroupMode]  = useState("both");
  const [roomB,      setRoomB]      = useState("");

  const course  = courses.find(c => c.code === courseCode);
  const startDec = Math.round((startH + startM / 60) * 4) / 4; // snap to 15-min
  const valid    = courseCode && room.trim();

  const handleAdd = () => {
    if (!valid) return;
    const base = {
      day, start: startDec, end: startDec + duration,
      code: courseCode, name: course?.name || courseCode,
      type, color: course?.color || "#818cf8",
      instructor: course?.instructor || "",
    };
    if (groupMode === "both") {
      onAdd({ ...base, group: "A", room: room.trim() }, true);
      onAdd({ ...base, group: "B", room: (roomB.trim() || room.trim()) }, false);
    } else {
      onAdd({ ...base, group: groupMode, room: room.trim() }, false);
    }
    onClose();
  };

  const DAYS_LIST = ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday"];

  return (
    <motion.div className={styles.overlay}
      initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={onClose}>
      <motion.div className={styles.addModal}
        initial={{scale:0.88,y:30,opacity:0}} animate={{scale:1,y:0,opacity:1}}
        exit={{scale:0.9,opacity:0}} transition={{type:"spring",stiffness:360,damping:26}}
        onClick={e=>e.stopPropagation()}>

        {/* Header */}
        <div className={styles.addModalHead}>
          <div className={styles.addModalHeadLeft}>
            <div className={styles.addModalIcon}>{Ic.plus}</div>
            <div>
              <h3 className={styles.addModalTitle}>Add New Session</h3>
              <p className={styles.addModalSub}>Year {year} — Choose day, time & course</p>
            </div>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>{Ic.close}</button>
        </div>

        <div className={styles.addModalBody}>
          {/* Row 1: Course */}
          <div className={styles.sfGroup}>
            <label className={styles.sfLabel}>Course</label>
            <select className={styles.sfField} value={courseCode} onChange={e=>setCourseCode(e.target.value)}>
              {courses.map(c=>(
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>

          {course && (
            <div className={styles.coursePreview} style={{borderColor:`${course.color}40`,background:`${course.color}10`}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:course.color,flexShrink:0}}/>
              <div>
                <div style={{fontWeight:700,fontSize:"0.84rem",color:"var(--text-primary)"}}>{course.name}</div>
                <div style={{fontSize:"0.72rem",color:"var(--text-muted)"}}>{course.instructor}</div>
              </div>
            </div>
          )}

          {/* Row 2: Day + Type */}
          <div className={styles.sfRow}>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Day</label>
              <select className={styles.sfField} value={day} onChange={e=>setDay(e.target.value)}>
                {DAYS_LIST.map(d=><option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Session Type</label>
              <select className={styles.sfField} value={type} onChange={e=>setType(e.target.value)}>
                <option>Lecture</option><option>Section</option><option>Lab</option>
              </select>
            </div>
          </div>

          {/* Row 3: Start time + Duration */}
          <div className={styles.sfRow}>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Start Time</label>
              <div className={styles.timePickerRow}>
                <select className={styles.sfFieldSm} value={startH} onChange={e=>setStartH(Number(e.target.value))}>
                  {[8,9,10,11,12,13,14,15,16].map(h=>{
                    const disp = h > 12 ? h-12 : h === 0 ? 12 : h;
                    const ap   = h >= 12 ? "PM" : "AM";
                    return <option key={h} value={h}>{disp}:00 {ap}</option>;
                  })}
                </select>
                <select className={styles.sfFieldSm} value={startM} onChange={e=>setStartM(Number(e.target.value))}>
                  <option value={0}>:00</option>
                  <option value={15}>:15</option>
                  <option value={30}>:30</option>
                  <option value={45}>:45</option>
                </select>
              </div>
            </div>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Duration</label>
              <select className={styles.sfField} value={duration} onChange={e=>setDuration(Number(e.target.value))}>
                {[0.5,1,1.5,2,2.5,3].map(d=>(
                  <option key={d} value={d}>{d===0.5?"30 min":`${d} hr${d!==1?"s":""}`}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Time preview */}
          <div className={styles.timePreview}>
            <span>📅</span>
            <span><strong>{day}</strong></span>
            <span>⏱ {fmtH(startDec)} → {fmtH(startDec + duration)}</span>
            <span className={styles.timePreviewDur}>
              {duration===0.5?"30 min":`${duration} hr${duration!==1?"s":""}`}
            </span>
          </div>

          {/* Group */}
          <div className={styles.sfGroup}>
            <label className={styles.sfLabel}>Apply to Group</label>
            <div className={styles.groupSel}>
              {[["both","Both A & B"],["A","Group A only"],["B","Group B only"]].map(([g,l])=>(
                <button key={g}
                  className={`${styles.groupSelBtn} ${groupMode===g?styles.groupSelOn:""}`}
                  onClick={()=>setGroupMode(g)}>{l}
                </button>
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div className={styles.sfRow}>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>
                Room / Hall{groupMode==="both"?" (Group A)":""} <span className={styles.req}>*</span>
              </label>
              <input className={styles.sfField}
                placeholder={groupMode==="both"?"Group A room":"e.g. Hall A, Lab 2"}
                value={room} onChange={e=>setRoom(e.target.value)}/>
            </div>
            {groupMode==="both" && (
              <div className={styles.sfGroup}>
                <label className={styles.sfLabel}>Room (Group B)</label>
                <input className={styles.sfField} placeholder="Group B room (optional)"
                  value={roomB} onChange={e=>setRoomB(e.target.value)}/>
              </div>
            )}
          </div>
        </div>

        <div className={styles.slotModalActions}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <motion.button className={styles.btnPrimary}
            onClick={handleAdd} disabled={!valid}
            style={{opacity:valid?1:0.45}}
            whileHover={valid?{scale:1.02}:{}} whileTap={valid?{scale:0.97}:{}}>
            {Ic.plus} Add to Schedule
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}


/* ═══════════════════════════════════════════════════════════
   DAY COLUMN
═══════════════════════════════════════════════════════════ */
function DayColumn({ day, sessions, onClickSlot, onRemove }) {
  const startHour = 8;

  return (
    <div className={styles.dayCol}>
      <div className={styles.dayHeader}>{day.slice(0,3)}</div>
      <div className={styles.dayBody}
        style={{height: HOURS.length * PX_PER_HOUR}}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const y = e.clientY - rect.top;
          const rawH = startHour + y / PX_PER_HOUR;
          const snapped = Math.round(rawH * 2) / 2; // snap to 30min
          const start = Math.max(startHour, Math.min(snapped, 15.5));
          onClickSlot(start);
        }}>
        {/* Hour lines */}
        {HOURS.map(h=>(
          <div key={h} className={styles.hourLine}
            style={{top: (h-startHour)*PX_PER_HOUR}}/>
        ))}

        {/* Sessions */}
        {sessions.map(s=>{
          const top    = (s.start - startHour) * PX_PER_HOUR + 1;
          const height = (s.end - s.start) * PX_PER_HOUR - 5;
          const isLec  = s.type === "Lecture";
          return (
            <motion.div key={s.id}
              className={styles.sessionBlock}
              style={{
                top, height,
                "--sc": s.color || "#818cf8",
                background: `${s.color || "#818cf8"}22`,
                borderLeft: `4px solid ${s.color || "#818cf8"}`,
              }}
              initial={{opacity:0,scaleY:0.6,x:-6}}
              animate={{opacity:1,scaleY:1,x:0}}
              exit={{opacity:0,scaleY:0.5,x:6}}
              transition={{type:"spring",stiffness:420,damping:28}}
              whileHover={{scale:1.02,zIndex:20}}
              onClick={e=>e.stopPropagation()}>
              {/* Top: code badge + type */}
              <div className={styles.sessTop}>
                <span className={styles.sessCodeBadge} style={{background:s.color||"#818cf8"}}>
                  {s.code}
                </span>
                <span className={styles.sessTypeBadge}
                  style={{color:isLec?"#818cf8":"#22c55e", background:isLec?"rgba(129,140,248,0.15)":"rgba(34,197,94,0.12)"}}>
                  {isLec?"L":"S"}
                </span>
              </div>
              {height>=48 && (
                <div className={styles.sessName}>{s.name}</div>
              )}
              {height>=70 && (
                <div className={styles.sessRoom}>
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
                  </svg>
                  {s.room}
                </div>
              )}
              {height>=88 && (
                <div className={styles.sessTime}>
                  {fmtH(s.start)} – {fmtH(s.end)}
                </div>
              )}
              {/* Group badge */}
              <span className={styles.sessGroup} style={{background:`${s.color||"#818cf8"}30`, color:s.color||"#818cf8"}}>
                {s.group}
              </span>
              <motion.button className={styles.sessionRemove}
                onClick={e=>{e.stopPropagation();onRemove(s.id);}}
                whileHover={{scale:1.1}} whileTap={{scale:0.85}}>
                {Ic.close}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   SLOT MODAL — pick course + room + type + duration
═══════════════════════════════════════════════════════════ */
function SlotModal({ slot, courses, existing, onAdd, onClose }) {
  const [courseCode, setCourseCode] = useState(courses[0]?.code || "");
  const [type,       setType]       = useState("Lecture");
  const [room,       setRoom]       = useState("");
  const [roomB,      setRoomB]      = useState("");
  const [duration,   setDuration]   = useState(1.5);
  const [groupMode,  setGroupMode]  = useState("both"); // "A" | "B" | "both"

  const course = courses.find(c=>c.code===courseCode);

  const handleAdd = () => {
    if (!courseCode || !room.trim()) return;
    const base = {
      day: slot.day, start: slot.start, end: slot.start + duration,
      code: courseCode, name: course?.name || courseCode,
      type, color: course?.color || "#818cf8",
      instructor: course?.instructor || "",
    };
    if (groupMode === "both") {
      // Add for A and B with different rooms if specified
      onAdd({ ...base, group: "A", room: room.trim() }, true);
      onAdd({ ...base, group: "B", room: (roomB.trim() || room.trim()) }, false);
    } else {
      onAdd({ ...base, group: groupMode, room: room.trim() }, false);
    }
  };

  return (
    <motion.div className={styles.overlay} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={onClose}>
      <motion.div className={styles.slotModal}
        initial={{scale:0.88,y:24,opacity:0}} animate={{scale:1,y:0,opacity:1}}
        exit={{scale:0.9,opacity:0}} transition={{type:"spring",stiffness:360,damping:26}}
        onClick={e=>e.stopPropagation()}>
        <div className={styles.slotModalHead}>
          <div>
            <h3 className={styles.slotModalTitle}>Add Session</h3>
            <p className={styles.slotModalSub}>{slot.day} · Starting {fmtH(slot.start)}</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>{Ic.close}</button>
        </div>

        <div className={styles.slotForm}>
          <div className={styles.sfGroup}>
            <label className={styles.sfLabel}>Course</label>
            <select className={styles.sfField} value={courseCode}
              onChange={e=>setCourseCode(e.target.value)}>
              {courses.map(c=>(
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>
          {course && (
            <div className={styles.coursePreview} style={{borderColor:`${course.color}40`, background:`${course.color}10`}}>
              <div style={{width:12,height:12,borderRadius:"50%",background:course.color,flexShrink:0}}/>
              <div>
                <div style={{fontWeight:700,fontSize:"0.84rem"}}>{course.name}</div>
                <div style={{fontSize:"0.72rem",color:"var(--text-muted)"}}>{course.instructor}</div>
              </div>
            </div>
          )}
          <div className={styles.sfRow}>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Session Type</label>
              <select className={styles.sfField} value={type} onChange={e=>setType(e.target.value)}>
                <option>Lecture</option>
                <option>Section</option>
                <option>Lab</option>
              </select>
            </div>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Duration</label>
              <select className={styles.sfField} value={duration} onChange={e=>setDuration(Number(e.target.value))}>
                {[0.5,1,1.5,2,2.5,3].map(d=>(
                  <option key={d} value={d}>{d===0.5?"30 min":`${d} hr${d!==1?"s":""}`}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Group selector */}
          <div className={styles.sfGroup}>
            <label className={styles.sfLabel}>Apply to Group</label>
            <div className={styles.groupSel}>
              {[["both","Both A & B"],["A","Group A only"],["B","Group B only"]].map(([g,l])=>(
                <button key={g}
                  className={`${styles.groupSelBtn} ${groupMode===g?styles.groupSelOn:""}`}
                  onClick={()=>setGroupMode(g)}>
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.sfRow}>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>
                Room / Hall {groupMode==="both"?" (Group A)":""}<span className={styles.req}>*</span>
              </label>
              <input className={styles.sfField}
                placeholder={groupMode==="both"?"Group A room":"e.g. Hall A, Lab 2"}
                value={room} onChange={e=>setRoom(e.target.value)}/>
            </div>
            {groupMode==="both" && (
              <div className={styles.sfGroup}>
                <label className={styles.sfLabel}>Room (Group B)</label>
                <input className={styles.sfField} placeholder="Group B room (optional)"
                  value={roomB} onChange={e=>setRoomB(e.target.value)}/>
              </div>
            )}
          </div>

          {/* Time preview */}
          <div className={styles.timePreview}>
            <span>⏱</span>
            <span>{fmtH(slot.start)} → {fmtH(slot.start+duration)}</span>
            <span className={styles.timePreviewDur}>
              {duration===0.5?"30 min":`${duration} hr${duration!==1?"s":""}`}
            </span>
          </div>
        </div>

        <div className={styles.slotModalActions}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <motion.button className={styles.btnPrimary}
            onClick={handleAdd} disabled={!room.trim()}
            style={{opacity:room.trim()?1:0.55}}
            whileHover={room.trim()?{scale:1.02}:{}}
            whileTap={room.trim()?{scale:0.97}:{}}>
            {Ic.plus} Add Session
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXAM MODAL
═══════════════════════════════════════════════════════════ */
function ExamModal({ courses, onAdd, onClose }) {
  const [courseCode, setCourseCode] = useState(courses[0]?.code || "");
  const [date,       setDate]       = useState("");
  const [time,       setTime]       = useState("10:00");
  const [hall,       setHall]       = useState("");
  const [duration,   setDuration]   = useState(2);

  const course = courses.find(c=>c.code===courseCode);
  const isValid = courseCode && date && time && hall.trim();

  const handleAdd = () => {
    if (!isValid) return;
    const [hr,min] = time.split(":");
    const h = parseInt(hr);
    const ampm = h>=12?"PM":"AM";
    const d = h>12?h-12:h;
    onAdd({
      code: courseCode, name: course?.name||courseCode,
      color: course?.color||"#818cf8",
      date, time: `${d}:${min||"00"} ${ampm}`,
      hall, duration,
    });
  };

  return (
    <motion.div className={styles.overlay} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
      onClick={onClose}>
      <motion.div className={styles.slotModal}
        initial={{scale:0.88,y:24,opacity:0}} animate={{scale:1,y:0,opacity:1}}
        exit={{scale:0.9,opacity:0}} transition={{type:"spring",stiffness:360,damping:26}}
        onClick={e=>e.stopPropagation()}>
        <div className={styles.slotModalHead}>
          <div>
            <h3 className={styles.slotModalTitle}>Add Exam</h3>
            <p className={styles.slotModalSub}>Schedule a midterm or final exam</p>
          </div>
          <button className={styles.modalCloseBtn} onClick={onClose}>{Ic.close}</button>
        </div>
        <div className={styles.slotForm}>
          <div className={styles.sfGroup}>
            <label className={styles.sfLabel}>Course</label>
            <select className={styles.sfField} value={courseCode} onChange={e=>setCourseCode(e.target.value)}>
              {courses.map(c=>(
                <option key={c.code} value={c.code}>{c.code} — {c.name}</option>
              ))}
            </select>
          </div>
          <div className={styles.sfRow}>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Date</label>
              <input type="date" className={styles.sfField} value={date} onChange={e=>setDate(e.target.value)}/>
            </div>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Time</label>
              <input type="time" className={styles.sfField} value={time} onChange={e=>setTime(e.target.value)}/>
            </div>
          </div>
          <div className={styles.sfRow}>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Hall / Room</label>
              <input className={styles.sfField} placeholder="Main Hall A"
                value={hall} onChange={e=>setHall(e.target.value)}/>
            </div>
            <div className={styles.sfGroup}>
              <label className={styles.sfLabel}>Duration</label>
              <select className={styles.sfField} value={duration} onChange={e=>setDuration(Number(e.target.value))}>
                {[1,1.5,2,2.5,3,3.5].map(d=>(
                  <option key={d} value={d}>{d} hr{d!==1?"s":""}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className={styles.slotModalActions}>
          <button className={styles.btnGhost} onClick={onClose}>Cancel</button>
          <motion.button className={styles.btnPrimary}
            onClick={handleAdd} disabled={!isValid}
            style={{opacity:isValid?1:0.55}}
            whileHover={isValid?{scale:1.02}:{}}
            whileTap={isValid?{scale:0.97}:{}}>
            {Ic.plus} Add Exam
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXAM CARD (same style as student schedule)
═══════════════════════════════════════════════════════════ */
function ExamCard({ exam, onRemove }) {
  const d = exam.date ? new Date(exam.date+"T12:00") : null;
  const monthStr  = d ? d.toLocaleDateString("en-US",{month:"short"})  : "—";
  const dayNum    = d ? d.getDate() : "—";
  const weekday   = d ? d.toLocaleDateString("en-US",{weekday:"long"}) : "—";
  const daysLeft  = d ? Math.max(0,Math.ceil((d - new Date())/86400000)) : null;

  return (
    <motion.div className={styles.examCard} variants={fadeUp}
      style={{"--ec": exam.color||"#818cf8"}}>
      {/* Color stripe */}
      <div className={styles.examStripe} style={{background:exam.color}}/>

      <div className={styles.examBody}>
        {/* Calendar tile */}
        <div className={styles.examTile} style={{background:`${exam.color}14`,borderColor:`${exam.color}25`}}>
          <div className={styles.examMonth} style={{color:exam.color}}>{monthStr}</div>
          <div className={styles.examDay}>{dayNum}</div>
          <div className={styles.examWeekday}>{weekday}</div>
        </div>

        {/* Info */}
        <div className={styles.examInfo}>
          <div className={styles.examCode} style={{color:exam.color}}>{exam.code}</div>
          <div className={styles.examName}>{exam.name}</div>
          <div className={styles.examMeta}>
            <span>🕐 {exam.time}</span>
            <span>🏛 {exam.hall}</span>
            <span>⏱ {exam.duration}hrs</span>
          </div>
        </div>

        {/* Countdown + remove */}
        <div className={styles.examRight}>
          {daysLeft !== null && (
            <div className={styles.examCountdown}
              style={{
                color:daysLeft<=3?"#ef4444":exam.color,
                background:daysLeft<=3?"rgba(239,68,68,0.1)":`${exam.color}12`,
                borderColor:daysLeft<=3?"rgba(239,68,68,0.25)":`${exam.color}25`,
              }}>
              {daysLeft===0?"Today!":daysLeft===1?"Tomorrow":`${daysLeft} days`}
            </div>
          )}
          <motion.button className={styles.examRemove} onClick={onRemove} whileTap={{scale:0.85}}>
            {Ic.trash}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}