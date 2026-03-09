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
	...getStoryConfig('scib-cdk-forgot-password'),
	title: 'Design System/DEPRECATED/CDK/Forgot Password',
	render: (args) => <scib-cdk-forgot-password {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
