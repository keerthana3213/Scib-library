import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Empty State',
	...getStoryConfig('scib-ui-empty-state', {status: 'deprecated'})
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-empty-state literals='${parseObject(args.literals)}'></scib-ui-empty-state>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		"imgSrc":"images/coffeBreak.svg",
		"mainTitle":"There are no contracts at this moment",
		"desc":"When contracts are loaded for client review they will appear in this area."
	}
};
