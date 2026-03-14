// src/pages/admin/RegisterEmailPage.jsx
import { useState, useRef, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./RegisterEmailPage.module.css";

const DOMAIN = "@akhbaracademy.edu.eg";

const ROLES = [
  { key:"student",    label:"Student",    prefix:"cs",  icon:"🎓", color:"#818cf8", dark:"#4338ca" },
  { key:"instructor", label:"Instructor", prefix:"dr",  icon:"🏛",  color:"#22c55e", dark:"#15803d" },
  { key:"admin",      label:"Admin",      prefix:"adm", icon:"⚡",  color:"#f59e0b", dark:"#b45309" },
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

/* ── SVG Icons ── */
const I = {
  search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>,
  mail:   <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
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
  chevR:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>,
  users:  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>,
};

/* spring presets */
const spring = { type:"spring", stiffness:420, damping:28 };
const springSmooth = { type:"spring", stiffness:300, damping:26 };

export default function RegisterEmailPage() {
  const [db,          setDb]          = useState(MOCK_DB_INIT);
  const [searchCode,  setSearchCode]  = useState("");
  const [result,      setResult]      = useState(null);
  const [mode,        setMode]        = useState("home");
  const [createStep,  setCreateStep]  = useState(1);
  const [createRole,  setCreateRole]  = useState("student");
  const [form,        setForm]        = useState({ code:"", firstName:"", lastName:"", password:"" });
  const [newPwd,      setNewPwd]      = useState("");
  const [showPwd,     setShowPwd]     = useState(false);
  const [copied,      setCopied]      = useState(null); // id of copied item
  const [toast,       setToast]       = useState(null);
  const [filterPanel, setFilterPanel] = useState(null); // null | "students"|"instructors"|"admins"|"suspended"
  const inputRef = useRef(null);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const showToast = (msg, type="ok") => {
    setToast({msg,type}); setTimeout(()=>setToast(null),2800);
  };
  const copyText = (text, id) => {
    navigator.clipboard?.writeText(text).catch(()=>{});
    setCopied(id); setTimeout(()=>setCopied(null),1600);
    showToast("Copied to clipboard ✓");
  };

  const search = () => {
    const q = searchCode.trim().toUpperCase();
    if (!q) return;
    const found = db.find(e => e.code.toUpperCase()===q);
    setResult(found || null);
    setMode(found ? "found" : "notfound");
    setFilterPanel(null);
  };

  const toggle = (entry) => {
    const updated = {...entry, active: !entry.active};
    setDb(p => p.map(e => e.id===entry.id ? updated : e));
    if (result?.id === entry.id) setResult(updated);
    showToast(updated.active ? "Account activated ✓" : "Account suspended");
  };

  const del = () => {
    setDb(p => p.filter(e => e.id!==result.id));
    setResult(null); setMode("home"); setSearchCode(""); setFilterPanel(null);
    showToast("Account deleted");
  };

  const savePwd = () => {
    if (!newPwd.trim()) return;
    const u = {...result, password:newPwd};
    setDb(p => p.map(e => e.id===result.id ? u : e));
    setResult(u); setMode("found"); setNewPwd(""); setShowPwd(false);
    showToast("Password updated ✓");
  };

  const create = () => {
    const {code,firstName,lastName,password} = form;
    if (!code.trim()||!firstName.trim()||!lastName.trim()||!password.trim()) return;
    const entry = {
      id:Date.now(), code:code.trim(), firstName:firstName.trim(),
      lastName:lastName.trim(), role:createRole, active:true,
      createdAt:new Date().toISOString().split("T")[0], password:password.trim()
    };
    setDb(p => [entry,...p]);
    setResult(entry); setMode("found"); setSearchCode(entry.code);
    setForm({code:"",firstName:"",lastName:"",password:""}); setCreateStep(1);
    setFilterPanel(null);
    showToast("Account created successfully ✓");
  };

  const stats = [
    { key:"students",    n: db.filter(e=>e.role==="student").length,    l:"Students",    c:"#818cf8" },
    { key:"instructors", n: db.filter(e=>e.role==="instructor").length, l:"Instructors", c:"#22c55e" },
    { key:"admins",      n: db.filter(e=>e.role==="admin").length,      l:"Admins",      c:"#f59e0b" },
    { key:"suspended",   n: db.filter(e=>!e.active).length,             l:"Suspended",   c:"#ef4444" },
  ];

  const panelAccounts = useMemo(() => {
    if (!filterPanel) return [];
    if (filterPanel === "suspended")   return db.filter(e => !e.active);
    if (filterPanel === "students")    return db.filter(e => e.role==="student");
    if (filterPanel === "instructors") return db.filter(e => e.role==="instructor");
    if (filterPanel === "admins")      return db.filter(e => e.role==="admin");
    return [];
  }, [filterPanel, db]);

  const email       = result ? buildEmail(result.role, result.code, result.firstName, result.lastName) : "";
  const roleData    = ROLES.find(r=>r.key===result?.role) || ROLES[0];
  const previewEmail= buildEmail(createRole, form.code, form.firstName, form.lastName);

  return (
    <div className={styles.page}>

      {/* ── Toast ── */}
      <AnimatePresence>
        {toast && (
          <motion.div className={`${styles.toast} ${toast.type==="ok" ? styles.toastOk : styles.toastErr}`}
            initial={{opacity:0,y:-32,x:"-50%",scale:0.88}}
            animate={{opacity:1,y:0,x:"-50%",scale:1}}
            exit={{opacity:0,y:-16,x:"-50%",scale:0.92}}
            transition={spring}>
            <span className={styles.toastDot}/>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ HEADER ════ */}
      <motion.div className={styles.header}
        initial={{opacity:0,y:-18}} animate={{opacity:1,y:0}}
        transition={{duration:0.5, ease:[0.22,1,0.36,1]}}>

        <div className={styles.headerBg}/>

        {/* Left: branding */}
        <div className={styles.headerLeft}>
          <motion.div className={styles.atBadge}
            animate={{rotate:[0,5,-5,0]}}
            transition={{duration:6,repeat:Infinity,ease:"easeInOut"}}>
            <span>@</span>
            <div className={styles.atBadgeRing}/>
          </motion.div>
          <div>
            <h1 className={styles.pageTitle}>Email Manager</h1>
            <p className={styles.pageDomain}>{DOMAIN.slice(1)}</p>
          </div>
        </div>

        {/* Center: stats */}
        <div className={styles.statsRow}>
          {stats.map((s,i) => (
            <motion.button key={s.key}
              className={`${styles.statChip} ${filterPanel===s.key ? styles.statChipActive : ""}`}
              style={{"--sc": s.c}}
              onClick={() => {
                setFilterPanel(p => p===s.key ? null : s.key);
                setMode("home");
              }}
              initial={{opacity:0,y:-12,scale:0.8}}
              animate={{opacity:1,y:0,scale:1}}
              transition={{delay:0.12+i*0.07, ...spring}}
              whileHover={{y:-3}}
              whileTap={{scale:0.94}}>
              <motion.span className={styles.statN}
                key={s.n}
                initial={{opacity:0,y:-8}}
                animate={{opacity:1,y:0}}
                transition={spring}>
                {s.n}
              </motion.span>
              <span className={styles.statL}>{s.l}</span>
              {filterPanel===s.key && (
                <motion.div className={styles.statActiveBar}
                  layoutId="statBar"
                  style={{background:s.c}}/>
              )}
            </motion.button>
          ))}
        </div>

        {/* Right: new account btn */}
        <motion.button className={styles.newBtn}
          onClick={()=>{setMode("create");setCreateStep(1);setFilterPanel(null);}}
          initial={{opacity:0,scale:0.8}} animate={{opacity:1,scale:1}} transition={{delay:0.25,...spring}}
          whileHover={{scale:1.04,boxShadow:"0 8px 28px rgba(129,140,248,0.4)"}}
          whileTap={{scale:0.96}}>
          <motion.span className={styles.newBtnIcon}
            whileHover={{rotate:90}} transition={{duration:0.2}}>
            {I.plus}
          </motion.span>
          <span>New Account</span>
        </motion.button>
      </motion.div>

      {/* ════ SEARCH BAR ════ */}
      <motion.div className={styles.searchSection}
        initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:0.1,duration:0.4}}>

        <div className={`${styles.searchWrap} ${
          mode==="notfound" ? styles.searchErr :
          mode==="found"    ? styles.searchOk  : ""
        }`}>
          <motion.span className={styles.searchIcon}
            animate={{color: mode==="found"?"#22c55e":mode==="notfound"?"#ef4444":"var(--text-muted)"}}>
            {I.search}
          </motion.span>
          <input ref={inputRef} className={styles.searchInput}
            value={searchCode}
            onChange={e=>{setSearchCode(e.target.value); if(mode!=="home"){setMode("home");setResult(null);}}}
            onKeyDown={e=>e.key==="Enter"&&search()}
            placeholder="Enter account code to search (e.g. 2203119)"
            spellCheck={false} autoComplete="off"/>
          <AnimatePresence>
            {searchCode && (
              <motion.button className={styles.clearBtn}
                onClick={()=>{setSearchCode("");setMode("home");setResult(null);}}
                initial={{opacity:0,scale:0.6}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.6}}
                transition={spring}>
                {I.close}
              </motion.button>
            )}
          </AnimatePresence>
          <motion.button className={styles.searchBtn}
            onClick={search} whileHover={{scale:1.03}} whileTap={{scale:0.97}}>
            Search
          </motion.button>
        </div>

        <div className={styles.formatHints}>
          {ROLES.map(r=>(
            <span key={r.key} className={styles.hint}>
              <span style={{color:r.color,fontWeight:800}}>{r.prefix}-</span>
              <span>code·Name@domain</span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* ════ FILTER PANEL (suspended / by role) ════ */}
      <AnimatePresence>
        {filterPanel && (
          <motion.div className={styles.filterPanel}
            initial={{opacity:0,y:-20,scale:0.97}}
            animate={{opacity:1,y:0,scale:1}}
            exit={{opacity:0,y:-14,scale:0.97}}
            transition={springSmooth}>

            {/* Panel header */}
            <div className={styles.fpHeader}>
              <div className={styles.fpHeaderLeft}>
                {filterPanel==="suspended"
                  ? <div className={styles.fpIconWrap} style={{background:"rgba(239,68,68,0.15)",color:"#ef4444"}}>{I.pause}</div>
                  : <div className={styles.fpIconWrap} style={{background:"rgba(129,140,248,0.12)",color:"#818cf8"}}>{I.users}</div>
                }
                <div>
                  <h2 className={styles.fpTitle}>
                    {filterPanel==="suspended" ? "Suspended Accounts"
                     : filterPanel==="students"    ? "Student Accounts"
                     : filterPanel==="instructors" ? "Instructor Accounts"
                     : "Admin Accounts"}
                  </h2>
                  <p className={styles.fpSub}>{panelAccounts.length} account{panelAccounts.length!==1?"s":""}</p>
                </div>
              </div>
              <motion.button className={styles.fpClose}
                onClick={()=>setFilterPanel(null)}
                whileHover={{scale:1.1,rotate:90}} whileTap={{scale:0.9}}
                transition={{duration:0.2}}>
                {I.close}
              </motion.button>
            </div>

            {/* Account list */}
            {panelAccounts.length===0 ? (
              <div className={styles.fpEmpty}>
                <div className={styles.fpEmptyIcon}>
                  {filterPanel==="suspended" ? "🎉" : "👤"}
                </div>
                <p>{filterPanel==="suspended" ? "No suspended accounts!" : "No accounts found"}</p>
              </div>
            ) : (
              <div className={styles.fpList}>
                {panelAccounts.map((acc,i) => {
                  const r = ROLES.find(x=>x.key===acc.role)||ROLES[0];
                  const em = buildEmail(acc.role,acc.code,acc.firstName,acc.lastName);
                  const copiedThis = copied===`panel-${acc.id}`;
                  return (
                    <motion.div key={acc.id} className={styles.fpItem}
                      initial={{opacity:0,x:-24}}
                      animate={{opacity:1,x:0}}
                      transition={{delay:i*0.055,...spring}}
                      layout>
                      {/* Avatar */}
                      <div className={styles.fpAvatar}
                        style={{background:`linear-gradient(135deg,${r.dark},${r.color})`}}>
                        {acc.firstName[0]}{acc.lastName[0]}
                        {!acc.active && <div className={styles.fpAvatarBan}/>}
                      </div>

                      {/* Info */}
                      <div className={styles.fpInfo}>
                        <div className={styles.fpName}>{acc.firstName} {acc.lastName}</div>
                        <div className={styles.fpMeta}>
                          <span className={styles.fpRoleBadge} style={{color:r.color,background:`${r.color}18`}}>
                            {r.icon} {r.label}
                          </span>
                          <span className={styles.fpCode}>#{acc.code}</span>
                        </div>
                        <div className={styles.fpEmail}>{em}</div>
                      </div>

                      {/* Actions */}
                      <div className={styles.fpActions}>
                        {/* Copy email */}
                        <motion.button className={`${styles.fpCopyBtn} ${copiedThis?styles.fpCopyDone:""}`}
                          onClick={()=>copyText(em,`panel-${acc.id}`)}
                          whileTap={{scale:0.88}} title="Copy email">
                          <AnimatePresence mode="wait">
                            {copiedThis
                              ? <motion.span key="done" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} style={{color:"#22c55e"}}>{I.check}</motion.span>
                              : <motion.span key="copy" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>{I.copy}</motion.span>
                            }
                          </AnimatePresence>
                        </motion.button>

                        {/* Activate/Suspend toggle */}
                        <motion.button
                          className={`${styles.fpToggleBtn} ${acc.active ? styles.fpToggleSuspend : styles.fpToggleActivate}`}
                          onClick={()=>toggle(acc)}
                          whileHover={{scale:1.04}} whileTap={{scale:0.96}}>
                          {acc.active ? <>{I.pause} Suspend</> : <>{I.play} Activate</>}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ════ MAIN CONTENT ════ */}
      <div className={styles.contentArea}>
        <AnimatePresence mode="wait">

          {/* ── HOME ── */}
          {mode==="home" && !filterPanel && (
            <motion.div key="home" className={styles.homeState}
              initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
              transition={{duration:0.35}}>
              <div className={styles.homeOrb}>
                <motion.div className={styles.homeOrbRing1}
                  animate={{rotate:360}} transition={{duration:16,repeat:Infinity,ease:"linear"}}/>
                <motion.div className={styles.homeOrbRing2}
                  animate={{rotate:-360}} transition={{duration:24,repeat:Infinity,ease:"linear"}}/>
                <div className={styles.homeOrbCore}>
                  <motion.span
                    animate={{scale:[1,1.08,1]}}
                    transition={{duration:3,repeat:Infinity,ease:"easeInOut"}}>@</motion.span>
                </div>
                {ROLES.map((r,i) => {
                  const angle = (i/3)*Math.PI*2 - Math.PI/2;
                  return (
                    <motion.div key={r.key} className={styles.homeOrbDot}
                      style={{
                        background:r.color,
                        left:`calc(50% + ${Math.cos(angle)*72}px - 8px)`,
                        top:`calc(50% + ${Math.sin(angle)*72}px - 8px)`,
                      }}
                      animate={{scale:[1,1.4,1],opacity:[0.7,1,0.7]}}
                      transition={{duration:2+i*0.5,repeat:Infinity,delay:i*0.4}}/>
                  );
                })}
              </div>
              <p className={styles.homeTitle}>Search an account</p>
              <p className={styles.homeSub}>Enter a code above or click a stat to browse accounts</p>
              <div className={styles.homeSamples}>
                {["2203119","INS001","ADM001","2203122"].map(c=>(
                  <motion.button key={c} className={styles.sampleChip}
                    onClick={()=>{setSearchCode(c);}}
                    whileHover={{y:-3,scale:1.04}} whileTap={{scale:0.96}}>
                    {c}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── NOT FOUND ── */}
          {mode==="notfound" && (
            <motion.div key="nf" className={styles.notFoundState}
              initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} exit={{opacity:0}}
              transition={{duration:0.32}}>
              <motion.div className={styles.nfIcon}
                animate={{rotate:[0,-10,10,-6,6,0]}}
                transition={{duration:0.6,delay:0.1}}>
                {I.warn}
              </motion.div>
              <p className={styles.nfTitle}>No account found for <strong>{searchCode}</strong></p>
              <p className={styles.nfSub}>Would you like to create a new account with this code?</p>
              <motion.button className={styles.nfCreateBtn}
                onClick={()=>{setForm(p=>({...p,code:searchCode}));setMode("create");setCreateStep(2);setCreateRole("student");}}
                whileHover={{scale:1.03,y:-2}} whileTap={{scale:0.97}}>
                {I.plus} Create account for <strong>{searchCode}</strong>
              </motion.button>
            </motion.div>
          )}

          {/* ── FOUND ── */}
          {mode==="found" && result && (
            <motion.div key={`found-${result.id}`}
              initial={{opacity:0,y:24,scale:0.96}} animate={{opacity:1,y:0,scale:1}}
              exit={{opacity:0,y:-12,scale:0.97}}
              transition={{duration:0.42,ease:[0.22,1,0.36,1]}}>

              <div className={styles.profileCard}>
                {/* Top gradient stripe */}
                <div className={styles.profileStripe}
                  style={{background:`linear-gradient(90deg,${roleData.color}60,${roleData.color}18,transparent)`}}/>

                {/* Header row */}
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatarWrap}>
                    <motion.div className={styles.profileAvatar}
                      style={{background:`linear-gradient(135deg,${roleData.dark},${roleData.color})`}}
                      whileHover={{scale:1.06}}>
                      {result.firstName[0]}{result.lastName[0]}
                    </motion.div>
                    <motion.div className={styles.profileAvatarPing}
                      style={{borderColor:`${roleData.color}40`}}
                      animate={{scale:[1,1.5,1],opacity:[0.5,0,0.5]}}
                      transition={{duration:2.5,repeat:Infinity,ease:"easeInOut"}}/>
                    {!result.active && (
                      <div className={styles.profileSuspendedOverlay}>
                        <div className={styles.profileSuspendedIcon}>{I.pause}</div>
                      </div>
                    )}
                  </div>

                  <div className={styles.profileInfo}>
                    <h2 className={styles.profileName}>{result.firstName} {result.lastName}</h2>
                    <div className={styles.profileMeta}>
                      <span className={styles.profileRoleBadge}
                        style={{color:roleData.color, background:`${roleData.color}18`, borderColor:`${roleData.color}30`}}>
                        {roleData.icon} {roleData.label}
                      </span>
                      <span className={styles.profileCode}>#{result.code}</span>
                      <span className={styles.profileDate}>Created {result.createdAt}</span>
                    </div>
                  </div>

                  {/* Status pill */}
                  <motion.button
                    className={`${styles.statusPill} ${result.active ? styles.statusActive : styles.statusSuspended}`}
                    onClick={()=>toggle(result)}
                    whileHover={{scale:1.06}} whileTap={{scale:0.94}}>
                    <motion.span className={styles.statusDot}
                      animate={result.active ? {scale:[1,1.4,1],opacity:[1,0.5,1]} : {scale:1,opacity:0.6}}
                      transition={{duration:1.6,repeat:result.active?Infinity:0}}/>
                    {result.active ? "Active" : "Suspended"}
                  </motion.button>
                </div>

                {/* Email block */}
                <div className={styles.emailBlock}>
                  <div className={styles.emailLabel}>EMAIL ADDRESS</div>
                  <div className={styles.emailRow}>
                    <div className={styles.emailDisplay}>
                      <span className={styles.emailPrefix} style={{color:roleData.color}}>
                        {email.split("@")[0]}
                      </span>
                      <span className={styles.emailAt} style={{color:roleData.color}}>@</span>
                      <span className={styles.emailDomain}>akhbaracademy.edu.eg</span>
                    </div>
                    <motion.button className={`${styles.copyBadge} ${copied===result.id?styles.copyBadgeDone:""}`}
                      onClick={()=>copyText(email, result.id)}
                      whileHover={{scale:1.04}} whileTap={{scale:0.9}}>
                      <AnimatePresence mode="wait">
                        {copied===result.id
                          ? <motion.span key="y" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} style={{color:"#22c55e"}}>{I.check}</motion.span>
                          : <motion.span key="n" initial={{scale:0}} animate={{scale:1}} exit={{scale:0}}>{I.copy}</motion.span>
                        }
                      </AnimatePresence>
                      <span>{copied===result.id ? "Copied!" : "Copy"}</span>
                    </motion.button>
                  </div>
                </div>

                {/* Action strip */}
                <div className={styles.actionStrip}>
                  <ActionTile icon={I.key} label="Change Password" color="#818cf8"
                    onClick={()=>{setNewPwd(result.password);setMode("changepwd");}}/>
                  <ActionTile
                    icon={result.active ? I.pause : I.play}
                    label={result.active ? "Suspend" : "Activate"}
                    color={result.active ? "#f59e0b" : "#22c55e"}
                    onClick={()=>toggle(result)}/>
                  <ActionTile icon={I.trash} label="Delete Account" color="#ef4444" danger
                    onClick={()=>setMode("confirmdelete")}/>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── CHANGE PASSWORD ── */}
          {mode==="changepwd" && result && (
            <motion.div key="cpwd" className={styles.sheetCard}
              initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}
              transition={{duration:0.38,ease:[0.22,1,0.36,1]}}>

              <button className={styles.backBtn} onClick={()=>setMode("found")}>{I.back} Back</button>

              <div className={styles.sheetIcon} style={{background:"rgba(129,140,248,0.12)",color:"#818cf8"}}>
                {I.key}
              </div>
              <h2 className={styles.sheetTitle}>Change Password</h2>
              <p className={styles.sheetSub}>{result.firstName} {result.lastName} · <code className={styles.inlineCode}>{email}</code></p>

              <div className={styles.pwdField}>
                <input type={showPwd?"text":"password"} className={styles.pwdInput}
                  value={newPwd} onChange={e=>setNewPwd(e.target.value)}
                  placeholder="Enter new password" autoFocus/>
                <button className={styles.pwdEye} onClick={()=>setShowPwd(p=>!p)}>
                  {showPwd?I.eyeoff:I.eye}
                </button>
              </div>

              <motion.button className={styles.genBtn}
                onClick={()=>setNewPwd(genPwd())} whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                {I.spark} Generate strong password
              </motion.button>

              <AnimatePresence>
                {newPwd && (
                  <motion.div className={styles.pwdPreview}
                    initial={{opacity:0,height:0}} animate={{opacity:1,height:"auto"}} exit={{opacity:0,height:0}}>
                    <code className={styles.pwdPreviewCode}>{newPwd}</code>
                    <button className={styles.pwdPreviewCopy}
                      onClick={()=>copyText(newPwd,"preview")} title="Copy">
                      {copied==="preview" ? I.check : I.copy}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className={styles.sheetActions}>
                <button className={styles.btnGhost} onClick={()=>setMode("found")}>Cancel</button>
                <motion.button className={styles.btnPrimary}
                  onClick={savePwd} disabled={!newPwd.trim()}
                  style={{opacity:newPwd.trim()?1:0.4, background:"linear-gradient(135deg,#4338ca,#818cf8)"}}
                  whileHover={newPwd.trim()?{scale:1.02}:{}} whileTap={newPwd.trim()?{scale:0.97}:{}}>
                  Save Password
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── CONFIRM DELETE ── */}
          {mode==="confirmdelete" && result && (
            <motion.div key="cdel" className={styles.sheetCard}
              initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}
              transition={{duration:0.38,ease:[0.22,1,0.36,1]}}>

              <button className={styles.backBtn} onClick={()=>setMode("found")}>{I.back} Back</button>

              <motion.div className={styles.sheetIcon} style={{background:"rgba(239,68,68,0.12)",color:"#ef4444"}}
                animate={{scale:[1,1.05,1]}} transition={{duration:1.5,repeat:Infinity}}>
                {I.trash}
              </motion.div>
              <h2 className={styles.sheetTitle}>Delete Account?</h2>
              <p className={styles.sheetSub}>This will permanently delete:</p>
              <div className={styles.deleteBadge}><code>{email}</code></div>
              <p className={styles.deleteWarn}>⚠ This action cannot be undone.</p>

              <div className={styles.sheetActions}>
                <button className={styles.btnGhost} onClick={()=>setMode("found")}>Cancel</button>
                <motion.button className={styles.btnDanger}
                  onClick={del} whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                  Yes, Delete Account
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── CREATE ── */}
          {mode==="create" && (
            <motion.div key="create"
              initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-12}}
              transition={{duration:0.38,ease:[0.22,1,0.36,1]}}>

              <button className={styles.backBtn}
                onClick={()=>createStep===2?setCreateStep(1):setMode("home")}>
                {I.back} {createStep===2?"Choose Role":"Back"}
              </button>

              {/* Step indicator */}
              <div className={styles.stepIndicator}>
                {[1,2].map(s=>(
                  <div key={s} className={`${styles.stepDot} ${createStep>=s?styles.stepDotOn:""}`}
                    style={createStep>=s?{background:ROLES.find(r=>r.key===createRole)?.color}:{}}>
                    {createStep>s ? I.check : s}
                  </div>
                ))}
                <div className={`${styles.stepLine} ${createStep>1?styles.stepLineOn:""}`}
                  style={createStep>1?{background:ROLES.find(r=>r.key===createRole)?.color}:{}}/>
              </div>

              <AnimatePresence mode="wait">
                {/* Step 1: Role */}
                {createStep===1 && (
                  <motion.div key="s1" className={styles.createPanel}
                    initial={{opacity:0,x:32}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}}
                    transition={{duration:0.3}}>
                    <h2 className={styles.createTitle}>Choose Account Type</h2>
                    <p className={styles.createSub}>Select the role for the new account</p>
                    <div className={styles.roleGrid}>
                      {ROLES.map(r => (
                        <motion.button key={r.key}
                          className={`${styles.roleCard} ${createRole===r.key?styles.roleCardOn:""}`}
                          style={{"--rc":r.color,"--rcd":r.dark}}
                          onClick={()=>setCreateRole(r.key)}
                          whileHover={{y:-5}} whileTap={{scale:0.97}}>
                          <div className={styles.roleCardIcon}>{r.icon}</div>
                          <div className={styles.roleCardName}>{r.label}</div>
                          <div className={styles.roleCardPrefix} style={{color:r.color}}>
                            <strong>{r.prefix}-</strong>code·Name
                          </div>
                          <AnimatePresence>
                            {createRole===r.key && (
                              <motion.div className={styles.roleCheck}
                                style={{background:r.color}}
                                initial={{scale:0,rotate:-90}} animate={{scale:1,rotate:0}} exit={{scale:0}}>
                                {I.check}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.button>
                      ))}
                    </div>
                    <motion.button className={styles.nextBtn}
                      onClick={()=>setCreateStep(2)}
                      style={{background:`linear-gradient(135deg,${ROLES.find(r=>r.key===createRole)?.dark},${ROLES.find(r=>r.key===createRole)?.color})`}}
                      whileHover={{scale:1.02,boxShadow:`0 8px 28px ${ROLES.find(r=>r.key===createRole)?.color}44`}}
                      whileTap={{scale:0.97}}>
                      Continue as {createRole} →
                    </motion.button>
                  </motion.div>
                )}

                {/* Step 2: Details */}
                {createStep===2 && (
                  <motion.div key="s2" className={styles.createPanel}
                    initial={{opacity:0,x:32}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-24}}
                    transition={{duration:0.3}}>

                    <div className={styles.createHeader}>
                      <span className={styles.createRoleBadge}
                        style={{color:ROLES.find(r=>r.key===createRole)?.color,
                          background:`${ROLES.find(r=>r.key===createRole)?.color}18`,
                          borderColor:`${ROLES.find(r=>r.key===createRole)?.color}30`}}>
                        {ROLES.find(r=>r.key===createRole)?.icon} {createRole}
                      </span>
                      <h2 className={styles.createTitle}>Account Details</h2>
                    </div>

                    {/* Live preview */}
                    <AnimatePresence>
                      {previewEmail && (
                        <motion.div className={styles.livePreview}
                          initial={{opacity:0,height:0,marginBottom:0}}
                          animate={{opacity:1,height:"auto",marginBottom:16}}
                          exit={{opacity:0,height:0,marginBottom:0}}
                          style={{borderColor:`${ROLES.find(r=>r.key===createRole)?.color}30`}}>
                          <span className={styles.lpLabel}>Preview</span>
                          <span className={styles.lpEmail}
                            style={{color:ROLES.find(r=>r.key===createRole)?.color}}>
                            {previewEmail}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className={styles.formGrid}>
                      <CField label="Code" placeholder="e.g. 2203119" value={form.code}
                        onChange={v=>setForm(p=>({...p,code:v}))} required/>
                      <CField label="First Name" placeholder="Ahmed" value={form.firstName}
                        onChange={v=>setForm(p=>({...p,firstName:v}))} required/>
                      <CField label="Last Name" placeholder="Mohamed" value={form.lastName}
                        onChange={v=>setForm(p=>({...p,lastName:v}))} required/>
                      <div className={styles.formFieldFull}>
                        <div className={styles.formLabelRow}>
                          <label className={styles.formLabel}>Password <span className={styles.req}>*</span></label>
                          <button className={styles.genSmall} onClick={()=>setForm(p=>({...p,password:genPwd()}))}>
                            {I.spark} Generate
                          </button>
                        </div>
                        <div className={styles.pwdField}>
                          <input type={showPwd?"text":"password"} className={styles.pwdInput}
                            placeholder="Min 8 characters" value={form.password}
                            onChange={e=>setForm(p=>({...p,password:e.target.value}))}/>
                          <button className={styles.pwdEye} onClick={()=>setShowPwd(p=>!p)}>
                            {showPwd?I.eyeoff:I.eye}
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className={styles.createActions}>
                      <button className={styles.btnGhost} onClick={()=>setMode("home")}>Cancel</button>
                      <motion.button className={styles.btnCreate}
                        onClick={create}
                        disabled={!form.code||!form.firstName||!form.lastName||!form.password}
                        style={{
                          opacity:(form.code&&form.firstName&&form.lastName&&form.password)?1:0.4,
                          background:`linear-gradient(135deg,${ROLES.find(r=>r.key===createRole)?.dark},${ROLES.find(r=>r.key===createRole)?.color})`
                        }}
                        whileHover={{scale:1.02}} whileTap={{scale:0.97}}>
                        {I.plus} Create Account
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

function ActionTile({ icon, label, color, onClick, danger }) {
  return (
    <motion.button className={`${styles.actionTile} ${danger?styles.actionTileDanger:""}`}
      style={{"--tc":color}}
      onClick={onClick}
      whileHover={{y:-4,background:`${color}14`}}
      whileTap={{scale:0.95}}>
      <span className={styles.actionTileIcon} style={{color}}>{icon}</span>
      <span className={styles.actionTileLabel}>{label}</span>
    </motion.button>
  );
}

function CField({ label, placeholder, value, onChange, required }) {
  return (
    <div className={styles.formField}>
      <label className={styles.formLabel}>{label}{required&&<span className={styles.req}> *</span>}</label>
      <input className={styles.formInput} placeholder={placeholder} value={value}
        onChange={e=>onChange(e.target.value)}/>
    </div>
  );
}
