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
	...getStoryConfig('scib-atoms-skeleton'),
	title: 'Design System/Atoms/Skeleton',
	render: (args) => <scib-atoms-skeleton {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		skeletonType: 'table',
		skeletonHostPath: ''
	}
};
