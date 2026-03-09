import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Parameter Input',
	...getStoryConfig('scib-cdk-parameter-input'),
};

const modalLiterals = {
	isRequiredLabel: '*Required input',
	buttonLabelList: ['Cancel', 'Create Group'],
};
const modalData = {
	title: 'New Group',
	text: '',
	legend: 'Creation group',
	showIsRequired: true,
	buttonList: [
		{
			eventName: 'cancelDelete',
			type: 'secondary',
			disabledIfRequired: false,
		},
		{
			eventName: 'confirmDelete',
			type: 'primary',
			disabledIfRequired: true,
		},
	],
	loadingImgSrc: 'assets/images/i-descarga.svg',
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-modal-form literals='${parseObject(modalLiterals)}' data='${parseObject(modalData)}'>
		<scib-cdk-parameter-input
			slot
			literals='${parseObject(args.literals)}'
			data='${parseObject(args.data)}'
		></scib-cdk-parameter-input>
	</scib-cdk-modal-form>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		itemTitle: 'Parameter',
		deleteItem: 'Delete parameter',
		addNewItem: 'Add new parameter',
		itemType: 'Input Type',
		placeholderItemType: 'Select Parameter Type',
		itemName: 'Parameter Name',
		placeholderItemName: 'Parameter Name',
		itemDefaultValue: 'Default Value',
		placeholderItemDefaultValue: 'Enter Value',
		itemComboListOptions: 'Parameter combo list options',
		itemValueListed: 'Value Listed',
		placeholderItemValueListed: 'Enter Value',
		date: 'Date',
		text: 'Single Value',
		number: 'Number Value',
		combo: 'Combo',
		pendingError: 'Pending to complete',
		newLable: 'Newly added',
		parameterLogic: 'Parameter Logic',
		parameterType: 'Parameter Type',
		parameterName: 'Parameter Name',
		automationType: 'Automation Type',
		atribute: 'Atribute',
		concatenation: 'Concatenation',
		manual: 'Manual',
		autoSingle: 'Automatic - Single value',
		autoAdded: 'Automatic - Added',
		default: 'Default',
		calculated: 'Calculated',
		autovalueunique: 'Automático - Valor único',
		autovalueaggregated: 'Automático - Valor agregado',
		operational: 'Operational',
		filenet: 'Filenet',
		amendment: 'Amendment',
		checkLabel: 'Mark as Mandatory',
	},
	data: {
		name: 'test-name557',
		couldBeMandatory: true,
		itemList: [
			{
				id: 'test_id',
				inputType: '',
				name: 'Test1',
				value: '',
				selectedMetadataName: { active: true, id: 'ExpirationDate', label: 'ExpirationDate' },
				paramType: 'Filenet',
				paramLogic: 'autovalueaggregated',
				atribute: 'booking',
				automation: '',
				concatenated: '|',
				paramTypes: [
					{
						id: "Operacionales",
						label: "Operational",
						value: "Operacionales",
					},
					{
						id: "Template",
						label: "Amendment",
						value: "Template"
					},
					{
						id: "Filenet",
						label: "Filenet",
						value: "Filenet"
					}
				],
				isMandatory: true,
			},
			{
				id: 'test-id',
				inputType: 'text',
				name: 'abc',
				value: '24',
				paramType: 'Operacionales',
				paramLogic: 'autovalueunique',
				atribute: '',
				automation: 'default',
				concatenated: '',
				paramTypes: [
					{
						id: "Operacionales",
						label: "Operational",
						value: "Operacionales",
					},
					{
						id: "Template",
						label: "Amendment",
						value: "Template"
					},
					{
						id: "Filenet",
						label: "Filenet",
						value: "Filenet"
					}
				]
			},
			{
				atribute: 'booking',
				automation: 'calculated',
				concatenated: '',
				id: 'test-name0',
				inputType: '',
				name: 'test2',
				paramLogic: 'autovalueunique',
				paramType: 'Operacionales',
				value: '',
				paramTypes: [
					{
						id: "Operacionales",
						label: "Operational",
						value: "Operacionales",
					},
					{
						id: "Template",
						label: "Amendment",
						value: "Template"
					},
					{
						id: "Filenet",
						label: "Filenet",
						value: "Filenet"
					}
				]
			},
			{
				atribute: '',
				automation: 'default',
				concatenated: '',
				id: 'test-name0',
				inputType: 'combo',
				name: 'lista',
				paramLogic: 'autovalueunique',
				paramType: 'Operacionales',
				value: ['v1', 'v2', 'v3'],
				paramTypes: [
					{
						id: "Operacionales",
						label: "Operational",
						value: "Operacionales",
					},
					{
						id: "Template",
						label: "Amendment",
						value: "Template"
					},
					{
						id: "Filenet",
						label: "Filenet",
						value: "Filenet"
					}
				]
			},
			{
				atribute: '',
				automation: '',
				concatenated: '',
				id: 'test-name0',
				inputType: 'number',
				name: 'rwe',
				paramLogic: 'manual',
				paramType: 'Operacionales',
				value: '',
				paramTypes: [
					{
						id: "Operacionales",
						label: "Operational",
						value: "Operacionales",
					},
					{
						id: "Template",
						label: "Amendment",
						value: "Template"
					},
					{
						id: "Filenet",
						label: "Filenet",
						value: "Filenet"
					}
				]
			},
		],
		parameterType: [
			{
				id: "Operacionales",
				label: "Operational",
				value: "Operacionales",
			},
			{
				id: "Template",
				label: "Amendment",
				value: "Template"
			},
			{
				id: "Filenet",
				label: "Filenet",
				value: "Filenet"
			}
		],
		automationType: [
			{
				active: false,
				id: 'default',
				name: 'Default',
			},
			{
				active: false,
				id: 'calculated',
				name: 'Calculated',
			},
		],
		atributes: [
			{
				active: false,
				id: 'booking',
				name: 'Booking Unit',
			},
			{
				active: false,
				id: 'other',
				name: 'Other',
			},
		],
		parameterLogic: [
			{
				active: false,
				id: 'autovalueaggregated',
				name: 'Automático - Valor agregado',
			},
			{
				active: false,
				id: 'autovalueunique',
				name: 'Automático - Valor único',
			},
			{
				active: false,
				id: 'manual',
				name: 'Manual',
			},
		],
		itemType: [
			{
				active: false,
				id: 'text',
				name: 'Single Value',
			},
			{
				active: true,
				id: 'number',
				name: 'Number Value',
			},
			{
				active: false,
				id: 'date',
				name: 'Date',
			},
			{
				active: false,
				id: 'combo',
				name: 'Combo',
			},
		],
		concatenatedValue: ';',
	},
	// Add default values here
};
