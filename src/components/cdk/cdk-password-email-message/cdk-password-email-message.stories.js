import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Password Email Message',
	...getStoryConfig('scib-cdk-password-email-message'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-password-email-message
		literals='${parseObject(args.literals)}'
		links='${parseObject(args.links)}'
		email='${args.email}'
	></scib-cdk-password-email-message>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		mainTitle: 'Set your password',
		publicWeb: 'Go to SCIB public site',
		textTopFirst: 'For security reasons we need to verify your account to access',
		textTopSecond: 'Client Hub',
		textBottomFirst: 'We have just sent you an email to',
		textBottomSecond: 'to set your password.',
	},
	links: {
		publicWebUrl: '/publicWebUrl',
	},
	email: 'john.smith@repsol.com',
	// Add default values here
};
