import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import { DEFAULT_CONFIG, DEFAULT_CONFIG_TOOLTIP_ROW } from './story.configs';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import { isEmpty, omit } from 'lodash';
import { RowSizesEnum } from './models/optimized-data-table.model';
import { Components } from '../../../components';
declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-organisms-optimized-data-table'),
	title: 'Design System/Organisms/Optimized Data Table',
	render: (args) => {
		return (
			<div style={{ margin: '0 auto', maxWidth: '1200px' }}>
				<scib-ui-v2-card>
					<scib-organisms-optimized-data-table {...args}>
						{isEmpty(args['manage-functionalities']) && (
							<div slot="header-actions" style={{ display: 'flex', gap: '8px', color: '#137e84' }}>
								<i className="icon icon-information-in-a-circle" />
								<i className="icon icon-refresh-reload-screen" />
								<i className="icon icon-download" />
								<i className="icon icon-settings" />
								<scib-atoms-button
									style={{ marginLeft: '4px' }}
									text="Action"
									size="xs"
									level="primary"
									variant="basic"
									type="button"
								></scib-atoms-button>
							</div>
						)}
					</scib-organisms-optimized-data-table>
				</scib-ui-v2-card>
			</div>
		);
	}
};
export default meta;

export const Standard: StoryObj = {
	args: {
		...omit(DEFAULT_CONFIG, ['manageFunctionalities']),
		manageFunctionalities: '',
		controlManager: 'local'
	}
};

export const Delegate: StoryObj = {
	args: {
		...omit(DEFAULT_CONFIG, ['manageFunctionalities']),
		controlManager: 'delegate'
	}
};

export const LocalInfiniteScroll: StoryObj = {
	args: {
		...omit(DEFAULT_CONFIG, ['manageFunctionalities']),
		manageFunctionalities: '',
		controlManager: 'localInfiniteScroll'
	}
};

// Simple example data for tables
const simpleData = [
	{ id: 1, name: 'John Smith', email: 'john@example.com', statusId: 'active1', status: 'Active' },
	{ id: 2, name: 'Mary Johnson', email: 'mary@example.com', statusId: 'active1', status: 'Inactive' },
	{ id: 3, name: 'Charles Brown', email: 'charles@example.com', statusId: 'active1', status: 'Active' },
	{ id: 4, name: 'Anne Davis', email: 'anne@example.com', statusId: 'active1', status: 'Pending' },
	{ id: 5, name: 'Paul Wilson', email: 'paul@example.com', statusId: 'active1', status: 'Active' }
];

// Simple columns for tables
const simpleColumns = [
	{ title: 'ID', field: 'id', width: 80 },
	{ title: 'Name', field: 'name', width: 180 },
	{ title: 'Email', field: 'email', width: 200 },
	{
		title: 'Status',
		field: 'status',
		width: 120,
		formatter: 'status',
		vertAlign: 'middle',
		formatterParams: {
			mapKey: 'statusId',
			isBold: true,
			values: {
				ready1: '#23779A',
				ready2: '#9BC3D3',
				active1: '#137E84',
				active2: '#32BBC3',
				active3: '#3366FF',
				active4: '#85A4FF',
				active5: '#9E3667',
				active6: '#BB7295',
				warning1: '#856300',
				warning2: '#FFCC33',
				error1: '#990000',
				error2: '#CC0000',
				block1: '#727272',
				block2: '#CCCCCC',
				success1: '#008035',
				success2: '#63BA68',
				cancel1: '#000000',
				cancel2: '#444444'
			}
		}
	}
];

