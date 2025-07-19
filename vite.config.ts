import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import path from 'path'
import { createHtmlPlugin } from 'vite-plugin-html'
import { fileURLToPath } from 'url'
import mkcert from "vite-plugin-mkcert"
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import topLevelAwait from "vite-plugin-top-level-await";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd())

  return {
    server: {
      https: true,
    },
    css: {
    preprocessorOptions: {
        scss: {
          api: 'modern-compiler' // or "modern"
        }
      }
    },
    base: env.VITE_PUBLIC_PATH_BASE,
    plugins: [
      nodePolyfills(),
      react(),
      svgr(),
      mkcert(),
      topLevelAwait({
        promiseExportName: "__tla",
        promiseImportName: i => `__tla_${i}`
      }),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: env.VITE_DEFAULT_TITLE,
            keywords: env.VITE_KEYWORDS,
            description: env.VITE_DESCRIPTION,
            site_name: env.VITE_SITE_NAME,
            twitter_site: `@${env.VITE_TWITTER_SITE}`,
            twitter_image: env.VITE_TWITTER_IMAGE
          }
        }
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.', 'src')
      }
    },
    build: {
      sourcemap: false
    },
    optimizeDeps: { exclude: ['node_modules/.cache'] }
  }
})
