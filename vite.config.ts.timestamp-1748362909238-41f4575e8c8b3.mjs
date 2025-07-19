// vite.config.ts
import { defineConfig, loadEnv } from "file:///Users/sunbeyond/Documents/Git/hyperbot/node_modules/.pnpm/vite@5.4.14_@types+node@22.13.1_sass@1.88.0_terser@5.38.1/node_modules/vite/dist/node/index.js";
import react from "file:///Users/sunbeyond/Documents/Git/hyperbot/node_modules/.pnpm/@vitejs+plugin-react@4.3.4_vite@5.4.14_@types+node@22.13.1_sass@1.88.0_terser@5.38.1_/node_modules/@vitejs/plugin-react/dist/index.mjs";
import svgr from "file:///Users/sunbeyond/Documents/Git/hyperbot/node_modules/.pnpm/vite-plugin-svgr@4.3.0_rollup@4.34.6_typescript@5.7.3_vite@5.4.14_@types+node@22.13.1_sass@1.88.0_terser@5.38.1_/node_modules/vite-plugin-svgr/dist/index.js";
import path from "path";
import { createHtmlPlugin } from "file:///Users/sunbeyond/Documents/Git/hyperbot/node_modules/.pnpm/vite-plugin-html@3.2.2_vite@5.4.14_@types+node@22.13.1_sass@1.88.0_terser@5.38.1_/node_modules/vite-plugin-html/dist/index.mjs";
import { fileURLToPath } from "url";
import mkcert from "file:///Users/sunbeyond/Documents/Git/hyperbot/node_modules/.pnpm/vite-plugin-mkcert@1.17.6_vite@5.4.14_@types+node@22.13.1_sass@1.88.0_terser@5.38.1_/node_modules/vite-plugin-mkcert/dist/mkcert.mjs";
import { nodePolyfills } from "file:///Users/sunbeyond/Documents/Git/hyperbot/node_modules/.pnpm/vite-plugin-node-polyfills@0.22.0_rollup@4.34.6_vite@5.4.14_@types+node@22.13.1_sass@1.88.0_terser@5.38.1_/node_modules/vite-plugin-node-polyfills/dist/index.js";
import topLevelAwait from "file:///Users/sunbeyond/Documents/Git/hyperbot/node_modules/.pnpm/vite-plugin-top-level-await@1.4.4_@swc+helpers@0.5.17_rollup@4.34.6_vite@5.4.14_@types+_eecb33b1f26dfba9a468520e5d456606/node_modules/vite-plugin-top-level-await/exports/import.mjs";
var __vite_injected_original_import_meta_url = "file:///Users/sunbeyond/Documents/Git/hyperbot/vite.config.ts";
var __filename = fileURLToPath(__vite_injected_original_import_meta_url);
var __dirname = path.dirname(__filename);
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    server: {
      https: true
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: "modern-compiler"
          // or "modern"
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
        promiseImportName: (i) => `__tla_${i}`
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
      })
    ],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, ".", "src")
      }
    },
    build: {
      sourcemap: false
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvc3VuYmV5b25kL0RvY3VtZW50cy9HaXQvaHlwZXJib3RcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9zdW5iZXlvbmQvRG9jdW1lbnRzL0dpdC9oeXBlcmJvdC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvc3VuYmV5b25kL0RvY3VtZW50cy9HaXQvaHlwZXJib3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcsIGxvYWRFbnYgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHN2Z3IgZnJvbSAndml0ZS1wbHVnaW4tc3ZncidcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5pbXBvcnQgeyBjcmVhdGVIdG1sUGx1Z2luIH0gZnJvbSAndml0ZS1wbHVnaW4taHRtbCdcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICd1cmwnXG5pbXBvcnQgbWtjZXJ0IGZyb20gXCJ2aXRlLXBsdWdpbi1ta2NlcnRcIlxuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gJ3ZpdGUtcGx1Z2luLW5vZGUtcG9seWZpbGxzJ1xuaW1wb3J0IHRvcExldmVsQXdhaXQgZnJvbSBcInZpdGUtcGx1Z2luLXRvcC1sZXZlbC1hd2FpdFwiO1xuXG5jb25zdCBfX2ZpbGVuYW1lID0gZmlsZVVSTFRvUGF0aChpbXBvcnQubWV0YS51cmwpO1xuY29uc3QgX19kaXJuYW1lID0gcGF0aC5kaXJuYW1lKF9fZmlsZW5hbWUpO1xuXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpXG5cbiAgcmV0dXJuIHtcbiAgICBzZXJ2ZXI6IHtcbiAgICAgIGh0dHBzOiB0cnVlLFxuICAgIH0sXG4gICAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICBzY3NzOiB7XG4gICAgICAgICAgYXBpOiAnbW9kZXJuLWNvbXBpbGVyJyAvLyBvciBcIm1vZGVyblwiXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGJhc2U6IGVudi5WSVRFX1BVQkxJQ19QQVRIX0JBU0UsXG4gICAgcGx1Z2luczogW1xuICAgICAgbm9kZVBvbHlmaWxscygpLFxuICAgICAgcmVhY3QoKSxcbiAgICAgIHN2Z3IoKSxcbiAgICAgIG1rY2VydCgpLFxuICAgICAgdG9wTGV2ZWxBd2FpdCh7XG4gICAgICAgIHByb21pc2VFeHBvcnROYW1lOiBcIl9fdGxhXCIsXG4gICAgICAgIHByb21pc2VJbXBvcnROYW1lOiBpID0+IGBfX3RsYV8ke2l9YFxuICAgICAgfSksXG4gICAgICBjcmVhdGVIdG1sUGx1Z2luKHtcbiAgICAgICAgbWluaWZ5OiB0cnVlLFxuICAgICAgICBpbmplY3Q6IHtcbiAgICAgICAgICBkYXRhOiB7XG4gICAgICAgICAgICB0aXRsZTogZW52LlZJVEVfREVGQVVMVF9USVRMRSxcbiAgICAgICAgICAgIGtleXdvcmRzOiBlbnYuVklURV9LRVlXT1JEUyxcbiAgICAgICAgICAgIGRlc2NyaXB0aW9uOiBlbnYuVklURV9ERVNDUklQVElPTixcbiAgICAgICAgICAgIHNpdGVfbmFtZTogZW52LlZJVEVfU0lURV9OQU1FLFxuICAgICAgICAgICAgdHdpdHRlcl9zaXRlOiBgQCR7ZW52LlZJVEVfVFdJVFRFUl9TSVRFfWAsXG4gICAgICAgICAgICB0d2l0dGVyX2ltYWdlOiBlbnYuVklURV9UV0lUVEVSX0lNQUdFXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KSxcbiAgICBdLFxuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgICdAJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4nLCAnc3JjJylcbiAgICAgIH1cbiAgICB9LFxuICAgIGJ1aWxkOiB7XG4gICAgICBzb3VyY2VtYXA6IGZhbHNlXG4gICAgfVxuICB9XG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF1UyxTQUFTLGNBQWMsZUFBZTtBQUM3VSxPQUFPLFdBQVc7QUFDbEIsT0FBTyxVQUFVO0FBQ2pCLE9BQU8sVUFBVTtBQUNqQixTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLHFCQUFxQjtBQUM5QixPQUFPLFlBQVk7QUFDbkIsU0FBUyxxQkFBcUI7QUFDOUIsT0FBTyxtQkFBbUI7QUFSNEosSUFBTSwyQ0FBMkM7QUFVdk8sSUFBTSxhQUFhLGNBQWMsd0NBQWU7QUFDaEQsSUFBTSxZQUFZLEtBQUssUUFBUSxVQUFVO0FBR3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLENBQUM7QUFFdkMsU0FBTztBQUFBLElBQ0wsUUFBUTtBQUFBLE1BQ04sT0FBTztBQUFBLElBQ1Q7QUFBQSxJQUNBLEtBQUs7QUFBQSxNQUNMLHFCQUFxQjtBQUFBLFFBQ2pCLE1BQU07QUFBQSxVQUNKLEtBQUs7QUFBQTtBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsTUFBTSxJQUFJO0FBQUEsSUFDVixTQUFTO0FBQUEsTUFDUCxjQUFjO0FBQUEsTUFDZCxNQUFNO0FBQUEsTUFDTixLQUFLO0FBQUEsTUFDTCxPQUFPO0FBQUEsTUFDUCxjQUFjO0FBQUEsUUFDWixtQkFBbUI7QUFBQSxRQUNuQixtQkFBbUIsT0FBSyxTQUFTLENBQUM7QUFBQSxNQUNwQyxDQUFDO0FBQUEsTUFDRCxpQkFBaUI7QUFBQSxRQUNmLFFBQVE7QUFBQSxRQUNSLFFBQVE7QUFBQSxVQUNOLE1BQU07QUFBQSxZQUNKLE9BQU8sSUFBSTtBQUFBLFlBQ1gsVUFBVSxJQUFJO0FBQUEsWUFDZCxhQUFhLElBQUk7QUFBQSxZQUNqQixXQUFXLElBQUk7QUFBQSxZQUNmLGNBQWMsSUFBSSxJQUFJLGlCQUFpQjtBQUFBLFlBQ3ZDLGVBQWUsSUFBSTtBQUFBLFVBQ3JCO0FBQUEsUUFDRjtBQUFBLE1BQ0YsQ0FBQztBQUFBLElBQ0g7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLFdBQVcsS0FBSyxLQUFLO0FBQUEsTUFDekM7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxXQUFXO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
