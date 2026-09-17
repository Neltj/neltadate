import { defineConfig } from 'vitest/config';
import vue from '@vitejs/plugin-vue';

const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
const base =
  process.env.GITHUB_ACTIONS === 'true' && repositoryName ? `/${repositoryName}/` : '/';

export default defineConfig({
  base,
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.spec.ts'],
  },
});
