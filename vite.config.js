import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@styles": "/src/styles",
      "@Atoms": "/src/components/Atoms",
      "@Molecule": "/src/components/Molecule",
      "@pages": "/src/pages",
      "@hooks": "/src/hooks",
    },
  },
})
