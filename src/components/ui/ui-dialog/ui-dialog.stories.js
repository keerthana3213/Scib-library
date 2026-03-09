import { getStoryConfig, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Dialog',
	...getStoryConfig('scib-ui-dialog', {status: 'deprecated'})
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open="${parseBoolean(args.open)}" hide-header="${parseBoolean(args.hideHeader)}">
		<div>Test<div>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	open: true,
	hideHeader: false
};
