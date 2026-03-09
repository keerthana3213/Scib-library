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
	...getStoryConfig('scib-cdk-toolbox'),
	title: 'Design System/DEPRECATED/CDK/Toolbox',
	render: (args) => <scib-cdk-toolbox {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
