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
	...getStoryConfig('scib-cdk-delete-members'),
	title: 'Design System/DEPRECATED/CDK/Delete Members',
	render: (args) => <scib-cdk-delete-members {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
