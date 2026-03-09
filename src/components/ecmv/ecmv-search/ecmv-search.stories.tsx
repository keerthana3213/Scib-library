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
	...getStoryConfig('scib-ecmv-search'),
	title: 'Design System/DEPRECATED/ECM/Search',
	render: (args) => <scib-ecmv-search {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
