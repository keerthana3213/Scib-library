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
	...getStoryConfig('scib-ui-ism-table'),
	title: 'Design System/DEPRECATED/UI/Ism Table',
	render: (args) => <scib-ui-ism-table {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
