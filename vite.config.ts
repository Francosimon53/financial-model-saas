import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";

// Configuración básica de Vite para React + Tailwind + Manus UI
export default defineConfig({
  plugins: [
    jsxLocPlugin(),
    tailwindcss(),
    react(),
  ],
  build: {
    // ya sabemos que tu build sale a dist/public
    outDir: "dist/public",
  },
});