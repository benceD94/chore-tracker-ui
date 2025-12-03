import React from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { Button } from '@mui/material';
import { auth } from "../../utils/firebase";
import { useAuth } from "../../hooks/useAuth";

const provider = new GoogleAuthProvider();

export const GoogleLoginButton: React.FC = () => {
  const { user, initializing } = useAuth();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const loggedInUser = result.user;
      console.log("Signed in as:", loggedInUser.displayName, loggedInUser.email);

      // Optional: access Google OAuth token
      const cred = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = cred?.accessToken;
      console.log("Access token:", accessToken);
    } catch (error: any) {
      console.error("Google sign-in error", error);
      alert(error.message || "Failed to sign in");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout error", error);
    }
  };

  if (initializing) return <div>Loading...</div>;

  if (user) {
    return (
      <div>
        <p>
          Logged in as <strong>{user.displayName || user.email}</strong>
        </p>
        <button onClick={handleLogout}>Sign out</button>
      </div>
    );
  }

  return (
    <Button variant="contained" onClick={handleLogin}>
      Sign in with Google
    </Button>
  );
};
