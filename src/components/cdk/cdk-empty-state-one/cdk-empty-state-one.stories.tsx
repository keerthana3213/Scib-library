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
	...getStoryConfig('scib-cdk-empty-state-one'),
	title: 'Design System/DEPRECATED/CDK/Empty State One',
	render: (args) => <scib-cdk-empty-state-one {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
