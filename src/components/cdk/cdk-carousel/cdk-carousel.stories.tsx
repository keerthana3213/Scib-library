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
	...getStoryConfig('scib-cdk-carousel'),
	title: 'Design System/DEPRECATED/CDK/Carousel',
	render: (args) => <scib-cdk-carousel {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
