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
	...getStoryConfig('scib-cdk-file-selector'),
	title: 'Design System/DEPRECATED/CDK/File Selector',
	render: (args) => <scib-cdk-file-selector {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
