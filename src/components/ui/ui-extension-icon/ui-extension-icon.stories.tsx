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
	...getStoryConfig('scib-ui-extension-icon'),
	title: 'Design System/DEPRECATED/UI/Extension Icon',
	render: (args) => <scib-ui-extension-icon {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
