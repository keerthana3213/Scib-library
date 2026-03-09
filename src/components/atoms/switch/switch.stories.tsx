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
	...getStoryConfig('scib-atoms-switch'),
	title: 'Design System/Atoms/Switch',
	render: (args) => <scib-atoms-switch {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		disabled: false,
		checked: false,
		readOnly: false,
		label: 'All available invoices'
	}
};
