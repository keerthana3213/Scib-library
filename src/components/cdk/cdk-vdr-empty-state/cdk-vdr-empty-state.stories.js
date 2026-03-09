import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Vdr Empty State',
	...getStoryConfig('scib-cdk-vdr-empty-state')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-vdr-empty-state
		show-button="${parseBoolean(args.showButton)}"
		literals='${parseObject(args.literals)}'
	></scib-cdk-vdr-empty-state>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	showButton: true,
	literals: {
		"title": "Welcome to VDR",
		"description": "You have not any room at this moment, but you can create one right now.",
		"btnText": "New Virtual Data Room",
		"imgSrc": "assets/images/i-laptop-coffee.svg"
	}
};
