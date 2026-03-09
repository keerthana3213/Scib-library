import { getStoryConfig, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Checkbox',
	...getStoryConfig('scib-ui-checkbox', {status: 'deprecated'}),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = args => render(args, `
	<scib-ui-checkbox
		label='${args.label}'
		checked='${parseBoolean(args.checked)}'
		indeterminate='${parseBoolean(args.indeterminate)}'
	></scib-ui-checkbox>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	label: 'Text example',
	indeterminate: true,
};
