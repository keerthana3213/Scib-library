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
	...getStoryConfig('scib-ui-input-telephone'),
	title: 'Design System/DEPRECATED/UI/Input Telephone',
	render: (args) => <scib-ui-input-telephone {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
