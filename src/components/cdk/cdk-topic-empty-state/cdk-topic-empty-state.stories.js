import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Topic Empty State',
	...getStoryConfig('scib-cdk-topic-empty-state'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-topic-empty-state
		show-button='${parseBoolean(args.showButton)}'
		literals='${parseObject(args.literals)}'
	></scib-cdk-topic-empty-state>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	showButton: true,
	literals: {
		'title': 'Empty State',
		'description': 'This is a meaningful description of the empty state',
		'btnText': 'New topic',
		'imgSrc': 'assets/images/i-negotiation.svg',
	}
};
