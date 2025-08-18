import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@parent': path.resolve(__dirname, '../src'),
      // Direct alias to xingine-react source instead of using yalc
      'xingine-react': path.resolve(__dirname, '../src/index.ts'),
      'xingine': path.resolve(__dirname, '../../xingine/src/index.ts'),
    },
  },
  define: {
    // Ensure proper NODE_ENV handling
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
  },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ""),
                configure(proxy) {
                    console.log("configuring the proxy");
                    proxy.on("proxyReq", (proxyReq, req) => {
                        console.log(
                            `[vite-proxy] ${req.method} ${req.url} → ${proxyReq.path}, original path -> ${path}`,
                        );
                    });

                    proxy.on("error", (err, req, res) => {
                        console.error("[vite-proxy] Proxy error:", err.message);
                        res.writeHead(502, { "Content-Type": "application/json" });
                        res.end(
                            JSON.stringify({ error: "Backend unavailable (proxy error)" }),
                        );
                    });
                },
            },
        },
    },
  optimizeDeps: {
    // Include dependencies that need to be pre-bundled
    include: ['react', 'react-dom', 'axios'],
    // Exclude local packages from optimization to allow hot reloading
    exclude: ['xingine', 'xingine-react']
  },
  build: {
    // Enable source maps for better debugging
    sourcemap: true,
    rollupOptions: {
      // Ensure external dependencies are handled correctly
      external: (id) => {
        // Don't externalize our local packages
        return false;
      }
    }
  }
})
