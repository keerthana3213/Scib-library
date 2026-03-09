import type { StorybookConfig } from '@storybook/react-vite';
import { get, merge } from 'lodash';
import path from 'path';
import { COMPONENTS_TSCONFIG_PATHS } from '../.ci/utils';

const componentType = process.env?.COMPONENT_TYPE;

const stories = [
	'../src/docs/**/*.mdx',
	...(componentType && componentType !== 'all'
		? get(COMPONENTS_TSCONFIG_PATHS, [componentType], []).include.map((path) => `../${path}.stories.tsx`)
		: ['../src/components/**/*.stories.tsx'])
];

const config: StorybookConfig = {
	stories,
	addons: [
		'@storybook/addon-links',
		'@storybook/addon-essentials',
		'@storybook/addon-interactions',
		'storybook-addon-themes',
		'storybook-dark-mode'
	],
	core: {
		builder: '@storybook/builder-vite',
		disableWebpackDefaults: true,
		disableTelemetry: true
	},
	framework: {
		name: '@storybook/react-vite',
		options: {}
	},
	docs: {
		autodocs: true,
		defaultName: 'Docs'
	},
	features: {
		buildStoriesJson: true,
		argTypeTargetsV7: true,
		storyStoreV7: true
	},
	typescript: {
		check: true
	},
	staticDirs: [
		{ from: '../src/assets', to: '/assets' },
		{ from: '../src/playgrounds', to: '/playgrounds' }
	],
	viteFinal: async (config, _options) => {
		return merge(config, {
			server: {
				watch: {
					ignored: []
				}
			},
			resolve: {
				alias: {
					'@storybook/utils': path.resolve(__dirname, 'utils.js')
				}
			}
		});
	}
};
export default config;
