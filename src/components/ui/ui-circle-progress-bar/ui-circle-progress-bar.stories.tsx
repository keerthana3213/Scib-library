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
	...getStoryConfig('scib-ui-circle-progress-bar'),
	title: 'Design System/DEPRECATED/UI/Circle Progress Bar',
	render: (args) => <scib-ui-circle-progress-bar {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
