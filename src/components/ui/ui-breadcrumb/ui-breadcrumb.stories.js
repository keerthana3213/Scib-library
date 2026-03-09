import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Breadcrumb',
	...getStoryConfig('scib-ui-breadcrumb'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = args => render(args, `
	<scib-ui-breadcrumb
		options='${parseObject(args.options)}'
		regular-font='${args.regularFont}'
	></scib-ui-breadcrumb>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	options: [
		{
			id: '1',
			label: 'Opcion1',
		},
		{
			id: '2',
			label: 'Opcion 2',
		},
		{
			id: '3',
			label: 'Opcion 3',
		},
	],
	regularFont: true
	// Add default values here
};
