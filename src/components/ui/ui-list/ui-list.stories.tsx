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
	...getStoryConfig('scib-ui-list'),
	title: 'Design System/DEPRECATED/UI/List',
	render: (args) => <scib-ui-list {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
