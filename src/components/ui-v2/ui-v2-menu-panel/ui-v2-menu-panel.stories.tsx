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
	...getStoryConfig('scib-ui-v2-menu-panel'),
	title: 'Design System/Atoms/Menu Panel',
	render: (args) => <scib-ui-v2-menu-panel {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		open: true,
		itemList: [
			{
				label: 'Opción 1',
				icon: 'edit-pencil',
				id: '1',
				disabled: true,
				data: {}
			},
			{
				label: 'Opción 2',
				icon: 'delete',
				id: '2',
				data: {}
			}
		]
	}
};
