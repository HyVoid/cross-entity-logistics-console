export const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[SafeLocalStorage] Failed to read ${key} from localStorage:`, e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[SafeLocalStorage] Failed to write ${key} to localStorage:`, e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[SafeLocalStorage] Failed to remove ${key} from localStorage:`, e);
    }
  }
};

export const safeConfirm = (message: string): boolean => {
  try {
    return window.confirm(message);
  } catch (e) {
    console.warn("window.confirm blocked or failed in sandboxed context:", e);
    return true; // Auto-confirm to proceed without blocking UI
  }
};

export const safeAlert = (message: string): void => {
  try {
    window.alert(message);
  } catch (e) {
    console.warn("window.alert blocked or failed in sandboxed context:", e);
  }
};
