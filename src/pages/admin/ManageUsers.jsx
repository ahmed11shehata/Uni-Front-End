// src/pages/admin/ManageUsers.jsx
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MOCK_STUDENTS, COURSE_DB,
  getAcademicStanding, getCourseStatus,
  getGradeFromTotal, getGPAPoints,
} from "../../services/mock/mockData";
import styles from "./ManageUsers.module.css";

const YEAR_LABELS = ["","1st Year","2nd Year","3rd Year","4th Year"];
const YEAR_COLORS = ["","#818cf8","#22c55e","#f59e0b","#ef4444"];

function gradeColor(t){if(t>=90)return"#22c55e";if(t>=80)return"#84cc16";if(t>=70)return"#f59e0b";if(t>=60)return"#fb923c";return"#ef4444";}

function getPatBg(type,color){const c=encodeURIComponent(color);const p={mosaic:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='56' height='56'%3E%3Crect x='2' y='2' width='24' height='24' rx='3' fill='${c}' opacity='.45'/%3E%3Crect x='30' y='2' width='24' height='24' rx='3' fill='${c}' opacity='.25'/%3E%3Crect x='2' y='30' width='24' height='24' rx='3' fill='${c}' opacity='.25'/%3E%3Crect x='30' y='30' width='24' height='24' rx='3' fill='${c}' opacity='.45'/%3E%3C/svg%3E")`,circles:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Ccircle cx='40' cy='40' r='28' fill='none' stroke='${c}' stroke-width='18' opacity='.28'/%3E%3C/svg%3E")`,squares:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Crect x='8' y='8' width='56' height='56' fill='none' stroke='${c}' stroke-width='3' opacity='.22'/%3E%3C/svg%3E")`,diamonds:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Cpolygon points='32,4 60,32 32,60 4,32' fill='none' stroke='${c}' stroke-width='3' opacity='.26'/%3E%3C/svg%3E")`,waves:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='40'%3E%3Cpath d='M0 20 Q20 0 40 20 Q60 40 80 20' fill='none' stroke='${c}' stroke-width='3' opacity='.25'/%3E%3C/svg%3E")`,dots:`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ccircle cx='4' cy='4' r='2.5' fill='${c}' opacity='.35'/%3E%3Ccircle cx='20' cy='20' r='2.5' fill='${c}' opacity='.35'/%3E%3C/svg%3E")`};return p[type]||p.mosaic;}

const SVG={search:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,user:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,book:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>,grades:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,plus:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,trash:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,lock:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>,close:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,warn:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,info:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>};

const fadeUp={hidden:{opacity:0,y:22},show:{opacity:1,y:0,transition:{duration:0.42,ease:[0.22,1,0.36,1]}}};

