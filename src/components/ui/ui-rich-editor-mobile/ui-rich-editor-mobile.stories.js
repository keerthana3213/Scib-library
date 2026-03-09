import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Rich Editor Mobile',
	...getStoryConfig('scib-ui-rich-editor-mobile')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-rich-editor-mobile
		hide='${parseBoolean(args.hide)}'
		literals='${parseObject(args.literals)}'
		text='${args.text}'
	>
		${args.content}
	</scib-ui-rich-editor-mobile>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	content: 'Slot: UIrich-editor-mobile',
	text: 'Prop: UIrich-editor-mobile',
	literals: {
		title: 'UIrich-editor-mobile',
	}
	// Add default values here
};
