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
	...getStoryConfig('scib-ui-radio-button'),
	title: 'Design System/DEPRECATED/UI/Radio Button',
	render: (args) => <scib-ui-radio-button {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
