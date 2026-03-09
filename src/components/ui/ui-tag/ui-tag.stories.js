import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Tag',
	...getStoryConfig('scib-ui-tag')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-tag
		text='${args.text}'
        closed='${parseBoolean(args.closed)}'
        clickable='${parseBoolean(args.clickable)}'
        min-width='${parseBoolean(args.minWidth)}'
        large='${parseBoolean(args.large)}'
        small='${parseBoolean(args.small)}'
        filter-id='${args.filterId}'
	>
	</scib-ui-tag>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	text: 'Closed',
    closed: false,
    clickable: false,
    minWidth: false,
    large: false,
    small: false,
    filterId: 0
	// Add default values here
};
