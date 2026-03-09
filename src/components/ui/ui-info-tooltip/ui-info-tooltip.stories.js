import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Info Tooltip',
	...getStoryConfig('scib-ui-info-tooltip')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style="padding:40px">
		<scib-ui-info-tooltip text="Example text" title="Tooltip example"><span>hola</span></scib-ui-info-tooltip>
	</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {};
