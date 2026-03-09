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
	...getStoryConfig('scib-ui-aside-panel'),
	title: 'Design System/DEPRECATED/UI/Aside Panel',
	render: (args) => <scib-ui-aside-panel {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
