export const DEFAULT_CONFIG = {
	analytics: {
		label01: 'ui_kit',
		eventCategory: 'ui_kit'
	},
	literals: {
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
		searchEmptyStateTitle: 'There is no results',
		searchEmptyStateDescription: "The field entered doesn't exist",
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
		tittleColumnChipContainer: 'Column applied',
		tooltipFilterSearch: 'Filter exist',
		tooltipEmptyFilter: 'Empty filter',
		paddingSelector: 'Padding selector',
		tableViewSelector: 'Table view selector',
		viewAllFilters: 'View all filters',
		columnSum: 'Column sum',
		dataDateColumns: 'Date of the column data',
		columnFilters: 'View column filters',
		view: 'View',
		paginator: 'Items-visibles',
		titleCustomViews: 'Custom views'
	},
	name: 'Securizations',
	loadingIds: [{ rowId: 'row-1' }, { rowId: 'row-8' }],
	controlManager: 'local',
	emptyStateTitle: 'No results found',
	emptyStateDescription: 'Try to change the search inputs to get other results.',
	emptyStateImage: 'i-laptop-coffee.svg',
	skeletonHostPath: '',
	loading: false,
	config: {
		paginationSizeSelector: [10, 20, 30, 'all'],
		paginationButtonCount: 3,
		paginationInitialPage: 1,
		infiniteScroll: false,
		paginationSize: 10,
		hideFilters: false,
		hideViews: false,
		totalItems: 1500,
		hideTotal: false,
		language: 'en',
		tooltipDelay: 500
	},
	itemList: [
		{
			title: 'Default views',
			type: 'view',
			id: 'default-views',
			views: [
				{
					favourite: true,
					label: 'Default',
					id: 'default',
					rowSize: 'medium',
					columns: [
						{
							field: 'status',
							title: 'Status'
						},
						{
							field: 'invoiceAmount',
							title: 'Invoice amount'
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
				},
				{
					favourite: false,
					label: 'Other view',
					id: 'other-view',
					rowSize: 'medium',
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
		},
		{
			title: 'Custom views',
			type: 'view',
			id: 'custom-views',
			views: [
				{
					favourite: false,
					label: 'Custom view 1',
					id: 'custom-view-1',
					rowSize: 'large',
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
							field: 'invoiced',
							title: 'Invoiced'
						},
						{
							field: 'date',
							title: 'Date'
						},
						{
							field: 'invoiceAmount',
							title: 'Invoice amount'
						}
					]
				},
				{
					favourite: false,
					label: 'Custom view 2',
					id: 'custom-view-2',
					rowSize: 'small',
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
	],
	showSubHeader: false,
	subHeaderData: {
		searchDate: '26/10/2023',
		data: [
			{
				field: 'status',
				hozAlign: 'left',
				value: '26/10/2023'
			},
			{
				field: 'active',
				hozAlign: 'left',
				value: '26/10/2023'
			},
			{
				field: 'date',
				hozAlign: 'left',
				value: '26/10/2023'
			},
			{
				field: 'supplierName',
				hozAlign: 'left',
				value: '12/10/2023'
			},
			{
				field: 'maturityDate',
				hozAlign: 'left',
				value: '26/10/2023'
			},
			{
				field: 'invoiceAmount',
				hozAlign: 'right',
				value: '26/10/2023'
			},
			{
				field: 'loan',
				hozAlign: 'left',
				value: '26/10/2023'
			},
			{
				field: 'sla',
				hozAlign: 'left',
				value: '26/10/2023'
			},
			{
				field: 'currency',
				hozAlign: 'left',
				value: '26/10/2023'
			},
			{
				field: 'invoiceBankCode',
				hozAlign: 'left',
				value: '26/10/2023'
			}
		]
	},
	columns: [
		{
			formatter: 'rowSelection',
			titleFormatter: 'rowSelection',
			hozAlign: 'center',
			headerSort: false,
			width: 31,
			fixed: true,
			frozen: true
		},
		{
			formatter: 'radio',
			hozAlign: 'center',
			vertAlign: 'middle',
			headerSort: true,
			width: 42,
			resizable: false,
			frozen: true
		},
		{
			title: 'Status',
			field: 'status',
			titleDescription: 'Description of Status field',
			width: 150,
			formatter: 'status',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'dropdownHeaderFilter',
			filterSingleValue: true,
			filterSelectOptions: [
				{
					id: 1,
					value: 'Pending paid'
				},
				{
					id: 2,
					value: 'Issued'
				}
			],
			minWidth: 150,
			titleFormatter: 'tooltipHeader',
			headerFilterLiveFilter: false,
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
		},
		{
			title: 'State',
			field: 'active',
			formatter: 'inlineStatus',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'textFieldHeaderFilter',
			minWidth: 150,
			headerFilterLiveFilter: false,
			formatterParams: { field: 'active', trueTitle: 'Activated', falseTitle: 'Inactive' }
		},
		{
			title: 'Invoiced',
			field: 'invoiced',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'booleanHeaderFilter',
			minWidth: 150,
			headerFilterLiveFilter: false
		},
		{
			title: 'Date',
			field: 'date',
			hozAlign: 'left',
			formatter: 'setCustomFormatters',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'dateRangeHeaderFilter',
			headerFilterLiveFilter: false,
			minWidth: 300,
			sorter: 'date',
			editor: 'setCustomEditorByCell',
			editorParams: {
				locale: 'es',
				language: 'en',
				editorMapKey: 'invoiced',
				values: {
					true: 'customInput',
					false: 'customDatePicker'
				}
			},
			formatterParams: {
				inputFormat: 'yyyy-LL-dd',
				outputFormat: 'dd/LL/yyyy',
				invalidPlaceholder: '(invalid date)',
				formatterMapKey: 'invoiced',
				values: {
					true: 'bold',
					false: 'datetime'
				}
			}
		},
		{
			title: 'Supplier name',
			field: 'supplierName',
			hozAlign: 'left',
			width: 150,
			formatter: 'image',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'textFieldHeaderFilter',
			headerFilterLiveFilter: false,
			formatterParams: { imageField: 'avatarImg' },
			editor: 'customSelect',
			editorParams: {
				selectValues: [
					{
						id: 1,
						value: 'watermelon'
					},
					{
						id: 5,
						value: 'pear'
					}
				]
			}
		},
		{
			title: 'Maturity Date',
			field: 'maturityDate',
			formatter: 'dateRange',
			vertAlign: 'middle',
			headerSort: true,
			sorter: 'date',
			hozAlign: 'left',
			headerFilterType: 'dateRangeHeaderFilter',
			minWidth: 300,
			headerFilterLiveFilter: false,
			editor: 'customDatePicker',
			editorParams: {
				locale: 'es',
				language: 'en',
				isRange: true
			},
			formatterParams: {
				outputDivider: '-',
				inputFormat: 'yyyy-LL-dd',
				outputFormat: 'dd/LL/yyyy',
				invalidPlaceholder: '(invalid date)'
			}
		},
		{
			title: 'Invoice amount',
			field: 'invoiceAmount',
			hozAlign: 'right',
			topCalc: 'sum',
			topCalcParams: { precision: true },
			formatter: 'tooltip',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'numberRangeHeaderFilter',
			headerFilterLiveFilter: false,
			minWidth: 250,
			formatterParams: {
				text: 'Currency: ',
				columnData: 'currency'
			},
			editor: 'customInput',
			validator: ['numeric', 'max:5']
		},
		{
			title: 'Loan',
			field: 'loan',
			hozAlign: 'left',
			vertAlign: 'middle',
			headerSort: true,
			titleFormatter: 'tooltipHeader',
			minWidth: 150,
			headerFilterType: 'textFieldHeaderFilter',
			headerFilterLiveFilter: false,
			editor: 'customInput'
		},
		{
			title: 'SLA',
			field: 'sla',
			formatter: 'trafficLights',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'numberRangeHeaderFilter',
			minWidth: 250,
			headerFilterLiveFilter: false,
			formatterParams: {
				lights: [
					{
						icon: 'circle-success',
						color: '#81B484',
						min: 0,
						max: 50
					},
					{
						icon: 'info-circle',
						color: '#B19645',
						min: 50,
						max: 100
					},
					{
						icon: 'warning',
						color: '#F14040',
						min: 100
					}
				]
			}
		},
		{
			title: 'Currency',
			field: 'currency',
			hozAlign: 'left',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'textFieldHeaderFilter',
			minWidth: 150,
			headerFilterLiveFilter: false
		},
		{
			title: 'Invoice bank code',
			field: 'invoiceBankCode',
			hozAlign: 'left',
			formatter: 'tooltip',
			vertAlign: 'middle',
			headerSort: true,
			headerFilterType: 'numberRangeHeaderFilter',
			minWidth: 250,
			headerFilterLiveFilter: false,
			formatterParams: {
				text: '',
				columnData: 'comment',
				inverseHoz: true
			}
		},
		{
			title: 'Download',
			field: 'Download',
			hozAlign: 'left',
			formatter: 'actionLink',
			formatterParams: {
				icon: 'download'
			},
			frozen: true
		},
		{
			titleFormatter: 'actionMenuHeader',
			field: 'menu',
			formatter: 'actionMenu',
			formatterParams: {
				items: [
					{
						id: 'option_1',
						label: 'Option 1',
						icon: 'edit-pencil',
						action: 'opt_1'
					},
					{
						id: 'option_2',
						label: 'Option 2',
						action: 'opt_2'
					}
				]
			},
			width: 45,
			minWidth: 45,
			maxWidth: 45,
			hozAlign: 'center',
			headerSort: false,
			frozen: true
		},
		{
			field: 'moveUp',
			formatter: 'moveUp',
			width: 45,
			minWidth: 45,
			maxWidth: 45,
			hozAlign: 'center',
			headerSort: false,
			frozen: true
		},
		{
			field: 'Show Detail',
			formatter: 'showDetail',
			formatterParams: {},
			width: 45,
			minWidth: 45,
			hozAlign: 'center',
			headerSort: false,
			frozen: true
		},
		{
			field: 'moveDown',
			formatter: 'moveDown',
			width: 45,
			minWidth: 45,
			maxWidth: 45,
			hozAlign: 'center',
			headerSort: false,
			frozen: true
		},
		{
			field: 'deleteRow',
			formatter: 'deleteRow',
			width: 45,
			minWidth: 45,
			maxWidth: 45,
			hozAlign: 'center',
			headerSort: false,
			frozen: true
		},
		{
			field: 'Show Info',
			formatter: 'showInfo',
			formatterParams: {},
			width: 45,
			minWidth: 45,
			hozAlign: 'center',
			headerSort: false,
			frozen: true
		}
	],
	rowData: [
		{
			active: false,
			invoiced: true,
			isDefaultRadio: true,
			comment: '<ul><li>a</li><li>b</li></ul>',
			status: 'Issued',
			date: '2021-10-27',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
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
			active: false,
			invoiced: true,
			isDefaultRadio: true,
			comment: '<ul><li>a</li><li>b</li></ul>',
			status: 'Issued2',
			date: '2021-10-27',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			loan: 'Santander SCIB',
			currency: 'EUR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'active1',
			sla: 25,
			actionShowDetailConfig: { hide: true },
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
			active: false,
			invoiced: true,
			isDefaultRadio: true,
			comment: '<ul><li>a</li><li>b</li></ul>',
			status: 'Issued3',
			date: '2021-10-27',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			isSelected: true,
			invoiceAmount: 9544.48,
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
			invoiced: true,
			comment:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			status: 'Pending paid',
			date: '2021-10-28',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
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
		},
		{
			active: false,
			invoiced: false,
			comment:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			status: 'Issued',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2023-12-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'EUR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'success2',
			sla: 49,
			actionLinkRowConfig: {
				showMoreInfo: {
					text: 'texto 2',
					allowClick: true,
					hasTooltip: true
				}
			},
			colorIconRowConfig: {
				iconsCell: {
					icon: 'cancel',
					color: 'yellow',
					isHidden: true
				}
			}
		},
		{
			active: true,
			invoiced: true,
			comment:
				'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'YEN',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'active2',
			sla: 50,
			actionLinkRowConfig: {
				showMoreInfo: {
					isHidden: true
				}
			},
			actionMenuRowConfig: {
				disabled: true
			}
		},
		{
			invoiced: true,
			comment: '1',
			status: 'Issued',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'EUR',
			invoiceBankCode: '2020000231',
			sla: 51,
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'warning2',
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		},
		{
			status: 'Pending paid',
			invoiced: false,
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'bock1',
			sla: 99,
			actionLinkRowConfig: {
				showMoreInfo: {
					text: '(2) multiples documentos',
					newIcon: 'attach',
					iconFirst: true,
					fullText: true
				}
			},
			actionMenuRowConfig: {
				disabled: true
			}
		},
		{
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			sla: 100,
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'block2',
			actionLinkRowConfig: {
				showMoreInfo: {
					text: 'texto 1',
					newIcon: 'hide-eye',
					hasTooltip: true,
					iconFirst: true
				}
			},
			actionMenuRowConfig: {
				disabled: true
			}
		},
		{
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			sla: 101,
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'warning1',
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		},
		{
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'error2',
			sla: 2,
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		},
		{
			status: 'Inventado',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'ready1',
			sla: 7,
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		},
		{
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'id1',
			sla: 8,
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		},
		{
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'id2',
			sla: 6,
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		},
		{
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'id1',
			sla: 18,
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		},
		{
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'id2',
			sla: 14,
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		},
		{
			status: 'Pending paid',
			date: '2021-03-01',
			supplierName: 'TECHNOLOGY COMPANY LTD',
			maturityDate: '2021-11-23|2024-12-30',
			invoiceAmount: 9544.48,
			currency: 'DOLAR',
			invoiceBankCode: '2020000231',
			avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
			statusId: 'id1',
			sla: 30,
			actionLinkRowConfig: {
				showMoreInfo: {
					hasTooltip: true,
					tooltipText: 'tooltip in actionLink'
				}
			}
		}
	]
};
