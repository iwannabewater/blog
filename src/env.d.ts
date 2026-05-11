interface Window {
  __luowenAnalytics?: {
    endpoint: string;
    lastPath: string;
    lastSentAt: number;
    sendPageview: () => void;
  };
  doNotTrack?: string;
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

interface Navigator {
  globalPrivacyControl?: boolean;
}
