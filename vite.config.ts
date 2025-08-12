import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')
  
  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      // Production optimizations
      minify: mode === 'production' ? 'esbuild' : false,
      sourcemap: mode === 'production' ? false : true,
      
      // Chunk size warnings and optimizations
      chunkSizeWarningLimit: 600,
      
      rollupOptions: {
        output: {
          // Manual chunk splitting for better caching
          manualChunks: {
            // Vendor chunks
            'react-vendor': ['react', 'react-dom'],
            'pdf-vendor': ['jspdf', 'html2canvas'],
            'ui-vendor': ['lucide-react', '@radix-ui/react-label', '@radix-ui/react-slot'],
            'form-vendor': ['react-hook-form', '@hookform/resolvers'],
            'utils-vendor': ['clsx', 'class-variance-authority', 'tailwind-merge', 'date-fns']
          },
          
          // Asset file naming
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            let extType = info[info.length - 1];
            
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              extType = 'img';
            } else if (/woff|woff2/.test(extType)) {
              extType = 'fonts';
            }
            
            return `assets/${extType}/[name]-[hash][extname]`;
          },
          
          // JS chunk naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
        },
      },
      
      // Target modern browsers for production
      target: mode === 'production' ? 'es2020' : 'esnext',
      
      // Additional optimizations
      cssCodeSplit: true,
      reportCompressedSize: false, // Faster builds
    },
    
    // Development server optimizations
    server: {
      port: 5173,
      host: true,
      open: false,
    },
    
    // Preview server config
    preview: {
      port: 4173,
      host: true,
    },
    
    // Define global constants
    define: {
      __APP_VERSION__: JSON.stringify(env.VITE_APP_VERSION || '2.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    // Optimize dependencies
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'jspdf',
        'html2canvas',
        'lucide-react',
        'react-hook-form',
        'sonner'
      ],
    },
  }
})
