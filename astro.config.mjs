// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import svelte from '@astrojs/svelte';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()]
  },

  output: 'server',
  integrations: [svelte()],

  adapter: node({
    mode: 'standalone'
  }),

  server: {
    host: '0.0.0.0'
  },
});
