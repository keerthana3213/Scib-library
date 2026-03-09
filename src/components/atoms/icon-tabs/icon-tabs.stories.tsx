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
	...getStoryConfig('scib-atoms-icon-tabs'),
	title: 'Design System/Atoms/Icon Tabs',
	render: (args) => <scib-atoms-icon-tabs {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		tabs: [
			{ id: 1, icon: 'row-separation-s' },
			{ id: 2, icon: 'row-separation-m' },
			{ id: 3, icon: 'row-separation-l' }
		],
		activeIndex: 1
	}
};
