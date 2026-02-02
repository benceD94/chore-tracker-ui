import { createContext } from "react";
import type { User } from "firebase/auth";

export type AuthContextValue = {
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

export const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: defaultCallback,
  getIdToken: defaultGetIdToken,
});
