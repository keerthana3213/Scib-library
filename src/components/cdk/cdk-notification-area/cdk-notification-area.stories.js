import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Notification Area',
	...getStoryConfig('scib-cdk-notification-area'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<p>Ver pestaña "Docs/Playgrounds"</p>
	<a href='/notification-area/index.html' target='_blank'>Notification Area Playground</a>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	// Add default values here
};
