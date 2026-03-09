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
	...getStoryConfig('scib-ecmv-document-details'),
	title: 'Design System/DEPRECATED/ECM/Document Details',
	render: (args) => <scib-ecmv-document-details {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
