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
	...getStoryConfig('scib-ui-added-tag'),
	title: 'Design System/DEPRECATED/UI/Added Tag',
	render: (args) => <scib-ui-added-tag {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
