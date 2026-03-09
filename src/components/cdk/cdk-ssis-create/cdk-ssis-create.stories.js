import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ssis Create',
	...getStoryConfig('scib-cdk-ssis-create'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open is-emitter absolute>
		<scib-cdk-ssis-create
			literals='${parseObject(args.literals)}'
			errors='${parseObject(args.errors)}'
			products='${parseObject(args.products)}'
			currency='${parseObject(args.currency)}'
			options='${parseObject(args.options)}'
			values-date='${parseObject(args.valuesDate)}'>
		</scib-cdk-ssis-create>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		'mainTitle': 'Create New Request',
		'instructionTitle': 'Instruction',
		'productLabel': 'Product*',
		'productPlaceholder': 'Choose Product',
		'currrencyLabel': 'Currency*',
		'currencyPlaceholder': 'Choose Currency',
		'primaryInstructionLabel': 'Primary Instruction',
		'swiftCodeLabel': 'Bank Swift Code*',
		'swiftCodePlaceholder': 'Enter Bank Swift Code...',
		'accountLabel': 'Account Number*',
		'accountPlaceholder': 'Enter Account Number...',
		'swiftIntermediaryLabel': 'Swift Intermediary',
		'swiftIntermediaryPlaceholder': 'Enter Swift Intermediary...',
		'accountIntermediaryLabel': 'Intermediary Account',
		'accountIntermediaryPlaceholder': 'Enter Intermediary Account...',
		'swiftIntermediary2Label': 'Swift Intermediary 2',
		'swiftIntermediary2Placeholder': 'Enter Swift Intermediary 2...',
		'accountIntermediary2Label': 'Intermediary 2 Account',
		'accountIntermediary2Placeholder': 'Enter Intermediary 2 Account...',
		'valueDateLabel': 'Value Date',
		'valueDatePlaceholder': 'Choose Date',
		'existingLabel': 'Existing Instructions',
		'existingOpt1Label': 'Maintain Existing',
		'existingOpt2Label': 'Overwrite Existing',
		'textAreaLabel': 'Comments',
		'textAreaPlaceholder': 'Write your comments...',
		'addInstructionBtn': 'Add new instruction',
		'deleteInstructionBtn': 'Delete instruction',
		'notice': '*Required input',
		'cancelBtn': 'Cancel',
		'submitBtn': 'Submit',
		'labelInfoCheckbox': 'Example text labelInfoCheckbox',
		'labelInfoDate': 'Example text labelInfoDate',
		'producstListLabel': 'Products listing',
		'tooltip': 'Delete product',
		'noResult': 'No results',
	},
	errors: {
		'exactlyCharacters': 'The entry must contain 11 characters',
	},
	products: [
		{
			'name': 'Contract',
			'value': 'Contract',
		},
		{
			'name': 'Request',
			'value': 'Request',
		},
		{
			'name': 'Account',
			'value': 'Account',
		},
		{
			'name': 'Lorem ipsum dolor1',
			'value': 'Lorem ipsum dolor1',
		},
		{
			'name': 'Account3',
			'value': 'Account3',
		},
		{
			'name': 'Account4',
			'value': 'Account4',
		},
		{
			'name': 'Lorem ipsum dolor',
			'value': 'Lorem ipsum dolor',
		},
	],
	currency: [
		{
			'name': 'EUR',
			'value': 'EUR',
		},
		{
			'name': 'LIB',
			'value': 'LIB',
		},
		{
			'name': 'RUB',
			'value': 'RUB',
		},
	],
	options: [
		{
			id: 'clients',
			label: 'Clients View',
			value: 'clients',
		},
		{
			id: 'products',
			label: 'Products View',
			value: 'products',
		},
	],
	valuesDate: [
		{
			'name': 'As soon as posible',
			'value': 'soon',
		},
		{
			'name': 'Later',
			'value': 'later',
		},
	],
	// Add default values here
};
