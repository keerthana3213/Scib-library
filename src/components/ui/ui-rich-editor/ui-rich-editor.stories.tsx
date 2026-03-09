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
	...getStoryConfig('scib-ui-rich-editor'),
	title: 'Design System/DEPRECATED/UI/Rich Editor',
	render: (args) => <scib-ui-rich-editor {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
