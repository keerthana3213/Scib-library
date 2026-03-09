import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Header Mobile',
	...getStoryConfig('scib-cdk-header-mobile')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-header-mobile
		hide='${parseBoolean(args.hide)}'
		literals='${parseObject(args.literals)}'
		text='${args.text}'
	>
		${args.content}
	</scib-cdk-header-mobile>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	content: 'Slot: CDKheader-mobile',
	text: 'Prop: CDKheader-mobile',
	literals: {
		title: 'CDKheader-mobile',
	}
	// Add default values here
};
