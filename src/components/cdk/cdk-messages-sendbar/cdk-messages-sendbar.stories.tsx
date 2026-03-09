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
	...getStoryConfig('scib-cdk-messages-sendbar'),
	title: 'Design System/DEPRECATED/CDK/Messages Sendbar',
	render: (args) => <scib-cdk-messages-sendbar {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
