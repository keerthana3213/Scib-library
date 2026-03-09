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
	...getStoryConfig('scib-ecmv-folder-navigator'),
	title: 'Design System/DEPRECATED/ECM/Folder Navigator',
	render: (args) => <scib-ecmv-folder-navigator {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