export default function ManageUsers(){
  const[searchId,setSearchId]=useState("");
  const[student,setStudent]=useState(null);
  const[notFound,setNotFound]=useState(false);
  const[view,setView]=useState(null);
  const[toast,setToast]=useState(null);
  const showToast=(msg,type="success")=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};
  const handleSearch=()=>{const k=searchId.trim().toUpperCase();const f=MOCK_STUDENTS[k];if(f){setStudent(JSON.parse(JSON.stringify(f)));setNotFound(false);setView(null);}else{setStudent(null);setNotFound(true);}};
  return(
    <div className={styles.page}>
      <AnimatePresence>{toast&&<motion.div className={`${styles.toast} ${styles[`toast_${toast.type}`]}`} initial={{opacity:0,y:-20,x:"-50%",scale:0.92}} animate={{opacity:1,y:0,x:"-50%",scale:1}} exit={{opacity:0,x:"-50%"}} transition={{type:"spring",stiffness:440,damping:28}}><span className={styles.toastDot}/>{toast.msg}</motion.div>}</AnimatePresence>
      <motion.div className={styles.searchWrap} initial={{opacity:0,y:-10}} animate={{opacity:1,y:0}}>
        <div className={styles.searchBox}>
          <span className={styles.searchIcon}>{SVG.search}</span>
          <input className={styles.searchIn} placeholder="Enter Student ID  (e.g. CS2024001)" value={searchId} onChange={e=>setSearchId(e.target.value)} onKeyDown={e=>e.key==="Enter"&&handleSearch()}/>
          {searchId&&<button className={styles.clearBtn} onClick={()=>{setSearchId("");setStudent(null);setNotFound(false);}}>{SVG.close}</button>}
        </div>
        <motion.button className={styles.searchBtn} onClick={handleSearch} whileHover={{scale:1.02}} whileTap={{scale:0.97}}>Search</motion.button>
      </motion.div>
      <p className={styles.searchHint}>Try: CS2024001 · CS2024002 · CS2024003</p>
      <AnimatePresence>{notFound&&!student&&<motion.div className={styles.notFound} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>{SVG.warn}<span>No student found with ID <strong>"{searchId}"</strong></span></motion.div>}</AnimatePresence>
      {!student&&!notFound&&<motion.div className={styles.emptyState} initial={{opacity:0}} animate={{opacity:1,transition:{delay:0.2}}}><motion.div className={styles.emptyOrb} animate={{y:[0,-10,0]}} transition={{duration:4,repeat:Infinity,ease:"easeInOut"}}>{SVG.user}</motion.div><p className={styles.emptyTitle}>Search for a student</p><p className={styles.emptySub}>Enter the student ID to view their profile, manage courses, and review grades.</p></motion.div>}
      <AnimatePresence>{student&&<motion.div key={student.id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className={styles.studentWrap}>
        <StudentProfile student={student}/>
        {view===null&&<motion.div className={styles.navCards} initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} transition={{delay:0.12}}>
          <NavCard icon={SVG.book} color="#818cf8" title="Registered Courses" desc="View, add, drop and manage course access" badge={student.registeredCourses?.length||0} badgeLabel="enrolled" onClick={()=>setView("courses")}/>
          <NavCard icon={SVG.grades} color="#22c55e" title="Academic Transcript" desc="Complete grade history by year and semester" badge={student.gpa?.toFixed(2)||"N/A"} badgeLabel="GPA" onClick={()=>setView("grades")}/>
        </motion.div>}
        {view&&<motion.button className={styles.backBtn} onClick={()=>setView(null)} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}>← Back</motion.button>}
        <AnimatePresence mode="wait">
          {view==="courses"&&<motion.div key="c" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><CoursesPanel student={student} update={setStudent} toast={showToast}/></motion.div>}
          {view==="grades"&&<motion.div key="g" initial={{opacity:0,y:18}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}}><GradesPanel student={student}/></motion.div>}
        </AnimatePresence>
      </motion.div>}</AnimatePresence>
    </div>
  );
}

