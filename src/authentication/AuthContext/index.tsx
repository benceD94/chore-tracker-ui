import { onAuthStateChanged, type User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { ensureUserProfile } from "../../infra/users";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  logout: () => void;
};

const defaultCallback = () => {
  throw new Error('AuthContext not initialized.');
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: defaultCallback,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) ensureUserProfile(firebaseUser)
      setLoading(false);
    }, (err) => {
      console.error('Auth state change error', err)
    });
  }, []);

  const logout = () => {
    auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
