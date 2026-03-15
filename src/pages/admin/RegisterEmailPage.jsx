// src/pages/admin/RegisterEmailPage.jsx — Full redesign: Split Panel Layout
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./RegisterEmailPage.module.css";

const DOMAIN = "@akhbaracademy.edu.eg";

const ROLES = [
  { key:"student",    label:"Student",    prefix:"cs",  icon:"🎓", color:"#818cf8", dark:"#4338ca", bg:"linear-gradient(135deg,#4338ca,#818cf8)" },
  { key:"instructor", label:"Instructor", prefix:"dr",  icon:"🏛",  color:"#22c55e", dark:"#15803d", bg:"linear-gradient(135deg,#15803d,#22c55e)" },
  { key:"admin",      label:"Admin",      prefix:"adm", icon:"⚡",  color:"#f59e0b", dark:"#b45309", bg:"linear-gradient(135deg,#b45309,#f59e0b)" },
];

const MOCK_DB_INIT = [
  { id:1, code:"2203119", firstName:"Ahmed",  lastName:"Mohamed", role:"student",    active:true,  createdAt:"2024-09-01", password:"Xk9@p2mR12" },
  { id:2, code:"2203120", firstName:"Sara",   lastName:"Khaled",  role:"student",    active:false, createdAt:"2024-09-01", password:"Nm7#q4xW88" },
  { id:3, code:"2203121", firstName:"Omar",   lastName:"Hassan",  role:"student",    active:true,  createdAt:"2024-09-02", password:"Bp3$t8yV77" },
  { id:4, code:"2203122", firstName:"Ismail", lastName:"Said",    role:"student",    active:true,  createdAt:"2026-03-14", password:"Is@mail55" },
  { id:5, code:"INS001",  firstName:"Sara",   lastName:"Mahmoud", role:"instructor", active:true,  createdAt:"2024-09-01", password:"Dr@sara01X" },
  { id:6, code:"ADM001",  firstName:"Ahmed",  lastName:"Hassan",  role:"admin",      active:true,  createdAt:"2024-09-01", password:"Adm!nX22Z" },
  { id:7, code:"2203123", firstName:"Nour",   lastName:"Ibrahim", role:"student",    active:false, createdAt:"2024-09-03", password:"Nu9!rIb44" },
];

function buildEmail(role, code, firstName, lastName) {
  const clean = s => s.trim().replace(/\s+/g,"").replace(/[^a-zA-Z0-9]/g,"");
  const r = ROLES.find(x=>x.key===role) || ROLES[0];
  const f=clean(firstName), l=clean(lastName), c=clean(code);
  if (!c||!f||!l) return "";
  return `${r.prefix}-${c}${f}${l}${DOMAIN}`;
}
function genPwd() {
  const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMN23456789@#$!";
  return Array.from({length:14},()=>chars[Math.floor(Math.random()*chars.length)]).join("");
}

