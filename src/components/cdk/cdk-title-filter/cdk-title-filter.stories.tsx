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
	...getStoryConfig('scib-cdk-title-filter'),
	title: 'Design System/DEPRECATED/CDK/Title Filter',
	render: (args) => <scib-cdk-title-filter {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
