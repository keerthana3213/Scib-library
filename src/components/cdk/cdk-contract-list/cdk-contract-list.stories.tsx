import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import agGridLiterals from '../../ui/ui-table/literals/ag-grid.js';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-cdk-contract-list'),
	title: 'Design System/DEPRECATED/CDK/Contract List',
	render: (args) => <scib-cdk-contract-list {...args} />
};
export default meta;

const defaultLiterals = {
	client: 'Client',
	tooltip: 'tooltipr',
	itemCountLabel: 'Groups',
	subitemCountLabel: 'Contracts',
	pending: 'Prop. Prep.',
	progress: 'Ready Neg.',
	requested: 'Negotation',
	done: 'Closed',
	filters: 'Filters',
	status: 'Status',
	group: 'Group',
	contracts: 'Contracts',
	amendment: 'Amendment',
	pendingToAssignTemplate: 'Pending to assign Template',
	pendingToAssignParameters: 'Pending to assign parameters',
	pendingToAssignAmendment: 'Pending Amendment',
	proposalPreparation: 'Proposal Preparation',
	proposalPreparationDelete: 'Proposal Preparation',
	proposalPreparationParamsWaiting: 'Proposal Preparation - Waiting for parameters',
	proposalPreparationParamsConfirmed: 'Proposal Preparation - Parameters confirmed',
	proposalPreparationAssigned: 'Proposal Preparation - Assigned',
	readyToNegotiate: 'Ready to Negotiate',
	pendingAmendment: 'Pending Amendment',
	blockedByClientOwner: 'Blocked by Client Owner',
	negotation: 'Negotiation',
	negotationAccepted: 'Negotiation - Accepted',
	negotationAcceptedNoVdr: 'Negotiation - Accepted',
	negotationEscalated: 'Negotiation - Escalated',
	negotationPendingDigitalSignature: 'Pending - Digital Signature',
	negotationSigned: 'Negotiation - Signed',
	negotationParametersConfirmed: 'Negotiation - Parameters confirmed',
	closedAgreed: 'Closed - Agreed',
	closedProtocol: 'Closed - Protocol',
	closedOriginalClause: 'Closed - Original Clause',
	closedContigency: 'Closed - Contingency',
	closedNewContractsAfterISDAProtocol: 'Closed - New contract after ISDA protocol',
	closedPendingCompensation: 'Closed - Pending Cash Compensation',
	closedAgreedCompensation: 'Closed - Agreed Cash Compensation',
	closedNoCompensation: 'Closed - No Cash Compensation',
	selectTemplate: 'Select Template',
	startNegotation: 'Start Negotiation in VDR',
	setUpParameters: 'Set Up Parameters',
	vdr: 'VDR',
	createVdr: 'Create VDR ',
	escalate: 'Escalate',
	deescalate: 'De-escalate',
	markAsAccepted: 'Mark as accepted',
	setUpSignature: 'Set Up Signature',
	confirmParameters: 'Confirm Parameters',
	reject: 'Reject',
	uploadSignedContract: 'Upload signed contract',
	close: 'Close',
	title: 'Open visual help',
	template: 'Template & annex',
	emptyContact: 'No email linked',
	loadBtn: 'Load More',
	editParameters: 'Edit Parameters',
	noTableMessage: 'Currently there are no operations assigned to this negotiation group.',
	noTableSubMessage: 'Select operations from another gruop or from ungrouped section to assign to this group.',
	tableItemCount: 'Contract(s)',
	loading: 'Loading',
	emptyState: 'No parameters defined for this categorty.',
	filterLiterals: {
		filterTitle: 'Filter',
		filterbtn: 'Apply',
		dropdown: [
			{
				valueDropdownLabel: 'Status',
				valueDropdownPlaceholder: 'Choose status',
				id: 'dropdownStatus1',
				values: [
					{
						id_doc_type: '01AS',
						t_name: 'campo 1',
						active: true
					},
					{
						id_doc_type: '01BA',
						t_name: 'campo 2',
						active: false
					},
					{
						id_doc_type: '01CDD',
						t_name: 'campo 3',
						active: false
					}
				]
			},
			{
				valueDropdownLabel: 'Status',
				valueDropdownPlaceholder: 'Choose status',
				id: 'dropdownStatus2',
				values: [
					{
						id_doc_type: '01AS1',
						t_name: 'campo 4',
						active: true
					},
					{
						id_doc_type: '01BA2',
						t_name: 'campo 5',
						active: false
					},
					{
						id_doc_type: '01CDD3',
						t_name: 'campo 6',
						active: false
					}
				]
			}
		],
		input: [
			{
				valueInputLabel: 'id request',
				valueInputPlaceholder: 'Enter ID request',
				id: 'inputsID'
			}
		],
		datepicker: [
			{
				valueDatePickerLabel: 'Effective Date Range',
				txt: 'To'
			}
		],
		fieldset: [
			{
				dropdown: {
					label: 'Status',
					placeholderSelect: 'Choose status',
					values: [
						{
							value: 'campo 1',
							name: 'campo 1'
						},
						{
							value: 'campo 2',
							name: 'campo 2'
						},
						{
							value: 'campo 3',
							name: 'campo 3'
						}
					]
				}
			},
			{
				dropdown: {
					label: 'Status2',
					placeholderSelect: 'Choose status2',
					values: [
						{
							value: '01AS2',
							name: 'campo 12'
						},
						{
							value: '01BA2',
							name: 'campo 22'
						},
						{
							value: '01CDD2',
							name: 'campo 32'
						}
					]
				}
			},
			{
				input: {
					label: 'id request',
					placeholder: 'Enter ID request',
					idInput: 'inputsID'
				}
			},
			{
				dropdown: {
					label: 'Status3',
					placeholderSelect: 'Choose status3',
					values: [
						{
							value: '01AS2',
							name: 'campo 12'
						},
						{
							value: '01BA2',
							name: 'campo 22'
						},
						{
							value: '01CDD2',
							name: 'campo 32'
						}
					]
				}
			},
			{
				datepicker: {
					valueDatePickerLabel: 'Effective Date Range',
					txt: 'To'
				}
			}
		]
	},
	tableLiterals: {
		downloadAll: 'Download All',
		downloadSelection: 'Download Selected',
		assignGroup: 'Assign group',
		total: 'Total',
		selected: 'Selected',
		localeText: agGridLiterals
	},
	paramTypes: ['Amendment parameters', 'Filenet metadata', 'Operational parameters']
};
export const PlaygroundDefault: StoryObj = {
	args: {
		horizontalFilter: true,
		literals: defaultLiterals,
		data: {
			archetype: 'ibor',
			itemCount: 5,
			subitemCount: 525,
			groupList: [
				{
					id: 'group-id-1',
					groupName: 'Non Protocol Swaps',
					amendmentName: '',
					blockEnd: '2021-01-15T16:27:05.000Z',
					contactEmail: 'tes@mail.test',
					status: {
						type: 'done',
						subType: 'closedPendingCompensation'
					},
					template: 'Template name',
					contracts: 0,
					contractList: [
						{
							hiddenId: '000',
							booking: 'contratoMcDonalds',
							product: 'pdf',
							identifier: 'InGen',
							descCounterparty: 'SBGM',
							glcs: 0,
							negCounterparty: 'icono',
							tradeDate: '18/11/2019',
							maturityDate: '12/03/2020',
							divisaAsset: 'something',
							divisaLiab: 'divisaLiab',
							indexAsset: 'indexAsset',
							indexLiab: 'something',
							indexTotal: 'something',
							situ: 'something',
							masterAgreement: 'something',
							collateralAgreement: 'something'
						},
						{
							hiddenId: '001',
							booking: 'contratoMcDonalds',
							product: 'pdf',
							identifier: 'InGen',
							descCounterparty: 'SBGM',
							glcs: 0,
							negCounterparty: 'icono',
							tradeDate: '18/11/2019',
							maturityDate: '12/03/2020',
							divisaAsset: 'something',
							divisaLiab: 'divisaLiab',
							indexAsset: 'indexAsset',
							indexLiab: 'something',
							indexTotal: 'something',
							situ: 'something',
							masterAgreement: 'something',
							collateralAgreement: 'something'
						},
						{
							hiddenId: '002',
							booking: 'contratoMcDonalds',
							product: 'pdf',
							identifier: 'InGen',
							descCounterparty: 'SBGM',
							glcs: 0,
							negCounterparty: 'icono',
							tradeDate: '18/11/2019',
							maturityDate: '12/03/2020',
							divisaAsset: 'something',
							divisaLiab: 'divisaLiab',
							indexAsset: 'indexAsset',
							indexLiab: 'something',
							indexTotal: 'something',
							situ: 'something',
							masterAgreement: 'something',
							collateralAgreement: 'something'
						}
					],
					paramTypes: ['Template', 'Filenet', 'Operacionales'],
					paramList: [
						{
							label: 'Parameter',
							text: 'Name 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweije Name 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yub999',
							parameterType: 'Filenet'
						},
						{
							label: 'Parameter',
							text: 'Name 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweije Name 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yub999',
							parameterType: 'Filenet'
						},
						{
							label: 'Parameter',
							text: 'Name 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweije Name 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubn 111 aowieuaoweijeName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yubnName 6yub999',
							parameterType: 'Filenet'
						},
						{
							label: 'Parameter',
							text: 'Nameyub999',
							parameterType: 'Operacionales'
						},
						{
							label: 'Parameter',
							text: 'Nameyub999',
							parameterType: 'Operacionales'
						},
						{
							label: 'Parameter',
							text: 'Nameyub999',
							parameterType: 'Operacionales'
						},
						{
							label: 'Parameter',
							text: 'Nameyub999',
							parameterType: 'Operacionales'
						},
						{
							label: 'Parameter',
							text: 'Nameyub999',
							parameterType: 'Operacionales'
						}
					]
				},
				{
					id: 'group-id-2',
					groupName: 'Protocol Derivates',
					amendmentName: '2019_Valid.docx',
					hasTemplate: true,
					blockEnd: '2021-01-30T16:27:05.000Z',
					status: {
						type: 'progress',
						subType: 'readyToNegotiate'
					},
					isLoading: false,
					emptyState: false,
					contracts: 28
				},
				{
					id: 'group-id-3',
					groupName: 'Collateral',
					hasTemplate: true,
					emptyState: true,
					status: {
						type: 'progress',
						subType: 'blockedByClientOwner'
					},
					contracts: 89
				},
				{
					id: 'group-id-41',
					groupName: 'Syndicated loan',
					amendmentName: '',
					hasTemplate: true,
					status: {
						type: 'requested',
						subType: 'negotationAcceptedNoVdr'
					},
					contracts: 16,
					template: 'Template name',
					feedDisabled: false,
					contractList: [
						{
							hiddenId: '000',
							booking: 'contratoMcDonalds',
							product: 'pdf',
							identifier: 'InGen',
							descCounterparty: 'SBGM',
							glcs: 0,
							negCounterparty: 'icono',
							tradeDate: '18/11/2019',
							maturityDate: '12/03/2020',
							divisaAsset: 'something',
							divisaLiab: 'divisaLiab',
							indexAsset: 'indexAsset',
							indexLiab: 'something',
							indexTotal: 'something',
							situ: 'something',
							masterAgreement: 'something',
							collateralAgreement: 'something'
						},
						{
							hiddenId: '001',
							booking: 'contratoMcDonalds',
							product: 'pdf',
							identifier: 'InGen',
							descCounterparty: 'SBGM',
							glcs: 0,
							negCounterparty: 'icono',
							tradeDate: '18/11/2019',
							maturityDate: '12/03/2020',
							divisaAsset: 'something',
							divisaLiab: 'divisaLiab',
							indexAsset: 'indexAsset',
							indexLiab: 'something',
							indexTotal: 'something',
							situ: 'something',
							masterAgreement: 'something',
							collateralAgreement: 'something'
						},
						{
							hiddenId: '002',
							booking: 'contratoMcDonalds',
							product: 'pdf',
							identifier: 'InGen',
							descCounterparty: 'SBGM',
							glcs: 0,
							negCounterparty: 'icono',
							tradeDate: '18/11/2019',
							maturityDate: '12/03/2020',
							divisaAsset: 'something',
							divisaLiab: 'divisaLiab',
							indexAsset: 'indexAsset',
							indexLiab: 'something',
							indexTotal: 'something',
							situ: 'something',
							masterAgreement: 'something',
							collateralAgreement: 'something'
						}
					]
				},
				{
					id: 'group-id-5',
					groupName: 'Non Protocol NDFs',
					amendmentName: '2019_Valid.pdf',
					hasTemplate: true,
					status: {
						type: 'done',
						subType: 'closedPendingCompensation'
					},
					contracts: 285
				},
				{
					id: 'group-id-52',
					groupName: 'Non Protocol NDFs',
					amendmentName: '',
					emptyState: true,
					status: {
						type: 'requested',
						subType: 'negotationPendingDigitalSignature'
					},
					contracts: 128
				},
				{
					id: 'group-id-59',
					groupName: 'Second opinions',
					amendmentName: '',
					hasTemplate: true,
					emptyState: true,
					status: {
						type: 'pending',
						subType: 'proposalPreparationParamsConfirmed'
					},
					contracts: 128
				},
				{
					id: 'group-id-55',
					groupName: 'Non Protocol NDFs',
					amendmentName: '2019_Valid.pdf',
					hasTemplate: true,
					emptyState: true,
					status: {
						type: 'done',
						subType: 'closedNoCompensation'
					},
					contracts: 28
				},
				{
					id: 'group-id-6',
					groupName: 'Syndicated loan',
					amendmentName: '',
					hasTemplate: true,
					status: {
						type: 'requested',
						subType: 'negotationEscalated'
					},
					contracts: 1,
					template: 'Template name',
					feedDisabled: true,
					contractList: [
						{
							hiddenId: '000',
							booking: 'contratoMcDonalds',
							product: 'pdf',
							identifier: 'InGen',
							descCounterparty: 'SBGM',
							glcs: 0,
							negCounterparty: 'icono',
							tradeDate: '18/11/2019',
							maturityDate: '12/03/2020',
							divisaAsset: 'something',
							divisaLiab: 'divisaLiab',
							indexAsset: 'indexAsset',
							indexLiab: 'something',
							indexTotal: 'something',
							situ: 'something',
							masterAgreement: 'something',
							collateralAgreement: 'something'
						}
					]
				}
			],
			permissions: {
				uploadEnabled: true,
				downloadEnabled: true,
				downloadEnabledIcon: false,
				selectTemplate: true,
				startNegotation: true,
				vdr: true,
				createVdr: true,
				escalate: true,
				deescalate: true,
				markAsAccepted: true,
				uploadSignedContract: true,
				reject: true,
				setUpParameters: true,
				setUpSignature: true,
				confirmParameters: true,
				close: true,
				editParameters: true,
				_reassignOperation: true,
				_downloadOperations: true
			},
			showLoading: false,
			loadingMoreItems: false,
			tableColumnDefs: [
				{
					headerName: 'Booking Unit',
					field: 'booking'
				},
				{
					headerName: 'Producto',
					field: 'product'
				},
				{
					headerName: 'Identificador BO',
					field: 'identifier'
				},
				{
					headerName: 'Counterparty Desc.',
					field: 'descCounterparty'
				},
				{
					headerName: 'GLCS',
					field: 'glcs'
				},
				{
					headerName: 'Counterparty to negotiatie',
					field: 'negCounterparty'
				},
				{
					headerName: 'Trade Date',
					field: 'tradeDate',
					filter: 'date'
				},
				{
					headerName: 'Maturity Date',
					field: 'maturityDate',
					filter: 'date'
				},
				{
					headerName: 'Divisa (Asset)',
					field: 'divisaAsset'
				},
				{
					headerName: 'Divisa (Liab)',
					field: 'divisaLiab'
				},
				{
					headerName: 'Indice (Asset)',
					field: 'indexAsset',
					filter: 'number'
				},
				{
					headerName: 'Indice (Liab)',
					field: 'indexLiab',
					filter: 'number'
				},
				{
					headerName: 'Indice (Total)',
					field: 'indexTotal',
					filter: 'number'
				},
				{
					headerName: 'Situ Legal',
					field: 'situ'
				},
				{
					headerName: 'Master Agreement REF',
					field: 'masterAgreement'
				},
				{
					headerName: 'Collateral Agreement REF',
					field: 'collateralAgreement'
				}
			],
			statusTypeCount: [
				{
					type: 'pending',
					count: '3'
				},
				{
					type: 'progress',
					count: '2'
				},
				{
					type: 'requested',
					count: '58'
				},
				{
					type: 'done',
					count: '2'
				}
			]
		},
		isForseti: false
		// Add default values here
	}
};