function StudentProfile({student}){
  const st=getAcademicStanding(student.gpa);
  const init=student.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase();
  const passed=student.completedCourses?.filter(c=>c.total>=60).length||0;
  const failed=student.failedCourses?.length||0;
  const reg=student.registeredCourses?.length||0;
  return(
    <motion.div className={styles.profile} variants={fadeUp} initial="hidden" animate="show">
      <div className={styles.profileAccentBar} style={{background:`linear-gradient(90deg,${st.color}50,${YEAR_COLORS[student.year]||"#818cf8"}30,transparent)`}}/>
      <div className={styles.profileMain}>
        <motion.div className={styles.avatar} style={{background:`linear-gradient(135deg,${st.color}cc,${st.color}66)`}} initial={{scale:0.6,opacity:0}} animate={{scale:1,opacity:1}} transition={{type:"spring",stiffness:300,damping:20,delay:0.08}}>
          <span className={styles.avatarLetters}>{init}</span>
          <motion.div className={styles.avatarRing} style={{borderColor:`${st.color}50`}} animate={{scale:[1,1.18,1],opacity:[0.5,0.1,0.5]}} transition={{duration:2.6,repeat:Infinity,ease:"easeInOut"}}/>
        </motion.div>
        <div className={styles.profileInfo}>
          <h2 className={styles.profileName}>{student.name}</h2>
          <div className={styles.profileMeta}>
            <span className={styles.profileId}>{student.id}</span>
            <span className={styles.sep}>·</span>
            <span style={{color:YEAR_COLORS[student.year]||"#818cf8",fontWeight:700}}>{YEAR_LABELS[student.year]}</span>
            <span className={styles.sep}>·</span>
            <span>{student.dept}</span>
          </div>
          <div className={styles.profileContact}>{student.email}{student.phone&&<> · {student.phone}</>}</div>
          <div className={styles.standingPill} style={{color:st.color,background:st.bg,borderColor:st.border}}>
            <span className={styles.standingDot} style={{background:st.color}}/>
            {st.label} — {st.maxCredits} hrs/semester
            {st.mustRetakeFirst&&<span className={styles.standingWarnTag}> ⚠ Must retake failed first</span>}
          </div>
        </div>
        <div className={styles.profileStats}>
          {[{v:student.gpa?.toFixed(2)||"—",l:"Cumulative GPA",c:st.color},{v:student.totalCreditsEarned||0,l:"Credits Earned",c:"#818cf8"},{v:reg,l:"This Semester",c:"#22c55e"},{v:passed,l:"Passed",c:"#14b8a6"},{v:failed,l:"Need Retake",c:failed>0?"#ef4444":"#6b7280"}].map((s,i)=>(
            <motion.div key={s.l} className={styles.statBox} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:0.12+i*0.06}}>
              <span className={styles.statVal} style={{color:s.c}}>{s.v}</span>
              <span className={styles.statLbl}>{s.l}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function NavCard({icon,color,title,desc,badge,badgeLabel,onClick}){
  return(
    <motion.button className={styles.navCard} style={{"--nc":color}} onClick={onClick} whileHover={{y:-6,boxShadow:"0 20px 48px rgba(0,0,0,0.14)"}} whileTap={{scale:0.98}}>
      <div className={styles.navCardIcon} style={{background:`${color}14`,color}}>{icon}</div>
      <div className={styles.navCardBody}><div className={styles.navCardTitle}>{title}</div><div className={styles.navCardDesc}>{desc}</div></div>
      <div className={styles.navCardBadge} style={{color,background:`${color}12`,borderColor:`${color}25`}}><span className={styles.navBadgeNum}>{badge}</span><span className={styles.navBadgeLbl}>{badgeLabel}</span></div>
      <span className={styles.navCardArrow} style={{color}}>→</span>
    </motion.button>
  );
}

function CoursesPanel({student,update,toast}){
  const[addOpen,setAddOpen]=useState(false);
  const[addSearch,setAddSearch]=useState("");
  const[hovered,setHovered]=useState(null);
  const st=getAcademicStanding(student.gpa);
  const max=student.adminMaxCredits||st.maxCredits;
  const regCourses=useMemo(()=>(student.registeredCourses||[]).map(code=>COURSE_DB.find(c=>c.code===code)).filter(Boolean),[student]);
  const used=regCourses.reduce((s,c)=>s+c.credits,0);
  const pct=Math.min(100,Math.round((used/max)*100));
  const allStatus=useMemo(()=>COURSE_DB.map(c=>({...c,status:getCourseStatus(c,student)})),[student]);
  const addable=useMemo(()=>{let l=allStatus.filter(c=>!["registered","completed"].includes(c.status));if(addSearch.trim()){const q=addSearch.toLowerCase();l=l.filter(c=>c.name.toLowerCase().includes(q)||c.code.toLowerCase().includes(q));}return l.slice(0,24);},[allStatus,addSearch]);
  const drop=code=>{update({...student,registeredCourses:student.registeredCourses.filter(c=>c!==code)});toast(`Dropped ${code}`,"info");};
  const lockCourse=code=>{update({...student,adminLocked:[...(student.adminLocked||[]),code],adminUnlocked:(student.adminUnlocked||[]).filter(c=>c!==code),registeredCourses:student.registeredCourses.filter(c=>c!==code)});toast(`${code} locked`,"info");};
  const forceAdd=code=>{update({...student,registeredCourses:[...(student.registeredCourses||[]),code],adminUnlocked:[...(student.adminUnlocked||[]),code]});setAddOpen(false);toast(`${code} added ✓`);};
  const sColor=s=>({available:"#22c55e",locked:"#f59e0b",failed:"#ef4444",unavailable:"#6b7280"}[s]||"#818cf8");
  return(
    <div className={styles.coursesPanel}>
      <AnimatePresence>{addOpen&&(
        <motion.div className={styles.overlay} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setAddOpen(false)}>
          <motion.div className={styles.addModal} initial={{scale:0.88,y:24,opacity:0}} animate={{scale:1,y:0,opacity:1}} exit={{scale:0.9,opacity:0}} transition={{type:"spring",stiffness:360,damping:26}} onClick={e=>e.stopPropagation()}>
            <div className={styles.addModalHead}>
              <div><h3 className={styles.addModalTitle}>Add Course for Student</h3><p className={styles.addModalSub}>Course will be available for student to register</p></div>
              <button className={styles.addModalClose} onClick={()=>setAddOpen(false)}>{SVG.close}</button>
            </div>
            <div className={styles.addModalSearch}>{SVG.search}<input className={styles.addModalIn} placeholder="Search courses…" autoFocus value={addSearch} onChange={e=>setAddSearch(e.target.value)}/></div>
            <div className={styles.addModalList}>
              {addable.map(c=>(
                <motion.div key={c.code} className={styles.addModalRow} whileHover={{background:"var(--hover-bg)"}}>
                  <div className={styles.addRowLeft}>
                    <span className={styles.addRowCode} style={{color:c.color||"var(--accent)"}}>{c.code}</span>
                    <div><div className={styles.addRowName}>{c.name}</div><div className={styles.addRowMeta}>{c.credits}hrs · Year {c.year}{c.prereqs?.length>0&&` · Req: ${c.prereqs.join(", ")}`}</div></div>
                  </div>
                  <div className={styles.addRowRight}>
                    <span className={styles.addRowStatus} style={{color:sColor(c.status),background:`${sColor(c.status)}12`}}>{c.status}</span>
                    <motion.button className={styles.addRowBtn} onClick={()=>forceAdd(c.code)} whileHover={{scale:1.04}} whileTap={{scale:0.95}}>{SVG.plus}{c.status==="locked"?"Force Add":"Add"}</motion.button>
                  </div>
                </motion.div>
              ))}
              {addable.length===0&&<div className={styles.addEmpty}>{SVG.info} No courses match</div>}
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
      <div className={styles.credBar}>
        <div className={styles.credBarRow}>
          <div><span className={styles.credUsed} style={{color:pct>=90?"#ef4444":pct>=70?"#f59e0b":"var(--accent)"}}>{used}</span><span className={styles.credMax}>/ {max} credit hours</span></div>
          <div className={styles.credBarRight}><span className={styles.credStanding} style={{color:st.color}}>{st.label}</span><motion.button className={styles.addBtn} onClick={()=>setAddOpen(true)} whileHover={{scale:1.03}} whileTap={{scale:0.97}}>{SVG.plus} Add Course</motion.button></div>
        </div>
        <div className={styles.credTrack}><motion.div className={styles.credFill} initial={{width:0}} animate={{width:`${pct}%`}} transition={{duration:1.1,ease:[0.22,1,0.36,1]}} style={{background:pct>=90?"#ef4444":pct>=70?"#f59e0b":"var(--accent)"}}/></div>
        <div className={styles.credNote}>{max-used} hrs remaining · {st.rule}</div>
      </div>
      {st.mustRetakeFirst&&<div className={styles.warnBanner} style={{borderColor:st.border,background:st.bg}}><span style={{color:st.color}}>{SVG.warn}</span><span style={{color:st.color}}><strong>{st.label}:</strong> {st.rule}</span></div>}
      {regCourses.length===0?<div className={styles.noCoursesMsg}>{SVG.info}<span>No courses registered. Use <strong>Add Course</strong> above.</span></div>:(
        <motion.div className={styles.courseCardGrid} initial="hidden" animate="show" variants={{show:{transition:{staggerChildren:0.05}}}}>
          {regCourses.map(course=>(
            <motion.article key={course.code} className={styles.adminCard} variants={fadeUp} whileHover={{y:-5}} onHoverStart={()=>setHovered(course.code)} onHoverEnd={()=>setHovered(null)}>
              <div className={styles.adminCover} style={{background:course.color,backgroundImage:getPatBg(course.pattern||"mosaic",course.color||"#818cf8"),backgroundSize:"64px 64px"}}>
                <div className={styles.adminCoverDark}/>
                <div className={styles.adminCoverTop}><span className={styles.adminCode}>{course.code}</span><span className={styles.adminCr}>{course.credits} cr</span></div>
                <AnimatePresence>{hovered===course.code&&<motion.div className={styles.adminActions} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <motion.button className={styles.adminActBtn} style={{color:"#ef4444"}} onClick={()=>drop(course.code)} whileTap={{scale:0.88}} title="Drop">{SVG.trash}</motion.button>
                  <motion.button className={styles.adminActBtn} style={{color:"#f59e0b"}} onClick={()=>lockCourse(course.code)} whileTap={{scale:0.88}} title="Lock">{SVG.lock}</motion.button>
                </motion.div>}</AnimatePresence>
                <div className={styles.adminCoverBot}>
                  <span className={styles.adminTypeBadge}>{course.type==="mandatory"?"Mandatory":"Elective"}</span>
                  <span className={styles.enrolledBadge}><span style={{background:"#22c55e",width:6,height:6,borderRadius:"50%",display:"inline-block"}}/> Enrolled</span>
                </div>
              </div>
              <div className={styles.adminCardBody}>
                <h3 className={styles.adminCardName}>{course.name}</h3>
                <div className={styles.adminCardMeta}><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>{course.instructor}</div>
                {course.prereqs?.length>0&&<div className={styles.adminCardPrereq}><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>Requires: {course.prereqs.join(", ")}</div>}
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </div>
  );
}

function GradesPanel({student}){
  const[openYear,setOpenYear]=useState(null);
  const byYear=useMemo(()=>{const y={};(student.completedCourses||[]).forEach(e=>{const yr=e.year||1;const sm=e.semester||1;if(!y[yr])y[yr]={};if(!y[yr][sm])y[yr][sm]=[];const info=COURSE_DB.find(c=>c.code===e.code)||{};y[yr][sm].push({...e,...info,name:info.name||e.code});});return y;},[student]);
  function semGPA(cs){const pts=cs.reduce((s,c)=>s+getGPAPoints(c.total)*(c.credits||3),0);const h=cs.reduce((s,c)=>s+(c.credits||3),0);return h>0?(pts/h).toFixed(2):"—";}
  const years=Object.keys(byYear).map(Number).sort();
  if(!years.length)return<div className={styles.gradesEmpty}>{SVG.info} No academic records found</div>;
  return(
    <div className={styles.gradesPanel}>
      <div className={styles.gpaCard}>
        <div className={styles.gpaCardLeft}><div className={styles.gpaCardVal} style={{color:getAcademicStanding(student.gpa).color}}>{student.gpa?.toFixed(2)||"N/A"}</div><div className={styles.gpaCardLbl}>Cumulative GPA</div></div>
        <div className={styles.gpaCardYears}>{years.map(yr=>{const all=Object.values(byYear[yr]).flat();return(<div key={yr} className={styles.gpaYearItem}><span className={styles.gpaYearVal} style={{color:YEAR_COLORS[yr]}}>{semGPA(all)}</span><span className={styles.gpaYearLbl}>Year {yr}</span></div>);})}</div>
      </div>
      {years.map(yr=>{
        const yd=byYear[yr];const sems=Object.keys(yd).map(Number).sort();const all=sems.flatMap(s=>yd[s]);const yg=semGPA(all);const isOpen=openYear===yr;
        return(
          <motion.div key={yr} className={styles.yearBlock} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} transition={{delay:yr*0.06}}>
            <button className={`${styles.yearHead} ${isOpen?styles.yearHeadOpen:""}`} style={{"--yc":YEAR_COLORS[yr]}} onClick={()=>setOpenYear(isOpen?null:yr)}>
              <div className={styles.yearHeadL}><span className={styles.yearDot} style={{background:YEAR_COLORS[yr]}}/><span className={styles.yearLabel}>{YEAR_LABELS[yr]}</span><span className={styles.yearCount}>{all.length} courses · {all.reduce((s,c)=>s+(c.credits||3),0)} hrs</span></div>
              <div className={styles.yearHeadR}><span className={styles.yearGPA} style={{color:YEAR_COLORS[yr]}}>GPA {yg}</span><span className={`${styles.yearChev} ${isOpen?styles.yearChevOpen:""}`}>›</span></div>
            </button>
            <AnimatePresence>{isOpen&&<motion.div className={styles.semsWrap} initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
              {sems.map(sm=>{const cs=yd[sm];return(
                <div key={sm} className={styles.semBlock}>
                  <div className={styles.semHead}><span className={styles.semLabel}>Semester {sm}</span><span className={styles.semMeta}>{cs.reduce((s,c)=>s+(c.credits||3),0)} hrs · GPA {semGPA(cs)}</span></div>
                  <div className={styles.gradeTable}>
                    <div className={styles.gradeHead}><span>Code</span><span>Course</span><span>Hrs</span><span>Score</span><span>Grade</span></div>
                    {cs.map(c=>{const gr=getGradeFromTotal(c.total);const gc=gradeColor(c.total);return(
                      <motion.div key={`${c.code}-${sm}`} className={`${styles.gradeRow} ${c.total<60?styles.gradeRowFail:""}`} initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}}>
                        <span className={styles.gradeCode} style={{color:c.color||"var(--accent)"}}>{c.code}</span>
                        <span className={styles.gradeName}>{c.name}</span>
                        <span className={styles.gradeHrs}>{c.credits||3}</span>
                        <span className={styles.gradeScore} style={{color:gc}}>{c.total}</span>
                        <span className={styles.gradeGrade} style={{color:gc,background:`${gc}14`,borderColor:`${gc}28`}}>{gr}</span>
                      </motion.div>
                    );})}
                  </div>
                </div>
              );})}
            </motion.div>}</AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
