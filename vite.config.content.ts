import { defineConfig } from "vite";
export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "src/scripts/content.ts",
      output: {
        entryFileNames: "content.js",
        format: "iife",
      },
    },
  },
  publicDir: "public",
});
