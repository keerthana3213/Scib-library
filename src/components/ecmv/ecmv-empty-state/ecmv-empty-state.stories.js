import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Empty State',
	...getStoryConfig('scib-ecmv-empty-state')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ecmv-empty-state
		literals='${parseObject(args.literals)}'
	>
	</scib-ecmv-empty-state>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		title: 'There are no files at this moment',
		description: 'When you start receiving files they will appear in this area.',
	}
	// Add default values here
};
