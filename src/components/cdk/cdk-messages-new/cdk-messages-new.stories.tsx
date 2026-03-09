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
	...getStoryConfig('scib-cdk-messages-new'),
	title: 'Design System/DEPRECATED/CDK/Messages New',
	render: (args) => <scib-cdk-messages-new {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
