import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Empty State One',
	...getStoryConfig('scib-cdk-empty-state-one'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-empty-state-one  
		literals='${parseObject(args.literals)}'
		content-cards='${parseObject(args.contentCards)}'
	></scib-cdk-empty-state-one>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		'imgLeftSrc': 'assets/images/i-cloud--left.svg',
		'mainTitle': 'Nacho, you have not applications',
		'imgRightSrc': 'assets/images/i-cloud--right.svg',
		'text': 'Visit the Store and add your applications to the feed',
		'btn': 'Go to the Store',
	},
	contentCards: [
		{
			'smallTitle': 'Single point of access',
			'desc': 'One-stop-shop for all SCIB services avaible at the store.',
			'imgSrc': 'assets/images/i-person-lock--small.svg',
		},
		{
			'smallTitle': 'Comprehensive vision',
			'desc': 'Fully-fledged vision for all SCIB digital offering.',
			'imgSrc': 'assets/images/i-person-laptop--small.svg',
		},
		{
			'smallTitle': 'User focus',
			'desc': 'Personalizad desktop curated by you.',
			'imgSrc': 'assets/images/i-writter--small.svg',
		},
	],
};
