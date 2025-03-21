import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // Add aliases for Node.js built-in modules
      fs: path.resolve(__dirname, 'src/lib/nodePolyfills.ts'),
      path: path.resolve(__dirname, 'src/lib/nodePolyfills.ts'),
      crypto: path.resolve(__dirname, 'src/lib/nodePolyfills.ts'),
    },
  },
  // Provide empty shims for Node.js built-in modules
  define: {
    // For development purposes, tell Vite to ignore certain imports in node_modules packages
    'process.env.NODE_DEBUG': 'false'
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
    }
  },
}));
