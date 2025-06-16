import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist",
    emptyOutDir: false,
    rollupOptions: {
      input: "src/scripts/options.ts",
      output: {
        entryFileNames: "options.js",
        format: "iife",
      },
    },
  },
  publicDir: "public",
});
