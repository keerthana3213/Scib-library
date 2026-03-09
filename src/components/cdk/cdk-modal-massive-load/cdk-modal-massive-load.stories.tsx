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
	...getStoryConfig('scib-cdk-modal-massive-load'),
	title: 'Design System/DEPRECATED/CDK/Modal Massive Load',
	render: (args) => <scib-cdk-modal-massive-load {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
