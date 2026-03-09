import { getStoryConfig, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Modal',
	...getStoryConfig('scib-ui-modal', {status: 'deprecated'})
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-modal open="${parseBoolean(args.open)}">
		<div>Text</div>
	</scib-ui-modal>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	open: false
};
