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
	...getStoryConfig('scib-atoms-avatar'),
	title: 'Design System/Atoms/Avatar',
	render: (args) => <scib-atoms-avatar {...args} />
};
export default meta;

export const Name: StoryObj = {
	args: {
		text: 'SL',
		variant: 'white',
		badge: '9',
		type: 'md'
	}
};

export const Image: StoryObj = {
	args: {
		variant: 'white',
		img: 'https://i.pravatar.cc/300'
	}
};
