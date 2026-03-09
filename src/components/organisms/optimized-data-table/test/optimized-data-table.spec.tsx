import { h } from '@stencil/core';
import { newSpecPage } from '@stencil/core/testing';
import * as tabulatorModule from 'tabulator-tables';
import { OrganismsOptimizedDataTable } from '../component/optimized-data-table';
import { RowSizesEnum, VIEW_TYPES_ENUM } from '../models/optimized-data-table.model';

class TabulatorStub {
	static extendModule(_name, _property, _values) {}
	constructor(public element: HTMLElement, public options) {}
	redraw = jest.fn();
	setColumns = jest.fn();
	replaceData = jest.fn();
	setPageSize = jest.fn();
	setPage = jest.fn();
	on = jest.fn();
	off = jest.fn();
}

(tabulatorModule as any).default.TabulatorFull = TabulatorStub;

describe('organisms-optimized-data-table', () => {
	it('builds', () => {
		expect(new OrganismsOptimizedDataTable()).toBeTruthy();
	});
	const literals = {
		favouriteCheckbox: 'Set as favourite table view',
		typeCustomView: 'Custom view',
		typeTableView: 'Table view',
		inputLabelName: 'View name',
		panelDescription: 'Default views cannot be edited',
		inputLabelSearch: 'Search fields',
		showAll: 'Show all',
		hideAll: 'Hide all',
		emptyStateTitle: 'At least one shown field is required.',
		emptyStateDescription: 'Switch the fields to "Shown" by clicking on the crossed out eye.',
		cancel: 'Cancel',
		save: 'Save',
		delete: 'Delete',
		saveModalMessage: "If you proceed, you'll lose any unsaved changes. Are you sure you want to continue?",
		dontSave: "Don't save",
		personalise: 'Personalise',
		edit: 'edit',
		createNew: 'Create new',
		required: '*Required inputs',
		titleColumnShown: 'Shown',
		titleColumnHidden: 'Hidden',
		tittleChipContainer: 'All applied',
		chipOpenFilter: 'Filters',
		tittleColumnChipContainer: 'Column applied'
	};
	// const columMock = [
	// 	{
	// 		title: 'State',
	// 		field: 'active',
	// 		formatter: 'inlineStatus',
	// 		vertAlign: 'middle',
	// 		titleFormatter: 'columnActionsHeader',
	// 		headerSort: true,
	// 		headerFilterType: 'textFieldHeaderFilter',
	// 		headerFilterLiveFilter: false,
	// 		formatterParams: { field: 'active', trueTitle: 'Activated', falseTitle: 'Inactive' }
	// 	},
	// 	{
	// 		title: 'Date',
	// 		field: 'date',
	// 		hozAlign: 'left',
	// 		formatter: 'datetime',
	// 		vertAlign: 'middle',
	// 		titleFormatter: 'columnActionsHeader',
	// 		headerSort: true,
	// 		headerFilterType: 'textFieldHeaderFilter',
	// 		headerFilterLiveFilter: false,
	// 		formatterParams: {
	// 			inputFormat: 'yyyy-LL-dd',
	// 			outputFormat: 'dd/LL/yyyy',
	// 			invalidPlaceholder: '(invalid date)'
	// 		}
	// 	}
	// ];
	// const configMock = {
	// 	paginationSizeSelector: [10, 20, 30],
	// 	paginationButtonCount: 3,
	// 	paginationInitialPage: 1,
	// 	paginationSize: 10,
	// 	totalItems: 1500,
	// 	language: 'en',
	// 	variant: 'optimized',
	// 	isDrop: true
	// };
	const rowDataMock = [
		{
			active: false,
			isDefaultRadio: true,
			comment: '<ul><li>a</li><li>b</li></ul>',
			status: 'Issued',
			date: '2021-10-27',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '23/11/2021',
			invoiceAmount: '9.544,48',
			loan: 'Santander SCIB',
			currency: 'EUR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'active1',
			sla: 25,
			actionMenuRowConfig: {
				disabledItemIds: ['option_2']
			},
			isDisabled: false,
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true
				}
			},
			colorIconRowConfig: {
				iconsCell: {
					icon: 'information-in-a-circle',
					color: 'blue',
					allowClick: true
				}
			}
		},
		{
			active: true,
			comment:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			status: 'Pending paid',
			date: '2021-10-28',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '23/11/2021',
			invoiceAmount: '9.544,48',
			currency: 'EUR',
			invoiceBankCode: '3020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'active3',
			sla: 12,
			actionLinkRowConfig: {
				showMoreInfo: {
					text: 'texto 1',
					newIcon: 'hide-eye',
					hasTooltip: true
				}
			},
			colorIconRowConfig: {
				iconsCell: {
					icon: 'checkmark-bold',
					color: '#66FF33',
					allowClick: false,
					fontSize: 60,
					hasTooltip: true,
					tooltipText: 'No clickable (no lanza evento)',
					isHidden: false
				}
			}
		}
	];

	const itemList = [
		{
			title: 'Default views',
			type: 'view',
			id: VIEW_TYPES_ENUM.DEFAULT_VIEWS,
			views: [
				{
					favourite: true,
					label: 'Default',
					id: 'default',
					rowSize: RowSizesEnum.MEDIUM,
					columns: [
						{
							field: 'status',
							title: 'Status'
						},
						{
							field: 'supplierName',
							title: 'Supplier Name'
						},
						{
							field: 'iconsCell',
							title: 'Icons'
						},
						{
							field: 'maturityDate',
							title: 'Maturity Date'
						}
					]
				},
				{
					favourite: false,
					label: 'Other view',
					id: 'other-view',
					rowSize: RowSizesEnum.MEDIUM,
					columns: [
						{
							field: 'status',
							title: 'Status'
						},
						{
							field: 'supplierName',
							title: 'Supplier Name'
						}
					]
				}
			]
		},
		{
			title: 'Custom views',
			type: 'view',
			id: VIEW_TYPES_ENUM.CUSTOM_VIEWS,
			views: [
				{
					favourite: false,
					label: 'Custom view 1',
					id: 'custom-view-1',
					rowSize: RowSizesEnum.LARGE,
					columns: [
						{
							field: 'status',
							title: 'Status'
						},
						{
							field: 'supplierName',
							title: 'Supplier Name'
						},
						{
							field: 'loan',
							title: 'Loan'
						}
					]
				},
				{
					favourite: false,
					label: 'Custom view 2',
					id: 'custom-view-2',
					rowSize: RowSizesEnum.SMALL,
					columns: [
						{
							field: 'status',
							title: 'Status'
						},
						{
							field: 'supplierName',
							title: 'Supplier Name'
						},
						{
							field: 'maturityDate',
							title: 'Maturity Date'
						}
					]
				}
			]
		}
	];
	describe('render', () => {
		it('it should hide the skeleton and show the table when the table is loaded', async () => {
			const page = await newSpecPage({
				components: [OrganismsOptimizedDataTable],
				template: () => (
					<scib-organisms-optimized-data-table
						loading={false}
						controlManager={'delegate'}
						itemList={itemList}
						literals={literals}
					></scib-organisms-optimized-data-table>
				),
				supportsShadowDom: true
			});
			const skeleton: HTMLElement = page.root.shadowRoot.querySelector('.skeleton.loaded');
			expect(skeleton).toBeDefined();
		});
		it('it should show the skeleton and hide the table when the table is loading', async () => {
			const page = await newSpecPage({
				components: [OrganismsOptimizedDataTable],
				template: () => (
					<scib-organisms-optimized-data-table
						loading={true}
						controlManager={'delegate'}
						itemList={itemList}
						literals={literals}
						rowData={rowDataMock}
					></scib-organisms-optimized-data-table>
				),
				supportsShadowDom: true
			});
			const skeleton: HTMLElement = page.root.shadowRoot.querySelector('.skeleton.loaded');
			expect(skeleton).toBeNull();
		});
	});
});
