import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/3d-printer-cost-calculator', // Cambia esto si vas a hospedar la app en una subruta diferente
});
