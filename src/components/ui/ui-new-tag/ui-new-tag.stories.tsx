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
	...getStoryConfig('scib-ui-new-tag'),
	title: 'Design System/DEPRECATED/UI/New Tag',
	render: (args) => <scib-ui-new-tag {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
