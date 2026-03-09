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
	...getStoryConfig('scib-ecmv-metadata-filter'),
	title: 'Design System/DEPRECATED/ECM/Metadata Filter',
	render: (args) => <scib-ecmv-metadata-filter {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
