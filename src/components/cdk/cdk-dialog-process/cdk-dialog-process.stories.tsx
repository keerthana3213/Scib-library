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
	...getStoryConfig('scib-cdk-dialog-process'),
	title: 'Design System/DEPRECATED/CDK/Dialog Process',
	render: (args) => <scib-cdk-dialog-process {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
