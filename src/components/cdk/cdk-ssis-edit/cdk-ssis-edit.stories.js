import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ssis Edit',
	...getStoryConfig('scib-cdk-ssis-edit'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open is-emitter absolute>
		<scib-cdk-ssis-edit
			literals='${parseObject(args.literals)}'
			errors='${parseObject(args.errors)}'
			products='${parseObject(args.products)}'
			currency='${parseObject(args.currency)}'
			values-date='${parseObject(args.valuesDate)}'>
		</scib-cdk-ssis-edit>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		'mainTitle': 'Edit Request Details',
		'mainTitleDetail': 'Request Details',
		'instructionID': 'ID 265344',
		'instructionStatus': 'Status: Done',
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
		'editBtn': 'Edit',
		'notice': '*Required input',
		'cancelBtn': 'Cancel',
		'submitBtn': 'Submit',
		'labelInfoCheckbox': 'Example text labelInfoCheckbox',
		'labelInfoDate': 'Example text labelInfoDate',
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
			'value': 'eur',
		},
		{
			'name': 'LIB',
			'value': 'lib',
		},
		{
			'name': 'RUB',
			'value': 'rub',
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
