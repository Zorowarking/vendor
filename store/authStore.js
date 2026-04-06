import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create((set) => ({
  user: null,
  role: null, // 'VENDOR' | 'RIDER'
  sessionToken: null,
  isAuthenticated: false,
  profileStatus: null, // 'PENDING' | 'KYC_SUBMITTED' | 'READY'
  kycDocs: {},

  login: (userData) => {
    set({
      user: userData.user,
      role: userData.role,
      sessionToken: userData.sessionToken,
      isAuthenticated: true,
      profileStatus: userData.profileStatus,
      kycDocs: {},
    });
    // Persist session if needed
  },

  logout: async () => {
    await AsyncStorage.removeItem('sessionToken');
    set({
      user: null,
      role: null,
      sessionToken: null,
      isAuthenticated: false,
      profileStatus: null,
      kycDocs: {},
    });
  },

  setProfileStatus: (status) => set({ profileStatus: status }),
  setRole: (role) => set({ role }),
  setKycDoc: (docId, data) => set((state) => ({ kycDocs: { ...state.kycDocs, [docId]: data } })),
}));
