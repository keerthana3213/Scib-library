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
	...getStoryConfig('scib-ui-color-panel'),
	title: 'Design System/DEPRECATED/UI/Color Panel',
	render: (args) => <scib-ui-color-panel {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
