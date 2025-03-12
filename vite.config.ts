import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  base: "/ipa/modern_ui",
  plugins: [react()],
  resolve: {
    alias: {
      src: "/src",
    },
  },
  server: {
    origin: "http://localhost:5173",
    cors: {
      origin: "https://server.ipa.demo",
    },
  },
});
