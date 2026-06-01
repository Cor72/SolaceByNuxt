import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography' // 1. 引入

export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    typography // 2. 使用
  ],
} satisfies Config