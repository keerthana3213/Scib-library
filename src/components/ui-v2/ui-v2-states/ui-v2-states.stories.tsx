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
	...getStoryConfig('scib-ui-v2-states'),
	title: 'Design System/Atoms/States',
	render: (args) => <scib-ui-v2-states {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		states: [
			{ state: 'complete', label: 'issued' },
			{ state: 'complete', label: 'paid' },
			{ state: 'draw', label: 'warning' },
			{ state: 'cancel', label: 'cancel' },
			{ state: 'incomplete', label: 'collected' },
			{ state: 'nuevo', label: 'vacio' }
		]
	}
};
