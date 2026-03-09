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
	...getStoryConfig('scib-organisms-virtual-support'),
	title: 'Design System/Organisms/Virtual-Support',
	render: (args) => <scib-organisms-virtual-support {...args}>{args.content}</scib-organisms-virtual-support>
};
export default meta;

export const Playground: StoryObj = {
	args: {
		language: 'en-GB'
	}
};
