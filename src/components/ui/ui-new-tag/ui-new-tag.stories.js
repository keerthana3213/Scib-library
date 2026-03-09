import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/New Tag',
	...getStoryConfig('scib-ui-new-tag')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-new-tag
		literals='${parseObject(args.literals)}'
	</scib-ui-new-tag>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		new: "NEW"
	}
};
