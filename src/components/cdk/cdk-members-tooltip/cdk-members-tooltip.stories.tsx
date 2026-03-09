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
	...getStoryConfig('scib-cdk-members-tooltip'),
	title: 'Design System/DEPRECATED/CDK/Members Tooltip',
	render: (args) => <scib-cdk-members-tooltip {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
