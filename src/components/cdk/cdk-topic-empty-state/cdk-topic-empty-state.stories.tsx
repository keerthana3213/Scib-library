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
	...getStoryConfig('scib-cdk-topic-empty-state'),
	title: 'Design System/DEPRECATED/CDK/Topic Empty State',
	render: (args) => <scib-cdk-topic-empty-state {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
