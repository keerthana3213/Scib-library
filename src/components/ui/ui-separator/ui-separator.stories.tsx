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
	...getStoryConfig('scib-ui-separator'),
	title: 'Design System/DEPRECATED/UI/Separator',
	render: (args) => <scib-ui-separator {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
