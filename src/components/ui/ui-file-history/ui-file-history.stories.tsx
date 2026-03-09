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
	...getStoryConfig('scib-ui-file-history'),
	title: 'Design System/DEPRECATED/UI/File History',
	render: (args) => <scib-ui-file-history {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
