import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Ism Table',
	...getStoryConfig('scib-ui-ism-table', {status: 'deprecated'})
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-ism-table>
	</scib-ui-ism-table>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
};
