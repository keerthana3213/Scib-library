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
	...getStoryConfig('scib-cdk-elements-list'),
	title: 'Design System/DEPRECATED/CDK/Elements List',
	render: (args) => <scib-cdk-elements-list {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
