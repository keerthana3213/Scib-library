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
	...getStoryConfig('scib-atoms-tag'),
	title: 'Design System/Atoms/Tag',
	render: (args) => <scib-atoms-tag {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		text: 'Pend. signature'
	}
};
