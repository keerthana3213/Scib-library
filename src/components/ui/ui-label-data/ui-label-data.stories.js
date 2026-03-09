import { getStoryConfig, render, parseBoolean, parseObject } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Label Data',
	...getStoryConfig('scib-ui-label-data')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-label-data
		label="${args.label}"
		text="${args.text}"
		copy-button="${parseBoolean(args.copyButton)}"
		required="${parseBoolean(args.required)}"
		data-icon='${parseObject(args.dataIcon)}'
	></scib-ui-label-data>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	label: "GROUP NAME",
	text: "ETD",
	copyButton: true,
	required: true,
	dataIcon: {
		'active': true,
		'icon': 'icon-warning',
		'color': 'seventh.mediumLight',
	},
};
