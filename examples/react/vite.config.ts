import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import tailwindcss from 'tailwindcss';
import {defineConfig} from 'vite';

export default defineConfig({
  css: {
    postcss: {
      plugins: [tailwindcss, autoprefixer],
    },
  },
  plugins: [react()],
  define: {
    '%VITE_COHORT_API_KEY%': JSON.stringify(process.env.VITE_COHORT_API_KEY),
  },
});
