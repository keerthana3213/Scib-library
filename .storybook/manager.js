import { addons } from '@storybook/manager-api';
import { version } from '../package.json';
import theme from './theme';

window.__STORYBOOK_STENCIL_DOC_VERSION__ = version;

addons.setConfig({
	theme,
	isFullscreen: false,
	showNav: true,
	showPanel: true,
	panelPosition: 'bottom',
	enableShortcuts: false,
	showToolbar: true,
	selectedPanel: undefined,
	initialActive: 'sidebar',
	sidebar: {
		showRoots: true,
		collapsedRoots: ['other']
	},
	toolbar: {
		eject: { hidden: true },
		copy: { hidden: true },
		fullscreen: { hidden: true }
	}
});
