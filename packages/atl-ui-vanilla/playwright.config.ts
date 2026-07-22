import { defineConfig, devices } from '@playwright/test';

const STORYBOOK_PORT = 4175;

export default defineConfig({
	expect: {
		toHaveScreenshot: {
			animations: 'disabled',
			maxDiffPixelRatio: 0.01,
		},
	},
	fullyParallel: true,
	outputDir: 'test-results/browser',
	projects: [
		{ name: 'chromium', use: { ...devices['Desktop Chrome'] } },
		{ name: 'firefox', use: { ...devices['Desktop Firefox'] } },
		{ name: 'webkit', use: { ...devices['Desktop Safari'] } },
	],
	reporter: [['list']],
	snapshotPathTemplate: '{testDir}/__screenshots__/{platform}/{arg}{ext}',
	testDir: 'tests/browser',
	use: {
		// biome-ignore lint/style/useNamingConvention: Playwright names this public option baseURL.
		baseURL: `http://127.0.0.1:${STORYBOOK_PORT}`,
		colorScheme: 'light',
		reducedMotion: 'reduce',
		screenshot: 'only-on-failure',
		trace: 'retain-on-failure',
	},
	webServer: {
		command: 'npm run storybook:test',
		reuseExistingServer: !process.env.CI,
		timeout: 120_000,
		url: `http://127.0.0.1:${STORYBOOK_PORT}/storybook.html`,
	},
});
