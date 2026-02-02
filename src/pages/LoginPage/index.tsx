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
import { useToast } from '../../components/ToastProvider/hooks';

const provider = new GoogleAuthProvider();

export const LoginPage: React.FC = () => {
  const {notify} = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate(from, { replace: true });
    } catch (error: unknown) {
      notify.error('Google sign-in error');
      console.error("Google sign-in error", error);
    }
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