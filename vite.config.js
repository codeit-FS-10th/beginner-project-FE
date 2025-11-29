import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@assets": "/src/assets",
      "@img": "/src/assets/Img",
      "@styles": "/src/styles",
      "@Atoms": "/src/components/Atoms",
      "@Molecule": "/src/components/Molecule",
      "@pages": "/src/pages",
      "@hooks": "/src/hooks",
      "@mocks": "/src/mocks",
      "@api": "/src/api",
    },
  },
})
