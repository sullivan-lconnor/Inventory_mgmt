// src/stores/authStore.js
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: null,
    token: null,
  }),
  actions: {
    loginUser(userId, token) {
      this.userId = userId;
      this.token = token;
      localStorage.setItem('auth', JSON.stringify({ userId, token }));
    },
    logoutUser() {
      this.userId = null;
      this.token = null;
      localStorage.removeItem('auth');
    },
    loadUserFromStorage() {
      const auth = localStorage.getItem('auth');
      if (auth) {
        const { userId, token } = JSON.parse(auth);
        this.userId = userId;
        this.token = token;
      }
    },
  },
});
