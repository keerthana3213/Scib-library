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
	...getStoryConfig('scib-cdk-topic-card'),
	title: 'Design System/DEPRECATED/CDK/Topic Card',
	render: (args) => <scib-cdk-topic-card {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
