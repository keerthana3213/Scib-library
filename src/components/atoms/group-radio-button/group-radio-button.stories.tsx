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
	...getStoryConfig('scib-atoms-group-radio-button'),
	title: 'Design System/Atoms/Group Radio Button',
	render: (args) => <scib-atoms-group-radio-button {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		options: [
			{
				label: 'Opcion 1',
				value: '1',
				id: '1',
				button: {
					text: 'button',
					disabled: false,
					event: 'link',
					level: 'tertiary'
				},
				helperText: 'helper text'
			},
			{
				label: 'Opcion 2',
				value: '2',
				id: '2'
			}
		],
		name: 'opciones',
		direction: 'column',
		value: '1'
	}
};
