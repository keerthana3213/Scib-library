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
	...getStoryConfig('scib-cdk-interaction-history'),
	title: 'Design System/DEPRECATED/CDK/Interaction History',
	render: (args) => <scib-cdk-interaction-history {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
