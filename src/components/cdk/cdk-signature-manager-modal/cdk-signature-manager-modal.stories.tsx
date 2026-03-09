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
	...getStoryConfig('scib-cdk-signature-manager-modal'),
	title: 'Design System/DEPRECATED/CDK/Signature Manager Modal',
	render: (args) => <scib-cdk-signature-manager-modal {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
