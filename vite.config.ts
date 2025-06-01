
import path from 'node:path';
import process from 'node:process'; // Added this line
import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react'; // Ensure this is installed: npm install -D @vitejs/plugin-react (or yarn/pnpm equivalent)

// ESM_equivalent for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
    // Use global process.cwd() by relying on the globally available 'process' object
    // Cast to NodeJS.Process to ensure type safety for cwd()
    const env = loadEnv(mode, (process as NodeJS.Process).cwd(), '');
    return {
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
