// src/pages/student/SchedulePage.jsx
import { useState, useContext, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import styles from './SchedulePage.module.css';

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const PX_PER_HOUR = 92;
const START_HOUR  = 8;
const DAYS_FULL   = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'];
const DAYS_SHORT  = ['Sat','Sun','Mon','Tue','Wed','Thu'];
const HOUR_MARKS  = [8,9,10,11,12,13,14,15,16];

const fmtTime = h => {
  const hr=Math.floor(h), min=h%1===0.5?'30':'00', ap=hr>=12?'PM':'AM';
  const d=hr>12?hr-12:hr===0?12:hr;
  return `${d}:${min} ${ap}`;
};
const fmtDur = (s,e) => {
  const d=e-s;
  if(d===0.5)return'30 min';
  if(d%1===0)return`${d}h`;
  return`${Math.floor(d)}h 30m`;
};

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════ */
const WEEKLY_DATA = [
  { id:1,  day:'Saturday',  start:8,    end:9.5,  code:'CS401', name:'Artificial Intelligence',  type:'Lecture', room:'Hall A',  instructor:'Dr. Sara Mahmoud',  color:'#e8a838', group:'A' },
  { id:2,  day:'Saturday',  start:9.5,  end:11,   code:'CS401', name:'Artificial Intelligence',  type:'Lecture', room:'Hall C',  instructor:'Dr. Sara Mahmoud',  color:'#e8a838', group:'B' },
  { id:3,  day:'Saturday',  start:11,   end:12.5, code:'CS402', name:'Compiler Design',          type:'Lecture', room:'Hall B',  instructor:'Dr. Khaled Omar',   color:'#7c6fc4', group:'A' },
  { id:4,  day:'Saturday',  start:12.5, end:14,   code:'CS402', name:'Compiler Design',          type:'Lecture', room:'Hall D',  instructor:'Dr. Khaled Omar',   color:'#7c6fc4', group:'B' },
  { id:5,  day:'Sunday',    start:8,    end:9.5,  code:'CS403', name:'Image Processing',         type:'Lecture', room:'Lab 1',   instructor:'Dr. Mona Hassan',   color:'#78909c', group:'A' },
  { id:6,  day:'Sunday',    start:9.5,  end:11,   code:'CS403', name:'Image Processing',         type:'Lecture', room:'Lab 2',   instructor:'Dr. Mona Hassan',   color:'#78909c', group:'B' },
  { id:7,  day:'Sunday',    start:12,   end:13,   code:'CS401', name:'Artificial Intelligence',  type:'Section', room:'Room 12', instructor:'Eng. Ahmed Tarek',  color:'#e8a838', group:'A' },
  { id:8,  day:'Sunday',    start:13,   end:14,   code:'CS401', name:'Artificial Intelligence',  type:'Section', room:'Room 14', instructor:'Eng. Ahmed Tarek',  color:'#e8a838', group:'B' },
  { id:9,  day:'Monday',    start:9,    end:10.5, code:'CS404', name:'Expert Systems',           type:'Lecture', room:'Hall C',  instructor:'Dr. Rania Farid',   color:'#e05c8a', group:'A' },
  { id:10, day:'Monday',    start:10.5, end:12,   code:'CS404', name:'Expert Systems',           type:'Lecture', room:'Hall C',  instructor:'Dr. Rania Farid',   color:'#e05c8a', group:'B' },
  { id:11, day:'Monday',    start:13,   end:14,   code:'CS402', name:'Compiler Design',          type:'Section', room:'Lab 2',   instructor:'Eng. Youssef Ali',  color:'#7c6fc4', group:'A' },
  { id:12, day:'Monday',    start:14,   end:15,   code:'CS402', name:'Compiler Design',          type:'Section', room:'Lab 3',   instructor:'Eng. Youssef Ali',  color:'#7c6fc4', group:'B' },
  { id:13, day:'Tuesday',   start:8,    end:9.5,  code:'CS405', name:'NLP',                      type:'Lecture', room:'Hall A',  instructor:'Dr. Sara Mahmoud',  color:'#5b9fb5', group:'A' },
  { id:14, day:'Tuesday',   start:9.5,  end:11,   code:'CS405', name:'NLP',                      type:'Lecture', room:'Hall A',  instructor:'Dr. Sara Mahmoud',  color:'#5b9fb5', group:'B' },
  { id:15, day:'Tuesday',   start:11,   end:12.5, code:'CS406', name:'OS Theory',                type:'Lecture', room:'Hall D',  instructor:'Dr. Tamer Ali',     color:'#3d8fe0', group:'A' },
  { id:16, day:'Tuesday',   start:12.5, end:14,   code:'CS406', name:'OS Theory',                type:'Lecture', room:'Hall D',  instructor:'Dr. Tamer Ali',     color:'#3d8fe0', group:'B' },
  { id:17, day:'Wednesday', start:8,    end:9,    code:'CS403', name:'Image Processing',         type:'Section', room:'Lab 3',   instructor:'Eng. Nour Hamed',   color:'#78909c', group:'A' },
  { id:18, day:'Wednesday', start:9,    end:10,   code:'CS403', name:'Image Processing',         type:'Section', room:'Lab 4',   instructor:'Eng. Nour Hamed',   color:'#78909c', group:'B' },
  { id:19, day:'Wednesday', start:11,   end:12,   code:'CS404', name:'Expert Systems',           type:'Section', room:'Room 8',  instructor:'Eng. Dina Samir',   color:'#e05c8a', group:'A' },
  { id:20, day:'Wednesday', start:12,   end:13,   code:'CS404', name:'Expert Systems',           type:'Section', room:'Room 9',  instructor:'Eng. Dina Samir',   color:'#e05c8a', group:'B' },
  { id:21, day:'Thursday',  start:9,    end:10,   code:'CS405', name:'NLP',                      type:'Section', room:'Lab 1',   instructor:'Eng. Kareem Nabil', color:'#5b9fb5', group:'A' },
  { id:22, day:'Thursday',  start:10,   end:11,   code:'CS405', name:'NLP',                      type:'Section', room:'Lab 1',   instructor:'Eng. Kareem Nabil', color:'#5b9fb5', group:'B' },
  { id:23, day:'Thursday',  start:13,   end:14,   code:'CS406', name:'OS Theory',                type:'Section', room:'Room 5',  instructor:'Eng. Hany Fouad',   color:'#3d8fe0', group:'A' },
  { id:24, day:'Thursday',  start:14,   end:15,   code:'CS406', name:'OS Theory',                type:'Section', room:'Room 6',  instructor:'Eng. Hany Fouad',   color:'#3d8fe0', group:'B' },
];

const MIDTERM_DATA = [
  { id:1, code:'CS401', name:'Artificial Intelligence',    date:'2026-04-05', time:'10:00 AM', hall:'Hall A — 2nd Floor',   duration:2,   color:'#e8a838' },
  { id:2, code:'CS402', name:'Compiler Design',            date:'2026-04-07', time:'12:00 PM', hall:'Hall B — 1st Floor',   duration:2,   color:'#7c6fc4' },
  { id:3, code:'CS403', name:'Image Processing',           date:'2026-04-08', time:'10:00 AM', hall:'Lab Hall — 3rd Floor', duration:2.5, color:'#78909c' },
  { id:4, code:'CS404', name:'Expert Systems',             date:'2026-04-09', time:'08:00 AM', hall:'Hall C — 2nd Floor',   duration:2,   color:'#e05c8a' },
  { id:5, code:'CS405', name:'Natural Language Processing',date:'2026-04-10', time:'10:00 AM', hall:'Hall A — 2nd Floor',   duration:2,   color:'#5b9fb5' },
  { id:6, code:'CS406', name:'OS Theory',                  date:'2026-04-12', time:'02:00 PM', hall:'Hall D — 1st Floor',   duration:1.5, color:'#3d8fe0' },
];

const FINAL_DATA = [
  { id:1, code:'CS401', name:'Artificial Intelligence',    date:'2026-06-14', time:'09:00 AM', hall:'Main Hall A',  duration:3,   color:'#e8a838' },
  { id:2, code:'CS402', name:'Compiler Design',            date:'2026-06-16', time:'11:00 AM', hall:'Main Hall B',  duration:3,   color:'#7c6fc4' },
  { id:3, code:'CS403', name:'Image Processing',           date:'2026-06-17', time:'09:00 AM', hall:'Lab Hall 1',   duration:3,   color:'#78909c' },
  { id:4, code:'CS404', name:'Expert Systems',             date:'2026-06-18', time:'11:00 AM', hall:'Main Hall C',  duration:3,   color:'#e05c8a' },
  { id:5, code:'CS405', name:'Natural Language Processing',date:'2026-06-19', time:'09:00 AM', hall:'Main Hall A',  duration:3,   color:'#5b9fb5' },
  { id:6, code:'CS406', name:'OS Theory',                  date:'2026-06-21', time:'01:00 PM', hall:'Main Hall D',  duration:2.5, color:'#3d8fe0' },
];

/* Unique courses for legend */
const COURSES = [...new Map(WEEKLY_DATA.map(s=>[s.code,{code:s.code,name:s.name,color:s.color}])).values()];

/* ── Today ── */
const TODAY = new Date().toLocaleDateString('en-US',{weekday:'long'});

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function SchedulePage() {
  const { user } = useContext(AuthContext) ?? {};
  const [view,  setView]  = useState('weekly'); // weekly | midterm | final
  const [group, setGroup] = useState('A');
  const [avail]           = useState({ weekly:true, midterm:true, final:true });
  const [tooltip, setTooltip] = useState(null);

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <motion.div className={styles.header} initial={{opacity:0,y:-12}} animate={{opacity:1,y:0}}>
        <div className={styles.headerLeft}>
          <div className={styles.headerIcon}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div>
            <h1 className={styles.headerTitle}>Academic Schedule</h1>
            <p className={styles.headerSub}>CS Dept · 3rd Year · Spring 2026</p>
          </div>
        </div>
      </motion.div>

      {/* ── View selector ── */}
      <motion.div className={styles.viewSelector}
        initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} transition={{delay:0.06}}>
        {[
          { key:'weekly',  emoji:'📅', label:'Weekly Schedule',  color:'#818cf8' },
          { key:'midterm', emoji:'📝', label:'Midterm Exams',     color:'#f59e0b' },
          { key:'final',   emoji:'🏆', label:'Final Exams',       color:'#e05c8a' },
        ].map(v=>(
          <motion.button key={v.key}
            className={`${styles.viewBtn} ${view===v.key?styles.viewBtnOn:''}`}
            style={view===v.key?{'--vc':v.color}:{}}
            onClick={()=>setView(v.key)}
            whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
            <span className={styles.viewBtnEmoji}>{v.emoji}</span>
            <span className={styles.viewBtnLabel}>{v.label}</span>
            {view===v.key && (
              <motion.div className={styles.viewBtnUnderline}
                layoutId="vbUnderline"
                style={{background:v.color}}/>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* ── Content ── */}
      <AnimatePresence mode="wait">
        {view==='weekly' && avail.weekly && (
          <motion.div key="weekly"
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}
            transition={{duration:0.38,ease:[0.22,1,0.36,1]}}>
            <WeeklyView group={group} onGroup={setGroup}/>
          </motion.div>
        )}
        {view==='midterm' && (
          <motion.div key="midterm"
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
            <ExamView data={MIDTERM_DATA} type="midterm" color="#f59e0b"/>
          </motion.div>
        )}
        {view==='final' && (
          <motion.div key="final"
            initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}>
            <ExamView data={FINAL_DATA} type="final" color="#e05c8a"/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WEEKLY VIEW
═══════════════════════════════════════════════════════════ */
function WeeklyView({ group, onGroup }) {
  const [hovered, setHovered] = useState(null);
  const filtered = WEEKLY_DATA.filter(s => s.group === group);
  const halfMarks = [];
  for(let h=START_HOUR; h<16; h++) { halfMarks.push(h); halfMarks.push(h+0.5); }

  return (
    <div className={styles.weeklyWrap}>

      {/* Top bar: Group selector + Legend */}
      <div className={styles.weeklyTop}>
        {/* Group A/B toggle */}
        <div className={styles.groupToggle}>
          <span className={styles.groupToggleLabel}>My Group:</span>
          {['A','B'].map(g=>(
            <motion.button key={g}
              className={`${styles.groupBtn} ${group===g?styles.groupBtnOn:''}`}
              onClick={()=>onGroup(g)}
              whileHover={{scale:1.04}} whileTap={{scale:0.96}}>
              <span className={styles.groupBtnLetter}>{g}</span>
              {group===g && (
                <motion.div className={styles.groupBtnBg}
                  layoutId="groupBg"
                  transition={{type:'spring',stiffness:400,damping:28}}/>
              )}
            </motion.button>
          ))}
        </div>

        {/* Legend */}
        <div className={styles.legendRow}>
          {COURSES.map(c=>(
            <div key={c.code} className={styles.legendItem}>
              <span className={styles.legendDot} style={{background:c.color}}/>
              <span className={styles.legendCode} style={{color:c.color}}>{c.code}</span>
              <span className={styles.legendName}>{c.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Type indicators */}
      <div className={styles.typeRow}>
        <span className={styles.typeChip} style={{background:'rgba(129,140,248,0.12)',color:'#818cf8',borderColor:'rgba(129,140,248,0.2)'}}>📖 Lecture</span>
        <span className={styles.typeChip} style={{background:'rgba(34,197,94,0.1)',color:'#22c55e',borderColor:'rgba(34,197,94,0.2)'}}>👥 Section / Lab</span>
        <span className={styles.typeHint}>Hover sessions for details</span>
        <span className={styles.groupIndicator}>
          Showing Group <strong>{group}</strong> schedule
        </span>
      </div>

      {/* GRID */}
      <div className={styles.grid}>
        {/* Time column */}
        <div className={styles.timeCol}>
          <div className={styles.timeColHead}/>
          <div className={styles.timeColBody} style={{height:HOUR_MARKS.length*PX_PER_HOUR}}>
            {HOUR_MARKS.map(h=>(
              <div key={h} className={styles.timeLabel}
                style={{top:(h-START_HOUR)*PX_PER_HOUR - 9}}>
                {fmtTime(h)}
              </div>
            ))}
          </div>
        </div>

        {/* Day columns */}
        {DAYS_FULL.map((day, di) => {
          const isToday = day === TODAY;
          const sessions = filtered.filter(s => s.day === day);
          return (
            <div key={day} className={`${styles.dayCol} ${isToday?styles.dayColToday:''}`}>
              {/* Day header */}
              <div className={`${styles.dayHead} ${isToday?styles.dayHeadToday:''}`}>
                <span className={styles.dayShort}>{DAYS_SHORT[di]}</span>
                {isToday && (
                  <motion.span className={styles.todayPill}
                    initial={{scale:0}} animate={{scale:1}}
                    transition={{type:'spring',stiffness:400,damping:20}}>
                    Today
                  </motion.span>
                )}
              </div>

              {/* Day body */}
              <div className={styles.dayBody}
                style={{height:HOUR_MARKS.length*PX_PER_HOUR, position:'relative'}}>

                {/* Grid lines */}
                {halfMarks.map(h=>(
                  <div key={h}
                    className={h%1===0?styles.hourLine:styles.halfLine}
                    style={{top:(h-START_HOUR)*PX_PER_HOUR}}/>
                ))}

                {/* Sessions */}
                {sessions.map(s=>(
                  <SessionBlock key={s.id} s={s}
                    hovered={hovered===s.id}
                    onEnter={()=>setHovered(s.id)}
                    onLeave={()=>setHovered(null)}/>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Session block */
function SessionBlock({ s, hovered, onEnter, onLeave }) {
  const top    = (s.start - START_HOUR) * PX_PER_HOUR;
  const height = (s.end - s.start) * PX_PER_HOUR - 4;
  const isLec  = s.type === 'Lecture';

  return (
    <motion.div
      className={`${styles.session} ${isLec?styles.sessionLec:styles.sessionSec}`}
      style={{
        top, height,
        background: isLec
          ? `linear-gradient(160deg, ${s.color}ee 0%, ${s.color}cc 100%)`
          : `linear-gradient(160deg, ${s.color}cc 0%, ${s.color}aa 100%)`,
        borderLeft: `4px solid ${s.color}`,
        '--sc': s.color,
      }}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      animate={hovered ? {x:3,zIndex:10} : {x:0,zIndex:1}}
      transition={{duration:0.15}}>

      <div className={styles.sessionCodeTag} style={{background:s.color}}>
        {s.code}
      </div>
      {height >= 38 && (
        <div className={styles.sessionName}>{s.name}</div>
      )}
      {height >= 56 && (
        <div className={styles.sessionMeta}>
          👤 {s.instructor}
        </div>
      )}
      {height >= 72 && (
        <div className={styles.sessionTime}>
          🏛 {s.room} · {fmtTime(s.start)}–{fmtTime(s.end)}
        </div>
      )}

      {/* Tooltip on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.div className={styles.tooltip}
            initial={{opacity:0,y:6,scale:0.94}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,scale:0.94}}
            transition={{duration:0.16}}>
            <div className={styles.ttCode} style={{color:s.color}}>{s.code}</div>
            <div className={styles.ttName}>{s.name}</div>
            <div className={styles.ttRow}>
              <span>🏛</span><span>{s.room}</span>
            </div>
            <div className={styles.ttRow}>
              <span>👤</span><span>{s.instructor}</span>
            </div>
            <div className={styles.ttRow}>
              <span>⏱</span>
              <span>{fmtTime(s.start)} – {fmtTime(s.end)} ({fmtDur(s.start,s.end)})</span>
            </div>
            <div className={styles.ttType}
              style={{background:isLec?'rgba(129,140,248,0.12)':'rgba(34,197,94,0.1)',
                color:isLec?'#818cf8':'#22c55e'}}>
              {s.type}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXAM VIEW
═══════════════════════════════════════════════════════════ */
function ExamView({ data, type, color }) {
  const isFinal = type === 'final';

  const parseDate = iso => {
    const d = new Date(iso+'T12:00');
    return {
      num:     d.getDate(),
      month:   d.toLocaleDateString('en-US',{month:'short'}),
      weekday: d.toLocaleDateString('en-US',{weekday:'long'}),
      full:    d.toLocaleDateString('en-US',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),
    };
  };

  const countdown = iso => {
    const diff = new Date(iso+'T12:00') - new Date();
    const days = Math.ceil(diff/86400000);
    if(days<0)  return {label:'Passed',    color:'#6b7280', bg:'rgba(107,114,128,0.1)'};
    if(days===0)return {label:'Today!',    color:'#ef4444', bg:'rgba(239,68,68,0.12)'};
    if(days<=5) return {label:`${days}d`,  color:'#f59e0b', bg:'rgba(245,158,11,0.12)'};
    return       {label:`${days} days`,   color,           bg:`${color}12`};
  };

  return (
    <div className={styles.examWrap}>
      {/* Header */}
      <div className={styles.examHeader}>
        <div className={styles.examHeaderIcon} style={{background:`${color}14`,color}}>
          {isFinal
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          }
        </div>
        <div>
          <h2 className={styles.examHeaderTitle}>{isFinal?'Final':'Midterm'} Exam Schedule</h2>
          <p className={styles.examHeaderSub}>{data.length} exams · Spring 2026</p>
        </div>
        <span className={styles.examBadge} style={{background:`${color}12`,color,borderColor:`${color}28`}}>
          {isFinal?'Final Term':'Midterm'}
        </span>
      </div>

      {/* Exam cards */}
      <motion.div className={styles.examGrid}
        initial="hidden" animate="show"
        variants={{show:{transition:{staggerChildren:0.07}}}}>
        {data.map((ex,i)=>{
          const dt = parseDate(ex.date);
          const cd = countdown(ex.date);
          return (
            <motion.div key={ex.id} className={styles.examCard}
              variants={{hidden:{opacity:0,y:18},show:{opacity:1,y:0,transition:{duration:0.42,ease:[0.22,1,0.36,1]}}}}
              whileHover={{y:-4,boxShadow:`0 16px 44px ${ex.color}30`}}>

              {/* Solid colored left stripe */}
              <div className={styles.examStripe} style={{background:ex.color}}/>

              {/* Calendar tile — solid color */}
              <div className={styles.examCalTile}
                style={{background:ex.color, borderColor:ex.color}}>
                <div className={styles.examCalMonth} style={{color:'rgba(255,255,255,.8)'}}>{dt.month}</div>
                <div className={styles.examCalDay} style={{color:'#fff'}}>{dt.num}</div>
                <div className={styles.examCalWeekday} style={{color:'rgba(255,255,255,.75)'}}>{dt.weekday.slice(0,3)}</div>
              </div>

              {/* Info */}
              <div className={styles.examInfo}>
                <div className={styles.examCode}
                  style={{color:'#fff', background:ex.color, borderColor:ex.color}}>
                  {ex.code}
                </div>
                <div className={styles.examName}>{ex.name}</div>
                <div className={styles.examMetaRow}>
                  <span className={styles.examMetaItem}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    {ex.time}
                  </span>
                  <span className={styles.examMetaItem}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {ex.hall}
                  </span>
                  <span className={styles.examMetaItem}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="13" r="8"/><polyline points="12 9 12 13 14 15"/><line x1="9" y1="2" x2="15" y2="2"/></svg>
                    {ex.duration} hrs
                  </span>
                </div>
              </div>

              {/* Countdown */}
              <div className={styles.examCountdown}
                style={{color:cd.color,background:cd.bg,borderColor:`${cd.color}28`}}>
                {cd.label}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className={styles.examNote}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
        Bring your university ID card · Arrive 15 minutes early
      </div>
    </div>
  );
}
