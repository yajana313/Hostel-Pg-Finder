import { useState } from "react";
import AuthContext from "./authContextInstance";

const STORAGE_KEY = "campusnest_user";

function readStoredUser() {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(STORAGE_KEY);
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(readStoredUser);

  // `remember` controls whether the session survives closing the browser
  // (localStorage) or only lasts the current tab (sessionStorage) — backs
  // the "Remember me" checkbox on the login form.
  const setUser = (nextUser, remember = true) => {
    setUserState(nextUser);
    try {
      localStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(STORAGE_KEY);
      if (nextUser) {
        (remember ? localStorage : sessionStorage).setItem(STORAGE_KEY, JSON.stringify(nextUser));
      }
    } catch {
      // storage unavailable — ignore, session just won't persist
    }
  };

  const logout = () => setUser(null);

  // Patches the signed-in user (e.g. after a profile edit) without
  // disturbing which storage ("remember me" or not) is in use.
  const updateUser = (patch) => {
    const remember = !!localStorage.getItem(STORAGE_KEY);
    setUser({ ...user, ...patch }, remember);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
