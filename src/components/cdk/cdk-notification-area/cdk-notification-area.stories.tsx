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
	...getStoryConfig('scib-cdk-notification-area'),
	title: 'Design System/DEPRECATED/CDK/Notification Area',
	render: (args) => <scib-cdk-notification-area {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
