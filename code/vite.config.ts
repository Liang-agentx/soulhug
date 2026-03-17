import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";

export default defineConfig({
  plugins: [react()],
  root: ".",
  publicDir: "public",
  build: {
    outDir: "dist",
  },
  server: {
    port: 5173,
    strictPort: true,
  },
  resolve: {
    alias: {
      // UI 包内部使用的 ~ 别名
      "~": resolve(__dirname, "packages/ui/src"),
      // 本地 UI 包
      "@soulhug/ui": resolve(__dirname, "packages/ui/src"),
    },
  },
});
