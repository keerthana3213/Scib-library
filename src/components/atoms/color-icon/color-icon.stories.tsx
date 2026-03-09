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
	...getStoryConfig('scib-atoms-color-icon'),
	title: 'Design System/Atoms/Color Icon',
	render: (args) => (
		<div style={{ width: '50px', height: '50px' }}>
			<scib-atoms-color-icon {...args}>{args.content}</scib-atoms-color-icon>
		</div>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		name: 'attach-document'
	}
};
