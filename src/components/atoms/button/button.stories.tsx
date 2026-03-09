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
	...getStoryConfig('scib-atoms-button'),
	title: 'Design System/Atoms/Button',
	render: (args) => <scib-atoms-button {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		text: 'Button',
		icon: 'chevron-down',
		size: 'm',
		level: 'primary',
		iconPosition: 'trailing',
		variant: 'basic',
		type: 'button'
	}
};
