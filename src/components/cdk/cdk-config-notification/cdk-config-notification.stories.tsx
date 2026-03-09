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
	...getStoryConfig('scib-cdk-config-notification'),
	title: 'Design System/DEPRECATED/CDK/Config Notification',
	render: (args) => <scib-cdk-config-notification {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
