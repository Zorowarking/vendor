import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { View, ActivityIndicator } from 'react-native';

export default function Layout() {
  const { isAuthenticated, role, profileStatus } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const inAuthGroup = segments[0] === 'auth';
    const currentScreen = segments[1];

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated
      router.replace('/auth/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Role-based redirection after login
      if (!role && currentScreen !== 'role-select') {
        router.replace('/auth/role-select');
      } else if (role && profileStatus === 'PENDING') {
        // If they are already on one of the registration screens or KYC hub, don't redirect
        const onboardingScreens = ['vendor-register', 'vendor-bank', 'rider-register', 'rider-bank', 'kyc'];
        const currentPath = segments.join('/');
        
        if (!onboardingScreens.some(screen => currentPath.includes(screen)) && currentScreen !== 'role-select') {
          if (role === 'VENDOR') router.replace('/auth/vendor-register');
          else if (role === 'RIDER') router.replace('/auth/rider-register');
        }
      } else if (profileStatus === 'UNDER_REVIEW') {
        if (!segments[0].includes('kyc')) {
          router.replace('/kyc/status');
        }
      } else if (profileStatus === 'READY') {
        // Redirect to main app based on role
        if (role === 'VENDOR' && segments[0] !== '(vendor)') router.replace('/vendor');
        else if (role === 'RIDER' && segments[0] !== '(rider)') router.replace('/rider');
      }
    }
  }, [isAuthenticated, role, profileStatus, segments, isMounted]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
      <Stack.Screen name="auth/otp-verify" options={{ title: 'Verify OTP' }} />
      <Stack.Screen name="auth/role-select" options={{ title: 'Role Selection' }} />
    </Stack>
  );
}
