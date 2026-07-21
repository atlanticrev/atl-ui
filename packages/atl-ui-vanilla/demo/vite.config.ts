import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';

export default defineConfig({
	build: {
		rollupOptions: {
			input: {
				components: fileURLToPath(new URL('./components.html', import.meta.url)),
				index: fileURLToPath(new URL('./index.html', import.meta.url)),
				storybook: fileURLToPath(new URL('./storybook.html', import.meta.url)),
			},
		},
	},
});
