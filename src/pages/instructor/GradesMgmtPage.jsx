// src/pages/instructor/GradesMgmtPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotifications } from "../../context/NotificationContext";
import styles from "./GradesMgmtPage.module.css";

/* ─── API LAYER ─────────────────────────────────
  TODO: replace with real endpoints
  GET  /api/instructor/courses
  GET  /api/instructor/grades/:courseId
  POST /api/instructor/grades/approve
  POST /api/instructor/grades/reject
─────────────────────────────────────────────── */

const MY_COURSES = [
  { id: "cs401", code: "CS401", name: "Artificial Intelligence",   color: "#e8a838", icon: "🤖" },
  { id: "cs404", code: "CS404", name: "Expert Systems",           color: "#e05c8a", icon: "🧠" },
];

const MOCK = {
  cs401: [
    { id: "a1", assignment: "Search Algorithm Implementation",  studentName: "Ahmed Hassan",  studentId: "20210001", submittedAt: "Feb 26 · 10:32 PM", file: "ahmed_search.pdf",  fileSize: "1.2 MB", maxGrade: 20, grade: null, status: "pending" },
    { id: "a2", assignment: "Knowledge Base Design",            studentName: "Sara Mohamed",  studentId: "20210002", submittedAt: "Mar 12 · 09:15 PM", file: "sara_kb.pdf",        fileSize: "2.8 MB", maxGrade: 20, grade: 17,   status: "approved" },
    { id: "a3", assignment: "Neural Network from Scratch",      studentName: "Omar Khalil",   studentId: "20210003", submittedAt: "Apr 1  · 11:58 PM",  file: "omar_nn.pdf",        fileSize: "3.5 MB", maxGrade: 20, grade: null, status: "pending" },
    { id: "a4", assignment: "Neural Network from Scratch",      studentName: "Nour Ibrahim",  studentId: "20210004", submittedAt: "Apr 1  · 08:44 AM",  file: "nour_nn.zip",        fileSize: "5.1 MB", maxGrade: 20, grade: null, status: "rejected", rejectionReason: "Suspected AI-generated content" },
    { id: "a5", assignment: "Knowledge Base Design",            studentName: "Laila Hassan",  studentId: "20210005", submittedAt: "Mar 13 · 07:20 PM", file: "laila_kb.pdf",       fileSize: "1.9 MB", maxGrade: 20, grade: 19,   status: "approved" },
  ],
  cs404: [
    { id: "b1", assignment: "Expert System Design",             studentName: "Laila Samir",   studentId: "20210010", submittedAt: "Mar 5  · 06:20 PM", file: "laila_expert.pdf",   fileSize: "1.8 MB", maxGrade: 20, grade: null, status: "pending" },
    { id: "b2", assignment: "Expert System Design",             studentName: "Youssef Ali",   studentId: "20210011", submittedAt: "Mar 4  · 11:30 PM", file: "youssef_es.pdf",     fileSize: "2.2 MB", maxGrade: 20, grade: 15,   status: "approved" },
    { id: "b3", assignment: "Knowledge Representation",         studentName: "Mona Karim",    studentId: "20210012", submittedAt: "Mar 18 · 03:10 PM", file: "mona_kr.pdf",        fileSize: "0.9 MB", maxGrade: 20, grade: null, status: "pending" },
  ],
};

const REJECT_REASONS = [
  { icon: "🤖", label: "AI-generated",       value: "Suspected AI-generated content" },
  { icon: "📋", label: "Wrong format",        value: "Incorrect submission format" },
  { icon: "📄", label: "Plagiarized",         value: "Plagiarism detected" },
  { icon: "📦", label: "Incomplete",          value: "Submission is incomplete" },
  { icon: "🔗", label: "Wrong assignment",    value: "Wrong assignment submitted" },
  { icon: "⚠️", label: "Corrupted file",      value: "File is corrupted or unreadable" },
];

/* ── Avatar with initials ── */
function Avatar({ name, color }) {
  const initials = name.split(" ").slice(0, 2).map(w => w[0]).join("");
  return (
    <div className={styles.avatar} style={{ background: `${color}20`, color, borderColor: `${color}35` }}>
      {initials}
    </div>
  );
}

