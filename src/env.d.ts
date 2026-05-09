interface Window {
  theme?: {
    themeMode: string;
    themeValue: string;
    setPreference: () => void;
    reflectPreference: () => void;
    getTheme: () => string;
    getMode: () => string;
    setTheme: (val: string) => void;
    setMode: (val: string) => void;
  };
}
