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
	...getStoryConfig('scib-cdk-parameter-input'),
	title: 'Design System/DEPRECATED/CDK/Parameter Input',
	render: (args) => <scib-cdk-parameter-input {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
