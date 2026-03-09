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
	...getStoryConfig('scib-cdk-signature-table-cell-status'),
	title: 'Design System/DEPRECATED/CDK/Signature Table Cell Status',
	render: (args) => <scib-cdk-signature-table-cell-status {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
