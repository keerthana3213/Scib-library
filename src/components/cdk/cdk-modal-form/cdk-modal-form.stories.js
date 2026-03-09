import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Modal Form',
	...getStoryConfig('scib-cdk-modal-form'),
};

const literalsFileSelector = {
	titleselector: 'Select or Drag Files',
	errorMaxFiles: 'Sorry, you cannot upload more than one file at a time',
	errorFormat: 'The file or extension is not supported',
	fileSelectedText: 'Attached document',
};

const literalsDropdown = {
	addItemLabel: 'Add to a new group',
	itemInputLabel: 'NEW GROUP NAME*',
	inputPlaceholder: 'Enter value',
};

const optionsCard = [
	{
		id: 'clientsBox',
		label: 'Virtual Data Room IBOR negotiation',
		value: 'clientsBox',
		description: 'Initiates IBOR negotiation through the Client’s VDR creating a new topic. This is the most desirable channel to carry out the negotiation, being the most user-friendly as well as simple from the operational point of view (automatic notifications and easy access to action buttons for escalation, closure, upload/ download of files).',
	},
	{
		id: 'productsBox',
		label: 'Non-VDR alternative IBOR Negotiation',
		value: 'productsBox',
		description: 'Changes the negotiation case status. It requires the case negotiation to be carried out through an alternative channel by the Execution Team. During the negotiation, you must bear in mind that it will be required to reflect all actions conducted outside the platform on the action buttons on the IBOR Transition application:',
		list: [
			'New amendment file update',
			'Amendment signature',
			'Escalation/ de-escalation',
			'Parameters confirmation by a different peer and case closure',
		],
	},
];

const literalsFile = {
	buttonLabelList: ["Edit", "Download"]
};

const dataFile = {
	fileName: "Template name",
	highlightedName: true,
	fileExtension: "",
	attributeList: ["Template description"],
	buttonList: [
		{
			eventName: "delete",
			iconName: "icon-delete",
			hideTxt: true,
			separator: true,
			disabled: true
		},
		{
			eventName: "edit-pencil",
			iconName: "icon-edit-pencil",
			hideTxt: true
		},
		{
			eventName: "open-eye",
			iconName: "icon-open-eye",
			hideTxt: true
		}
	]
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-modal-form
		is-loading='${parseBoolean(args.isLoading)}'
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	>
		<div slot='header'></div>
		<div slot>
			<scib-ui-row>
				<scib-ui-column col-lg='3'>
					<scib-ui-dropdown
						label='GROUP NAME*'
						header='Choose Class'
						options='[{"active":true,"id_doc_type":"01AS","t_name":"Accounting controls"},{"active":false,"id_doc_type":"01AS","t_name":"Accounting controls2"},{"active":false,"id_doc_type":"01AS","t_name":"Accounting controls3"}]'
						metadatavalues='false'
						multipleselector='single'
						disabledselector='false'
						enableitemaddition='true'
						idselect='documentClass'
						name='dropdown01'
						required
						literals='${parseObject(literalsDropdown)}'
					>
					</scib-ui-dropdown>
				</scib-ui-column>
			</scib-ui-row>
			<scib-ui-row>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput0'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
					></scib-ui-input>
				</scib-ui-column>
				<scib-ui-column col-lg='6'>
					<scib-ui-radio-button
						is-radio-card='true'
						group-name='radioName'
						options='${parseObject(optionsCard)}'
					></scib-ui-radio-button>
				</scib-ui-column>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput2'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
					></scib-ui-input>
				</scib-ui-column>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput0'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
					></scib-ui-input>
				</scib-ui-column>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput2'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
					></scib-ui-input>
				</scib-ui-column>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput3'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
					></scib-ui-input>
				</scib-ui-column>
			</scib-ui-row>
			<scib-ui-row separator>
				<scib-ui-column col-lg='6'>
					<scib-cdk-file-selector
						show-upload-files
						name='file-selector'
						literals='${parseObject(literalsFileSelector)}'
						maxfiles='1'
						smallsize='true'
					>
					</scib-cdk-file-selector>
				</scib-ui-column>
			</scib-ui-row>
			<scib-ui-row>
				<scib-ui-column col-lg='4'>
					<scib-ui-textarea
						name-txtarea='textname'
						label-txtarea='my label'
						placeholder-txtarea='Something something'
					>
					</scib-ui-textarea>
				</scib-ui-column>
			</scib-ui-row>
			<scib-ui-row>
				<scib-ui-column col-lg='3'>
					<scib-ui-dropdown
						label='GROUP NAME*'
						header='Choose Class'
						options='[{"active":true,"id_doc_type":"01AS","t_name":"Accounting controls"},{"active":false,"id_doc_type":"01AS","t_name":"Accounting controls2"},{"active":false,"id_doc_type":"01AS","t_name":"Accounting controls3"}]'
						metadatavalues='false'
						multipleselector='single'
						disabledselector='false'
						enableitemaddition='true'
						idselect='documentClass'
						name='dropdown01'
						required
						literals='${parseObject(literalsDropdown)}'
					>
					</scib-ui-dropdown>
				</scib-ui-column>
			</scib-ui-row>
		</div>
	</scib-cdk-modal-form>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		isRequiredLabel: '*Required input',
		buttonLabelList: ['Cancel', 'Create Group'],
		loading: 'Loading...',
	},
	data: {
		title: 'Lorem ipsum',
		text: 'Welcome! Vestibulum rutrum quam vitae fringilla tincidunt. Suspendisse nec tortor urna. Ut laoreet sodales nisi, quis iaculis nulla iaculis vitae. ',
		legend: 'Creation user',
		showIsRequired: true,
		buttonList: [
			{
				eventName: 'cancel',
				type: 'secondary',
				disabledIfRequired: false,
			},
			{
				eventName: 'confirm',
				type: 'primary',
				disabledIfRequired: true,
			},
		],
		loadingImgSrc: 'images/i-descarga.svg',
	},
	// Add default values here
};


