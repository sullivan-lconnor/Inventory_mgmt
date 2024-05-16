// src/stores/utilsStore.js
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';

export const useUtilsStore = defineStore('utilsStore', {
  actions: {
    generateUUID() {
      return uuidv4();
    },
  },
});
