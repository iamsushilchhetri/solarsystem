import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// GitHub Pages serves this app from a /solarsystem/ subpath; Netlify serves it from the domain root.
export default defineConfig({
  base: process.env.NETLIFY ? "/" : "/solarsystem/",
  plugins: [react(), tailwindcss()],
});