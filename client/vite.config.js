import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

let config = {};
if (process.env.NODE_ENV !== "docker") {
  config = {
    envDir: "../",
    envPrefix: "PROJ_",
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  ...config,
});
