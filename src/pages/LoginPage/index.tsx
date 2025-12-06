import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import React from "react";
import { useNavigate, useLocation } from "react-router";
import { auth } from "../../utils/firebase";

const provider = new GoogleAuthProvider();

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation() as any;

  const from = location.state?.from?.pathname || "/dashboard";

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
    navigate(from, { replace: true });
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Google</button>
    </div>
  );
};
