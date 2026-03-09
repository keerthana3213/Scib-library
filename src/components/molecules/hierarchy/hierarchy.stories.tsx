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
	...getStoryConfig('scib-molecules-hierarchy'),
	title: 'Design System/Molecules/Hierarchy',
	render: (args) => <scib-molecules-hierarchy {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		menuList: [
			{
				label: 'Opción 1',
				icon: 'edit-pencil',
				id: '1',
				data: {}
			},
			{
				label: 'Opción 2',
				icon: 'delete',
				id: '2',
				data: {}
			}
		],
		config: {
			activeMenu: true,
			columnOptions: [
				{ idField: 'control', key_title: 'column_control', width: 70 },
				{ idField: 'breach', key_title: 'column_breach', tagParams: { type: 'alert' } },
				{ idField: 'warning', key_title: 'column_warning', tagParams: { type: 'warning' } }
			]
		},
		literals: {
			column_control: 'Controls',
			column_breach: 'Breachs',
			column_warning: 'Warnings',
			bocarte: 'Bocarte',
			main: 'Main Portfolio',
			component_name: 'Sections'
		},
		data: [
			{
				key_title: 'bocarte',
				control: 29,
				breach: 49,
				warning: 10,
				subsection: [
					{
						key_title: 'main',
						control: '10',
						breach: '29',
						warning: '4'
					},
					{
						key_title: '6',
						control: '19',
						breach: '20',
						warning: '6'
					}
				]
			},
			{
				key_title: 'Accordion text'
			},
			{
				key_title: 'Accordion text'
			}
		]
	}
};
