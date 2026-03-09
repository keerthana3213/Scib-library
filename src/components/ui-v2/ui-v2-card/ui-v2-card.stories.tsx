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
	...getStoryConfig('scib-ui-v2-card'),
	title: 'Design System/Atoms/Card',
	render: (args) => (
		<scib-ui-v2-card {...args}>
			<h3>Title</h3>
			<p>{args.content}</p>
		</scib-ui-v2-card>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		variant: 'white',
		content:
			'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore' +
			' magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo' +
			' consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur' +
			' sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
		cardId: 'card-id',
		tooltip: 'Tooltip for the card',
		type: 'outlined'
	}
};
