// src/context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

export const THEMES = {

  /* ── 1. Default ── */
  default: {
    id: "default", name: "Default", emoji: "☀️",
    desc: "Clean & professional", dark: false,
    vars: {
      "--page-bg": "#f0f4f8", "--sidebar-bg": "#1c2035",
      "--topbar-bg": "#ffffff", "--topbar-border": "#e8edf4",
      "--card-bg": "#ffffff", "--card-bg-2": "#f7f9fc",
      "--card-border": "#e2e8f0", "--border": "#e2e8f0",
      "--text-primary": "#0f172a", "--text-secondary": "#475569",
      "--text-muted": "#94a3b8", "--prog-track": "#f1f5f9",
      "--detail-bg": "#f7f9fc", "--detail-border": "#edf2f7",
      "--input-bg": "#ffffff", "--hover-bg": "#f1f5f9",
    },
  },

  /* ── 2. Light Sage ── */
  light: {
    id: "light", name: "Light Sage", emoji: "🌿",
    desc: "Fresh, calm & easy on eyes", dark: false,
    vars: {
      "--page-bg": "#f0f5f2", "--sidebar-bg": "#1a3328",
      "--topbar-bg": "#ffffff", "--topbar-border": "#d4e8dc",
      "--card-bg": "#ffffff", "--card-bg-2": "#eef6f1",
      "--card-border": "#cce4d8", "--border": "#cce4d8",
      "--text-primary": "#0d2218", "--text-secondary": "#2e6b4a",
      "--text-muted": "#6aaa87", "--prog-track": "#d8f0e4",
      "--detail-bg": "#eef6f1", "--detail-border": "#d4e8dc",
      "--input-bg": "#ffffff", "--hover-bg": "#e4f2ea",
    },
  },

  /* ── 3. Dark Slate ── */
  dark: {
    id: "dark", name: "Dark Slate", emoji: "🌑",
    desc: "Comfortable dark mode", dark: true,
    vars: {
      "--page-bg": "#111827", "--sidebar-bg": "#0b0f1a",
      "--topbar-bg": "#161e2e", "--topbar-border": "#1e2d40",
      "--card-bg": "#1e2535", "--card-bg-2": "#253045",
      "--card-border": "#2a3850", "--border": "#2e405a",
      "--text-primary": "#e8edf8", "--text-secondary": "#8fa4c8",
      "--text-muted": "#4e6080", "--prog-track": "#253045",
      "--detail-bg": "#253045", "--detail-border": "#2a3850",
      "--input-bg": "#1e2535", "--hover-bg": "#2a3850",
    },
  },

  /* ── 4. Ramadan Night ── */
  ramadan: {
    id: "ramadan", name: "Ramadan Night", emoji: "🌙",
    desc: "The magic of holy nights", dark: true,
    vars: {
      "--page-bg": "#0e0820", "--sidebar-bg": "#08041a",
      "--topbar-bg": "#140a28", "--topbar-border": "#2c1458",
      "--card-bg": "#1a0e38", "--card-bg-2": "#221548",
      "--card-border": "#3a1e6a", "--border": "#4a2880",
      "--text-primary": "#f0e4c0", "--text-secondary": "#d4af37",
      "--text-muted": "#8a6c40", "--prog-track": "#221548",
      "--detail-bg": "#221548", "--detail-border": "#3a1e6a",
      "--input-bg": "#1a0e38", "--hover-bg": "#2c1a50",
    },
  },

  /* ── 5. Deep Ocean ── */
  ocean: {
    id: "ocean", name: "Deep Ocean", emoji: "🌊",
    desc: "Calm like the deep sea", dark: true,
    vars: {
      "--page-bg": "#071828", "--sidebar-bg": "#040d18",
      "--topbar-bg": "#0b2035", "--topbar-border": "#0f2e48",
      "--card-bg": "#0e2540", "--card-bg-2": "#133050",
      "--card-border": "#1a3e60", "--border": "#1e4a72",
      "--text-primary": "#d0e8f8", "--text-secondary": "#5cb8d8",
      "--text-muted": "#2a6885", "--prog-track": "#133050",
      "--detail-bg": "#133050", "--detail-border": "#1a3e60",
      "--input-bg": "#0e2540", "--hover-bg": "#1a3e60",
    },
  },

  /* ── 6. Cherry Blossom ── */
  sakura: {
    id: "sakura", name: "Cherry Blossom", emoji: "🌸",
    desc: "Soft spring vibes", dark: false,
    vars: {
      "--page-bg": "#fff4f7", "--sidebar-bg": "#420816",
      "--topbar-bg": "#ffffff", "--topbar-border": "#ffd0de",
      "--card-bg": "#ffffff", "--card-bg-2": "#fff0f5",
      "--card-border": "#ffc8d8", "--border": "#ffb0c8",
      "--text-primary": "#280810", "--text-secondary": "#9c1a44",
      "--text-muted": "#e08aaa", "--prog-track": "#fde8f0",
      "--detail-bg": "#fff5f9", "--detail-border": "#ffd0de",
      "--input-bg": "#ffffff", "--hover-bg": "#fde8f0",
    },
  },

  /* ── 7. Forest Night ── */
  forest: {
    id: "forest", name: "Forest Night", emoji: "🌲",
    desc: "Deep emerald & earth tones", dark: true,
    vars: {
      "--page-bg": "#0b1c10", "--sidebar-bg": "#060e08",
      "--topbar-bg": "#0e2014", "--topbar-border": "#1a3822",
      "--card-bg": "#132818", "--card-bg-2": "#1a3520",
      "--card-border": "#204828", "--border": "#285835",
      "--text-primary": "#ccead4", "--text-secondary": "#58b870",
      "--text-muted": "#34704a", "--prog-track": "#1a3520",
      "--detail-bg": "#1a3520", "--detail-border": "#204828",
      "--input-bg": "#132818", "--hover-bg": "#204828",
    },
  },

  /* ── 8. Sunset Gold ── */
  sunset: {
    id: "sunset", name: "Sunset Gold", emoji: "🌅",
    desc: "Warm amber glow", dark: false,
    vars: {
      "--page-bg": "#fef7ec", "--sidebar-bg": "#3a1005",
      "--topbar-bg": "#ffffff", "--topbar-border": "#fdd8a0",
      "--card-bg": "#ffffff", "--card-bg-2": "#fff8ee",
      "--card-border": "#fcdca0", "--border": "#f8c878",
      "--text-primary": "#1a0800", "--text-secondary": "#8a3010",
      "--text-muted": "#c07838", "--prog-track": "#fdefd0",
      "--detail-bg": "#fff8ee", "--detail-border": "#fdd8a0",
      "--input-bg": "#ffffff", "--hover-bg": "#fdefd0",
    },
  },

  /* ── 9. Space Explorer ── */
  space: {
    id: "space", name: "Space Explorer", emoji: "🚀",
    desc: "Cosmic dark — stars & nebula", dark: true,
    vars: {
      "--page-bg": "#060810", "--sidebar-bg": "#030508",
      "--topbar-bg": "#0c0e1c", "--topbar-border": "#181c38",
      "--card-bg": "#0e1028", "--card-bg-2": "#151840",
      "--card-border": "#1e2258", "--border": "#252868",
      "--text-primary": "#c8d4f8", "--text-secondary": "#6878e0",
      "--text-muted": "#363c80", "--prog-track": "#151840",
      "--detail-bg": "#151840", "--detail-border": "#1e2258",
      "--input-bg": "#0e1028", "--hover-bg": "#1e2258",
    },
  },

  /* ── 10. Nordic Ice ── */
  nordic: {
    id: "nordic", name: "Nordic Ice", emoji: "❄️",
    desc: "Cool, clean Scandinavian", dark: false,
    vars: {
      "--page-bg": "#f2f5fc", "--sidebar-bg": "#1c2e42",
      "--topbar-bg": "#ffffff", "--topbar-border": "#d4deee",
      "--card-bg": "#ffffff", "--card-bg-2": "#eef2fa",
      "--card-border": "#ccd8ec", "--border": "#b8ccdf",
      "--text-primary": "#132038", "--text-secondary": "#344e70",
      "--text-muted": "#7090b0", "--prog-track": "#dce8f4",
      "--detail-bg": "#eef2fa", "--detail-border": "#d4deee",
      "--input-bg": "#ffffff", "--hover-bg": "#e0e8f8",
    },
  },

  /* ── 11. Caramel Latte ── */
  caramel: {
    id: "caramel", name: "Caramel Latte", emoji: "☕",
    desc: "Warm cozy coffee vibes", dark: false,
    vars: {
      "--page-bg": "#fdf5ec", "--sidebar-bg": "#2a1408",
      "--topbar-bg": "#fffaf5", "--topbar-border": "#e8c89a",
      "--card-bg": "#fffaf5", "--card-bg-2": "#f7ede0",
      "--card-border": "#e0c4a0", "--border": "#d0a878",
      "--text-primary": "#180a00", "--text-secondary": "#6a3818",
      "--text-muted": "#b87848", "--prog-track": "#f0e0c8",
      "--detail-bg": "#f7ede0", "--detail-border": "#e8c89a",
      "--input-bg": "#fffaf5", "--hover-bg": "#f0e0c8",
    },
  },

  /* ══════════════════════════════════════
     ── 12. ARCTIC BLIZZARD ── NEW ──
     شديد الشتوي — ثلج وجليد وعواصف قطبية
  ══════════════════════════════════════ */
  arctic: {
    id: "arctic", name: "Arctic Blizzard", emoji: "🌨️",
    desc: "Frozen tundra — ice, snow & frost", dark: true,
    vars: {
      "--page-bg": "#040c18",        /* جلاميد جليدية سوداء عميقة */
      "--sidebar-bg": "#020609",     /* عتامة قطبية */
      "--topbar-bg": "#06101e",      /* سماء ليل قطبي */
      "--topbar-border": "#0e2238",
      "--card-bg": "#081428",        /* كارت كقطعة جليد داكنة */
      "--card-bg-2": "#0c1e38",
      "--card-border": "#1a3858",
      "--border": "#1e4870",
      "--text-primary": "#d8f0ff",   /* أبيض جليدي */
      "--text-secondary": "#7ab8e0", /* أزرق جليدي */
      "--text-muted": "#2a5878",     /* رمادي جليدي */
      "--prog-track": "#0c1e38",
      "--detail-bg": "#0c1e38",
      "--detail-border": "#1a3858",
      "--input-bg": "#081428",
      "--hover-bg": "#112540",
    },
  },

  /* ══════════════════════════════════════
     ── 13. PHARAOH'S EGYPT ── NEW ──
     الحضارة الفرعونية — ذهب، بردي، أهرامات
  ══════════════════════════════════════ */
  pharaoh: {
    id: "pharaoh", name: "Pharaoh's Egypt", emoji: "🏺",
    desc: "Ancient civilization — gold, papyrus & scarab", dark: true,
    vars: {
      "--page-bg": "#150900",        /* ليل صحراء النيل */
      "--sidebar-bg": "#0a0500",     /* ظلام المعبد */
      "--topbar-bg": "#1e0e02",      /* رمال الليل */
      "--topbar-border": "#3c1e08",
      "--card-bg": "#241408",        /* ورق البردي الداكن */
      "--card-bg-2": "#301c0e",
      "--card-border": "#503010",
      "--border": "#6a4020",
      "--text-primary": "#f0d888",   /* ذهب البردي */
      "--text-secondary": "#c88830", /* عنبر فرعوني */
      "--text-muted": "#7a5020",     /* رمال الصحراء */
      "--prog-track": "#301c0e",
      "--detail-bg": "#301c0e",
      "--detail-border": "#503010",
      "--input-bg": "#241408",
      "--hover-bg": "#3c2010",
    },
  },

  /* ══════════════════════════════════════
     ── 14. SALADIN'S LEGACY ── NEW ──
     صلاح الدين ومصر القديمة — نحاس، فيروز، رمال
  ══════════════════════════════════════ */
  saladin: {
    id: "saladin", name: "Saladin's Legacy", emoji: "⚔️",
    desc: "Islamic golden age — brass, turquoise & desert sand", dark: true,
    vars: {
      "--page-bg": "#0e0c04",        /* ليل القاهرة القديمة */
      "--sidebar-bg": "#080600",     /* ظلال القلعة */
      "--topbar-bg": "#16120a",      /* جلد قديم */
      "--topbar-border": "#34280e",
      "--card-bg": "#201808",        /* نحاس معتق */
      "--card-bg-2": "#2c2210",
      "--card-border": "#4a380a",
      "--border": "#6a5418",
      "--text-primary": "#f0e0a8",   /* رمل ذهبي */
      "--text-secondary": "#d4a840", /* نحاس أصفر */
      "--text-muted": "#7a6028",     /* تراب الصحراء */
      "--prog-track": "#2c2210",
      "--detail-bg": "#2c2210",
      "--detail-border": "#4a380a",
      "--input-bg": "#201808",
      "--hover-bg": "#382a0e",
    },
  },

  /* ══════════════════════════════════════
     ── 15. SILENT FOG ── NEW ──
     الضباب والشبورة — أجواء ساكنة مرعبة
  ══════════════════════════════════════ */
  fog: {
    id: "fog", name: "Silent Fog", emoji: "🌫️",
    desc: "Eerie mist — ghostly pale & haunting silence", dark: true,
    vars: {
      "--page-bg": "#0a0e10",        /* ظلام الضباب */
      "--sidebar-bg": "#050708",     /* عتمة مطلقة */
      "--topbar-bg": "#0e1418",      /* ضباب كثيف */
      "--topbar-border": "#1a2228",
      "--card-bg": "#121c20",        /* ظل في الضباب */
      "--card-bg-2": "#182428",
      "--card-border": "#243038",
      "--border": "#2e3e48",
      "--text-primary": "#b0c8c0",   /* وميض ضبابي شاحب */
      "--text-secondary": "#607870", /* رمادي مخضر */
      "--text-muted": "#304040",     /* ظل الضباب */
      "--prog-track": "#182428",
      "--detail-bg": "#182428",
      "--detail-border": "#243038",
      "--input-bg": "#121c20",
      "--hover-bg": "#1e2c32",
    },
  },
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(
    () => localStorage.getItem("uni_theme") || "default"
  );
  const theme = THEMES[themeId] || THEMES.default;

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([k, v]) => root.style.setProperty(k, v));
    root.setAttribute("data-theme", themeId);
    localStorage.setItem("uni_theme", themeId);
  }, [themeId, theme]);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setTheme: setThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);