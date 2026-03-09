import type { Preview } from '@storybook/react';
import { setStencilDocJson } from './controls';
import { ReactActionsDecorator } from './decorators/react-actions';
import { ReactDocsDecorator } from './decorators/react-docs';
import docJson from './docs/components-data.json';

if (docJson) {
	setStencilDocJson(docJson);
}

const preview: Preview = {
	decorators: [ReactActionsDecorator],
	parameters: {
		docs: {
			page: ReactDocsDecorator
		},
		controls: {
			expanded: true,
			matchers: {
				color: null,
				date: null
			}
		},
		options: {
			storySort: {
				method: '',
				order: [
					'Get Started',
					[
						'Get Started',
						'Migration Guide v3+',
						'First steps',
						'CSS Style Guide',
						'Custom properties',
						'Añadir nuevos iconos',
						'Changelog'
					],
					'Documentation',
					[
						'Icons',
						'Color Icons',
						'Taildwind options',
						'Images',
						'Playgrounds',
						'Paquete para producción',
						'Problemáticas y casuísticas recurrentes',
						'Icons (DEPRECATED)'
					],
					'Design System',
					['Atoms', 'Molecules', 'Organisms', 'Apps', 'DEPRECATED']
				],
				locales: ''
			}
		},
		viewport: {
			viewports: {
				mobile: {
					name: 'mobile',
					styles: {
						width: '360px',
						height: '640px'
					}
				},
				mobileLarge: {
					name: 'mobile-large',
					styles: {
						width: '414px',
						height: '736px'
					}
				},
				tablet: {
					name: 'tablet',
					styles: {
						width: '768px',
						height: '1024px'
					}
				},
				tabletLarge: {
					name: 'tablet-large',
					styles: {
						width: '1024px',
						height: '1366px'
					}
				},
				desktop: {
					name: 'desktop',
					styles: {
						width: '1366px',
						height: '768px'
					}
				},
				desktopLarge: {
					name: 'desktop-large',
					styles: {
						width: '1920px',
						height: '1080px'
					}
				}
			}
		},
		darkMode: {
			classTarget: 'html',
			current: 'light'
		},
		themes: {
			default: 'Default brand',
			list: [
				{ name: 'Default brand', class: ['default'], color: '#ec0000' },
				{ name: 'New brand', class: ['new-brand'], color: '#60001D' }
			]
		}
	}
};

export default preview;
