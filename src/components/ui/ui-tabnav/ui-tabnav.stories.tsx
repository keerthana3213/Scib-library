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
	...getStoryConfig('scib-ui-tabnav'),
	title: 'Design System/DEPRECATED/UI/Tabnav',
	render: (args) => <scib-ui-tabnav {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
