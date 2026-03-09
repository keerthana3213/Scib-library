import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Showcase',
	...getStoryConfig('scib-cdk-showcase'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-showcase 
		slot='step'  
		main-title='${args.mainTitle}'
		content-cards='${parseObject(args.contentCards)}'
	></scib-cdk-showcase>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	mainTitle: '"<h2>What can you find into \nthe <strong>Communication Framework?</strong></h2>',
	contentCards: [
		{
			'text': '<p>Here you can find all your applications, <em>services and transactional</em> tools to manage your business.</p>',
			'imgSrc': 'https://images.unsplash.com/photo-1552257079-e48b715185fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1778&q=80',
			'imgAlt': 'alt de la imagen',
		},
		{
			'text': '<p>Here you can find all your applications, <em>services and transactional</em> tools to manage your business.</p>',
			'imgSrc': 'https://images.unsplash.com/photo-1552257079-e48b715185fa?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1778&q=80',
			'imgAlt': 'alt de la imagen',
		},
	],
	// Add default values here
};
