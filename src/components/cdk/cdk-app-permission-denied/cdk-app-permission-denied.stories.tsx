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
	...getStoryConfig('scib-cdk-app-permission-denied'),
	title: 'Design System/DEPRECATED/CDK/App Permission Denied',
	render: (args) => <scib-cdk-app-permission-denied {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
