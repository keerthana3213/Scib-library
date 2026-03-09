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
	...getStoryConfig('scib-ui-table-simple'),
	title: 'Design System/DEPRECATED/UI/Table Simple',
	render: (args) => <scib-ui-table-simple {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
