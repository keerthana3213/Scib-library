import { getStoryConfig, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Switch',
	...getStoryConfig('scib-ui-switch')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-switch
		checked="${parseBoolean(args.checked)}"
		label="${args.label}"
	></scib-ui-switch>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	checked: false,
	label: 'Label'
};
