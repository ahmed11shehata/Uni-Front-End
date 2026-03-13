import { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import styles from './SchedulePage.module.css';

/* ═══════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════ */
const PX_PER_HOUR = 88;

const fmtTime = h => {
  const hr   = Math.floor(h);
  const min  = h % 1 === 0.5 ? '30' : '00';
  const ampm = hr >= 12 ? 'PM' : 'AM';
  const disp = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr;
  return `${disp}:${min} ${ampm}`;
};

const fmtDur = (start, end) => {
  const d = end - start;
  if (d === 0.5) return '30 min';
  if (d % 1 === 0) return `${d} hr${d > 1 ? 's' : ''}`;
  return `${Math.floor(d)}h 30m`;
};

const durLabel = n => {
  if (n === 0.5) return '30 min';
  if (n % 1 === 0) return `${n} hr${n > 1 ? 's' : ''}`;
  return `${Math.floor(n)}h 30min`;
};

/* ═══════════════════════════════════════════════════════════
   MOCK DATA
═══════════════════════════════════════════════════════════ */
const DAYS_FULL  = ['Saturday','Sunday','Monday','Tuesday','Wednesday','Thursday'];
const DAYS_SHORT = ['Sat','Sun','Mon','Tue','Wed','Thu'];
const HOUR_MARKS = [8,9,10,11,12,13,14,15,16];

const WEEKLY_DATA = [
  { id:1,  day:'Saturday',  start:8,    end:9.5,  code:'CS401', name:'Artificial Intelligence',     type:'Lecture', room:'Hall A',   instructor:'Dr. Sara Mahmoud',  color:'#e8a838', group:'A' },
  { id:2,  day:'Saturday',  start:9.5,  end:11,   code:'CS401', name:'Artificial Intelligence',     type:'Lecture', room:'Hall C',   instructor:'Dr. Sara Mahmoud',  color:'#e8a838', group:'B' },
  { id:3,  day:'Saturday',  start:11,   end:12.5, code:'CS402', name:'Compiler Design',             type:'Lecture', room:'Hall B',   instructor:'Dr. Khaled Omar',   color:'#7c6fc4', group:'A' },
  { id:4,  day:'Saturday',  start:12.5, end:14,   code:'CS402', name:'Compiler Design',             type:'Lecture', room:'Hall D',   instructor:'Dr. Khaled Omar',   color:'#7c6fc4', group:'B' },
  { id:5,  day:'Sunday',    start:8,    end:9.5,  code:'CS403', name:'Image Processing',            type:'Lecture', room:'Lab 1',    instructor:'Dr. Mona Hassan',   color:'#78909c', group:'A' },
  { id:6,  day:'Sunday',    start:9.5,  end:11,   code:'CS403', name:'Image Processing',            type:'Lecture', room:'Lab 2',    instructor:'Dr. Mona Hassan',   color:'#78909c', group:'B' },
  { id:7,  day:'Sunday',    start:12,   end:13,   code:'CS401', name:'Artificial Intelligence',     type:'Section', room:'Room 12',  instructor:'Eng. Ahmed Tarek',  color:'#e8a838', group:'A' },
  { id:8,  day:'Sunday',    start:13,   end:14,   code:'CS401', name:'Artificial Intelligence',     type:'Section', room:'Room 14',  instructor:'Eng. Ahmed Tarek',  color:'#e8a838', group:'B' },
  { id:9,  day:'Monday',    start:9,    end:10.5, code:'CS404', name:'Expert Systems',              type:'Lecture', room:'Hall C',   instructor:'Dr. Rania Farid',   color:'#e05c8a', group:'A' },
  { id:10, day:'Monday',    start:10.5, end:12,   code:'CS404', name:'Expert Systems',              type:'Lecture', room:'Hall C',   instructor:'Dr. Rania Farid',   color:'#e05c8a', group:'B' },
  { id:11, day:'Monday',    start:13,   end:14,   code:'CS402', name:'Compiler Design',             type:'Section', room:'Lab 2',    instructor:'Eng. Youssef Ali',  color:'#7c6fc4', group:'A' },
  { id:12, day:'Monday',    start:14,   end:15,   code:'CS402', name:'Compiler Design',             type:'Section', room:'Lab 3',    instructor:'Eng. Youssef Ali',  color:'#7c6fc4', group:'B' },
  { id:13, day:'Tuesday',   start:8,    end:9.5,  code:'CS405', name:'NLP',                         type:'Lecture', room:'Hall A',   instructor:'Dr. Sara Mahmoud',  color:'#5b9fb5', group:'A' },
  { id:14, day:'Tuesday',   start:9.5,  end:11,   code:'CS405', name:'NLP',                         type:'Lecture', room:'Hall A',   instructor:'Dr. Sara Mahmoud',  color:'#5b9fb5', group:'B' },
  { id:15, day:'Tuesday',   start:11,   end:12.5, code:'CS406', name:'OS Theory',                   type:'Lecture', room:'Hall D',   instructor:'Dr. Tamer Ali',     color:'#3d8fe0', group:'A' },
  { id:16, day:'Tuesday',   start:12.5, end:14,   code:'CS406', name:'OS Theory',                   type:'Lecture', room:'Hall D',   instructor:'Dr. Tamer Ali',     color:'#3d8fe0', group:'B' },
  { id:17, day:'Wednesday', start:8,    end:9,    code:'CS403', name:'Image Processing',            type:'Section', room:'Lab 3',    instructor:'Eng. Nour Hamed',   color:'#78909c', group:'A' },
  { id:18, day:'Wednesday', start:9,    end:10,   code:'CS403', name:'Image Processing',            type:'Section', room:'Lab 4',    instructor:'Eng. Nour Hamed',   color:'#78909c', group:'B' },
  { id:19, day:'Wednesday', start:11,   end:12,   code:'CS404', name:'Expert Systems',              type:'Section', room:'Room 8',   instructor:'Eng. Dina Samir',   color:'#e05c8a', group:'A' },
  { id:20, day:'Wednesday', start:12,   end:13,   code:'CS404', name:'Expert Systems',              type:'Section', room:'Room 9',   instructor:'Eng. Dina Samir',   color:'#e05c8a', group:'B' },
  { id:21, day:'Thursday',  start:9,    end:10,   code:'CS405', name:'NLP',                         type:'Section', room:'Lab 1',    instructor:'Eng. Kareem Nabil', color:'#5b9fb5', group:'A' },
  { id:22, day:'Thursday',  start:10,   end:11,   code:'CS405', name:'NLP',                         type:'Section', room:'Lab 1',    instructor:'Eng. Kareem Nabil', color:'#5b9fb5', group:'B' },
  { id:23, day:'Thursday',  start:13,   end:14,   code:'CS406', name:'OS Theory',                   type:'Section', room:'Room 5',   instructor:'Eng. Hany Fouad',   color:'#3d8fe0', group:'A' },
  { id:24, day:'Thursday',  start:14,   end:15,   code:'CS406', name:'OS Theory',                   type:'Section', room:'Room 6',   instructor:'Eng. Hany Fouad',   color:'#3d8fe0', group:'B' },
];

const MIDTERM_DATA = [
  { id:1, code:'CS401', name:'Artificial Intelligence',     date:'2025-04-05', time:'10:00 AM', hall:'Hall A — 2nd Floor',   duration:2,   color:'#e8a838' },
  { id:2, code:'CS402', name:'Compiler Design',             date:'2025-04-07', time:'12:00 PM', hall:'Hall B — 1st Floor',   duration:2,   color:'#7c6fc4' },
  { id:3, code:'CS403', name:'Image Processing',            date:'2025-04-08', time:'10:00 AM', hall:'Lab Hall — 3rd Floor', duration:2.5, color:'#78909c' },
  { id:4, code:'CS404', name:'Expert Systems',              date:'2025-04-09', time:'08:00 AM', hall:'Hall C — 2nd Floor',   duration:2,   color:'#e05c8a' },
  { id:5, code:'CS405', name:'Natural Language Processing', date:'2025-04-10', time:'10:00 AM', hall:'Hall A — 2nd Floor',   duration:2,   color:'#5b9fb5' },
  { id:6, code:'CS406', name:'Operating Systems Theory',   date:'2025-04-12', time:'02:00 PM', hall:'Hall D — 1st Floor',   duration:1.5, color:'#3d8fe0' },
];

const FINAL_DATA = [
  { id:1, code:'CS401', name:'Artificial Intelligence',     date:'2025-06-14', time:'09:00 AM', hall:'Main Hall A',  duration:3,   color:'#e8a838' },
  { id:2, code:'CS402', name:'Compiler Design',             date:'2025-06-16', time:'11:00 AM', hall:'Main Hall B',  duration:3,   color:'#7c6fc4' },
  { id:3, code:'CS403', name:'Image Processing',            date:'2025-06-17', time:'09:00 AM', hall:'Lab Hall 1',   duration:3,   color:'#78909c' },
  { id:4, code:'CS404', name:'Expert Systems',              date:'2025-06-18', time:'11:00 AM', hall:'Main Hall C',  duration:3,   color:'#e05c8a' },
  { id:5, code:'CS405', name:'Natural Language Processing', date:'2025-06-19', time:'09:00 AM', hall:'Main Hall A',  duration:3,   color:'#5b9fb5' },
  { id:6, code:'CS406', name:'Operating Systems Theory',   date:'2025-06-21', time:'01:00 PM', hall:'Main Hall D',  duration:2.5, color:'#3d8fe0' },
];

/* ─── inline SVG icons ─── */
const Ic = {
  Cal: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Week: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="14" x2="11" y2="14"/><line x1="13" y1="14" x2="16" y2="14"/><line x1="8" y1="18" x2="11" y2="18"/></svg>,
  Mid: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  Fin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>,
  Clk: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  Pin: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>,
  Tim: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8"/><polyline points="12 9 12 13 14 15"/><line x1="9" y1="2" x2="15" y2="2"/></svg>,
  Shd: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>,
  Inf: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>,
  Grd: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Lck: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,
  Alt: () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
};

const TABS = [
  { key:'weekly',  label:'Weekly Schedule', sub:'Lectures & Sections',   Icon: Ic.Week, color:'#818cf8', data: WEEKLY_DATA  },
  { key:'midterm', label:'Midterm Exams',   sub:'Mid-semester exams',    Icon: Ic.Mid,  color:'#f59e0b', data: MIDTERM_DATA, count: MIDTERM_DATA.length },
  { key:'final',   label:'Final Exams',     sub:'End-of-semester exams', Icon: Ic.Fin,  color:'#e05c8a', data: FINAL_DATA,   count: FINAL_DATA.length   },
];

/* ═══════════════════════════════════════════════════════════
   PAGE
═══════════════════════════════════════════════════════════ */
export default function SchedulePage() {
  const { user }  = useContext(AuthContext) ?? {};
  const isAdmin   = user?.role === 'admin';

  const [active, setActive] = useState('weekly');
  const [avail,  setAvail]  = useState({ weekly:true, midterm:true, final:false });
  const [group,  setGroup]  = useState('A');

  const tab = TABS.find(t => t.key === active);

  return (
    <div className={styles.page}>

      {/* ── Header ── */}
      <div className={styles.hdr}>
        <div className={styles.hdrL}>
          <div className={styles.hdrIcon}><Ic.Cal/></div>
          <div>
            <h1 className={styles.hdrTitle}>Academic Schedule</h1>
            <p className={styles.hdrSub}>Computer Science &nbsp;·&nbsp; 3rd Year &nbsp;·&nbsp; Spring 2025</p>
          </div>
        </div>
        {isAdmin && (
          <div className={styles.adminTag}><Ic.Shd/> Admin Mode</div>
        )}
      </div>

      {/* ── Body ── */}
      <div className={styles.body}>

        {/* LEFT */}
        <div className={styles.viewer}>
          {!avail[active]
            ? <NotAvail type={active}/>
            : active === 'weekly'
              ? <WeeklyView group={group} onGroup={setGroup}/>
              : <ExamView type={active} data={tab.data} color={tab.color}/>
          }
        </div>

        {/* RIGHT */}
        <div className={styles.panel}>
          <div className={styles.panelHd}><Ic.Grd/> Schedule Types</div>

          {TABS.map(t => (
            <PanelCard
              key={t.key} tab={t}
              active={active===t.key}
              avail={avail[t.key]}
              isAdmin={isAdmin}
              onSelect={()=>setActive(t.key)}
              onToggle={()=>setAvail(p=>({...p,[t.key]:!p[t.key]}))}
            />
          ))}

          <div className={styles.panelFoot}>
            <Ic.Inf/>
            <span>{isAdmin ? 'Use toggles to publish/hide schedules.' : 'Schedules are published by the administration.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Right panel card ─── */
function PanelCard({ tab, active, avail, isAdmin, onSelect, onToggle }) {
  return (
    <div
      className={`${styles.pcard} ${active ? styles.pcardOn : ''}`}
      style={active ? {'--cc':tab.color}:{}}
      onClick={onSelect} role="button" tabIndex={0}
      onKeyDown={e=>e.key==='Enter'&&onSelect()}
    >
      {active && <div className={styles.pcBar} style={{background:tab.color}}/>}

      <div className={styles.pcIcon} style={{
        background: avail ? `${tab.color}18` : 'rgba(120,120,120,0.08)',
        color:       avail ? tab.color        : 'var(--text-muted)',
      }}>
        <tab.Icon/>
      </div>

      <div className={styles.pcBody}>
        <div className={styles.pcLabel}>{tab.label}</div>
        <div className={styles.pcSub}>{tab.sub}</div>
        <div className={`${styles.pcStat} ${avail ? styles.pcOn : styles.pcOff}`}>
          <span className={styles.dot}/>
          {avail ? (tab.count ? `Available · ${tab.count} exams` : 'Available') : 'Not Available Yet'}
        </div>
      </div>

      {isAdmin && (
        <button
          className={`${styles.tog} ${avail ? styles.togOn : ''}`}
          style={avail ? {'--tc':tab.color}:{}}
          onClick={e=>{e.stopPropagation();onToggle();}}
          aria-label="toggle"
        >
          <span className={styles.togT}/>
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   WEEKLY VIEW
═══════════════════════════════════════════════════════════ */
function WeeklyView({ group, onGroup }) {
  const todayName = new Date().toLocaleDateString('en-US',{weekday:'long'});
  const courses   = [...new Map(WEEKLY_DATA.map(s=>[s.code,{code:s.code,color:s.color,name:s.name}])).values()];
  const halfMarks = [];
  for(let h=8;h<=16;h+=0.5) halfMarks.push(h);
  const filtered  = WEEKLY_DATA.filter(s=>s.group===group||s.group==='ALL');

  return (
    <div className={styles.wWrap}>

      {/* Top bar */}
      <div className={styles.wTop}>
        <div>
          <h2 className={styles.wTitle}>Weekly Timetable</h2>
          <p className={styles.wSub}>8:00 AM – 4:00 PM &nbsp;·&nbsp; Sat–Thu</p>
        </div>
        <div className={styles.grpTabs}>
          {['A','B'].map(g=>(
            <button key={g} className={`${styles.grpTab} ${group===g?styles.grpOn:''}`} onClick={()=>onGroup(g)}>
              Group {g}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {courses.map(c=>(
          <div key={c.code} className={styles.legItem}>
            <span className={styles.legDot} style={{background:c.color}}/>
            <span className={styles.legCode}>{c.code}</span>
            <span className={styles.legName}>{c.name}</span>
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className={styles.grid}>

        {/* Time labels */}
        <div className={styles.timeCol}>
          <div className={styles.timeHead}/>
          <div className={styles.timeBody} style={{height:8*PX_PER_HOUR}}>
            {HOUR_MARKS.map(h=>(
              <div key={h} className={styles.timeLbl} style={{top:(h-8)*PX_PER_HOUR}}>
                {fmtTime(h)}
              </div>
            ))}
          </div>
        </div>

        {/* Day columns */}
        {DAYS_FULL.map((day,di)=>{
          const isToday = day===todayName;
          const sessions = filtered.filter(s=>s.day===day);
          return (
            <div key={day} className={`${styles.dayCol} ${isToday?styles.dayNow:''}`}>
              <div className={`${styles.dayHd} ${isToday?styles.dayHdNow:''}`}>
                {DAYS_SHORT[di]}
                {isToday&&<span className={styles.todayTag}>Today</span>}
              </div>
              <div className={styles.dayBody} style={{height:8*PX_PER_HOUR}}>
                {halfMarks.map(h=>(
                  <div key={h} className={h%1===0?styles.gridLine:styles.gridHalf} style={{top:(h-8)*PX_PER_HOUR}}/>
                ))}
                {sessions.map(s=><Session key={s.id} s={s}/>)}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className={styles.wFoot}>
        <span className={styles.typePill} data-t="L">📖 Lecture</span>
        <span className={styles.typePill} data-t="S">👥 Section</span>
        <span className={styles.wFootNote}>Hover a session for details</span>
      </div>
    </div>
  );
}

function Session({ s }) {
  const top  = (s.start - 8) * PX_PER_HOUR;
  const ht   = (s.end - s.start) * PX_PER_HOUR - 3;
  const isL  = s.type === 'Lecture';

  return (
    <div
      className={`${styles.sess} ${isL?styles.sessL:styles.sessS}`}
      style={{top, height:ht, '--sc':s.color, background:`${s.color}14`, borderLeft:`3px solid ${s.color}`}}
      title={`${s.code} · ${s.name}\n${s.type} · ${s.room}\n${s.instructor}\n${fmtTime(s.start)}–${fmtTime(s.end)} (${fmtDur(s.start,s.end)})`}
    >
      <span className={styles.sessCode} style={{background:s.color}}>{s.code}</span>
      <span className={styles.sessName}>{s.name}</span>
      {ht>=52&&<span className={styles.sessMeta}>{s.room}</span>}
      {ht>=68&&<span className={styles.sessDur}>{fmtTime(s.start)}–{fmtTime(s.end)}</span>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   EXAM VIEW (Midterm + Final — same design)
═══════════════════════════════════════════════════════════ */
function ExamView({ type, data, color }) {
  const isFinal = type === 'final';

  const parseDate = iso => {
    const d = new Date(iso+'T00:00:00');
    return {
      day:   d.toLocaleDateString('en-US',{weekday:'short'}),
      num:   d.getDate(),
      month: d.toLocaleDateString('en-US',{month:'short'}),
      full:  d.toLocaleDateString('en-US',{weekday:'long',day:'numeric',month:'long',year:'numeric'}),
    };
  };

  const countdown = iso => {
    const diff = new Date(iso+'T00:00:00') - new Date();
    const days = Math.ceil(diff/86400000);
    if(days<0)  return {label:'Passed',      cls:styles.cPast};
    if(days===0)return {label:'Today!',      cls:styles.cToday};
    if(days<=5) return {label:`${days}d left`,cls:styles.cSoon};
    return       {label:`${days} days`,      cls:styles.cFar};
  };

  return (
    <div className={styles.exWrap}>

      {/* Header */}
      <div className={styles.exHdr}>
        <div className={styles.exHdrIcon} style={{background:`${color}15`,color}}>
          {isFinal ? <Ic.Fin/> : <Ic.Mid/>}
        </div>
        <div>
          <h2 className={styles.exTitle}>{isFinal ? 'Final Exam Schedule' : 'Midterm Exam Schedule'}</h2>
          <p className={styles.exSub}>{data.length} courses · Spring 2025</p>
        </div>
        <span className={styles.exBadge} style={{background:`${color}12`,color,borderColor:`${color}28`}}>
          {isFinal ? 'Final Term' : 'Midterm'}
        </span>
      </div>

      {/* Exam list */}
      <div className={styles.exList}>
        {data.map((ex,i)=>{
          const dt = parseDate(ex.date);
          const cd = countdown(ex.date);
          return (
            <div key={ex.id} className={styles.exCard} style={{'--ec':ex.color, animationDelay:`${i*50}ms`}}>

              {/* Colour accent bar */}
              <div className={styles.exBar} style={{background:ex.color}}/>

              {/* Calendar tile */}
              <div className={styles.exCal}>
                <div className={styles.exCalTop} style={{background:ex.color}}>{dt.month}</div>
                <div className={styles.exCalNum}>{dt.num}</div>
                <div className={styles.exCalDay}>{dt.day}</div>
              </div>

              {/* Info */}
              <div className={styles.exInfo}>
                <div className={styles.exCode} style={{background:`${ex.color}18`,color:ex.color}}>{ex.code}</div>
                <div className={styles.exName}>{ex.name}</div>
                <div className={styles.exMeta}>
                  <span><Ic.Clk/> {ex.time}</span>
                  <span><Ic.Pin/> {ex.hall}</span>
                  <span><Ic.Tim/> {durLabel(ex.duration)}</span>
                </div>
              </div>

              {/* Countdown */}
              <div className={`${styles.exCd} ${cd.cls}`}>{cd.label}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.exNote}>
        <Ic.Alt/> Bring your university ID · Arrive 15 min early
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NOT AVAILABLE
═══════════════════════════════════════════════════════════ */
function NotAvail({ type }) {
  const m = {
    weekly:  {Icon:Ic.Week, label:'Weekly Schedule',  color:'#818cf8'},
    midterm: {Icon:Ic.Mid,  label:'Midterm Schedule', color:'#f59e0b'},
    final:   {Icon:Ic.Fin,  label:'Final Schedule',   color:'#e05c8a'},
  }[type];

  return (
    <div className={styles.naWrap}>
      <div className={styles.naIco} style={{'--nc':m.color}}>
        <m.Icon/>
        <div className={styles.naLck}><Ic.Lck/></div>
      </div>
      <h3 className={styles.naTitle}>Not Published Yet</h3>
      <p className={styles.naSub}>
        The <strong>{m.label}</strong> hasn't been released by the administration.
        <br/>Check back later or contact your coordinator.
      </p>
      <div className={styles.naHint}><Ic.Inf/> You'll be notified once published</div>
    </div>
  );
}