/* ── Approve Modal ── */
function ApproveModal({ subs, onConfirm, onClose }) {
  const list = Array.isArray(subs) ? subs : [subs];
  const [grades, setGrades] = useState({});

  return (
    <motion.div className={styles.overlay} onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className={styles.modal} onClick={e => e.stopPropagation()}
        initial={{ scale: 0.88, y: 32, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}>

        <div className={styles.modalTop} style={{ background: "linear-gradient(135deg,#dcfce7,#f0fdf4)" }}>
          <div className={styles.modalTopIcon}>✅</div>
          <div>
            <h3 className={styles.modalTitle}>
              Approve {list.length > 1 ? `${list.length} Submissions` : "Submission"}
            </h3>
            <p className={styles.modalSub}>Enter the grade for each submission</p>
          </div>
        </div>

        <div className={styles.modalBody}>
          {list.map(s => (
            <div key={s.id} className={styles.approveEntry}>
              <div className={styles.approveLeft}>
                <div className={styles.approveStudent}>{s.studentName}</div>
                <div className={styles.approveAssign}>{s.assignment}</div>
              </div>
              <div className={styles.approveGrade}>
                <input
                  type="number" min={0} max={s.maxGrade}
                  className={styles.gradeInput}
                  placeholder="—"
                  value={grades[s.id] ?? ""}
                  onChange={e => setGrades(g => ({ ...g, [s.id]: +e.target.value }))}
                />
                <span className={styles.gradeSlash}>/ {s.maxGrade}</span>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.modalFoot}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <motion.button className={styles.greenBtn}
            onClick={() => onConfirm(list.map(s => ({ id: s.id, grade: grades[s.id] ?? 0 })))}
            whileHover={{ scale: 1.03, filter: "brightness(1.07)" }}
            whileTap={{ scale: 0.96 }}>
            Confirm ✅
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Reject Modal ── */
function RejectModal({ subs, onConfirm, onClose }) {
  const list = Array.isArray(subs) ? subs : [subs];
  const [picked, setPicked] = useState(null);
  const [custom, setCustom] = useState("");
  const reason = picked === "__custom__" ? custom : picked;

  return (
    <motion.div className={styles.overlay} onClick={onClose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <motion.div className={styles.modal} onClick={e => e.stopPropagation()}
        initial={{ scale: 0.88, y: 32, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.88, y: 20, opacity: 0 }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}>

        <div className={styles.modalTop} style={{ background: "linear-gradient(135deg,#fee2e2,#fff5f5)" }}>
          <div className={styles.modalTopIcon}>❌</div>
          <div>
            <h3 className={styles.modalTitle}>
              Reject {list.length > 1 ? `${list.length} Submissions` : "Submission"}
            </h3>
            <p className={styles.modalSub}>Reason will be sent to student(s) via notification</p>
          </div>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.reasonGrid}>
            {REJECT_REASONS.map(r => (
              <motion.button
                key={r.value}
                className={`${styles.reasonBtn} ${picked === r.value ? styles.reasonBtnPicked : ""}`}
                onClick={() => setPicked(picked === r.value ? null : r.value)}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
              >
                <span className={styles.reasonBtnIcon}>{r.icon}</span>
                <span className={styles.reasonBtnLabel}>{r.label}</span>
              </motion.button>
            ))}
          </div>

          {/* Custom */}
          <button
            className={`${styles.customToggle} ${picked === "__custom__" ? styles.customToggleOn : ""}`}
            onClick={() => setPicked(picked === "__custom__" ? null : "__custom__")}
          >
            ✏️ Write custom reason
          </button>
          <AnimatePresence>
            {picked === "__custom__" && (
              <motion.input
                className={styles.customInput}
                placeholder="Type reason here…"
                value={custom}
                onChange={e => setCustom(e.target.value)}
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 42, marginTop: 8 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
              />
            )}
          </AnimatePresence>
        </div>

        <div className={styles.modalFoot}>
          <button className={styles.cancelBtn} onClick={onClose}>Cancel</button>
          <motion.button
            className={styles.redBtn}
            disabled={!reason}
            onClick={() => reason && onConfirm(list.map(s => s.id), reason)}
            whileHover={reason ? { scale: 1.03, filter: "brightness(1.07)" } : {}}
            whileTap={reason ? { scale: 0.96 } : {}}
          >
            Reject ❌
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ── Main Page ── */
export default function GradesMgmtPage() {
  const { addNotification } = useNotifications();
  const [courseId,  setCourseId]  = useState(MY_COURSES[0].id);
  const [data,      setData]      = useState(MOCK);
  const [selected,  setSelected]  = useState(new Set());
  const [approveT,  setApproveT]  = useState(null);
  const [rejectT,   setRejectT]   = useState(null);
  const [toast,     setToast]     = useState(null);
  const [filter,    setFilter]    = useState("all"); // all | pending | approved | rejected

  const course  = MY_COURSES.find(c => c.id === courseId);
  const allSubs = data[courseId] || [];
  const shown   = allSubs.filter(s => filter === "all" || s.status === filter);
  const pending = allSubs.filter(s => s.status === "pending");
  const pendingIds = pending.map(s => s.id);
  const allPendingSelected = pendingIds.length > 0 && pendingIds.every(id => selected.has(id));

  const stats = {
    total:    allSubs.length,
    pending:  pending.length,
    approved: allSubs.filter(s => s.status === "approved").length,
    rejected: allSubs.filter(s => s.status === "rejected").length,
  };

  const flash = (msg, color) => {
    setToast({ msg, color });
    setTimeout(() => setToast(null), 2600);
  };

  const toggle = (id) => setSelected(prev => {
    const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n;
  });

  const toggleAll = () =>
    setSelected(allPendingSelected ? new Set() : new Set(pendingIds));

  const doApprove = (results) => {
    setData(prev => ({
      ...prev,
      [courseId]: prev[courseId].map(s => {
        const r = results.find(x => x.id === s.id);
        if (!r) return s;
        addNotification("student", {
          type: "grade_approved", title: "Assignment Graded ✅",
          body: `'${s.assignment}' has been approved.`,
          detail: { course: course.name, assignment: s.assignment, grade: r.grade, max: s.maxGrade, file: s.file, submittedAt: s.submittedAt, note: "Keep up the great work!" },
          time: "Just now",
        });
        return { ...s, grade: r.grade, status: "approved" };
      }),
    }));
    setSelected(new Set()); setApproveT(null);
    flash(`✅ ${results.length} submission(s) approved`, "#22c55e");
  };

  const doReject = (ids, reason) => {
    setData(prev => ({
      ...prev,
      [courseId]: prev[courseId].map(s => {
        if (!ids.includes(s.id)) return s;
        addNotification("student", {
          type: "grade_rejected", title: "Assignment Returned ❌",
          body: `'${s.assignment}' was returned.`,
          detail: { course: course.name, assignment: s.assignment, max: s.maxGrade, file: s.file, submittedAt: s.submittedAt, reason },
          time: "Just now",
        });
        return { ...s, status: "rejected", rejectionReason: reason };
      }),
    }));
    setSelected(new Set()); setRejectT(null);
    flash(`❌ ${ids.length} submission(s) rejected`, "#ef4444");
  };

  return (
    <div className={styles.page}>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className={styles.toast} style={{ color: toast.color, borderColor: `${toast.color}50` }}
            initial={{ y: -50, opacity: 0, x: "-50%" }}
            animate={{ y: 0, opacity: 1, x: "-50%" }}
            exit={{ y: -50, opacity: 0, x: "-50%" }}
            transition={{ type: "spring", stiffness: 420, damping: 30 }}>
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Page header ── */}
      <motion.div className={styles.pageHead}
        initial={{ opacity: 0, y: -14 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className={styles.title}>Grade Management</h1>
          <p className={styles.sub}>Your courses only · Approve or reject student submissions</p>
        </div>
      </motion.div>

      {/* ── Course selector cards ── */}
      <div className={styles.courseCards}>
        {MY_COURSES.map((c, i) => {
          const p = (data[c.id] || []).filter(s => s.status === "pending").length;
          const isActive = courseId === c.id;
          return (
            <motion.button
              key={c.id}
              className={`${styles.courseCard} ${isActive ? styles.courseCardOn : ""}`}
              style={isActive ? { borderColor: c.color, background: `${c.color}09` } : {}}
              onClick={() => { setCourseId(c.id); setSelected(new Set()); setFilter("all"); }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className={styles.courseCardIcon} style={{ background: `${c.color}18`, color: c.color }}>{c.icon}</span>
              <div className={styles.courseCardInfo}>
                <span className={styles.courseCardCode} style={isActive ? { color: c.color } : {}}>{c.code}</span>
                <span className={styles.courseCardName}>{c.name}</span>
              </div>
              {p > 0 && (
                <span className={styles.courseCardBadge} style={{ background: c.color }}>{p}</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* ── Stats row ── */}
      <motion.div className={styles.statsRow}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {[
          { label: "Total",    val: stats.total,    col: "#64748b", bg: "#f1f5f9" },
          { label: "Pending",  val: stats.pending,  col: "#d97706", bg: "#fffbeb" },
          { label: "Approved", val: stats.approved, col: "#16a34a", bg: "#f0fdf4" },
          { label: "Rejected", val: stats.rejected, col: "#dc2626", bg: "#fff5f5" },
        ].map((s, i) => (
          <motion.div key={s.label} className={styles.statBox}
            style={{ background: s.bg, borderColor: `${s.col}25` }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.12 + i * 0.05, type: "spring", stiffness: 380, damping: 24 }}>
            <span className={styles.statVal} style={{ color: s.col }}>{s.val}</span>
            <span className={styles.statLabel}>{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Toolbar ── */}
      <div className={styles.toolbar}>
        {/* Filter pills */}
        <div className={styles.filterPills}>
          {["all","pending","approved","rejected"].map(f => (
            <button
              key={f}
              className={`${styles.filterPill} ${filter === f ? styles.filterPillOn : ""}`}
              style={filter === f ? { background: course.color, borderColor: course.color } : {}}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== "all" && <span className={styles.filterCount}>{stats[f] ?? 0}</span>}
            </button>
          ))}
        </div>

        {/* Bulk select */}
        {pending.length > 0 && (
          <div className={styles.bulkControls}>
            <label className={styles.checkLabel} onClick={toggleAll}>
              <div className={`${styles.cb} ${allPendingSelected ? styles.cbOn : ""}`}
                style={allPendingSelected ? { background: course.color, borderColor: course.color } : {}}>
                {allPendingSelected && <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" width="11" height="11"><polyline points="2 6 5 9 10 3"/></svg>}
              </div>
              <span>{selected.size > 0 ? `${selected.size} selected` : "Select all pending"}</span>
            </label>

            <AnimatePresence>
              {selected.size > 0 && (
                <motion.div className={styles.bulkBtns}
                  initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                  <motion.button className={styles.bulkGreen}
                    onClick={() => setApproveT(pending.filter(s => selected.has(s.id)))}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                    ✅ Approve ({selected.size})
                  </motion.button>
                  <motion.button className={styles.bulkRed}
                    onClick={() => setRejectT(pending.filter(s => selected.has(s.id)))}
                    whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.95 }}>
                    ❌ Reject ({selected.size})
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ── Submissions ── */}
      <div className={styles.subList}>
        <AnimatePresence>
          {shown.map((s, i) => {
            const isPending = s.status === "pending";
            const isChecked = selected.has(s.id);
            const statusCol = s.status === "approved" ? "#16a34a" : s.status === "rejected" ? "#dc2626" : "#d97706";
            const statusBg  = s.status === "approved" ? "rgba(34,197,94,0.08)"  : s.status === "rejected" ? "rgba(239,68,68,0.08)"  : "rgba(245,158,11,0.08)";
            const statusBrd = s.status === "approved" ? "rgba(34,197,94,0.25)"  : s.status === "rejected" ? "rgba(239,68,68,0.22)"  : "rgba(245,158,11,0.28)";
            const statusLbl = s.status === "approved" ? "✅ Approved"           : s.status === "rejected" ? "❌ Rejected"           : "⏳ Pending";

            return (
              <motion.div
                key={s.id}
                className={`${styles.subCard} ${isChecked ? styles.subCardChecked : ""}`}
                style={isChecked ? { borderColor: course.color, boxShadow: `0 0 0 2px ${course.color}20` } : {}}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ delay: i * 0.04, duration: 0.36 }}
                layout
              >
                {/* Left: checkbox + avatar */}
                <div className={styles.subLeft}>
                  {isPending ? (
                    <div
                      className={`${styles.cb} ${isChecked ? styles.cbOn : ""}`}
                      style={isChecked ? { background: course.color, borderColor: course.color } : {}}
                      onClick={() => toggle(s.id)}
                    >
                      {isChecked && <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" width="11" height="11"><polyline points="2 6 5 9 10 3"/></svg>}
                    </div>
                  ) : <div className={styles.cbPlaceholder} />}
                  <Avatar name={s.studentName} color={course.color} />
                </div>

                {/* Center info */}
                <div className={styles.subInfo}>
                  <div className={styles.subName}>{s.studentName}
                    <span className={styles.subId}>{s.studentId}</span>
                  </div>
                  <div className={styles.subAssign}>{s.assignment}</div>
                  <div className={styles.subMeta}>
                    <span>🕐 {s.submittedAt}</span>
                    <span className={styles.subFile}>
                      <span>📄</span> {s.file}
                      <span className={styles.subFileSize}>{s.fileSize}</span>
                    </span>
                  </div>
                  {s.rejectionReason && (
                    <div className={styles.subRejectReason}>⛔ {s.rejectionReason}</div>
                  )}
                </div>

                {/* Right: grade + status + actions */}
                <div className={styles.subRight}>
                  {/* Grade bubble */}
                  {s.grade !== null ? (
                    <div className={styles.gradeBubble} style={{ color: "#16a34a", background: "rgba(34,197,94,0.08)", borderColor: "rgba(34,197,94,0.3)" }}>
                      <span className={styles.gradeNum}>{s.grade}</span>
                      <span className={styles.gradeOf}>/{s.maxGrade}</span>
                    </div>
                  ) : (
                    <div className={styles.gradeBubble} style={{ color: "#94a3b8", background: "#f8fafc", borderColor: "#e2e8f0" }}>
                      <span className={styles.gradeNum}>—</span>
                      <span className={styles.gradeOf}>/{s.maxGrade}</span>
                    </div>
                  )}

                  {/* Status chip */}
                  <span className={styles.statusChip}
                    style={{ color: statusCol, background: statusBg, borderColor: statusBrd }}>
                    {statusLbl}
                  </span>

                  {/* Action buttons */}
                  {isPending && (
                    <div className={styles.actionBtns}>
                      <motion.button className={styles.approveBtn}
                        onClick={() => setApproveT(s)}
                        whileHover={{ scale: 1.06, filter: "brightness(1.08)" }}
                        whileTap={{ scale: 0.93 }}>
                        ✅ Approve
                      </motion.button>
                      <motion.button className={styles.rejectBtn}
                        onClick={() => setRejectT(s)}
                        whileHover={{ scale: 1.06, filter: "brightness(1.08)" }}
                        whileTap={{ scale: 0.93 }}>
                        ❌ Reject
                      </motion.button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {shown.length === 0 && (
          <motion.div className={styles.empty} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <span style={{ fontSize: 44 }}>📭</span>
            <p>No {filter === "all" ? "" : filter} submissions</p>
          </motion.div>
        )}
      </div>

      {/* ── Modals ── */}
      <AnimatePresence>
        {approveT && <ApproveModal subs={approveT} onConfirm={doApprove} onClose={() => setApproveT(null)} />}
        {rejectT  && <RejectModal  subs={rejectT}  onConfirm={doReject}  onClose={() => setRejectT(null)}  />}
      </AnimatePresence>
    </div>
  );
}