const contractReviewerLiterals = {
	subitemCountLabel: 'Contracts',
	disabledTooltip: 'You have no permission to access to the negotiation. For more information, contact your administrator',
	pending: 'Pending',
	signed: 'Client Sign.',
	signedContract: 'Setup signature',
	done: 'Closed',
	filters: 'Filters',
	status: 'Status',
	group: 'Group',
	contracts: 'Contracts',
	date: 'Trade date',
	vdr: 'VDR',
	reject: 'Reject',
	uploadSignedContract: 'Upload signed contract',
	loadBtn: 'Load More',
	filterLiterals: {
		filterTitle: 'Filter',
		filterbtn: 'Apply',
		dropdown: [
			{
				valueDropdownLabel: 'Status',
				valueDropdownPlaceholder: 'Choose status',
				id: 'dropdownStatus1',
				values: [
					{
						id_doc_type: '01AS',
						t_name: 'campo 1',
						active: true
					},
					{
						id_doc_type: '01BA',
						t_name: 'campo 2',
						active: false
					},
					{
						id_doc_type: '01CDD',
						t_name: 'campo 3',
						active: false
					}
				]
			},
			{
				valueDropdownLabel: 'Status',
				valueDropdownPlaceholder: 'Choose status',
				id: 'dropdownStatus2',
				values: [
					{
						id_doc_type: '01AS1',
						t_name: 'campo 4',
						active: true
					},
					{
						id_doc_type: '01BA2',
						t_name: 'campo 5',
						active: false
					},
					{
						id_doc_type: '01CDD3',
						t_name: 'campo 6',
						active: false
					}
				]
			}
		],
		input: [
			{
				valueInputLabel: 'id request',
				valueInputPlaceholder: 'Enter ID request',
				id: 'inputsID'
			}
		],
		datepicker: [
			{
				valueDatePickerLabel: 'Effective Date Range',
				txt: 'To'
			}
		],
		fieldset: [
			{
				dropdown: {
					label: 'Status',
					placeholderSelect: 'Choose status',
					values: [
						{
							value: 'campo 1',
							name: 'campo 1'
						},
						{
							value: 'campo 2',
							name: 'campo 2'
						},
						{
							value: 'campo 3',
							name: 'campo 3'
						}
					]
				}
			},
			{
				dropdown: {
					label: 'Status2',
					placeholderSelect: 'Choose status2',
					values: [
						{
							value: '01AS2',
							name: 'campo 12'
						},
						{
							value: '01BA2',
							name: 'campo 22'
						},
						{
							value: '01CDD2',
							name: 'campo 32'
						}
					]
				}
			},
			{
				input: {
					label: 'id request',
					placeholder: 'Enter ID request',
					idInput: 'inputsID'
				}
			},
			{
				dropdown: {
					label: 'Status3',
					placeholderSelect: 'Choose status3',
					values: [
						{
							value: '01AS2',
							name: 'campo 12'
						},
						{
							value: '01BA2',
							name: 'campo 22'
						},
						{
							value: '01CDD2',
							name: 'campo 32'
						}
					]
				}
			},
			{
				datepicker: {
					valueDatePickerLabel: 'Effective Date Range',
					txt: 'To'
				}
			}
		]
	}
};
export const PlaygroundCREmployees: StoryObj = {
	args: {
		horizontalFilter: true,
		hiddenHelp: true,
		literals: contractReviewerLiterals,
		data: {
			archetype: 'reviewer',
			subitemCount: 7,
			groupList: [
				{
					id: '332',
					groupName: 'Product C',
					amendmentName: 'ADVICE_DOCUMENT_CATEGORY_DOC_CONFIRMATION_TRADE_10011613_MESSAGE_14107246_ID_13480281.pdf',
					hasTemplate: true,
					status: {
						type: 'signed',
						subType: 'signedUnderReview'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '331',
					groupName: 'Swap',
					amendmentName: 'Document-Test-Insertv4.pdf',
					hasTemplate: true,
					status: {
						type: 'signed',
						subType: 'signedUnderReview'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '372',
					groupName: 'Product B',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: {
						type: 'done',
						subType: 'closedInvalid'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '373',
					groupName: 'Product B',
					amendmentName: 'ADVICE_DOCUMENT_CATEGORY_DOC_CONFIRMATION_TRADE_10011613_MESSAGE_14107246_ID_13480281.pdf',
					hasTemplate: true,
					status: {
						type: 'done',
						subType: 'pendingSign'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '327',
					groupName: 'Product B',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: {
						type: 'done',
						subType: 'closedNeedUpdate'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '376',
					groupName: 'Product B',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: {
						type: 'pending',
						subType: 'pendingSign'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '329',
					groupName: 'Swap',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: {
						type: 'signed',
						subType: 'signedUnderReview'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '328',
					groupName: 'Product B',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: {
						type: 'signed',
						subType: 'signedUnderReview'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '325',
					groupName: 'Swap',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: {
						type: 'done',
						subType: 'closedInvalid'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '326',
					groupName: 'Swap',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: {
						type: 'signed',
						subType: 'signedUnderReview'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '375',
					groupName: 'Product B',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: {
						type: 'done',
						subType: 'closedInvalid'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '348',
					groupName: 'Swap',
					amendmentName: 'PRODUCT_Swap_TRADE_5472802_MESSAGE_11998772.pdf',
					hasTemplate: true,
					status: {
						type: 'pending',
						subType: 'pendingSign'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				}
			],
			permissions: {
				signed: true,
				vdr: true,
				reject: true,
				downloadEnabled: true,
				downloadEnabledIcon: true,
				uploadSignedContract: true
			},
			showLoading: false,
			loadingMoreItems: false,
			totalesStatus: {
				pending: 0,
				signed: 2,
				done: 0
			}
		},
		isForseti: true,
		filterStatus: ''
		// Add default values here
	}
};
export const PlaygroundCRClients: StoryObj = {
	args: {
		horizontalFilter: true,
		hiddenHelp: true,
		literals: contractReviewerLiterals,
		data: {
			archetype: 'reviewer',
			subitemCount: 7,
			groupList: [
				{
					id: '332',
					groupName: 'Product C',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: { type: 'pending', subType: 'pendingSignatureClient' },
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: '332'
				},
				{
					id: '331',
					groupName: 'Swap',
					amendmentName: 'Document-Test-Insertv4.pdf',
					hasTemplate: true,
					status: { type: 'signed', subType: 'pendingReviewClient' },
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: '331',
					topicPermission: false
				},
				{
					id: '332',
					groupName: 'Product C',
					amendmentName: 'ADVICE_DOCUMENT_CATEGORY_DOC_CONFIRMATION_TRADE_10011613_MESSAGE_14107246_ID_13480281.pdf',
					hasTemplate: true,
					status: {
						subType: 'digitalSignaturePending',
						type: 'requested'
					},
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: 'BDSD'
				},
				{
					id: '327',
					groupName: 'Product B',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: { type: 'done', subType: 'closedNeedUpdate' },
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: '327',
					topicPermission: true
				},
				{
					id: '328',
					groupName: 'Product B',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: { subType: 'digitalSignatureError', type: 'error' },
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: '328',
					topicPermission: true
				},
				{
					id: '329',
					groupName: 'Swap',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: { type: 'done', subType: 'pendingReviewClient' },
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: '329',
					topicPermission: false
				},
				{
					id: '325',
					groupName: 'Swap',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: { type: 'done', subType: 'closedInvalid' },
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: '325',
					topicPermission: true
				},
				{
					id: '326',
					groupName: 'Swap',
					amendmentName: 'Actualizar-amendment.docx.docx',
					hasTemplate: true,
					status: { type: 'done', subType: 'pendingReviewClient' },
					trade_date: '1/10/2020',
					isLoading: false,
					emptyState: false,
					contracts: '326',
					topicPermission: true
				}
			],
			permissions: {
				// rejected: true,
				signed: true,
				vdr: true,
				// reject: true,
				downloadEnabled: true,
				downloadEnabledIcon: true,
				uploadSignedContract: true
			},
			showLoading: false,
			loadingMoreItems: false,
			totalesStatus: {
				pending: 0,
				signed: 2,
				done: 0
			}
		},
		isForseti: true,
		filterStatus: ''
		// Add default values here
	}
};
