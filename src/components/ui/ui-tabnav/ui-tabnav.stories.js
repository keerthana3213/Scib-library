import { getStoryConfig, parseObject, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Tabnav',
	...getStoryConfig('scib-ui-tabnav', {status: 'deprecated'})
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-tabnav 
		small='${parseBoolean(args.small)}'
		maximize-tab='${parseBoolean(args.maximizeTab)}'
		tabs='${parseObject(args.tabs)}'
	></scib-ui-tabnav>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
    maximizeTab: false,
    small: false,
	tabs: [
		{
			id: 'TOPC',
			label: 'Topics'
		},
		{
			id: 'MEMB',
			label: 'Members'
		}
	]
}

// Small Story
export const Small = Template.bind();
Small.args = {
    maximizeTab: true,
    small: true,
	tabs: [
		{
			id: 'incoming',
			label: 'Incoming'
		},
		{
			id: 'archive',
			label: 'Archive'
		}
	]
}
