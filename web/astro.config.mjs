import { defineConfig } from 'astro/config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://sol.com.py',
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
})
