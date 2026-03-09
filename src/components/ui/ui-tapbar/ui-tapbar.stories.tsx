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
	...getStoryConfig('scib-ui-tapbar'),
	title: 'Design System/DEPRECATED/UI/Tapbar',
	render: (args) => <scib-ui-tapbar {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
