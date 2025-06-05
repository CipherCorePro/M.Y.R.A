
import path from 'node:path';
// Rely on global process (import removed)
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// ESM_equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    // Use global process.cwd() by relying on the globally available 'process' object
    const env = loadEnv(mode, (process as any).cwd(), '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'), // Changed to point to project root
        }
      },
      server: {
        host: true // This will make the server accessible over the network
      }
    };
});