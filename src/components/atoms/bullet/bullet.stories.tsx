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
	...getStoryConfig('scib-atoms-bullet'),
	title: 'Design System/Atoms/Bullet',
	render: (args) => <scib-atoms-bullet {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		idBullet: '1',
		size: 'normal'
	}
};
