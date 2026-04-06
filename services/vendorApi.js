import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';

const getClient = () => {
  const token = useAuthStore.getState().sessionToken;
  return axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};

export const vendorApi = {
  toggleStatus: async (isOnline) => {
    try {
      const client = getClient();
      const response = await client.put('/vendor/status/toggle', { isOnline });
      return response.data;
    } catch (error) {
      console.warn('vendorApi.toggleStatus mock fallback due to error:', error.message);
      // Fallback for UI if backend is not ready
      return { success: true, isOnline };
    }
  },
  
  getEarnings: async (period = 'today') => {
    try {
      const client = getClient();
      const response = await client.get(`/vendor/earnings?period=${period}`);
      return response.data;
    } catch (error) {
      // Mock stats
      return { totalOrders: 0, revenue: 0, avgPrepTime: '0 min' };
    }
  },

  acceptOrder: async (orderId) => {
    try {
      const client = getClient();
      const response = await client.put(`/vendor/orders/${orderId}/accept`);
      return response.data;
    } catch (error) {
      console.warn('vendorApi.acceptOrder mock fallback:', error.message);
      return { success: true };
    }
  },

  rejectOrder: async (orderId, reason) => {
    try {
      const client = getClient();
      const response = await client.put(`/vendor/orders/${orderId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.warn('vendorApi.rejectOrder mock fallback:', error.message);
      return { success: true };
    }
  },

  updateOrderStatus: async (orderId, status) => {
    try {
      const client = getClient();
      const response = await client.put(`/vendor/orders/${orderId}/status`, { status });
      return response.data;
    } catch (error) {
      console.warn('vendorApi.updateOrderStatus mock fallback:', error.message);
      return { success: true };
    }
  }
};
