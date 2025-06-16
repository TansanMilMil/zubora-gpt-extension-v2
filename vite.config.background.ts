import { defineConfig } from "vite";
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "src/scripts/background.ts",
      output: {
        entryFileNames: "background.js",
        format: "iife",
      },
    },
  },
  publicDir: "public",
});
