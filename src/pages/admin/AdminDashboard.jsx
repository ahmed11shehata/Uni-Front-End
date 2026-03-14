// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useRegistration } from "../../context/RegistrationContext";
import styles from "./AdminDashboard.module.css";

/* ── animated counter ── */
function Counter({ to, duration = 1.4 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    const steps = 60;
    const inc   = to / steps;
    const id    = setInterval(() => {
      start += inc;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(Math.floor(start));
    }, (duration * 1000) / steps);
    return () => clearInterval(id);
  }, [to]);
  return <>{val.toLocaleString()}</>;
}

const STATS = [
  { id:"students",  label:"Total Students",   value:1248, icon:"👥", color:"#818cf8", trend:"+12%", trendUp:true  },
  { id:"registered",label:"Registered",        value:842,  icon:"✅", color:"#22c55e", trend:"+8%",  trendUp:true  },
  { id:"instructors",label:"Instructors",       value:64,   icon:"🎓", color:"#3b82f6", trend:"+2",   trendUp:true  },
  { id:"courses",   label:"Active Courses",    value:38,   icon:"📚", color:"#f59e0b", trend:"same", trendUp:null  },
];

const ACTIONS = [
  { label:"Register User",       desc:"Add new student or instructor",     path:"/admin/register",      emoji:"👤", color:"#818cf8" },
  { label:"Manage Users",        desc:"View and control student accounts", path:"/admin/manage-users",  emoji:"⚙️", color:"#22c55e" },
  { label:"Registration Manager",desc:"Open/close course registration",   path:"/admin/registration",  emoji:"📋", color:"#f59e0b" },
  { label:"Email Manager",       desc:"Create and manage student emails",  path:"/admin/email-manager", emoji:"✉️", color:"#ef4444" },
  { label:"Schedule Manager",    desc:"Build weekly & exam schedules",     path:"/admin/schedule",      emoji:"🗓️", color:"#14b8a6" },
  { label:"Themes",              desc:"Customize system appearance",       path:"/admin/themes",         emoji:"🎨", color:"#ec4899" },
];

const RECENT = [
  { name:"Ahmed Mohamed Ali",   action:"Registered 6 courses", time:"2 min ago",   color:"#22c55e" },
  { name:"Sara Khaled Ibrahim", action:"Dropped CS103",         time:"14 min ago",  color:"#ef4444" },
  { name:"Omar Hassan Farouk",  action:"GPA updated to 2.7",   time:"1 hr ago",    color:"#f59e0b" },
  { name:"Nour El-Din Samir",   action:"Email created",         time:"2 hrs ago",   color:"#818cf8" },
  { name:"Dina Mahmoud Saad",   action:"Schedule published",    time:"Yesterday",   color:"#14b8a6" },
];

const stagger = { show:{ transition:{ staggerChildren:0.07 } } };
const fadeUp  = { hidden:{opacity:0,y:20}, show:{opacity:1,y:0,transition:{duration:0.45,ease:[0.22,1,0.36,1]}} };

