import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Rich Editor',
	...getStoryConfig('scib-ui-rich-editor'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style='max-width: 720px; margin: 1rem auto; height: 450px'>
		<scib-ui-rich-editor new-text-value='${args.newTextValue}' placeholder='${args.placeholder}' ></scib-ui-rich-editor>
	</div>
`);

// Default Story
export const Develop = Template.bind({});
Develop.args = {
	newTextValue: '',
	placeholder: 'placeholder'
	// Add default values here
};
