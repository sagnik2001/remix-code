
const ISSERVER = typeof window === "undefined";

const LocalStorage = {
  setItem: (key: string, value: string) => {
    if (!ISSERVER) {
      try {
        window.localStorage.setItem(key, value);
      } catch (e) {
        console.error("localStorage.setItem failed:", e);
      }
    }
  },
  getItem: (key: string): string | null => {
    return ISSERVER ? null : window.localStorage.getItem(key);
  },
  removeItem: (key: string) => {
    if (!ISSERVER) {
      window.localStorage.removeItem(key);
    }
  },
};

export const SessionStorage = {
  setItem: (key: string, value: string) => {
    if (!ISSERVER) {
      window.sessionStorage.setItem(key, value);
    }
  },
  getItem: (key: string): string | null => {
    return ISSERVER ? null : window.sessionStorage.getItem(key);
  },
  removeItem: (key: string) => {
    if (!ISSERVER) {
      window.sessionStorage.removeItem(key);
    }
  },
  clear: () => {
    if (!ISSERVER) {
      window.sessionStorage.clear();
    }
  },
};

export default LocalStorage;
