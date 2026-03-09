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
	...getStoryConfig('scib-ui-row'),
	title: 'Design System/DEPRECATED/UI/Row',
	render: (args) => <scib-ui-row {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
