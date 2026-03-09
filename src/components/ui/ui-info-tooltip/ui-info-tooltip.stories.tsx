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
	...getStoryConfig('scib-ui-info-tooltip'),
	title: 'Design System/DEPRECATED/UI/Info Tooltip',
	render: (args) => <scib-ui-info-tooltip {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
