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
	...getStoryConfig('scib-ui-options-menu'),
	title: 'Design System/DEPRECATED/UI/Options Menu',
	render: (args) => <scib-ui-options-menu {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
