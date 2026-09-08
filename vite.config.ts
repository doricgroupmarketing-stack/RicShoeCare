import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const apiKey = 'AQ.Ab8RN6Lxi_R2qRKqvOGA2tduUlPFmDCXz9ByVZFXdsh5S3OEfw';
    return {
      server: {
        port: 3000,
        host: true,
        hmr: {
          protocol: 'wss',
          clientPort: 443,
        },
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(apiKey),
        'process.env.GEMINI_API_KEY': JSON.stringify(apiKey),
        'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(apiKey)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
