import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Login Phishing Form',
	...getStoryConfig('scib-cdk-login-phishing-form')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-login-phishing-form
        email-invalid='${parseBoolean(args.emailInvalid)}'
		literals='${parseObject(args.literals)}'
		source='${parseObject(args.source)}'
		captcha='${parseObject(args.captcha)}'
	>
	</scib-cdk-login-phishing-form>
`);

// Default Story
export const EmailValidation = Template.bind();
EmailValidation.args = {
    emailInvalid: false,
	literals: {
		title: 'Validate your email',
		description: 'For security reasons we need to verify your invitation email to access Client Hub.',
		description2: 'We will send you an email with a verification code to set your password and complete the process.',
		publicWeb: 'Go to SCIB public site',
		emailLabel: 'EMAIL',
		emailPlaceholder: 'Enter your email address...',
		confirm: 'Confirm',
		contact: 'Contact us for help',
        inputError: 'The email entered does not match the registration email',
        inputFormatError: 'Email format not valid'
	},
    source: {
		publicWebUrl: '/publicWebUrl',
		contactUrl: '/contactUrl',
	},
    captcha: {
		sitekey: "6LfdIAUbAAAAAIl3y_Xc5or-hWtZknbhOWX3IhA_",
		displayCaptcha: true,
		validateCaptcha: false
	}
	// Add default values here
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
 const TemplateCode = (args) => render(args, `
 <scib-cdk-login-phishing-form
     email='${args.email}'
     expired-code='${parseBoolean(args.expiredCode)}'
     step-code='${parseBoolean(args.stepCode)}'
     code-invalid='${parseBoolean(args.codeInvalid)}'
     literals='${parseObject(args.literals)}'
     source='${parseObject(args.source)}'
     captcha='${parseObject(args.captcha)}'
 >
 </scib-cdk-login-phishing-form>
`);

// Default Story
export const CodeValidation = TemplateCode.bind();
CodeValidation.args = {
    stepCode: true,
    codeInvalid: false,
    expiredCode: false,
    activeResendCode: true,
    email: 'john.smith@bussines.com',
	literals: {
		title: 'Security verification code',
		description: 'To continue with the activation process of your user account we have just sent you an email with the verification code to',
		description2: 'The code will expire in 10 minutes.',
		publicWeb: 'Go to SCIB public site',
		emailLabel: 'VERIFICATION CODE',
		emailPlaceholder: 'Enter your verification code...',
		confirm: 'Verify',
		contact: 'Contact us for help',
        inputError: 'Invalid verification code',
        inputFormatError: 'Verfication code format not valid',
        inputExpiredCodeError: 'Expired code. Try resending a new code',
        newCode: 'Need new verification code?',
        newCodeLink: 'Resend code',
        newCodeWait: 'You need to wait a few minutes if you need a new verification code.'
	},
    source: {
		publicWebUrl: '/publicWebUrl',
		contactUrl: '/contactUrl'
	}
	// Add default values here
};
