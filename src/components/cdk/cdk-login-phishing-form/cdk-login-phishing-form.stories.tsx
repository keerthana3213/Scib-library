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
	...getStoryConfig('scib-cdk-login-phishing-form'),
	title: 'Design System/DEPRECATED/CDK/Login Phishing Form',
	render: (args) => <scib-cdk-login-phishing-form {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
