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
	...getStoryConfig('scib-ecmv-modal-files'),
	title: 'Design System/DEPRECATED/ECM/Modal Files',
	render: (args) => <scib-ecmv-modal-files {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
