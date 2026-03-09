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
	...getStoryConfig('scib-cdk-forseti-preview'),
	title: 'Design System/DEPRECATED/CDK/Forseti Preview',
	render: (args) => <scib-cdk-forseti-preview {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
