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
	...getStoryConfig('scib-molecules-status-modal'),
	title: 'Design System/Molecules/Status Modal',
	render: (args) => (
		<scib-molecules-status-modal {...args}>
			<div slot="actions" dangerouslySetInnerHTML={{ __html: args.actions }} />
		</scib-molecules-status-modal>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		status: 'success',
		open: true,
		disableClose: true,
		titleModal: 'Lorem ipsum dolor sit amet consectetur adipiscing elit',
		message: 'You -have used up all three attempts. To unlock your signature, contact client service at xxx xx xx xx',
		actions: `<scib-atoms-button text='I understand' type='button' size='m'></scib-atoms-button>`
	}
};
