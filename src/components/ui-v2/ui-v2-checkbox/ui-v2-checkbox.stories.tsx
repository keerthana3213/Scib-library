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
	...getStoryConfig('scib-ui-v2-checkbox'),
	title: 'Design System/Atoms/Checkbox',
	render: (args) => <scib-ui-v2-checkbox {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		value: 'indeterminate',
		uid: '23',
		label: 'hello',
		helper: 'friend'
	}
};
