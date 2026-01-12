import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  resolve: {
    alias: {
      '@/paraglide/runtime': resolve(
        __dirname,
        'src/test/paraglide-runtime.mock.ts',
      ),
    },
  },
  test: {
    environment: 'happy-dom',
  },
})
