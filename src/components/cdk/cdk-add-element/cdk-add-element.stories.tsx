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
	...getStoryConfig('scib-cdk-add-element'),
	title: 'Design System/DEPRECATED/CDK/Add Element',
	render: (args) => <scib-cdk-add-element {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
