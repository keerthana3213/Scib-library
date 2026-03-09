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
	...getStoryConfig('scib-atoms-navigation'),
	title: 'Design System/Atoms/Navigation',
	render: (args) => <scib-atoms-navigation {...args} dangerouslySetInnerHTML={{ __html: args.content }} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		content: '',
		text: 'Prop: ATOMSnavigation',
		literals: {
			title: 'ATOMSnavigation'
		}
	}
};
