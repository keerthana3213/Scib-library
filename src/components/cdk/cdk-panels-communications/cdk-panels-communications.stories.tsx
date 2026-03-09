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
	...getStoryConfig('scib-cdk-panels-communications'),
	title: 'Design System/DEPRECATED/CDK/Panels Communications',
	render: (args) => <scib-cdk-panels-communications {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
