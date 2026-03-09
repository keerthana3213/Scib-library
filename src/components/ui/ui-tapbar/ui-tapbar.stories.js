import { getStoryConfig, parseObject, parseBoolean, render } from '@storybook/utils';
// import { customEventAction } from '../../../docs/utils/decorators.js';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Tapbar',
	...getStoryConfig('scib-ui-tapbar')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div>
		<scib-ui-tapbar
			taps='${parseObject(args.taps)}'
			action-menu-show='${parseBoolean(args.actionMenuShow)}'
		></scib-ui-tapbar>
	</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
    actionMenuShow: true,
	taps: [
		{
			id: 'apps',
			icon: 'icon-apps',
			name: 'My Apps',
            notifications: '',
            actionMenu: [
                { id: 1, text: 'Mark all as read', separator: false, icon: 'icon-share-24', eventId: 'markAsRead' },
                { id: 2, text: 'Move all to archive', separator: false, icon: 'icon-flag', eventId: 'moveArchive' }
            ]
		},
		{
			id: 'all',
			icon: 'icon-inbox',
			name: 'Other',
            notifications: '3',
            actionMenu: [
                { id: 1, text: 'Mark all as read', separator: false, icon: 'icon-share-24', eventId: 'markAsRead' },
                { id: 2, text: 'Move all to archive', separator: false, icon: 'icon-flag', eventId: 'moveArchive' }
            ]
		}
	]
};
