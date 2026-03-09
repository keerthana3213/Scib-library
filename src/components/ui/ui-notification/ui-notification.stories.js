import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Notification',
	...getStoryConfig('scib-ui-notification')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-notification text='${args.slot}' icon='${args.icon}'></scib-ui-notification>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	slot: 'This is a notification text',
	icon: null
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
 const TemplateIcon = (args) => render(args, `
 	<scib-ui-notification 
 		text='${args.slot}' 
		icon='${args.icon}' 
	></scib-ui-notification>
`);

// Default Story
export const DevelopIcon = TemplateIcon.bind();
DevelopIcon.args = {
	slot: 'This is a notification text',
	icon: 'icon-awarness'
};
