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
	...getStoryConfig('scib-ui-v2-menu-panel-multiselect'),
	title: 'Design System/Atoms/Menu Panel Multiselect',
	render: (args) => <scib-ui-v2-menu-panel-multiselect {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		open: true,
		subtitle: 'Filter by',
		checkIcon: 'check',
		submenuPosition: 'left',
		expandAllOnOpen: false,
		itemList: [
			{
				label: 'Opción 1',
				checked: true,
				id: '1'
			},
			{
				label: 'Opción 2',
				checked: true,
				id: '2',
				submenuIcon: 'chevron-24',
				submenuItems: [
					{
						label: 'Opción 2-1',
						checked: false,
						id: '1'
					},
					{
						label: 'Opción 2-2',
						checked: true,
						id: '1'
					}
				]
			}
		]
	}
};

export const NestedMenu: StoryObj = {
	args: {
		open: true,
		subtitle: 'Filter by',
		checkIcon: 'check',
		submenuPosition: 'right',
		submenuIcon: 'chevron-right-small-thin',
		openSubmenuOn: 'hover',
		changeDirectionOnLevelsList: ['3', '4'],
		expandAllOnOpen: true,
		itemList: [
			{
				label: 'Opción 1 hoja prueba con texto largo',
				checked: false,
				id: '1',
				icon: 'icon-online-banking',
				separator: 'bottom'
			},
			{
				label: 'Opción 2 rama  prueba con texto largo',
				checked: false,
				id: '2',

				submenuItems: [
					{
						groupLabel: 'Other options available'
					},
					{
						label: 'Opción 2-1 hoja',
						checked: false,
						id: '3',
						icon: 'icon-portfolio-of-values',
						separator: 'between'
					},
					{
						label: 'Opción 2-2 rama',
						checked: false,
						id: '4',
						submenuItems: [
							{
								label: 'Opción 2-2-1 hoja',
								checked: false,
								id: '5'
							}
						]
					}
				]
			},
			{
				label: 'Opción 3 rama',
				checked: true,
				id: '6',
				icon: 'icon-stock-exchange',
				submenuItems: [
					{
						label: 'Opción 3-1 hoja',
						checked: false,
						id: '7'
					},
					{
						label: 'Opción 3-2 rama',
						checked: true,
						id: '8',
						icon: 'icon-burndownchart-2',
						submenuItems: [
							{
								label: 'Opción 3-2-1 hoja',
								checked: false,
								id: '9'
							},
							{
								label: 'Opción 3-2-2 rama',
								checked: false,
								id: '10',
								submenuItems: [
									{
										label: 'Opción 3-2-2-1 hoja',
										checked: false,
										id: '11'
									}
								],
								separator: 'top'
							},
							{
								label: 'Opción 3-2-3 rama',
								checked: true,
								id: '12',
								submenuItems: [
									{
										label: 'Opción 3-2-3-1 hoja',
										checked: false,
										id: '13'
									},
									{
										label: 'Opción 3-2-3-2 rama',
										checked: false,
										id: '14',
										submenuItems: [
											{
												label: 'Opción 3-2-3-2-1 hoja',
												checked: false,
												id: '15',
												separator: 'top'
											},
											{
												label: 'Opción 3-2-3-2-2 hoja',
												checked: false,
												id: '16'
											},
											{
												label: 'Opción 3-2-3-2-3 rama',
												checked: false,
												id: '17',
												submenuItems: [
													{
														label: 'Opción 3-2-3-2-3-1 hoja',
														checked: false,
														id: '18',
														separator: 'between'
													},
													{
														label: 'Opción 3-2-3-2-3-2 hoja',
														checked: false,
														id: '19'
													}
												]
											}
										]
									}
								]
							}
						]
					},
					{
						label: 'Opción 3-3 hoja',
						checked: false,
						id: '20'
					}
				]
			}
		]
	}
};
