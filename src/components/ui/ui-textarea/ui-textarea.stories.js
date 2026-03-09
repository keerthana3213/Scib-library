import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Textarea',
	...getStoryConfig('scib-ui-textarea')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-textarea></scib-ui-textarea>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {};
