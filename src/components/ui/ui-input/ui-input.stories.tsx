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
	...getStoryConfig('scib-ui-input'),
	title: 'Design System/DEPRECATED/UI/Input',
	render: (args) => <scib-ui-input {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
