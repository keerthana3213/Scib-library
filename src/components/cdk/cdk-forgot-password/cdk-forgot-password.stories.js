import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Forgot Password',
	...getStoryConfig('scib-cdk-forgot-password'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-forgot-password
		literals='${parseObject(args.literals)}'
		error='${parseObject(args.error)}'
		props='${parseObject(args.props)}'
		captcha='${parseObject(args.captcha)}'
	></scib-cdk-forgot-password>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		mainTitle: 'Password Recovery',
		publicWeb: 'Go to SCIB public site',
		emailLabel: 'EMAIL',
		emailPlaceholder: 'Enter your email address',
		login: 'Send',
		contact: 'Contact us for help',
		cancel: 'Cancel',
		paragraph: 'Enter your email and we will send you new confirmation to change your password.',
		sendEmailparagraph: 'Your request has been processed correctly. If you still haven’t received an email in 30 minutes, please try again.',
		textError: '',
		done: 'Done',
	},
	props: {
		publicWebUrl: '/publicWebUrl',
		contactUrl: '/contactUrl',
		postUrl: '/postUrl',
		errorUrl: '/errorUrl',
		okUrl: '/okUrl',
		sendEmailOk: false,
	},
	error: {
		textError: 'Ha ocurrido un error',
	},
	captcha:{
		sitekey:"6LfdIAUbAAAAAIl3y_Xc5or-hWtZknbhOWX3IhA_",
		displayCaptcha:true,
		validateCaptcha:false
	}
	// Add default values here
};
