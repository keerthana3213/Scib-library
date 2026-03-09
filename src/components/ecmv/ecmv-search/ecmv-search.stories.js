import { getStoryConfig, parseNumber, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Search',
	...getStoryConfig('scib-ecmv-search'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ecmv-search
		placeholder='${args.placeholder}'
		label='${args.label}'
		debouncetime='${parseNumber(args.debouncetime)}'
	></scib-ecmv-search>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	label: 'Files',
	placeholder: 'Search',
	debouncetime: 1000,
	// Add default values here
};
