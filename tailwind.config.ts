import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

export default {
  content: [],
  theme: {
    extend: {
      padding: {
        'safe': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
      },
    },
  },
  plugins: [
    typography,
  ],
} satisfies Config