/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const TemplateWizardSteps = (args) => render(args, `
	<scib-cdk-modal-form
		is-loading='${parseBoolean(args.isLoading)}'
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	>
		<div slot='header'>
			<scib-ui-file-history
				literals='${parseObject(literalsFile)}'
				data='${parseObject(dataFile)}'
			></scib-ui-file-history>
		</div>
		<div slot='1'>
			<scib-ui-row>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput0'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
						step-position='1'
						required
					></scib-ui-input>
				</scib-ui-column>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput1'
						value=''
						step-position='1'
						inputplaceholder='Enter group name'
						multiselect='false'
					></scib-ui-input>
				</scib-ui-column>
			</scib-ui-row>
		</div>
		<div slot='2'>
			<scib-ui-row>
				<scib-ui-column col-lg='4'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput2'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
						step-position='2'
						required='true'
					></scib-ui-input>
				</scib-ui-column>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput3'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
					></scib-ui-input>
				</scib-ui-column>
			</scib-ui-row>
		</div>
		<div slot='3'>
			<scib-ui-row>
				<scib-ui-column col-lg='4'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput5'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
						step-position='3'
						required='true'
					></scib-ui-input>
				</scib-ui-column>
				<scib-ui-column col-lg='2'>
					<scib-ui-input
						label='GROUP NAME*'
						name='groupInput6'
						value=''
						inputplaceholder='Enter group name'
						multiselect='false'
					></scib-ui-input>
				</scib-ui-column>
			</scib-ui-row>
		</div>
	</scib-cdk-modal-form>
`);

// Default Story
export const WizardSteps = TemplateWizardSteps.bind();
WizardSteps.args = {
	literals: {
		isRequiredLabel: '*Required input',
		loading: 'Loading...',
		buttonLabelList: ['Cancel', 'Create Group'],
		next: 'Next',
	},
	data: {
		title: 'New Group',
		legend: 'Creation group',
		steps: ['Signed Contract', 'Parameters', 'Signature options'],
		showIsRequired: true,
		buttonList: [
			{
				eventName: 'cancelDelete',
				type: 'secondary',
				disabledIfRequired: false,
			},
			{
				eventName: 'submit',
				type: 'primary',
				disabledIfRequired: true,
			},
		],
		loadingImgSrc: 'images/i-descarga.svg',
	},
	// Add default values here
};