export const RowSize: StoryObj = {
	args: {
		...omit(DEFAULT_CONFIG, ['itemList', 'manageFunctionalities', 'columns', 'rowData', 'filters']),
		manageFunctionalities: {
			showManageViews: false,
			showFilters: false,
			showRowsize: false,
			showPaginator: false
		},
		config: {
			renderHorizontal: 'virtual',
			pagination: false,
			totalItems: 200,
			language: 'en'
		},
		filters: [],
		controlManager: 'local',
		columns: simpleColumns,
		rowData: simpleData
	},
	render: (args) => {
		const [rowSizeValue, setRowSizeValue] = useState(40);
		const [enumRowSize, setEnumRowSize] = useState(RowSizesEnum.MEDIUM);
		const selectRef = useRef<Components.ScibUiV2Select>(null);

		const handleSelectChange = (event) => {
			if (event && event.detail) {
				setEnumRowSize(event.detail);
			}
		};

		useEffect(() => {
			if (selectRef.current) {
				const selectElement = selectRef.current as any;
				selectElement.addEventListener('valueChange', handleSelectChange);

				return () => {
					selectElement.removeEventListener('valueChange', handleSelectChange);
				};
			}
		}, [selectRef.current]);

		return (
			<div className="mx-auto max-w-6xl">
				<div className="mb-5">
					<h2 className="text-lg font-medium mb-2.5">Table with RowSizesEnum</h2>
					<div className="flex items-center mb-5">
						<div style={{ width: '250px' }}>
							<scib-ui-v2-select
								ref={selectRef}
								label="Tamaño de fila"
								value={enumRowSize}
								menu-options={JSON.stringify([
									{ id: 'small', value: RowSizesEnum.SMALL, label: 'Pequeño (small)' },
									{ id: 'medium', value: RowSizesEnum.MEDIUM, label: 'Mediano (medium)' },
									{ id: 'large', value: RowSizesEnum.LARGE, label: 'Grande (large)' }
								])}
							></scib-ui-v2-select>
						</div>
					</div>
					<scib-ui-v2-card>
						<scib-organisms-optimized-data-table {...args} rowsize={enumRowSize}></scib-organisms-optimized-data-table>
					</scib-ui-v2-card>
				</div>

				<div className="mb-5">
					<h2 className="text-lg font-medium mb-2.5">Row Size Control</h2>
					<div className="flex items-center mb-5 w-96">
						<span className="mr-5 min-w-[100px]">Size: {rowSizeValue}px</span>
						<input
							type="range"
							min="20"
							max="100"
							value={rowSizeValue}
							onChange={(e) => setRowSizeValue(parseInt(e.target.value))}
							className="full-screen"
						/>
					</div>
				</div>

				<div className="mb-5">
					<h2 className="text-lg font-medium mb-2.5">Table with custom value ({rowSizeValue})</h2>
					<scib-ui-v2-card>
						<scib-organisms-optimized-data-table {...args} rowsize={`${rowSizeValue}`}></scib-organisms-optimized-data-table>
					</scib-ui-v2-card>
				</div>

				{/* 				<div className="mb-5">
					<h2 className="text-lg font-medium mb-2.5">Table with showRowSize enabled</h2>
					<scib-ui-v2-card>
						<scib-organisms-optimized-data-table
							{...args}
							manageFunctionalities={{
								showManageViews: false,
								showFilters: false,
								showRowsize: true,
								showPaginator: false
							}}
						></scib-organisms-optimized-data-table>
					</scib-ui-v2-card>
				</div> */}
			</div>
		);
	}
};

export const SimpleTable: StoryObj = {
	args: {
		...omit(DEFAULT_CONFIG, ['itemList', 'manageFunctionalities', 'config']),
		manageFunctionalities: {
			showManageViews: false,
			showFilters: false,
			showRowsize: false,
			showPaginator: false
		},
		config: {
			renderHorizontal: 'virtual',
			paginationSize: 5,
			totalItems: 200,
			language: 'en'
		},
		controlManager: 'localInfiniteScroll'
	}
};

export const EmptyState: StoryObj = {
	args: {
		...omit(DEFAULT_CONFIG, ['itemList', 'manageFunctionalities', 'config', 'rowData']),
		manageFunctionalities: {
			showManageViews: false,
			showFilters: false,
			showRowsize: false,
			showPaginator: false
		},
		config: {
			renderHorizontal: 'virtual',
			paginationSize: 5,
			totalItems: 200,
			language: 'en'
		},
		rowData: []
	}
};

export const WithTooltipRow: StoryObj = {
	args: {
		...DEFAULT_CONFIG_TOOLTIP_ROW,
		controlManager: 'localInfiniteScroll'
	}
};
