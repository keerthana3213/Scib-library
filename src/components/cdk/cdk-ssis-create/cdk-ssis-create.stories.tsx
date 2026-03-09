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
	...getStoryConfig('scib-cdk-ssis-create'),
	title: 'Design System/DEPRECATED/CDK/Ssis Create',
	render: (args) => <scib-cdk-ssis-create {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
