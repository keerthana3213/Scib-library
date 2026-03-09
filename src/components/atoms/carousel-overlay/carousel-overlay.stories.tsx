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
	...getStoryConfig('scib-atoms-carousel-overlay'),
	title: 'Design System/Atoms/Carousel Overlay',
	render: (args) => <scib-atoms-carousel-overlay {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		text: 'Prop: ATOMScarousel-overlay',
		literals: {
			title: 'ATOMScarousel-overlay'
		}
	}
};
