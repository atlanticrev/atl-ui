import path from 'node:path';

import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		environment: 'jsdom',
		exclude: [...configDefaults.exclude, 'tests/browser/**'],
		setupFiles: [path.resolve(__dirname, '../../vitest.setup.ts')],
	},
});
