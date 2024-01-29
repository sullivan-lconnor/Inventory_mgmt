import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

const localNetworkIP = '192.168.1.171'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    proxy: {
      // Proxying API requests to the Express server
      '/api': {
        target: `http://${localNetworkIP}:3000`, // Express backend URL
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
