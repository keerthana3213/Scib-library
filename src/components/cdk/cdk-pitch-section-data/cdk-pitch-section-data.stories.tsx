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
	...getStoryConfig('scib-cdk-pitch-section-data'),
	title: 'Design System/DEPRECATED/CDK/Pitch Section Data',
	render: (args) => <scib-cdk-pitch-section-data {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
