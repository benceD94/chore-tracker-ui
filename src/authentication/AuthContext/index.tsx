import { onAuthStateChanged, type User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../../utils/firebase";
import { authService } from "../../api/services/authService";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  logout: () => void;
  getIdToken: () => Promise<string | null>;
};

const defaultCallback = () => {
  throw new Error('AuthContext not initialized.');
};

const defaultGetIdToken = async () => {
  throw new Error('AuthContext not initialized.');
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: defaultCallback,
  getIdToken: defaultGetIdToken,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser) => {
        setUser(firebaseUser);

        // If user is signed in, validate with backend
        if (firebaseUser) {
          try {
            const idToken = await firebaseUser.getIdToken();
            await authService.login(idToken);
          } catch (error) {
            console.error('Backend login error:', error);
            // If backend login fails, sign out the user
            await auth.signOut();
            setUser(null);
          }
        }

        setLoading(false);
      },
      (err) => {
        console.error('Auth state change error:', err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Backend logout error:', error);
    } finally {
      await auth.signOut();
    }
  };

  const getIdToken = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout, getIdToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
