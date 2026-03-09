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
	...getStoryConfig('scib-atoms-chip-selector'),
	title: 'Design System/Atoms/Chip Selector',
	render: (args) => <scib-atoms-chip-selector {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		chipText: 'Label',
		icon: 'slot',
		counter: 99
	}
};
