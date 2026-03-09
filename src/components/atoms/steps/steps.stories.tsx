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
	...getStoryConfig('scib-atoms-steps'),
	title: 'Design System/Atoms/Steps',
	render: (args) => <scib-atoms-steps {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		steps: [
			{
				id: 1,
				value: 'Selection',
				active: false
			},
			{
				id: 2,
				value: 'Configuration',
				active: true
			},
			{
				id: 3,
				value: 'Confirmation',
				active: false
			}
		]
	}
};
