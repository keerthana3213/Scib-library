import {
	RecipientListWithLabel,
	SignatureStep,
	SignatureStepType,
	SignatureTypes,
	SignatureTypesEnum,
	RecipientTypes
} from './cdk-signature-modal.model';

export const defaultRadioSignature: SignatureTypes = {
	id: 1,
	type: SignatureTypesEnum.SIMPLE,
	label: 'universalsignaturepen_imageonly',
	value: 1,
	disabled: false,
	options: []
};

export const defaultRadioRecipientTypes: Partial<RecipientListWithLabel>[] = [
	{
		id: RecipientTypes.SIGNER,
		label: RecipientTypes.SIGNER,
		value: 'recipientType01',
		isChecked: true
	},
	{
		id: RecipientTypes.CC,
		label: RecipientTypes.CC,
		value: 'recipientType02',
		isChecked: false
	}
];

export const defaultSteps: Partial<SignatureStep>[] = [
	{
		order: 1,
		type: SignatureStepType.DOCUMENTATION,
		name: SignatureStepType.DOCUMENTATION,
		skip: false
	},
	{
		order: 2,
		type: SignatureStepType.CONFIGURATION,
		name: SignatureStepType.CONFIGURATION,
		skip: false
	},
	{
		order: 3,
		type: SignatureStepType.CONFIRMATION,
		name: SignatureStepType.CONFIRMATION,
		skip: false
	}
];
