import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Separator',
	...getStoryConfig('scib-ui-separator')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<row> <scib-ui-separator></scib-ui-separator> </row>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {};
