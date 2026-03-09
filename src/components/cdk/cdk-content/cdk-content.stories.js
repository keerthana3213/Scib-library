import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Content',
	...getStoryConfig('scib-cdk-content'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-content slot='step'
		main-title='${args.mainTitle}'
		text='${args.text}'
		img-src='${args.imgSrc}'
		img-alt='${args.imgAlt}'
	></scib-cdk-content>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	mainTitle: '<h2><strong>Welcome to the Portal, Tom!</strong></h2>',
	text: '<p>Here you can find all your applications, <em>services and transactional</em> tools to manage your business.</p><p>Take a look and <strong> enjoy your new digital experience.</strong></p>',
	imgSrc: 'https://images.unsplash.com/photo-1552257079-e48b715185fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1778&q=80',
	imgAlt: 'alt de la imagen',
	// Add default values here
};
