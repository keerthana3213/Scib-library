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
	...getStoryConfig('scib-cdk-ism-contact-list'),
	title: 'Design System/DEPRECATED/CDK/Ism Contact List',
	render: (args) => <scib-cdk-ism-contact-list {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
