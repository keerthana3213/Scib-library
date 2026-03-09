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
	...getStoryConfig('scib-ui-empty-state'),
	title: 'Design System/DEPRECATED/UI/Empty State',
	render: (args) => <scib-ui-empty-state {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
