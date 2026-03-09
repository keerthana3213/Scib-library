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
	...getStoryConfig('scib-atoms-badge'),
	title: 'Design System/Atoms/Badge',
	render: (args) => <scib-atoms-badge {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		text: '9+',
		variant: 'lightblue',
		type: 'badge'
	}
};
