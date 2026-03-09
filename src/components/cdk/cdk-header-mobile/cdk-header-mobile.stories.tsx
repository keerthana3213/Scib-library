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
	...getStoryConfig('scib-cdk-header-mobile'),
	title: 'Design System/DEPRECATED/CDK/Header Mobile',
	render: (args) => <scib-cdk-header-mobile {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
