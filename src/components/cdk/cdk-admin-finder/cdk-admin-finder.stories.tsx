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
	...getStoryConfig('scib-cdk-admin-finder'),
	title: 'Design System/DEPRECATED/CDK/Admin Finder',
	render: (args) => <scib-cdk-admin-finder {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
