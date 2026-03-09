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
	...getStoryConfig('scib-cdk-app-selection'),
	title: 'Design System/DEPRECATED/CDK/App Selection',
	render: (args) => <scib-cdk-app-selection {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
