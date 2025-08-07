import process from 'node:process';

import { defineConfig } from '@vben/vite-config';

import { loadEnv } from 'vite';

export default defineConfig(async (props) => {
  const env = props && loadEnv(props.mode, process.cwd());
  return {
    application: {},
    vite: {
      server: {
        proxy: {
          [env?.VITE_GLOB_API_URL as string]: {
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
            // mock代理目标地址
            target: env?.VITE_SERVER_TARGET,
            ws: true,
          },
        },
      },
    },
  };
});
