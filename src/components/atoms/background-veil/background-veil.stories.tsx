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
	...getStoryConfig('scib-atoms-background-veil'),
	title: 'Design System/Atoms/Background Veil',
	render: (args) => <scib-atoms-background-veil {...args}>{args.content}</scib-atoms-background-veil>
};
export default meta;

export const Playground: StoryObj = {
	args: {
		content: '<h3>This is a Head 3</h3>',
		imgBackground: 'assets/images/default-img-store.png',
		heightBackground: '440px'
	}
};