/* ── Icons ── */
const I = {
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  key:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="17" r="4"/><path d="M10.8 13.2L20 4"/><path d="M18 6l2 2"/><path d="M15 7l2 2"/></svg>,
  trash:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
  pause:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>,
  play:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
  copy:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>,
  close:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  eye:    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  eyeoff: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>,
  plus:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  back:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>,
  spark:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>,
  check:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>,
  warn:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  mail:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

const sp = { type:"spring", stiffness:400, damping:28 };

/* ═══════════════════════════════════════
   ENVELOPE SCENE
═══════════════════════════════════════ */
function EnvelopeScene({ roleColor }) {
  return (
    <motion.div className={styles.envScene}>
      <motion.div className={styles.envWrap}
        initial={{ scale:0.2, opacity:0, y:80, rotate:-8 }}
        animate={{
          scale:   [0.2, 1.08, 1, 1, 0.4],
          opacity: [0,   1,    1, 1, 0],
          y:       [80,  0,    0, -10, -90],
          x:       [0,   0,    0, 0,   420],
          rotate:  [-8,  0,    0, 0,   16],
        }}
        transition={{ duration:1.8, times:[0,.22,.32,.55,1], ease:"easeInOut" }}>
        <svg viewBox="0 0 200 136" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.envSvg}>
          <defs>
            <linearGradient id="eg" x1="0" y1="0" x2="200" y2="136" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4338ca"/><stop offset="100%" stopColor="#6366f1"/>
            </linearGradient>
          </defs>
          <ellipse cx="100" cy="130" rx="60" ry="6" fill="rgba(0,0,0,0.2)"/>
          <rect x="8" y="24" width="184" height="100" rx="14" fill="url(#eg)"/>
          <rect x="8" y="24" width="184" height="44" rx="14" fill="rgba(255,255,255,0.08)"/>
          <path d="M8 36 L100 84 L192 36" stroke="rgba(255,255,255,0.25)" strokeWidth="2.5" fill="none" strokeLinejoin="round"/>
          <path d="M8 124 L68 80" stroke="rgba(255,255,255,0.18)" strokeWidth="2"/>
          <path d="M192 124 L132 80" stroke="rgba(255,255,255,0.18)" strokeWidth="2"/>
          <motion.g initial={{y:20,opacity:0}} animate={{y:[20,0],opacity:[0,1]}} transition={{delay:.3,duration:.3}}>
            <rect x="62" y="10" width="76" height="54" rx="6" fill="white" opacity="0.95"/>
            <rect x="70" y="20" width="60" height="4" rx="2" fill={roleColor} opacity="0.7"/>
            <rect x="70" y="30" width="44" height="3" rx="1.5" fill="rgba(0,0,0,0.15)"/>
            <rect x="70" y="38" width="50" height="3" rx="1.5" fill="rgba(0,0,0,0.1)"/>
          </motion.g>
          <circle cx="100" cy="68" r="22" fill={roleColor}/>
          <text x="100" y="75" textAnchor="middle" fill="white" fontSize="20" fontWeight="900" fontFamily="monospace">@</text>
          <motion.circle cx="34" cy="30" r="4" fill="#fbbf24" animate={{scale:[0,1.2,1],opacity:[0,1,.8]}} transition={{delay:.35,duration:.4}}/>
          <motion.circle cx="166" cy="34" r="3.5" fill="#34d399" animate={{scale:[0,1.2,1],opacity:[0,1,.8]}} transition={{delay:.45,duration:.4}}/>
          <motion.circle cx="172" cy="100" r="3" fill="#f87171" animate={{scale:[0,1.2,1],opacity:[0,1,.7]}} transition={{delay:.55,duration:.4}}/>
        </svg>
        <motion.div className={styles.envCheck}
          initial={{scale:0,opacity:0}} animate={{scale:1,opacity:1}}
          transition={{delay:.45,type:"spring",stiffness:520,damping:22}}>✓</motion.div>
      </motion.div>
      <motion.p className={styles.envText} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:.28}}>
        Creating account…
      </motion.p>
    </motion.div>
  );
}

