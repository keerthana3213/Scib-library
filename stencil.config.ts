import { angularOutputTarget } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { sass } from '@stencil/sass';
import { customConfig, name } from './package.json';
import { angularValueAccessorBindings } from './src/angular-proxy';

const isDev = process.env.NODE_ENV === 'development';

export const DEPRECATED_COMPONENTS = [
	// cdk
	'scib-cdk-folder-navigation',
	'scib-cdk-file-selector',
	'scib-cdk-messages-attached-bar',
	'scib-cdk-video',
	'scib-cdk-vdr-preview',
	'scib-cdk-list-request',
	'scib-cdk-ism-content',
	'scib-cdk-signature-table-show-detail',
	'scib-cdk-pitch-section-data',
	'scib-cdk-signature-manager-modal',
	'scib-cdk-ibor-mobile',
	'scib-cdk-modal-form',
	'scib-cdk-signature-modal-configuration',
	'scib-cdk-topic-create',
	'scib-cdk-signature-modal-documentation',
	'scib-cdk-ism-preview',
	'scib-cdk-members-tooltip',
	'scib-cdk-contract-card',
	'scib-cdk-ism-modal-detail',
	'scib-cdk-elements-list',
	'scib-cdk-signature-modal',
	'scib-cdk-signature-modal-mailing',
	'scib-cdk-signature-table-cell-status',
	'scib-cdk-signature-template-folder-navigation',
	'scib-cdk-vdr-final-form',
	'scib-cdk-childs-table',
	'scib-cdk-create-vdr',
	'scib-cdk-ism-link-card',
	// ecmv
	'scib-ecmv-search',
	'scib-ecmv-metadata-filter',
	'scib-ecmv-folder-navigator',
	'scib-ecmv-modal-status',
	'scib-ecmv-empty-state',
	'scib-ecmv-modal-files',
	'scib-ecmv-document-details',
	'scib-ecmv-files-selector',
	'scib-ecmv-breadcrumb',
	// apps
	'scib-apps-ecmv-form-add-files',
	// ui
	'scib-ui-column',
	'scib-ui-separator',
	'scib-ui-dialog',
	'scib-ui-table-simple',
	'scib-ui-button',
	'scib-ui-color-panel',
	'scib-ui-file-history',
	'scib-ui-tabnav',
	'scib-ui-dropdown',
	'scib-ui-textarea',
	'scib-ui-loading',
	'scib-ui-toast',
	'scib-ui-empty-state',
	'scib-ui-password-strength-bar',
	'scib-ui-filter',
	'scib-ui-wrapper',
	'scib-ui-row',
	'scib-ui-select',
	'scib-ui-aside-panel',
	'scib-ui-input',
	'scib-ui-avatar',
	'scib-ui-extension-icon',
	'scib-ui-ism-table',
	'scib-ui-radio-button',
	'scib-ui-added-tag',
	'scib-ui-table',
	'scib-ui-toast',
	'scib-ui-tag',
	'scib-ui-new-tag',
	'scib-ui-circle-progress-bar',
	'scib-ui-accordion',
	'scib-ui-input-telephone'
];

export const config: Config = {
	namespace: 'scib-ui-kit',
	enableCache: true,
	tsconfig: isDev ? 'tsconfig.dev.json' : 'tsconfig.json',
	sourceMap: isDev,
	srcDir: 'src',
	globalStyle: 'src/scss/styles.scss',
	globalScript: 'src/externals.ts',
	devServer: {
		port: customConfig.stencil.port,
		reloadStrategy: 'pageReload',
		openBrowser: false
	},
	maxConcurrentWorkers: 5,
	excludeUnusedDependencies: true,
	plugins: [
		sass({
			includePaths: [
				'./node_modules',
				'./src/scss/01_settings',
				'./src/scss/02_tools',
				'./src/scss/03_elements',
				'./src/scss/99_utilities',
				'./src/components/apps',
				'./src/components/atoms',
				'./src/components/cdk',
				'./src/components/ecmv',
				'./src/components/molecules',
				'./src/components/organisms',
				'./src/components/ui',
				'./src/components/ui-v2'
			]
		})
	],
	outputTargets: [
		{
			type: 'docs-json',
			file: '.storybook/docs/components-data.json'
		},
		...((isDev
			? [
					{
						type: 'docs-vscode',
						file: '.storybook/docs/vscode-data.json'
					},
					{
						type: 'www',
						dir: '.tmp',
						empty: true
					}
			  ]
			: [
					{
						type: 'dist',
						esmLoaderPath: './loader',
						dir: 'dist',
						copy: [
							{
								src: 'assets',
								dest: 'assets'
							},
							{
								src: 'scss',
								dest: 'scss'
							},
							{
								src: 'themes',
								dest: 'themes'
							}
						]
					},
					{
						type: 'dist-custom-elements',
						dir: customConfig.stencil.dir,
						externalRuntime: false
					},
					angularOutputTarget({
						componentCorePackage: name,
						directivesProxyFile: `./.angular-lib/src/lib/components.ts`,
						valueAccessorConfigs: angularValueAccessorBindings
					}),
					reactOutputTarget({
						stencilPackageName: name,
						outDir: './.react-lib/src/',
						excludeComponents: DEPRECATED_COMPONENTS
					})
			  ]) as any)
	],
	testing: {
		verbose: false,
		moduleFileExtensions: ['ts', 'tsx', 'js'],
		transformIgnorePatterns: ['<rootDir>/node_modules/(?!scrollable-component)'],
		setupFilesAfterEnv: ['<rootDir>/setupTests.js'],
		testRegex: '/(apps|atoms|molecules|organisms|ui-v2)/.*/test/.*.(spec|test).tsx?$',
		transform: {
			'^.+\\.js$': 'babel-jest'
		},
		collectCoverageFrom: [
			'<rootDir>/src/components/apps/**/*.{ts,tsx}',
			'<rootDir>/src/components/atoms/**/*.{ts,tsx}',
			'<rootDir>/src/components/molecules/**/*.{ts,tsx}',
			'<rootDir>/src/components/organisms/**/*.{ts,tsx}',
			'<rootDir>/src/components/ui-v2/**/*.{ts,tsx}',
			'!<rootDir>/src/components/**/*.stories.tsx',
			'!<rootDir>/src/components/**/__test__/**/*',
			'!<rootDir>/src/components/**/test/**/*',
			'!<rootDir>/src/components/**/*.{model,module,config}.*',
			'!<rootDir>/src/**/*'
		]
	}
};
