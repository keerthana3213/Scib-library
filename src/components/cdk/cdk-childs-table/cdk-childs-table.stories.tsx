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
	...getStoryConfig('scib-cdk-childs-table'),
	title: 'Design System/DEPRECATED/CDK/Childs Table',
	render: (args) => <scib-cdk-childs-table {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
