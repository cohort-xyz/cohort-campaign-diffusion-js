import path from 'node:path';
import {defineConfig} from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'CohortCampaignDiffusionSDK',
      fileName: format => `cohort-campaign-diffusion-sdk.${format}.js`,
      formats: ['es', 'umd'],
    },
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        exports: 'named',
        globals: {
          CohortCampaignDiffusionSDK: 'CohortCampaignDiffusionSDK',
        },
      },
    },
  },
  plugins: [
    dts({
      tsconfigPath: path.resolve(__dirname, 'tsconfig.project.json'),
      insertTypesEntry: true,
      logLevel: 'info',
      entryRoot: 'src',
      outDir: 'dist',
    }),
  ],
});
