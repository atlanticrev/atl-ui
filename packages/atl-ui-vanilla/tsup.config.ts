import { defineConfig } from 'tsup';

export default defineConfig({
	clean: true,
	dts: true,
	entry: {
		controllers: 'src/controllers/index.ts',
		core: 'src/core/index.ts',
		'define-all': 'src/define-all.ts',
		index: 'src/index.ts',
		input: 'src/components/input/index.ts',
		select: 'src/components/select/index.ts',
		tabs: 'src/components/tabs/index.ts',
		toast: 'src/components/toast/index.ts',
	},
	format: ['esm'],
	minify: true,
	sourcemap: true,
	splitting: true,
	target: 'es2022',
	treeshake: true,
});
