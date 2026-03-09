import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Loading',
	...getStoryConfig('scib-ui-loading')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-loading
		literals='${parseObject(args.literals)}'
		secondary="${parseBoolean(args.secondary)}"
		show="${parseBoolean(args.show)}"
		animation="${parseBoolean(args.animation)}"
		button="${parseBoolean(args.button)}"
	></scib-ui-loading>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	show: true,
	literals: {
		buttonText: "Show more"
	}
};

// Show more Story
export const ShowMoreButton = Template.bind();
ShowMoreButton.args = {
	show: true,
	button: true,
	secondary: true,
	literals: {
		buttonText: "Show more"
	}
};
