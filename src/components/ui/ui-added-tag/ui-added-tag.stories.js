import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Added Tag',
	...getStoryConfig('scib-ui-added-tag'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = args => render(args, `
	<scib-ui-added-tag
		literals='${parseObject(args.literals)}'>
	</scib-ui-added-tag>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		added: 'Added',
	},
	// Add default values here
};
