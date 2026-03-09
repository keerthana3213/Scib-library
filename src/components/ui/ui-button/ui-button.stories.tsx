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
	...getStoryConfig('scib-ui-button'),
	title: 'Design System/DEPRECATED/UI/Button',
	render: (args) => <scib-ui-button {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
