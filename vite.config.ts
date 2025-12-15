
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import ntpClient from 'ntp-client'

const WINDOWS_TIME_HOST = 'time.windows.com'
const WINDOWS_TIME_PORT = 123

const windowsTimePlugin = () => {
  const handler = (_req: any, res: any, next: any) => {
    if (_req.method && _req.method !== 'GET') {
      next()
      return
    }

    ntpClient.getNetworkTime(
      WINDOWS_TIME_HOST,
      WINDOWS_TIME_PORT,
      (err: Error | null, date: Date) => {
        res.setHeader('Content-Type', 'application/json')

        if (err) {
          res.statusCode = 502
          res.end(JSON.stringify({ error: 'sync_failed' }))
          return
        }

        res.end(
          JSON.stringify({
            datetime: date.toISOString(),
          })
        )
      }
    )
  }

  return {
    name: 'windows-time-proxy',
    configureServer(server: any) {
      server.middlewares.use('/api/windows-time', handler)
    },
    configurePreviewServer(server: any) {
      server.middlewares.use('/api/windows-time', handler)
    },
  }
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    windowsTimePlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },
})
