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
	...getStoryConfig('scib-cdk-content'),
	title: 'Design System/DEPRECATED/CDK/Content',
	render: (args) => <scib-cdk-content {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
