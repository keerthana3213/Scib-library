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
	...getStoryConfig('scib-atoms-loading'),
	title: 'Design System/Atoms/Loading',
	render: (args) => (
		<div style={{ height: '200px' }}>
			<scib-atoms-loading {...args} />
		</div>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		level: 'primary',
		size: 's',
		variant: 'circular',
		value: -1
	}
};
