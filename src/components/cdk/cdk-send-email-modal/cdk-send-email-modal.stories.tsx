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
	...getStoryConfig('scib-cdk-send-email-modal'),
	title: 'Design System/DEPRECATED/CDK/Send Email Modal',
	render: (args) => <scib-cdk-send-email-modal {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
