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
	...getStoryConfig('scib-ui-v2-empty-state'),
	title: 'Design System/Atoms/Empty State',
	render: (args) => <scib-ui-v2-empty-state {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		right: true,
		size: 'md',
		button: 'Start',
		buttonIcon: {
			icon: 'attach-document',
			position: 'leading'
		},
		image: 'assets/images/i-laptop-coffee.svg',
		mainTitle: 'No results found',
		description: 'Try to change the search inputs to get other results.'
	}
};
export const MultipleButtons: StoryObj = {
	args: {
		right: true,
		size: 'md',
		arrayButtons: [
			{
				level: 'primary',
				text: ' Start',
				iconOptions: { icon: 'attach-document', position: 'leading' },
				event: 'event 1'
			},
			{
				level: 'secondary',
				text: 'Cancel',
				iconOptions: { icon: 'close', position: 'trailing' },
				event: 'event 2'
			},
			{
				level: 'tertiary',
				text: 'Link',
				event: 'event 3'
			}
		],
		image: 'assets/images/i-laptop-coffee.svg',
		mainTitle: 'No results found',
		description: 'Try to change the search inputs to get other results.'
	}
};

export const InitialState: StoryObj = {
	render: (args: any) => (
		<scib-ui-v2-empty-state {...args}>
			<div slot="content">
				<scib-ui-button primary ultrasmall dangerouslySetInnerHTML={{ __html: args.content }} />
			</div>
		</scib-ui-v2-empty-state>
	),
	args: {
		right: true,
		size: 'md',
		image: 'assets/images/i-laptop-woman.svg',
		mainTitle: 'No results found',
		description: 'Try to change the search inputs to get other results.',
		content: 'Contenido'
	}
};
