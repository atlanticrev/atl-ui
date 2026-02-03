import { defineConfig } from 'tsup';
import { TsconfigPathsPlugin } from '@esbuild-plugins/tsconfig-paths';

export default defineConfig({
	entry: ['src/index.ts'],
	format: ['esm'],
	dts: true,
	treeshake: true,
	sourcemap: true,
	clean: true,
	external: ['react', 'react-dom'],
	esbuildPlugins: [TsconfigPathsPlugin({ tsconfig: 'tsconfig.json' })],
});
