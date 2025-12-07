import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate, useLocation } from "react-router";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Container,
} from '@mui/material';
import { Google } from '@mui/icons-material';
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
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <Container maxWidth="sm">
        <Card
          sx={{
            boxShadow: 3,
          }}
        >
          <CardContent
            sx={{
              p: 6,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            {/* App Icon/Logo */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: 2,
                bgcolor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h3" sx={{ color: 'white' }}>
                ✓
              </Typography>
            </Box>

            {/* Title */}
            <Typography variant="h4" component="h1" align="center">
              Chore Tracker
            </Typography>

            {/* Subtitle */}
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ mb: 2 }}
            >
              Track chores, earn points, and keep your household organized.
            </Typography>

            {/* Login Button */}
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Google />}
              onClick={handleLogin}
              sx={{
                py: 1.5,
                textTransform: 'none',
              }}
            >
              Continue with Google
            </Button>

            {/* Footer Text */}
            <Typography
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{ mt: 2 }}
            >
              By continuing, you agree to our Terms of Service and Privacy
              Policy
            </Typography>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}