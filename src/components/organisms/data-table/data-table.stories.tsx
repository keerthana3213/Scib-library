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
	...getStoryConfig('scib-organisms-data-table'),
	title: 'Design System/Organisms/Data Table',
	render: (args) => <scib-organisms-data-table {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		loadingIds: [{ rowId: 'row-1' }, { rowId: 'row-8' }],
		controlManager: 'local',
		skeletonHostPath: '',
		loading: false,
		config: {
			index: 'rowId',
			paginationSizeSelector: [10, 20, 30],
			paginationButtonCount: 3,
			paginationInitialPage: 1,
			paginationSize: 10,
			totalItems: 1500,
			language: 'en'
		},
		columns: [
			{ formatter: 'radio', hozAlign: 'center', headerSort: false, width: 42, resizable: false },
			{
				formatter: 'rowSelection',
				titleFormatter: 'rowSelection',
				hozAlign: 'center',
				headerSort: false,
				width: 64
			},
			{
				title: 'Status',
				field: 'status',
				width: 150,
				formatter: 'status',
				formatterParams: {
					mapKey: 'statusId',
					isBold: true,
					values: {
						id1: 'green',
						id2: 'blue'
					}
				}
			},
			{
				title: 'Status',
				field: 'active',
				formatter: 'inlineStatus',
				formatterParams: { field: 'active', trueTitle: 'Activated', falseTitle: 'Inactive' }
			},
			{
				title: 'Date',
				field: 'date',
				hozAlign: 'left',
				formatter: 'datetime',
				formatterParams: {
					inputFormat: 'yyyy-LL-dd',
					outputFormat: 'dd/LL/yyyy',
					invalidPlaceholder: '(invalid date)'
				}
			},
			{
				title: 'Suplier name',
				field: 'suplierName',
				hozAlign: 'left',
				width: 250,
				formatter: 'image',
				formatterParams: { imageField: 'avatarImg' }
			},
			{
				title: 'Icons',
				field: 'iconsCell',
				headerSort: false,
				width: 80,
				formatter: 'colorIcon'
			},
			{ title: 'Maturity Date', field: 'maturityDate', sorter: 'date', hozAlign: 'left' },
			{
				title: 'Invoice amount',
				field: 'invoiceAmount',
				hozAlign: 'right',
				formatter: 'tooltip',
				formatterParams: {
					text: 'Currency: ',
					columnData: 'currency'
				}
			},
			{
				title: 'SLA',
				field: 'sla',
				formatter: 'trafficLights',
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
			{ title: 'Currency', field: 'currency', hozAlign: 'left' },
			{
				title: 'Invoice bank code',
				field: 'invoiceBankCode',
				hozAlign: 'left',
				formatter: 'tooltip',
				formatterParams: {
					text: '',
					columnData: 'comment',
					inverseHoz: true
				}
			},
			{
				title: 'showMoreInfo',
				field: 'showMoreInfo',
				formatter: 'actionLink',
				formatterParams: {
					icon: 'open-eye',
					columnData: 'comment'
				},
				minWidth: 61,
				hozAlign: 'left',
				headerSort: false
			},
			{
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
				width: 60,
				minWidth: 60,
				hozAlign: 'center',
				headerSort: false
			},
			{
				field: 'detail',
				formatter: 'showDetail',
				formatterParams: {},
				width: 60,
				minWidth: 60,
				hozAlign: 'center',
				headerSort: false
			}
		],
		rowData: [
			{
				active: false,
				isDefaultRadio: true,
				comment: '<ul><li>a</li><li>b</li></ul>',
				status: 'Issued',
				date: '2021-10-27',
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'EUR',
				invoiceBankCode: '2020000231',
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id1',
				sla: 25,
				actionMenuRowConfig: {
					disabledItemIds: ['option_2']
				},
				isDisabled: true,
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'EUR',
				invoiceBankCode: '2020000231',
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id2',
				isSelected: true,
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
				comment:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				status: 'Issued',
				date: '2021-03-01',
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'EUR',
				invoiceBankCode: '2020000231',
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id1',
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
				comment:
					'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
				status: 'Pending paid',
				date: '2021-03-01',
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'YEN',
				invoiceBankCode: '2020000231',
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id2',
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
				comment: '1',
				status: 'Issued',
				date: '2021-03-01',
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'EUR',
				invoiceBankCode: '2020000231',
				sla: 51,
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'DOLAR',
				invoiceBankCode: '2020000231',
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id2',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'DOLAR',
				invoiceBankCode: '2020000231',
				sla: 100,
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id1',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'DOLAR',
				invoiceBankCode: '2020000231',
				sla: 101,
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id2',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'DOLAR',
				invoiceBankCode: '2020000231',
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id1',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
				currency: 'DOLAR',
				invoiceBankCode: '2020000231',
				avatarImg: 'http://www.w3bai.com/w3css/img_avatar3.png',
				statusId: 'id2',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
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
				suplierName: 'TECHNOLOGY COMPANY LTD',
				maturityDate: '23/11/2021',
				invoiceAmount: '9.544,48',
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
	}
};
