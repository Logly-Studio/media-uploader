import { defineConfig } from 'vite'
import { resolve } from "path";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, "./main.tsx"),
      name: "@logly/media-uploads",
      fileName: "media-uploads",
    },
    rollupOptions: {
      external: ["react"],
      output: {
        globals: {
          react: "react",
        },
      },
    },
  },
});
