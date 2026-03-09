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
	...getStoryConfig('scib-cdk-showcase'),
	title: 'Design System/DEPRECATED/CDK/Showcase',
	render: (args) => <scib-cdk-showcase {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
