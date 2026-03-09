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
	...getStoryConfig('scib-cdk-mifid-landing'),
	title: 'Design System/DEPRECATED/CDK/Mifid Landing',
	render: (args) => <scib-cdk-mifid-landing {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
