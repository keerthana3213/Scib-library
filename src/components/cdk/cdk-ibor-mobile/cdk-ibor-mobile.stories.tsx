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
	...getStoryConfig('scib-cdk-ibor-mobile'),
	title: 'Design System/DEPRECATED/CDK/Ibor Mobile',
	render: (args) => <scib-cdk-ibor-mobile {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
