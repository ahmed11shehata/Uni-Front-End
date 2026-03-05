import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useAuth } from "../../hooks/useAuth";
import { loginUser } from "../../services/api/authApi";
import styles from "./LoginPage.module.css";

const ROLES = [
  {
    value: "student",
    label: "Student",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 14l9-5-9-5-9 5 9 5z"/>
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
      </svg>
    ),
  },
  {
    value: "instructor",
    label: "Instructor",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="2" y="3" width="20" height="14" rx="2"/>
        <path d="M8 21h8M12 17v4"/>
        <path d="M7 8h4M7 11h3"/>
      </svg>
    ),
  },
  {
    value: "admin",
    label: "Admin",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
        <path d="M18 14l2 2 4-4" strokeLinecap="round"/>
      </svg>
    ),
  },
];

function RoleCard({ role, selected, onSelect }) {
  return (
    <motion.button
      type="button"
      className={`${styles.roleCard} ${selected ? styles.roleCardActive : ""}`}
      onClick={() => onSelect(role.value)}
      whileHover={{ y: -4, scale: 1.03 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className={styles.roleIcon}>{role.icon}</span>
      <span className={styles.roleLabel}>{role.label}</span>
      <AnimatePresence>
        {selected && (
          <motion.span
            className={styles.roleCheck}
            initial={{ scale: 0, rotate: -90 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}

// ── Running Cat SVG Animation ────────────────────
function RunningCat() {
  return (
    <motion.div
      className={styles.catWrap}
      animate={{ x: ["0%", "110%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
    >
      <svg viewBox="0 0 120 60" fill="none" xmlns="http://www.w3.org/2000/svg" className={styles.catSvg}>
        {/* Body */}
        <motion.ellipse cx="55" cy="35" rx="28" ry="16" fill="rgba(255,255,255,0.15)"
          animate={{ ry: [16, 14, 16] }}
          transition={{ duration: 0.4, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Head */}
        <circle cx="84" cy="28" r="14" fill="rgba(255,255,255,0.15)" />
        {/* Ears */}
        <polygon points="76,18 80,8 85,18" fill="rgba(255,255,255,0.2)" />
        <polygon points="85,18 90,8 94,18" fill="rgba(255,255,255,0.2)" />
        {/* Eyes */}
        <ellipse cx="80" cy="27" rx="2.5" ry="2" fill="white" opacity="0.9"/>
        <ellipse cx="89" cy="27" rx="2.5" ry="2" fill="white" opacity="0.9"/>
        <circle cx="80" cy="27" r="1.2" fill="#1a2456"/>
        <circle cx="89" cy="27" r="1.2" fill="#1a2456"/>
        {/* Nose */}
        <ellipse cx="84" cy="31" rx="1.5" ry="1" fill="#f5a623" opacity="0.9"/>
        {/* Whiskers */}
        <line x1="70" y1="30" x2="82" y2="31" stroke="white" strokeWidth="0.8" opacity="0.6"/>
        <line x1="70" y1="33" x2="82" y2="32" stroke="white" strokeWidth="0.8" opacity="0.6"/>
        <line x1="86" y1="31" x2="98" y2="30" stroke="white" strokeWidth="0.8" opacity="0.6"/>
        <line x1="86" y1="32" x2="98" y2="33" stroke="white" strokeWidth="0.8" opacity="0.6"/>
        {/* Tail */}
        <motion.path
          d="M27 35 Q10 20 15 10"
          stroke="rgba(255,255,255,0.2)" strokeWidth="5" strokeLinecap="round" fill="none"
          animate={{ d: ["M27 35 Q10 20 15 10", "M27 35 Q10 30 20 15", "M27 35 Q10 20 15 10"] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Front legs */}
        <motion.line x1="65" y1="48" x2="60" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round"
          animate={{ x2: [60, 68, 60], y2: [58, 54, 58] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.line x1="72" y1="50" x2="68" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round"
          animate={{ x2: [68, 60, 68], y2: [58, 54, 58] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut", delay: 0.17 }}
        />
        {/* Back legs */}
        <motion.line x1="42" y1="48" x2="36" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round"
          animate={{ x2: [36, 44, 36], y2: [58, 54, 58] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut", delay: 0.17 }}
        />
        <motion.line x1="50" y1="50" x2="44" y2="58" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round"
          animate={{ x2: [44, 36, 44], y2: [58, 54, 58] }}
          transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>

      {/* Shadow under cat */}
      <motion.div
        className={styles.catShadow}
        animate={{ scaleX: [1, 0.85, 1], opacity: [0.3, 0.2, 0.3] }}
        transition={{ duration: 0.35, repeat: Infinity, ease: "easeInOut" }}
      />
    </motion.div>
  );
}

// ── Floating Stars ───────────────────────────────
function FloatingStars() {
  const stars = [
    { x: "15%", y: "20%", delay: 0 },
    { x: "80%", y: "15%", delay: 0.5 },
    { x: "60%", y: "70%", delay: 1 },
    { x: "25%", y: "75%", delay: 1.5 },
    { x: "90%", y: "55%", delay: 0.8 },
    { x: "45%", y: "25%", delay: 1.2 },
  ];
  return (
    <>
      {stars.map((s, i) => (
        <motion.div
          key={i}
          className={styles.star}
          style={{ left: s.x, top: s.y }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: s.delay, ease: "easeInOut" }}
        >
          ✦
        </motion.div>
      ))}
    </>
  );
}

export default function LoginPage() {
  const navigate  = useNavigate();
  const { login } = useAuth();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.trim()) return setError("Please enter your email");
    if (!password)     return setError("Please enter your password");
    setLoading(true);
    try {
      const data = await loginUser({ email: email.trim(), password, role });
      login(data.user, data.token);
      toast.success("Welcome, " + data.user.name + "!");
      const routes = {
        admin:      "/admin/dashboard",
        instructor: "/instructor/dashboard",
        student:    "/student/dashboard",
      };
      navigate(routes[data.user.role], { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>

      {/* Background */}
      <div className={styles.bgDecor}>
        <div className={styles.bgOrb1} />
        <div className={styles.bgOrb2} />
        <div className={styles.bgOrb3} />
      </div>

      {/* ── Brand Panel ── */}
      <motion.aside
        className={styles.brandPanel}
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <FloatingStars />

        <div className={styles.brandInner}>

          {/* Logo */}
          <div className={styles.logoSection}>
            <motion.div
              className={styles.logoCircle}
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <svg viewBox="0 0 100 100" fill="none" className={styles.capSvg}>
                {/* Glow ring */}
                <circle cx="50" cy="50" r="46" stroke="rgba(245,166,35,0.3)" strokeWidth="2"/>
                {/* Cap flat top */}
                <motion.polygon
                  points="50,20 88,38 50,56 12,38"
                  fill="white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
                />
                {/* Cap body */}
                <motion.path
                  d="M24 46 L24 66 Q24 80 50 80 Q76 80 76 66 L76 46 L50 56 Z"
                  fill="rgba(255,255,255,0.85)"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 0.85, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                />
                {/* Tassel */}
                <motion.line x1="88" y1="38" x2="88" y2="62"
                  stroke="white" strokeWidth="3.5" strokeLinecap="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                />
                <motion.circle cx="88" cy="66" r="5" fill="#f5a623"
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 1 }}
                />
              </svg>
            </motion.div>

            <motion.h1 className={styles.brandName}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              AKHBAR ELYOM
            </motion.h1>

            <motion.p className={styles.brandSub}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
            >
              Academy for students
            </motion.p>

            <motion.div className={styles.divider}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
            />
          </div>

          {/* Feature Cards */}
          <div className={styles.brandFeatures}>
            {[
              { icon: "📊", text: "Track grades & GPA" },
              { icon: "📅", text: "Interactive timetable" },
              { icon: "🤖", text: "AI study tools" },
              { icon: "📁", text: "Submit assignments" },
            ].map((f, i) => (
              <motion.div key={f.text} className={styles.featureItem}
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 + i * 0.12, type: "spring", stiffness: 200 }}
                whileHover={{ x: 6, scale: 1.02 }}
              >
                <span className={styles.featureIcon}>{f.icon}</span>
                <span>{f.text}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Running Cat at the bottom */}
        <div className={styles.catTrack}>
          <div className={styles.catTrackLine} />
          <RunningCat />
        </div>
      </motion.aside>

      {/* ── Form Panel ── */}
      <main className={styles.formPanel}>
        <motion.div className={styles.formCard}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className={styles.formHeader}>
            <motion.div className={styles.formHeaderIcon}
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              🎓
            </motion.div>
            <h2>Welcome Back</h2>
            <p>Select your role and sign in to continue</p>
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Your Role</label>
            <div className={styles.roleGrid}>
              {ROLES.map((r) => (
                <RoleCard key={r.value} role={r} selected={role === r.value} onSelect={setRole} />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            <div className={styles.fieldGroup}>
              <label htmlFor="email" className={styles.fieldLabel}>Email Address</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                </span>
                <input id="email" type="email" className={styles.input}
                  placeholder="example@uni.edu" value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(""); }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="password" className={styles.fieldLabel}>Password</label>
              <div className={styles.inputWrap}>
                <span className={styles.inputIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/>
                    <path d="M7 11V7a5 5 0 0110 0v4"/>
                  </svg>
                </span>
                <input id="password" type={showPass ? "text" : "password"}
                  className={styles.input} placeholder="••••••••" value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  autoComplete="current-password"
                />
                <button type="button" className={styles.eyeBtn} onClick={() => setShowPass(p => !p)}>
                  {showPass ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div className={styles.errorBox}
                  initial={{ opacity: 0, y: -8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }} role="alert"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span>{error}</span>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button type="submit" className={styles.submitBtn}
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02, boxShadow: "0 12px 32px rgba(99,60,180,0.4)" }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
            >
              {loading ? (
                <><span className={styles.spinner} /><span>Signing in...</span></>
              ) : (
                <>
                  <span>Sign In</span>
                  <motion.svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <line x1="5" y1="12" x2="19" y2="12"/>
                    <polyline points="12 5 19 12 12 19"/>
                  </motion.svg>
                </>
              )}
            </motion.button>
          </form>

          <div className={styles.devHint}>
            <span className={styles.devBadge}>DEV</span>
            <span>
              <strong>admin@uni.edu</strong> / admin123 &nbsp;·&nbsp;
              <strong>instructor@uni.edu</strong> / inst123 &nbsp;·&nbsp;
              <strong>student@uni.edu</strong> / std123
            </span>
          </div>
        </motion.div>
      </main>
    </div>
  );
}