import { getStoryConfig, parseBoolean, parseNumber, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/List Request',
	...getStoryConfig('scib-cdk-list-request'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-list-request
		num-skeletons-repeat='${parseNumber(args.numSkeletonsRepeat)}'
		show-skeleton='${parseBoolean(args.showSkeleton)}'
		literals='${parseObject(args.literals)}'
		labels='${parseObject(args.labels)}'
		request-labels='${parseObject(args.requestLabels)}'
		buttons='${parseObject(args.buttons)}'
		legend='${parseObject(args.legend)}'
		filter-literals='${parseObject(args.filterLiterals)}'
		requests='${parseObject(args.requests)}'
	></scib-cdk-list-request>    
	<scib-cdk-ssis-edit       
			literals='{ 
					"mainTitle": "Edit Request Details",
					"mainTitleDetail": "Request Details",
					"instructionID": "ID 265344",
					"instructionStatus": "Status: Done",
					"productLabel": "Product*",
					"productPlaceholder": "Choose Product",
					"currrencyLabel": "Currency*",
					"currencyPlaceholder": "Choose Currency",
					"primaryInstructionLabel": "Primary Instruction",
					"swiftCodeLabel": "Bank Swift Code*",
					"swiftCodePlaceholder": "Enter Bank Swift Code...",
					"accountLabel": "Account Number*",
					"accountPlaceholder": "Enter Account Number...",
					"swiftIntermediaryLabel": "Swift Intermediary",
					"swiftIntermediaryPlaceholder": "Enter Swift Intermediary...",
					"accountIntermediaryLabel": "Intermediary Account",
					"accountIntermediaryPlaceholder": "Enter Intermediary Account...",
					"swiftIntermediary2Label": "Swift Intermediary 2",
					"swiftIntermediary2Placeholder": "Enter Swift Intermediary 2...",
					"accountIntermediary2Label": "Intermediary 2 Account",
					"accountIntermediary2Placeholder": "Enter Intermediary 2 Account...",
					"valueDateLabel": "Value Date",
					"valueDatePlaceholder": "Choose Date",
					"existingLabel": "Existing Instructions",
					"existingOpt1Label": "Maintain Existing",
					"existingOpt2Label": "Overwrite Existing",
					"textAreaLabel": "Comments",
					"textAreaPlaceholder": "Write your comments...",
					"editBtn": "Edit",
					"notice": "*Required input",
					"cancelBtn": "Cancel",
					"submitBtn": "Submit",
					"labelInfoCheckbox": "Example text labelInfoCheckbox",
					"labelInfoDate": "Example text labelInfoDate",
					"producstListLabel":"Products listing",
					"tooltip":"Delete product",
					"noResult":"No results"
			}'
			errors='{ 
					"exactlyCharacters": "swift code not valid"
			}'
			products='[
					{
							"name": "Contract",
							"value": "Contract"
					},
					{
							"name": "Request",
							"value": "Request"
					},
					{
							"name": "Account",
							"value": "Account"
					},
					{
							"name": "Lorem ipsum dolor1",
							"value": "Lorem ipsum dolor1"
					},
					{
							"name": "Account3",
							"value": "Account3"
					},
					{
							"name": "Account4",
							"value": "Account4"
					},
					{
							"name": "Lorem ipsum dolor",
							"value": "Lorem ipsum dolor"
					}
			]'
			currency='[
					{
							"name": "EUR",
							"value": "EUR"
					},
					{
							"name": "LIB",
							"value": "LIB"
					},
					{
							"name": "RUB",
							"value": "RUB"
					}
			]'
			values-date='[
					{
							"name": "As soon as posible",
							"value": "soon"
					},
					{
							"name": "Later",
							"value": "later"
					}
			]'>
	</scib-cdk-ssis-edit>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	numSkeletonsRepeat: 15,
	literals: {
		'accessibleLoading': 'Loading info...',
		'loadBtn': 'Load more',
		'totalHeader': '6 Total Request',
		'firstMessage': 'There are no results to show',
		'secondMessage': 'This is a meaningful description of the empty state',
	},
	labels: [
		'status',
		'Product',
		'Currency',
		'Bank Swift Code',
		'Account Number',
	],
	requestLabels: {
		'status': 'Status',
		'client': 'Client',
		'id': 'ID Request',
		'creationDate': 'Effective Date',
	},
	buttons: {
		'textBtns': [
			{ 'name': 'Cancel', 'label': 'Cancel', 'icon': 'icon-close', 'event': 'cancelRequest' },
			{ 'name': 'Confirm', 'label': 'Confirm', 'icon': 'icon-confirm', 'event': 'confirmRequest' },
		],
		'iconBtns': [
			{ 'name': 'appian', 'label': 'Appian', 'icon': 'icon-appian', 'event': 'appiankRequest' },
			{ 'name': 'Message', 'label': 'Message', 'icon': 'icon-message', 'event': 'openRequest' },
		],
	},
	legend: {
		'pendingLabel': 'Pending',
		'requestedLabel': 'Requested',
		'inProgressLabel': 'In progress',
		'doneLabel': 'Done',
		'cancelLabel': 'Cancel',
		'pending': 2,
		'requested': 1,
		'inProgress': 1,
		'done': 1,
		'cancel': 1,
	},
	filterLiterals: {
		'filterTitle': 'Filter',
		'filterbtn': 'Apply',
		'fieldset': [
			{
				'input':
					{
						'label': 'Código GLCS del cliente',
						'placeholder': 'XXXX',
						'idInput': 'GLCS',
					},
			},
		],
	},
	requests: [
		{
			'requestData': {
				'status': 'Requested',
				'client': 'Iberdrola',
				'id': '111111',
				'creationDate': '12/03/2012',
			},
			'childsData': {
				'data': [
					{
						'status': 'Pending (Locked)',
						'product': 'Contract',
						'currency': 'EUR',
						'bicCorresponsal': 'bicCorresponsal bank sift code',
						'bicIntermediario1': 'bicIntermediario1',
						'cuentaIntermediario1': 'cuentaIntermediario1',
						'bicIntermediario2': 'bicIntermediario2',
						'cuentaCorresponsal': 'ACCOUNT NUMBER',
						'cuentaIntermediario2': 'cuentaIntermediario2',
						'fechaEfectiva': '22/04/2021',
						'id': '10',
					},
					{
						'status': 'Pending',
						'product': ['Contract', 'Account4'],
						'currency': 'EUR',
						'bicCorresponsal': 'bicCorresponsal bank sift code',
						'bicIntermediario1': 'bicIntermediario1',
						'cuentaIntermediario1': 'cuentaIntermediario1',
						'bicIntermediario2': 'bicIntermediario2',
						'cuentaCorresponsal': 'ACCOUNT NUMBER',
						'cuentaIntermediario2': 'cuentaIntermediario2',
						'id': '11',
					},
					{
						'status': 'In progress',
						'product': ['Contract', 'Account4'],
						'currency': 'EUR',
						'bicCorresponsal': 'bicCorresponsal bank sift code',
						'bicIntermediario1': 'bicIntermediario1',
						'cuentaIntermediario1': 'cuentaIntermediario1',
						'bicIntermediario2': 'bicIntermediario2',
						'cuentaCorresponsal': 'ACCOUNT NUMBER',
						'cuentaIntermediario2': 'cuentaIntermediario2',
						'fechaEfectiva': '04/22/2021',
						'id': '12',
					},
				],
			},
			'locked': false,
		}, {
			'requestData': {
				'status': 'Pending',
				'id': '222222',
				'client': 'Iberdrola',
				'creationDate': '12/03/2012',
			},
			'childsData': {
				'data': [
					{
						'status': 'Pending',
						'product': ['Contract', 'Account4'],
						'currency': 'EUR',
						'bicCorresponsal': 'bicCorresponsal bank sift code',
						'bicIntermediario1': 'bicIntermediario1',
						'cuentaIntermediario1': 'cuentaIntermediario1',
						'bicIntermediario2': 'bicIntermediario2',
						'cuentaCorresponsal': 'ACCOUNT NUMBER',
						'cuentaIntermediario2': 'cuentaIntermediario2',
						'fechaEfectiva': '4/22/2014',
						'id': '13',
					},
					{
						'status': 'Pending',
						'product': ['Contract', 'Account4'],
						'currency': 'EUR',
						'bicCorresponsal': 'bicCorresponsal bank sift code',
						'bicIntermediario1': 'bicIntermediario1',
						'cuentaIntermediario1': 'cuentaIntermediario1',
						'bicIntermediario2': 'bicIntermediario2',
						'cuentaCorresponsal': 'ACCOUNT NUMBER',
						'cuentaIntermediario2': 'cuentaIntermediario2',
						'fechaEfectiva': '4/22/2014',
						'id': '14',
					},
					{
						'status': 'Pending',
						'product': 'Contract',
						'currency': 'EUR',
						'bicCorresponsal': 'bicCorresponsal bank sift code',
						'bicIntermediario1': 'bicIntermediario1',
						'cuentaIntermediario1': 'cuentaIntermediario1',
						'bicIntermediario2': 'bicIntermediario2',
						'cuentaCorresponsal': 'ACCOUNT NUMBER',
						'cuentaIntermediario2': 'cuentaIntermediario2',
						'fechaEfectiva': '4/22/2014',
						'id': '15',
					},
					{
						'status': 'Requested (Locked)',
						'product': ['Contract', 'Account4'],
						'currency': 'EUR',
						'bicCorresponsal': 'bicCorresponsal bank sift code',
						'bicIntermediario1': 'bicIntermediario1',
						'cuentaIntermediario1': 'cuentaIntermediario1',
						'bicIntermediario2': 'bicIntermediario2',
						'cuentaCorresponsal': 'ACCOUNT NUMBER',
						'cuentaIntermediario2': 'cuentaIntermediario2',
						'fechaEfectiva': '4/22/2014',
						'id': '16',
					},
				],
			},
			'locked': false,
		},
	],
	// Add default values here
};
