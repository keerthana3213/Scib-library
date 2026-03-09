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
	...getStoryConfig('scib-cdk-create-vdr'),
	title: 'Design System/DEPRECATED/CDK/Create Vdr',
	render: (args) => <scib-cdk-create-vdr {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
