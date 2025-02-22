import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://svelte.dev/docs/kit/integrations
	// for more information about preprocessors
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter(),
		alias: {
			$components: './src/components',
			$stores: './src/stores',
			$utils: './src/utils',
			$styles: './src/styles',
			$assets: './src/assets',
			$routes: './src/routes',
			$layouts: './src/layouts',
			$services: './src/services',
			$types: './src/types',
		}
	}
};

export default config;
