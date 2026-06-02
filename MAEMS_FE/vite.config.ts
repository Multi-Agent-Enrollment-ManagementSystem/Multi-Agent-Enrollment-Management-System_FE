import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  envPrefix: ["VITE_", "MAEMS_"],
  base: "/",
  resolve: {
    alias: {
      // @/* → src/*: import tuyệt đối cho code ứng dụng (vd. @/components/Button)
      "@": path.resolve(__dirname, "./src"),
      // @tiptap-ui/* → @/*: scaffold TipTap UI (tránh trùng npm scope @tiptap/*)
      "@tiptap-ui": path.resolve(__dirname, "./@"),
    },
  },
});