/* ═══════════════════════════════════════
   MAIN PAGE
═══════════════════════════════════════ */
export default function RegisterEmailPage() {
  const [db,         setDb]         = useState(MOCK_DB_INIT);
  const [search,     setSearch]     = useState("");
  const [result,     setResult]     = useState(null);
  const [mode,       setMode]       = useState("home"); // home|found|notfound|changepwd|confirmdelete|create
  const [activeTab,  setActiveTab]  = useState("overview"); // overview|password|danger
  const [activeRole, setActiveRole] = useState(null); // sidebar filter
  const [createStep, setCreateStep] = useState(1);
  const [createRole, setCreateRole] = useState("student");
  const [form,       setForm]       = useState({code:"",firstName:"",lastName:"",password:""});
  const [newPwd,     setNewPwd]     = useState("");
  const [showPwd,    setShowPwd]    = useState(false);
  const [copied,     setCopied]     = useState(null);
  const [toast,      setToast]      = useState(null);
  const [emailAnim,  setEmailAnim]  = useState(false);
  const [sideSearch, setSideSearch] = useState("");
  const inputRef = useRef(null);

  useEffect(()=>{ if(mode==="home") inputRef.current?.focus(); },[mode]);

  const showToast=(msg,type="ok")=>{ setToast({msg,type}); setTimeout(()=>setToast(null),2800); };
  const copyText=(text,id)=>{ navigator.clipboard?.writeText(text).catch(()=>{}); setCopied(id); setTimeout(()=>setCopied(null),1600); showToast("Copied ✓"); };

  const doSearch=()=>{
    const q=search.trim().toUpperCase(); if(!q) return;
    const found=db.find(e=>e.code.toUpperCase()===q);
    setResult(found||null); setMode(found?"found":"notfound"); setActiveTab("overview"); setActiveRole(null);
  };

  const toggle=(entry)=>{
    const u={...entry,active:!entry.active};
    setDb(p=>p.map(e=>e.id===entry.id?u:e));
    if(result?.id===entry.id) setResult(u);
    showToast(u.active?"Account activated ✓":"Account suspended");
  };

  const del=()=>{
    setDb(p=>p.filter(e=>e.id!==result.id));
    setResult(null); setMode("home"); setSearch(""); setActiveRole(null);
    showToast("Account deleted");
  };

  const savePwd=()=>{
    if(!newPwd.trim()) return;
    const u={...result,password:newPwd};
    setDb(p=>p.map(e=>e.id===result.id?u:e));
    setResult(u); setMode("found"); setActiveTab("overview"); setNewPwd(""); setShowPwd(false);
    showToast("Password updated ✓");
  };

  const create=()=>{
    const {code,firstName,lastName,password}=form;
    if(!code.trim()||!firstName.trim()||!lastName.trim()||!password.trim()) return;
    const entry={id:Date.now(),code:code.trim(),firstName:firstName.trim(),lastName:lastName.trim(),role:createRole,active:true,createdAt:new Date().toISOString().split("T")[0],password:password.trim()};
    setDb(p=>[entry,...p]);
    setEmailAnim(true);
    setTimeout(()=>{ setEmailAnim(false); setResult(entry); setMode("found"); setSearch(entry.code); setActiveTab("overview"); setForm({code:"",firstName:"",lastName:"",password:""}); setCreateStep(1); setActiveRole(null); showToast("Account created successfully ✓"); }, 2000);
  };

  /* Sidebar list */
  const sideList = useMemo(()=>{
    let list = [...db];
    if(activeRole) list = list.filter(e=>activeRole==="suspended"?!e.active:e.role===activeRole);
    if(sideSearch.trim()) {
      const q = sideSearch.trim().toLowerCase();
      list = list.filter(e=>
        e.firstName.toLowerCase().includes(q) ||
        e.lastName.toLowerCase().includes(q)  ||
        e.code.toLowerCase().includes(q)
      );
    }
    return list; // no limit
  },[db,activeRole,sideSearch]);

  const stats = [
    { key:"student",    label:"Students",    n:db.filter(e=>e.role==="student").length,    c:"#818cf8", bg:"linear-gradient(135deg,#4338ca,#818cf8)" },
    { key:"instructor", label:"Instructors", n:db.filter(e=>e.role==="instructor").length, c:"#22c55e", bg:"linear-gradient(135deg,#15803d,#22c55e)" },
    { key:"admin",      label:"Admins",      n:db.filter(e=>e.role==="admin").length,      c:"#f59e0b", bg:"linear-gradient(135deg,#b45309,#f59e0b)" },
    { key:"suspended",  label:"Suspended",   n:db.filter(e=>!e.active).length,             c:"#ef4444", bg:"linear-gradient(135deg,#991b1b,#ef4444)" },
  ];

  const email     = result ? buildEmail(result.role,result.code,result.firstName,result.lastName) : "";
  const roleData  = ROLES.find(r=>r.key===result?.role)||ROLES[0];
  const prevEmail = buildEmail(createRole,form.code,form.firstName,form.lastName);

  return (
    <div className={styles.page}>

      {/* Toast */}
      <AnimatePresence>
        {toast&&(
          <motion.div className={`${styles.toast} ${toast.type==="ok"?styles.toastOk:styles.toastErr}`}
            initial={{opacity:0,y:-28,x:"-50%",scale:.9}} animate={{opacity:1,y:0,x:"-50%",scale:1}}
            exit={{opacity:0,y:-16,x:"-50%"}} transition={sp}>
            <span className={styles.toastDot}/>{toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ TOP NAV BAR — compact branding only ════ */}
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          {/* Keep the @ icon */}
          <div className={styles.atBadge}>
            <span>@</span>
            <div className={styles.atBadgeRing}/>
          </div>
          <div>
            <h1 className={styles.topBarTitle}>Email Manager</h1>
            <p className={styles.topBarDomain}>{DOMAIN.slice(1)}</p>
          </div>
        </div>
        <motion.button className={styles.newAccBtn}
          onClick={()=>{setMode("create");setCreateStep(1);setActiveRole(null);}}
          whileHover={{scale:1.04}} whileTap={{scale:.96}}>
          <span className={styles.newAccBtnIcon}>{I.plus}</span>
          New Account
        </motion.button>
      </div>

      {/* ════ SPLIT LAYOUT ════ */}
      <div className={styles.split}>

        {/* ══ LEFT SIDEBAR ══ */}
        <aside className={styles.sidebar}>

          {/* Stat cards — 2×2 grid */}
          <div className={styles.statsGrid}>
            {stats.map((s,i)=>(
              <motion.button key={s.key}
                className={`${styles.statCard} ${activeRole===s.key?styles.statCardOn:""}`}
                style={{background:activeRole===s.key?s.bg:undefined}}
                onClick={()=>setActiveRole(p=>p===s.key?null:s.key)}
                initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                transition={{delay:i*.06,...sp}}
                whileHover={{y:-4,scale:1.04}} whileTap={{scale:.97}}>
                <span className={styles.statCardN} style={activeRole===s.key?{color:"#fff"}:{color:s.c}}>{s.n}</span>
                <span className={styles.statCardL} style={activeRole===s.key?{color:"rgba(255,255,255,.8)"}:{}}>{s.label}</span>
                {activeRole===s.key&&<span className={styles.statCardCheck}>✓</span>}
              </motion.button>
            ))}
          </div>

          {/* Recent accounts mini list */}
          <div className={styles.sideListWrap}>
            {/* Sidebar search */}
            <div className={styles.sideSearch}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className={styles.sideSearchIco}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input className={styles.sideSearchInp}
                value={sideSearch}
                onChange={e=>setSideSearch(e.target.value)}
                placeholder="Search name or code…"/>
              {sideSearch&&<button className={styles.sideSearchClear} onClick={()=>setSideSearch("")}>✕</button>}
            </div>
            <div className={styles.sideListHead}>
              <span>{activeRole ? stats.find(s=>s.key===activeRole)?.label||"Filtered" : "All Accounts"}</span>
              <span className={styles.sideListCount}>{sideList.length}</span>
            </div>
            <div className={styles.sideList}>
              {sideList.map((acc,i)=>{
                const r=ROLES.find(x=>x.key===acc.role)||ROLES[0];
                const isActive = result?.id===acc.id;
                return (
                  <motion.button key={acc.id}
                    className={`${styles.sideItem} ${isActive?styles.sideItemActive:""}`}
                    style={isActive?{borderColor:r.color,background:`${r.color}0f`}:{}}
                    onClick={()=>{ setResult(acc); setMode("found"); setSearch(acc.code); setActiveTab("overview"); }}
                    initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}}
                    transition={{delay:i*.04,...sp}}
                    whileHover={{x:4}}>
                    <div className={styles.sideItemAvatar} style={{background:r.bg}}>
                      {acc.firstName[0]}{acc.lastName[0]}
                      {!acc.active&&<div className={styles.sideItemBan}/>}
                    </div>
                    <div className={styles.sideItemInfo}>
                      <span className={styles.sideItemName}>{acc.firstName} {acc.lastName}</span>
                      <span className={styles.sideItemCode} style={{color:r.color}}>#{acc.code}</span>
                    </div>
                    <div className={styles.sideItemRole} style={{background:`${r.color}18`,color:r.color}}>{r.icon}</div>
                  </motion.button>
                );
              })}
              {sideList.length===0&&(
                <div className={styles.sideEmpty}>No accounts</div>
              )}
            </div>
          </div>
        </aside>

        {/* ══ MAIN PANEL ══ */}
        <main className={styles.main}>

          {/* Search bar */}
          <div className={styles.searchRow}>
            <div className={`${styles.searchBox} ${mode==="found"?styles.searchOk:mode==="notfound"?styles.searchErr:""}`}>
              <span className={styles.searchIco}>{I.search}</span>
              <input ref={inputRef} className={styles.searchInp}
                value={search} placeholder="Enter account code (e.g. 2203119)"
                onChange={e=>{setSearch(e.target.value);if(mode!=="home"){setMode("home");setResult(null);}}}
                onKeyDown={e=>e.key==="Enter"&&doSearch()} autoComplete="off" spellCheck={false}/>
              {search&&(
                <button className={styles.clearX} onClick={()=>{setSearch("");setMode("home");setResult(null);}}>
                  {I.close}
                </button>
              )}
            </div>
            <motion.button className={styles.searchGoBtn} onClick={doSearch} whileHover={{scale:1.04}} whileTap={{scale:.96}}>
              Search
            </motion.button>
          </div>

          {/* Format hints */}
          <div className={styles.fmtHints}>
            {ROLES.map(r=>(
              <span key={r.key} className={styles.fmtHint}>
                <span style={{color:r.color,fontWeight:800}}>{r.prefix}-</span>
                <span>code·Name@domain</span>
              </span>
            ))}
          </div>

          {/* Content area */}
          <div className={styles.contentBox}>
            <AnimatePresence mode="wait">

              {/* ── HOME ── */}
              {mode==="home"&&(
                <motion.div key="home" className={styles.homePane}
                  initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} exit={{opacity:0}}>
                  <div className={styles.homeIllusWrap}>
                    <svg viewBox="0 0 120 88" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.homeIllusSvg}>
                      <ellipse cx="60" cy="84" rx="36" ry="4" fill="var(--border)" opacity="0.5"/>
                      <rect x="8" y="16" width="104" height="64" rx="10" fill="var(--card-bg)" stroke="var(--border)" strokeWidth="2"/>
                      <path d="M8 26 L60 54 L112 26" stroke="var(--border)" strokeWidth="2" fill="none" strokeLinejoin="round"/>
                      <path d="M8 80 L42 52" stroke="var(--border)" strokeWidth="1.5" opacity="0.5"/>
                      <path d="M112 80 L78 52" stroke="var(--border)" strokeWidth="1.5" opacity="0.5"/>
                      <circle cx="60" cy="38" r="14" fill="#818cf8"/>
                      <text x="60" y="43" textAnchor="middle" fill="white" fontSize="14" fontWeight="900" fontFamily="monospace">@</text>
                      <circle cx="28" cy="70" r="5" fill="#818cf8" opacity="0.7"/>
                      <circle cx="60" cy="74" r="4" fill="#22c55e" opacity="0.7"/>
                      <circle cx="92" cy="70" r="5" fill="#f59e0b" opacity="0.7"/>
                    </svg>
                  </div>
                  <h2 className={styles.homeTitle}>Search an account</h2>
                  <p className={styles.homeSub}>Type a code above or click any account on the left sidebar</p>
                  <div className={styles.homeSamples}>
                    {["2203119","INS001","ADM001","2203122"].map(c=>(
                      <button key={c} className={styles.sampleBtn} onClick={()=>setSearch(c)}>{c}</button>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* ── NOT FOUND ── */}
              {mode==="notfound"&&(
                <motion.div key="nf" className={styles.notFoundPane}
                  initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                  <motion.div className={styles.nfIconWrap}
                    animate={{rotate:[0,-10,10,-5,5,0]}} transition={{duration:.6,delay:.1}}>
                    {I.warn}
                  </motion.div>
                  <h3 className={styles.nfTitle}>No account found for <strong>"{search}"</strong></h3>
                  <p className={styles.nfSub}>Would you like to create a new account with this code?</p>
                  <motion.button className={styles.nfCreateBtn}
                    onClick={()=>{setForm(p=>({...p,code:search}));setMode("create");setCreateStep(2);setCreateRole("student");}}
                    whileHover={{scale:1.03,y:-2}} whileTap={{scale:.97}}>
                    {I.plus} Create account for "{search}"
                  </motion.button>
                </motion.div>
              )}

              {/* ── FOUND — NEW TAB-BASED LAYOUT ── */}
              {mode==="found"&&result&&(
                <motion.div key={`found-${result.id}`} className={styles.foundPane}
                  initial={{opacity:0,x:24,scale:.97}} animate={{opacity:1,x:0,scale:1}}
                  exit={{opacity:0,x:-16}} transition={{...sp}}>

                  {/* Account identity strip — solid colored */}
                  <div className={styles.idStrip} style={{background:roleData.bg}}>
                    <div className={styles.idStripAvatar}>
                      {result.firstName[0]}{result.lastName[0]}
                      {!result.active&&<div className={styles.idStripBan}/>}
                    </div>
                    <div className={styles.idStripInfo}>
                      <span className={styles.idName}>{result.firstName} {result.lastName}</span>
                      <span className={styles.idMeta}>
                        {roleData.icon} {roleData.label} · #{result.code} · {result.createdAt}
                      </span>
                    </div>
                    <div className={styles.idStripRight}>
                      <button
                        className={`${styles.idStatusBtn} ${result.active?styles.idStatusActive:styles.idStatusSuspended}`}
                        onClick={()=>toggle(result)}>
                        <span className={styles.idStatusDot}/>
                        {result.active?"Active":"Suspended"}
                      </button>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className={styles.tabsRow}>
                    {[
                      {k:"overview", label:"📧 Overview"},
                      {k:"password", label:"🔑 Password"},
                      {k:"danger",   label:"⚠️ Danger Zone"},
                    ].map(t=>(
                      <button key={t.k}
                        className={`${styles.tab} ${activeTab===t.k?styles.tabOn:""}`}
                        style={activeTab===t.k?{"--tc":t.k==="danger"?"#ef4444":roleData.color}:{}}
                        onClick={()=>setActiveTab(t.k)}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* Tab content */}
                  <AnimatePresence mode="wait">

                    {/* Overview tab */}
                    {activeTab==="overview"&&(
                      <motion.div key="ov" className={styles.tabContent}
                        initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>

                        {/* Email card */}
                        <div className={styles.emailCard}>
                          <div className={styles.emailCardIcon} style={{background:roleData.bg}}>
                            {I.mail}
                          </div>
                          <div className={styles.emailCardBody}>
                            <div className={styles.emailCardLabel}>Email Address</div>
                            <div className={styles.emailCardAddr}>
                              <span style={{color:roleData.color,fontWeight:900}}>{email.split("@")[0]}</span>
                              <span className={styles.emailCardAt}>@</span>
                              <span className={styles.emailCardDomain}>akhbaracademy.edu.eg</span>
                            </div>
                          </div>
                          <motion.button
                            className={`${styles.copyEmailBtn} ${copied===result.id?styles.copyEmailBtnDone:""}`}
                            style={copied===result.id?{}:{background:roleData.bg}}
                            onClick={()=>copyText(email,result.id)}
                            whileHover={{scale:1.06}} whileTap={{scale:.92}}>
                            <AnimatePresence mode="wait">
                              {copied===result.id
                                ? <motion.span key="y" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>{I.check}</motion.span>
                                : <motion.span key="n" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>{I.copy}</motion.span>
                              }
                            </AnimatePresence>
                            <span>{copied===result.id?"Copied!":"Copy"}</span>
                          </motion.button>
                        </div>

                        {/* Info grid */}
                        <div className={styles.infoGrid}>
                          {[
                            {l:"First Name", v:result.firstName},
                            {l:"Last Name",  v:result.lastName},
                            {l:"Code",       v:"#"+result.code, mono:true},
                            {l:"Role",       v:roleData.label},
                            {l:"Status",     v:result.active?"Active":"Suspended", c:result.active?"#22c55e":"#ef4444"},
                            {l:"Created",    v:result.createdAt},
                          ].map(item=>(
                            <div key={item.l} className={styles.infoCell}>
                              <span className={styles.infoCellLabel}>{item.l}</span>
                              <span className={styles.infoCellVal} style={{color:item.c||"var(--text-primary)",fontFamily:item.mono?"monospace":undefined}}>
                                {item.v}
                              </span>
                            </div>
                          ))}
                        </div>

                        {/* Quick action row */}
                        <div className={styles.quickActions}>
                          <motion.button className={styles.qaBtn} style={{background:"linear-gradient(135deg,#f59e0b,#fbbf24)"}}
                            onClick={()=>toggle(result)} whileHover={{scale:1.04,y:-2}} whileTap={{scale:.96}}>
                            <span>{result.active?I.pause:I.play}</span>
                            {result.active?"Suspend Account":"Activate Account"}
                          </motion.button>
                        </div>
                      </motion.div>
                    )}

                    {/* Password tab */}
                    {activeTab==="password"&&(
                      <motion.div key="pw" className={styles.tabContent}
                        initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                        <div className={styles.pwdSection}>
                          <h3 className={styles.pwdSectionTitle}>Change Password</h3>
                          <p className={styles.pwdSectionSub}>Set a new password for {result.firstName} {result.lastName}</p>

                          <div className={styles.pwdField} style={newPwd?{borderColor:`${roleData.color}60`}:{}}>
                            <input type={showPwd?"text":"password"} className={styles.pwdInput}
                              value={newPwd} onChange={e=>setNewPwd(e.target.value)}
                              placeholder="Enter new password" autoFocus/>
                            <button className={styles.pwdEye} onClick={()=>setShowPwd(p=>!p)}>
                              {showPwd?I.eyeoff:I.eye}
                            </button>
                          </div>

                          <motion.button className={styles.genBtn}
                            onClick={()=>setNewPwd(genPwd())} whileHover={{scale:1.02}} whileTap={{scale:.97}}>
                            {I.spark} Generate strong password
                          </motion.button>

                          <AnimatePresence>
                            {newPwd&&(
                              <motion.div className={styles.pwdPreview}
                                initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
                                <code className={styles.pwdPreviewCode}>{newPwd}</code>
                                <button className={styles.pwdPreviewCopy}
                                  onClick={()=>copyText(newPwd,"preview")}>{copied==="preview"?I.check:I.copy}</button>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          <div className={styles.pwdActions}>
                            <button className={styles.btnGhost} onClick={()=>setActiveTab("overview")}>Cancel</button>
                            <motion.button className={styles.btnSave}
                              style={{background:roleData.bg,opacity:newPwd.trim()?1:.4}}
                              disabled={!newPwd.trim()}
                              onClick={savePwd} whileHover={newPwd.trim()?{scale:1.02}:{}} whileTap={newPwd.trim()?{scale:.97}:{}}>
                              Save Password
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Danger tab */}
                    {activeTab==="danger"&&(
                      <motion.div key="dz" className={styles.tabContent}
                        initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} exit={{opacity:0}}>
                        <div className={styles.dangerZone}>
                          <div className={styles.dangerHeader}>
                            <div className={styles.dangerIcon}>{I.warn}</div>
                            <div>
                              <h3 className={styles.dangerTitle}>Danger Zone</h3>
                              <p className={styles.dangerSub}>These actions cannot be undone</p>
                            </div>
                          </div>

                          <div className={styles.dangerCard}>
                            <div className={styles.dangerCardLeft}>
                              <div className={styles.dangerCardTitle}>Delete Account</div>
                              <div className={styles.dangerCardSub}>
                                Permanently delete <strong>{buildEmail(result.role,result.code,result.firstName,result.lastName)}</strong> and all associated data.
                              </div>
                            </div>
                            <motion.button className={styles.dangerDeleteBtn}
                              onClick={del} whileHover={{scale:1.04}} whileTap={{scale:.96}}>
                              {I.trash} Delete Account
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                  </AnimatePresence>
                </motion.div>
              )}

              {/* ── CREATE ACCOUNT ── */}
              {mode==="create"&&(
                <motion.div key="create" className={styles.createPane}
                  initial={{opacity:0,x:40,scale:.97}} animate={{opacity:1,x:0,scale:1}}
                  exit={{opacity:0,x:-30,scale:.97}}
                  transition={{type:"spring",stiffness:340,damping:30}}>

                  <div className={styles.createWrap}>

                    {/* Left: dark sidebar */}
                    <div className={styles.createSidebar}>
                      <button className={styles.sideBackBtn}
                        onClick={()=>createStep===2?setCreateStep(1):setMode("home")}>
                        {I.back} {createStep===2?"Role":"Back"}
                      </button>

                      <div className={styles.createSideTitle}>New Account</div>

                      <div className={styles.vStepper}>
                        {[{n:1,label:"Account Type",desc:"Student, Instructor or Admin"},{n:2,label:"Account Details",desc:"Code, name & password"}].map((s,i)=>{
                          const on=createStep===s.n, done=createStep>s.n;
                          const rc=ROLES.find(r=>r.key===createRole);
                          return (
                            <div key={s.n} className={styles.vStepItem}>
                              {i>0&&<div className={styles.vStepLine}><div className={styles.vStepLineFill} style={{background:done||on?rc?.color:"rgba(255,255,255,.12)",height:done?"100%":on?"50%":"0%"}}/></div>}
                              <div className={styles.vStepRow}>
                                <div className={styles.vStepNum} style={on||done?{background:rc?.color,borderColor:rc?.color,color:"#fff",boxShadow:`0 4px 14px ${rc?.color}44`}:{}}>
                                  {done?<span style={{display:"flex"}}>{I.check}</span>:s.n}
                                </div>
                                <div className={styles.vStepText}>
                                  <div className={styles.vStepLabel} style={on?{color:"rgba(255,255,255,.95)"}:{}}>{s.label}</div>
                                  <div className={styles.vStepDesc}>{s.desc}</div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {createStep===2&&(()=>{
                        const rc=ROLES.find(r=>r.key===createRole);
                        return (
                          <div className={styles.createSideRole}>
                            <div className={styles.createSideRoleIcon} style={{background:rc?.bg}}>{rc?.icon}</div>
                            <div className={styles.createSideRoleName} style={{color:rc?.color}}>{rc?.label}</div>
                            <div className={styles.createSideRolePrefix}><code>{rc?.prefix}-</code>code·Name</div>
                          </div>
                        );
                      })()}
                    </div>

                    {/* Right: content */}
                    <div className={styles.createContent}>
                      <AnimatePresence mode="wait">

                        {/* Step 1 */}
                        {createStep===1&&(
                          <motion.div key="s1"
                            initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-18}}
                            transition={{type:"spring",stiffness:380,damping:28}}>
                            <h2 className={styles.createTitle}>Choose Account Type</h2>
                            <p className={styles.createSub}>Select the role for the new account</p>
                            <div className={styles.roleGrid}>
                              {ROLES.map((r,ri)=>{
                                const on=createRole===r.key;
                                return (
                                  <motion.button key={r.key}
                                    className={`${styles.roleCard} ${on?styles.roleCardOn:""}`}
                                    style={on?{background:r.bg,borderColor:r.color,boxShadow:`0 12px 36px ${r.color}44`}:{"--rc":r.color}}
                                    onClick={()=>setCreateRole(r.key)}
                                    initial={{opacity:0,y:16}} animate={{opacity:1,y:0}}
                                    transition={{delay:ri*.07,...sp}}
                                    whileHover={{y:-6}} whileTap={{scale:.97}}>
                                    <div className={styles.roleCardIconWrap}
                                      style={on?{background:"rgba(255,255,255,.2)",border:"2px solid rgba(255,255,255,.35)"}:{background:`${r.color}16`,border:`2px solid ${r.color}28`}}>
                                      <span className={styles.roleCardIcon}>{r.icon}</span>
                                    </div>
                                    <div className={styles.roleCardName} style={on?{color:"#fff"}:{}}>{r.label}</div>
                                    <div className={styles.roleCardPrefix} style={on?{color:"rgba(255,255,255,.7)"}:{color:r.color}}>
                                      <code>{r.prefix}-</code>code·Name
                                    </div>
                                    {on&&(
                                      <motion.div className={styles.roleCheck}
                                        initial={{scale:0}} animate={{scale:1}}
                                        transition={{type:"spring",stiffness:500,damping:20}}>
                                        {I.check}
                                      </motion.div>
                                    )}
                                  </motion.button>
                                );
                              })}
                            </div>
                            <motion.button className={styles.nextBtn}
                              style={{background:ROLES.find(r=>r.key===createRole)?.bg}}
                              onClick={()=>setCreateStep(2)}
                              whileHover={{scale:1.02,y:-2}} whileTap={{scale:.97}}>
                              Continue → Select {ROLES.find(r=>r.key===createRole)?.label}
                            </motion.button>
                          </motion.div>
                        )}

                        {/* Step 2 */}
                        {createStep===2&&(
                          <motion.div key="s2"
                            initial={{opacity:0,x:24}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-18}}
                            transition={{type:"spring",stiffness:380,damping:28}}>
                            <h2 className={styles.createTitle}>Account Details</h2>
                            <p className={styles.createSub}>Fill in the information for the new account</p>

                            {prevEmail&&(
                              <AnimatePresence>
                                <motion.div className={styles.livePreview}
                                  style={{borderColor:`${ROLES.find(r=>r.key===createRole)?.color}35`,background:`${ROLES.find(r=>r.key===createRole)?.color}08`}}
                                  initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
                                  <div className={styles.lpLeft}>
                                    <span className={styles.lpLabel}>Email Preview</span>
                                    <span className={styles.lpEmail} style={{color:ROLES.find(r=>r.key===createRole)?.color}}>{prevEmail}</span>
                                  </div>
                                  <span style={{color:ROLES.find(r=>r.key===createRole)?.color,display:"flex"}}>{I.check}</span>
                                </motion.div>
                              </AnimatePresence>
                            )}

                            <div className={styles.formGrid}>
                              <div className={styles.formField}>
                                <label className={styles.formLabel}>Code <span className={styles.req}>*</span></label>
                                <input className={styles.formInput} placeholder="e.g. 2203119" value={form.code} onChange={e=>setForm(p=>({...p,code:e.target.value}))} style={form.code?{borderColor:`${ROLES.find(r=>r.key===createRole)?.color}55`}:{}}/>
                              </div>
                              <div/>
                              <div className={styles.formField}>
                                <label className={styles.formLabel}>First Name <span className={styles.req}>*</span></label>
                                <input className={styles.formInput} placeholder="Ahmed" value={form.firstName} onChange={e=>setForm(p=>({...p,firstName:e.target.value}))} style={form.firstName?{borderColor:`${ROLES.find(r=>r.key===createRole)?.color}55`}:{}}/>
                              </div>
                              <div className={styles.formField}>
                                <label className={styles.formLabel}>Last Name <span className={styles.req}>*</span></label>
                                <input className={styles.formInput} placeholder="Mohamed" value={form.lastName} onChange={e=>setForm(p=>({...p,lastName:e.target.value}))} style={form.lastName?{borderColor:`${ROLES.find(r=>r.key===createRole)?.color}55`}:{}}/>
                              </div>
                              <div className={styles.formFieldFull}>
                                <div className={styles.formLabelRow}>
                                  <label className={styles.formLabel}>Password <span className={styles.req}>*</span></label>
                                  <button className={styles.genSmall} onClick={()=>setForm(p=>({...p,password:genPwd()}))}>{I.spark} Auto-generate</button>
                                </div>
                                <div className={styles.pwdField} style={form.password?{borderColor:`${ROLES.find(r=>r.key===createRole)?.color}55`}:{}}>
                                  <input type={showPwd?"text":"password"} className={styles.pwdInput}
                                    placeholder="Min 8 characters" value={form.password}
                                    onChange={e=>setForm(p=>({...p,password:e.target.value}))}/>
                                  <button className={styles.pwdEye} onClick={()=>setShowPwd(p=>!p)}>{showPwd?I.eyeoff:I.eye}</button>
                                </div>
                              </div>
                            </div>

                            <div className={styles.createActions}>
                              <button className={styles.btnGhost} onClick={()=>setMode("home")}>Cancel</button>
                              <motion.button className={styles.btnCreate}
                                style={{background:ROLES.find(r=>r.key===createRole)?.bg,opacity:(form.code&&form.firstName&&form.lastName&&form.password)?1:.38}}
                                disabled={!form.code||!form.firstName||!form.lastName||!form.password}
                                onClick={create} whileHover={{scale:1.02}} whileTap={{scale:.97}}>
                                {I.plus} Create Account
                              </motion.button>
                            </div>
                          </motion.div>
                        )}

                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* Envelope animation overlay */}
      <AnimatePresence>
        {emailAnim&&(
          <motion.div className={styles.envOverlay}
            initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.25}}>
            <EnvelopeScene roleColor={ROLES.find(r=>r.key===createRole)?.color||"#818cf8"}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}