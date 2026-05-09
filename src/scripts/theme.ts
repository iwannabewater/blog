const THEME = "theme";
const LIGHT = "light";
const DARK = "dark";
const SYSTEM = "system";
const MODES = [SYSTEM, LIGHT, DARK] as const;

type ThemeMode = (typeof MODES)[number];

function isThemeMode(value: string | null | undefined): value is ThemeMode {
  return value === SYSTEM || value === LIGHT || value === DARK;
}

function getStoredMode(): ThemeMode {
  const stored = localStorage.getItem(THEME);
  return isThemeMode(stored) ? stored : SYSTEM;
}

function resolveTheme(mode: ThemeMode): typeof LIGHT | typeof DARK {
  if (mode === LIGHT || mode === DARK) return mode;

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? DARK
    : LIGHT;
}

let themeMode: ThemeMode = isThemeMode(window.theme?.themeMode)
  ? window.theme.themeMode
  : getStoredMode();
let themeValue = resolveTheme(themeMode);

function setPreference(): void {
  localStorage.setItem(THEME, themeMode);
  reflectPreference();
}

function setButtonState(): void {
  const button = document.querySelector("#theme-btn");
  if (!(button instanceof HTMLButtonElement)) return;

  const labels: Record<ThemeMode, string> = {
    system: "跟随系统",
    light: "白天模式",
    dark: "夜间模式",
  };

  button.dataset.themeMode = themeMode;
  button.setAttribute("aria-label", `当前主题：${labels[themeMode]}`);
  button.setAttribute("title", `当前主题：${labels[themeMode]}，点击切换`);
}

function reflectPreference(): void {
  themeValue = resolveTheme(themeMode);
  if (window.theme) {
    window.theme.themeMode = themeMode;
    window.theme.themeValue = themeValue;
  }
  document.firstElementChild?.setAttribute("data-theme", themeValue);
  document.firstElementChild?.setAttribute("data-theme-mode", themeMode);
  setButtonState();

  const body = document.body;
  if (!body) return;

  const bgColor = window.getComputedStyle(body).backgroundColor;
  document
    .querySelector("meta[name='theme-color']")
    ?.setAttribute("content", bgColor);
}

function setThemeMode(mode: string): void {
  themeMode = isThemeMode(mode) ? mode : SYSTEM;
  themeValue = resolveTheme(themeMode);
  if (window.theme) {
    window.theme.themeMode = themeMode;
    window.theme.themeValue = themeValue;
  }
}

if (window.theme) {
  window.theme.setPreference = setPreference;
  window.theme.reflectPreference = reflectPreference;
  window.theme.getMode = () => themeMode;
  window.theme.getTheme = () => themeValue;
  window.theme.setMode = setThemeMode;
  window.theme.setTheme = (val: string) => {
    themeValue = val === DARK ? DARK : LIGHT;
    window.theme!.themeValue = themeValue;
  };
} else {
  window.theme = {
    themeMode,
    themeValue,
    setPreference,
    reflectPreference,
    getMode: () => themeMode,
    getTheme: () => themeValue,
    setMode: setThemeMode,
    setTheme: (val: string) => {
      themeValue = val === DARK ? DARK : LIGHT;
      window.theme!.themeValue = themeValue;
    },
  };
}

function cycleMode(): void {
  const index = MODES.indexOf(themeMode);
  const nextMode = MODES[(index + 1) % MODES.length];
  setThemeMode(nextMode);
  setPreference();
}

function setThemeFeature(): void {
  reflectPreference();

  const button = document.querySelector("#theme-btn");
  if (!(button instanceof HTMLButtonElement) || button.dataset.bound === "true")
    return;

  button.dataset.bound = "true";
  button.addEventListener("click", cycleMode);
}

setThemeFeature();

document.addEventListener("astro:after-swap", setThemeFeature);

document.addEventListener("astro:before-swap", event => {
  const astroEvent = event;
  const bgColor = document
    .querySelector("meta[name='theme-color']")
    ?.getAttribute("content");

  if (bgColor) {
    astroEvent.newDocument
      .querySelector("meta[name='theme-color']")
      ?.setAttribute("content", bgColor);
  }
});

window
  .matchMedia("(prefers-color-scheme: dark)")
  .addEventListener("change", () => {
    if (themeMode !== SYSTEM) return;
    reflectPreference();
  });
