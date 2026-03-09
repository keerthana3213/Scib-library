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
	...getStoryConfig('scib-cdk-password-email-message'),
	title: 'Design System/DEPRECATED/CDK/Password Email Message',
	render: (args) => <scib-cdk-password-email-message {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
