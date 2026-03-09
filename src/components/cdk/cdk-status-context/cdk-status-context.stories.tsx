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
	...getStoryConfig('scib-cdk-status-context'),
	title: 'Design System/DEPRECATED/CDK/Status Context',
	render: (args) => <scib-cdk-status-context {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
