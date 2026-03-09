import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-molecules-login-credentials'),
	title: 'Design System/Molecules/Login Credentials',
	render: (args) => <scib-molecules-login-credentials {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		literals: {
			mainTitle: 'SCIB Digital Platform Login',
			publicWeb: 'Go to SCIB public site',
			emailLabel: 'EMAIL',
			emailPlaceholder: 'Enter your email address',
			passLabel: 'PASSWORD',
			passPlaceholder: 'Enter your password',
			login: 'Login',
			forgotpass: 'Forgot password?',
			contact: 'Contact us for help'
			// textError: 'Incorrect email address and/or password',
		},
		links: {
			publicWebUrl: '/publicWebUrl',
			forgotPassUrl: '/forgotPassUrl',
			contactUrl: '/contactUrl'
		},
		captcha: {
			sitekey: '6LfdIAUbAAAAAIl3y_Xc5or-hWtZknbhOWX3IhA_',
			displayCaptcha: true,
			validateCaptcha: true
		}
	}
};
