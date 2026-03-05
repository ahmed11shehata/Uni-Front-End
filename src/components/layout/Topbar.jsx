import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../hooks/useAuth";
import styles from "./Topbar.module.css";

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "quiz",       title: "Quiz Tomorrow",       desc: "Physics quiz at 10:00 AM",         time: "2h ago",  unread: true  },
  { id: 2, type: "assignment", title: "Assignment Due",      desc: "Math assignment due in 3 days",    time: "5h ago",  unread: true  },
  { id: 3, type: "grade",      title: "Grade Posted",        desc: "Your Chemistry grade is posted",   time: "1d ago",  unread: false },
  { id: 4, type: "course",     title: "New Course Added",    desc: "Software Design is now available", time: "2d ago",  unread: false },
];

const NOTIF_COLORS = {
  quiz:       "#6b46c1",
  assignment: "#dc2626",
  grade:      "#10b981",
  course:     "#0891b2",
};

const NOTIF_ICONS = {
  quiz:       "📝",
  assignment: "📋",
  grade:      "📊",
  course:     "📚",
};

const ROLE_LABELS = {
  student:    "Student Portal",
  instructor: "Instructor Portal",
  admin:      "Admin Panel",
};

function getTimeOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

export default function Topbar() {
  const { user } = useAuth();
  const [showNotif, setShowNotif]     = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <h1 className={styles.portalTitle}>{ROLE_LABELS[user?.role]}</h1>
        <span className={styles.greeting}>
          Good {getTimeOfDay()}, <strong>{user?.name?.split(" ")[0]}</strong> 👋
        </span>
      </div>

      <div className={styles.right}>

        {/* Notifications */}
        <div className={styles.notifWrap}>
          <motion.button className={styles.iconBtn}
            onClick={() => setShowNotif(p => !p)}
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 01-3.46 0"/>
            </svg>
            {unreadCount > 0 && (
              <motion.span className={styles.badge}
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500 }}
              >
                {unreadCount}
              </motion.span>
            )}
          </motion.button>

          <AnimatePresence>
            {showNotif && (
              <>
                <div className={styles.overlay} onClick={() => setShowNotif(false)} />
                <motion.div className={styles.notifDropdown}
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className={styles.notifHeader}>
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <button className={styles.markRead} onClick={markAllRead}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className={styles.notifList}>
                    {notifications.map((n, i) => (
                      <motion.div key={n.id}
                        className={`${styles.notifItem} ${n.unread ? styles.notifUnread : ""}`}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => setNotifications(prev =>
                          prev.map(x => x.id === n.id ? { ...x, unread: false } : x)
                        )}
                      >
                        <div className={styles.notifIconWrap}
                          style={{ background: NOTIF_COLORS[n.type] + "22", color: NOTIF_COLORS[n.type] }}
                        >
                          {NOTIF_ICONS[n.type]}
                        </div>
                        <div className={styles.notifContent}>
                          <span className={styles.notifTitle}>{n.title}</span>
                          <span className={styles.notifDesc}>{n.desc}</span>
                          <span className={styles.notifTime}>{n.time}</span>
                        </div>
                        {n.unread && (
                          <div className={styles.unreadDot}
                            style={{ background: NOTIF_COLORS[n.type] }}
                          />
                        )}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Avatar */}
        <div className={styles.avatar}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
      </div>
    </header>
  );
}