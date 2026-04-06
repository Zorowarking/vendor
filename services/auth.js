import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { auth } from './firebase';
import { 
  signInWithPhoneNumber, 
  GoogleAuthProvider, 
  signInWithCredential 
} from 'firebase/auth';
import { Alert } from 'react-native';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

export const authService = {
  // Google Login Implementation (Web/Expo Go version)
  googleLogin: async () => {
    try {
      // In Expo Go, Google Login with the JS SDK usually requires AuthSession
      // For now, we will maintain a placeholder or use Mock until AuthSession is configured
      Alert.alert('Info', 'Google Login in Expo Go requires additional configuration. Use OTP for now.');
      return null;
    } catch (error) {
      console.error('Google Login Error:', error);
      Alert.alert('Error', 'Google login failed');
      throw error;
    }
  },

  /**
   * Sends an OTP via Firebase Web SDK
   * @param {string} phoneNumber 
   * @param {object} recaptchaVerifier - Reference to the Recaptcha modal verifier
   */
  sendOTP: async (phoneNumber, recaptchaVerifier) => {
    try {
      console.log('--- STARTING SEND_OTP ---');
      console.log('Phone:', phoneNumber);
      
      if (!recaptchaVerifier) {
        throw new Error('Recaptcha verifier is required for Web SDK Phone Auth');
      }

      // signInWithPhoneNumber returns a confirmationResult object
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
      console.log('--- OTP SENT SUCCESSFULLY ---');
      return confirmationResult;
    } catch (error) {
      console.error('--- SEND_OTP ERROR ---', error);
      let message = 'Failed to send OTP. Please try again.';
      if (error.code === 'auth/captcha-check-failed') {
        message = 'Recaptcha verification failed. Please try again.';
      } else if (error.code === 'auth/invalid-phone-number') {
        message = 'Invalid phone number format.';
      }
      Alert.alert('Error', message);
      throw error;
    }
  },

  /**
   * Verifies an OTP code using the confirmationResult
   * @param {object} confirmationResult 
   * @param {string} code 
   */
  verifyOTP: async (confirmationResult, code) => {
    try {
      console.log('--- STARTING VERIFY_OTP ---');
      console.log('Code length:', code.length);

      if (!confirmationResult || !confirmationResult.confirm) {
        throw new Error('No confirmation result object found. Please try sending OTP again.');
      }
      
      const result = await confirmationResult.confirm(code);
      console.log('--- OTP VERIFIED SUCCESSFULLY ---');
      const user = result.user;
      
      const role = null; // New user for this demo
      const profileStatus = 'PENDING';
      const sessionToken = await user.getIdToken();

      useAuthStore.getState().login({
        user: { uid: user.uid, phoneNumber: user.phoneNumber },
        role,
        profileStatus,
        sessionToken,
      });

      return { role, profileStatus };
    } catch (error) {
      console.error('--- VERIFY_OTP ERROR ---', error);
      Alert.alert('Error', 'Invalid OTP code. Please check and try again.');
      throw error;
    }
  },

  logout: async () => {
    try {
      await auth.signOut();
      await useAuthStore.getState().logout();
    } catch (error) {
      console.error('Logout Error:', error);
      throw error;
    }
  },
};