export default function AdminDashboard() {
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

  return (
    <div className={styles.page}>

      {/* ══ HERO HEADER ══════════════════════════════════════════ */}
      <motion.div className={styles.hero}
        initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}} transition={{duration:0.55,ease:[0.22,1,0.36,1]}}>
        <div className={styles.heroLeft}>
          <div className={styles.heroBadge}>
            <span className={styles.heroBadgeDot}/>
            Admin Panel
          </div>
          <h1 className={styles.heroTitle}>
            {greeting()}, <span className={styles.heroName}>Ahmed</span> 👋
          </h1>
          <p className={styles.heroSub}>
            {time.toLocaleDateString("en-US",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
            {" · "}
            <span className={styles.heroClock}>
              {time.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",second:"2-digit"})}
            </span>
          </p>
        </div>

        {/* Registration live status */}
        <motion.div
          className={`${styles.regStatus} ${regWindow.isOpen ? styles.regOpen : styles.regClosed}`}
          animate={regWindow.isOpen ? {boxShadow:["0 0 0 0 rgba(34,197,94,0.3)","0 0 0 12px rgba(34,197,94,0)","0 0 0 0 rgba(34,197,94,0)"]} : {}}
          transition={{duration:2.5,repeat:Infinity}}>
          <div className={styles.regStatusIcon}>
            {regWindow.isOpen ? "🟢" : "🔴"}
          </div>
          <div className={styles.regStatusText}>
            <span className={styles.regStatusLabel}>
              Registration {regWindow.isOpen ? "Open" : "Closed"}
            </span>
            {regWindow.isOpen && daysLeft !== null && (
              <span className={styles.regStatusSub}>
                {daysLeft === 0 ? "Closes today!" : `${daysLeft} days left`}
                {" · "}{regWindow.semester} {regWindow.academicYear}
              </span>
            )}
            {!regWindow.isOpen && (
              <span className={styles.regStatusSub}>Students cannot register</span>
            )}
          </div>
          <button className={styles.regStatusBtn}
            onClick={() => navigate("/admin/registration")}>
            Manage →
          </button>
        </motion.div>
      </motion.div>

      {/* ══ STATS GRID ══════════════════════════════════════════ */}
      <motion.div className={styles.statsGrid}
        variants={stagger} initial="hidden" animate="show">
        {STATS.map((s, i) => (
          <motion.div key={s.id} className={styles.statCard} variants={fadeUp}
            whileHover={{y:-4,boxShadow:"0 16px 40px rgba(0,0,0,0.1)"}}>
            {/* Background glow */}
            <div className={styles.statGlow} style={{background:s.color}}/>
            <div className={styles.statTop}>
              <div className={styles.statIcon} style={{background:`${s.color}18`, color:s.color}}>
                {s.icon}
              </div>
              {s.trendUp !== null && (
                <span className={`${styles.statTrend} ${s.trendUp ? styles.trendUp : styles.trendDown}`}>
                  {s.trendUp ? "↑" : "↓"} {s.trend}
                </span>
              )}
            </div>
            <div className={styles.statVal} style={{color:s.color}}>
              <Counter to={s.value}/>
            </div>
            <div className={styles.statLabel}>{s.label}</div>
            <motion.div className={styles.statBar}
              initial={{scaleX:0}} animate={{scaleX:1}}
              transition={{delay:0.3+i*0.1,duration:0.8,ease:"easeOut"}}
              style={{background:`linear-gradient(90deg,${s.color},${s.color}44)`}}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* ══ MAIN CONTENT ═════════════════════════════════════════ */}
      <div className={styles.mainGrid}>

        {/* Quick actions */}
        <motion.div className={styles.actionsCard}
          initial={{opacity:0,x:-20}} animate={{opacity:1,x:0}} transition={{delay:0.25,duration:0.5}}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Quick Actions</h2>
            <span className={styles.cardSub}>Jump to any section</span>
          </div>
          <div className={styles.actionsGrid}>
            {ACTIONS.map((a, i) => (
              <motion.button key={a.label}
                className={styles.actionBtn}
                style={{"--ac": a.color}}
                onClick={() => navigate(a.path)}
                initial={{opacity:0,scale:0.9}} animate={{opacity:1,scale:1}}
                transition={{delay:0.3+i*0.06}}
                whileHover={{scale:1.03,y:-3}} whileTap={{scale:0.97}}>
                <span className={styles.actionEmoji}>{a.emoji}</span>
                <div className={styles.actionText}>
                  <span className={styles.actionLabel}>{a.label}</span>
                  <span className={styles.actionDesc}>{a.desc}</span>
                </div>
                <span className={styles.actionArrow}>›</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Right column */}
        <div className={styles.rightCol}>

          {/* System overview donut-style */}
          <motion.div className={styles.overviewCard}
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.3}}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>System Overview</h2>
            </div>
            <div className={styles.overviewRing}>
              <svg viewBox="0 0 120 120" className={styles.ringSvg}>
                {/* Background circle */}
                <circle cx="60" cy="60" r="50" fill="none" stroke="var(--hover-bg)" strokeWidth="12"/>
                {/* Registered arc */}
                <motion.circle cx="60" cy="60" r="50" fill="none"
                  stroke="#22c55e" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray="314"
                  initial={{strokeDashoffset:314}}
                  animate={{strokeDashoffset:314*(1-842/1248)}}
                  transition={{delay:0.5,duration:1.4,ease:[0.22,1,0.36,1]}}
                  style={{transform:"rotate(-90deg)",transformOrigin:"60px 60px"}}
                />
              </svg>
              <div className={styles.ringCenter}>
                <span className={styles.ringPct}>67%</span>
                <span className={styles.ringLbl}>Registered</span>
              </div>
            </div>
            <div className={styles.overviewStats}>
              {[
                {label:"Registered",   val:842,  color:"#22c55e"},
                {label:"Not yet",      val:406,  color:"var(--border)"},
                {label:"Instructors",  val:64,   color:"#3b82f6"},
                {label:"Courses",      val:38,   color:"#f59e0b"},
              ].map(s=>(
                <div key={s.label} className={styles.overviewItem}>
                  <span className={styles.overviewDot} style={{background:s.color}}/>
                  <span className={styles.overviewLbl}>{s.label}</span>
                  <span className={styles.overviewVal}>{s.val}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent activity */}
          <motion.div className={styles.activityCard}
            initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} transition={{delay:0.38}}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Recent Activity</h2>
            </div>
            <div className={styles.activityList}>
              {RECENT.map((r,i) => (
                <motion.div key={i} className={styles.activityRow}
                  initial={{opacity:0,x:12}} animate={{opacity:1,x:0}}
                  transition={{delay:0.45+i*0.07}}>
                  <div className={styles.activityAvatar}
                    style={{background:`${r.color}20`, color:r.color}}>
                    {r.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                  </div>
                  <div className={styles.activityInfo}>
                    <span className={styles.activityName}>{r.name}</span>
                    <span className={styles.activityAction}>{r.action}</span>
                  </div>
                  <span className={styles.activityTime}>{r.time}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ══ GPA CREDIT RULES ═════════════════════════════════════ */}
      <motion.div className={styles.gpaCard}
        initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.5}}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Credit Hour Rules — GPA Based</h2>
          <span className={styles.cardSub}>Applied automatically per student</span>
        </div>
        <div className={styles.gpaGrid}>
          {[
            {label:"Excellent",  range:"GPA ≥ 3.5", hrs:21, color:"#22c55e", icon:"⭐"},
            {label:"Very Good",  range:"GPA ≥ 3.0", hrs:18, color:"#4ade80", icon:"✨"},
            {label:"Good",       range:"GPA ≥ 2.5", hrs:18, color:"#86efac", icon:"👍"},
            {label:"Pass",       range:"GPA ≥ 2.0", hrs:15, color:"#f59e0b", icon:"📊"},
            {label:"Warning",    range:"GPA ≥ 1.5", hrs:12, color:"#ef4444", icon:"⚠️"},
            {label:"Probation",  range:"GPA < 1.5", hrs:9,  color:"#991b1b", icon:"🚨"},
          ].map((r,i)=>(
            <motion.div key={r.label} className={styles.gpaRule}
              style={{"--gc":r.color}}
              initial={{opacity:0,y:14}} animate={{opacity:1,y:0}}
              transition={{delay:0.55+i*0.06}}>
              <div className={styles.gpaRuleTop}>
                <span className={styles.gpaEmoji}>{r.icon}</span>
                <span className={styles.gpaHrs} style={{color:r.color}}>{r.hrs}<small>hrs</small></span>
              </div>
              <div className={styles.gpaLabel}>{r.label}</div>
              <div className={styles.gpaRange}>{r.range}</div>
              <motion.div className={styles.gpaBar}
                initial={{scaleX:0}} animate={{scaleX:r.hrs/21}}
                transition={{delay:0.7+i*0.06,duration:0.7,ease:"easeOut"}}
                style={{background:r.color}}/>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
