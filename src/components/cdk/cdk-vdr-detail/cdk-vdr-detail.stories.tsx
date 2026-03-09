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
	...getStoryConfig('scib-cdk-vdr-detail'),
	title: 'Design System/DEPRECATED/CDK/Vdr Detail',
	render: (args) => <scib-cdk-vdr-detail {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
