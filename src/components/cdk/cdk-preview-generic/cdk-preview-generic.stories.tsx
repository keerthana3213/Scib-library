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
	...getStoryConfig('scib-cdk-preview-generic'),
	title: 'Design System/DEPRECATED/CDK/Preview Generic',
	render: (args) => <scib-cdk-preview-generic {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
