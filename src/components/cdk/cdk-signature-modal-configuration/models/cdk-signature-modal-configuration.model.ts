import { SignatureTypes } from '../../cdk-signature-modal/models/cdk-signature-modal.model';

export const enum SignatureTypesIdEnum {
	SIMPLE = 1,
	QUALIFIED = 4,
	QUALIFIED_ID_NOW = 5,
	ADEVANCED = 2,
	ADVANCED_CERTIFICADE = 8,
	QUALIFIED_SIGNER_HELD_MEXICO = 6
}

export interface SignatureTypesOptions {
	name: string;
	key: SignatureOptions | string;
	type: string;
}

export const enum SignatureOptions {
	SMS = 'sms',
	OTP = 'oneTimePassword'
}

export const enum SignatureOptionsId {
	SMS = 0,
	OTP = 1,
	CERTIFICATED = 2
}

export interface QualifiedOptions {
	id: number;
	value: string;
	label: string;
}

export const enum QualifiedLabels {
	NONE = 'None',
	IDNOW = 'IDnow',
	SIGNERHELDMEXICO = 'Signer Held Mexico'
}

export interface RecipientList {
	id: string;
	value: string;
}

export const enum RecipientTypes {
	SIGNER = 'recipient_signer',
	CC = 'recipient_cc'
}

export interface RecipientListWithLabel extends RecipientList {
	label: string;
	isChecked: boolean;
}

export interface RecipientListOnlyCC extends RecipientList {
	label: string;
	isChecked: boolean;
}

export interface SignerRecipient {
	id: number;
	name: string;
	email: string;
	typeId?: string;
	type: string;
	typeLabel: string;
	showForm: boolean;
	selectedOption?: number;
	recipientId?: number;
	sms?: string;
	oneTimePassword?: string;
	options?: RecipientListWithLabel[] | RecipientListOnlyCC[];
	isTemplate?: boolean;
	isValid?: boolean;
	position?: number;
	roleName?: string;
	glcs?: string; //Subsidiary;
	isQualifiedIDNow?: boolean;
	qualifiedType?: string;
	cardId: number;
	accessCode?: string;
}

export type Languages = 'es-ES' | 'en-GB';

export interface Literals {
	dialog: {
		helpTitle: string;
		helpSubtitle: string;
		helpDescription: string;
		helpSubdescription: string;
		helpText: string;
		btnBack: string;
		btnCancel: string;
		btnNext: string;
		btnHelpCancel: string;
		btnHelpStart: string;
		btnFinish: string;
		btnDuplicate: string;
		noResultsText: string;
		checkLabel: string;
		helpVideoTitle: string;
		helpTextTitle: string;
		btnCloseVideoHelp: string;
		btnCloseTextHelp: string;
		btnClearSelection: string;
		btnShowFolders: string;
		requiredLabel: string;
		documentationTitle: string;
		configurationTitle: string;
		confirmationTitle: string;
		selectorFilesTitle: string;
		selectorFilesDuplicatedError: string;
		selectorFilesMaxError: string;
		selectorFilesMaxError2: string;
		selectorFilesFormatError: string;
		selectorFilesAttached: string;
		selectorTextDescription: string;
		documentTxt: string;
		categoryPlaceholder: string;
		signatureTypesLabel: string;
		signatureTypesTooltipApp: string;
		signatureTypesTooltipUser: string;
		checkSignOrderLabel: string;
		signatureCheckLabel: string;
		recipientsTitle: string;
		recipientsTitleCC: string;
		recipientNameLabelInput: string;
		recipientNamePlaceholderInput: string;
		recipientEmailLabelInput: string;
		recipientEmailPlaceholderInput: string;
		recipientGlcsLabelInput: string;
		recipientGlcsPlaceholderInput: string;
		recipientQualifiedIDNow: string;
		glcsError: string;
		// Delete
		// recipientOptionsLabelInput: string;
		// recipientOptionsPlaceholderInput: string;

		recipientOptionsLabelInputCode: string;
		recipientOptionsPlaceholderInputCode: string;
		recipientOptionsPlaceholderInputSms: string;
		recipientOptionsLabelInputSmsFormat: string;
		recipientOptionsLabelInputSmsRequired: string;
		recipientOptionsLabelInputSmsCountryRequired: string;

		deleteRecipientBtn: string;
		addRecipientBtn: string;
		pendingRecipientAlert: string;
		signatureDaysExpireLabel: string;
		masiveLoadBtn: string;
		cancelMasiveLoadBtn: string;
		downloadMasiveLoadTemplate: string;
		resumeTitleSiganture: string;
		resumeTitleDoc: string;
		resumeTitleExpiry: string;
		resumeRecipientListTitle: string;
		resumeCustomizeMailTitle: string;
		resumeSubjectLabel: string;
		resumeSubjectPlaceholder: string;
		resumeMessageLabel: string;
		resumeMessagePlaceholder: string;
		modalButtonText: string;
		close: string;
		modalCompleteMainTitle: string;
		modalCompleteMessage: string;
		modalCompleteOnlyBtn: string;
		modalProcessMainTitle: string;
		modalProcessMessage: string;
		modalProcessBtnLeft: string;
		modalProcessBtnRight: string;
		modalErrorMainTitle: string;
		modalErrorMainTitleSizeLimit: string;
		modalErrorMainTitleAssignManager: string;
		modalErrorMessageSizeLimit: string;
		modalErrorMessageAssignManager: string;
		modalErrorMessage: string;
		modalErrorBtn: string;
		modalLoadingMainTitle: string;
		modalLoadingMessage: string;
		modalAppPermissionsMainTitle: string;
		modalAppPermissionsMessage: string;
		modalAppPermissionsBtn: string;
		modalUserPermissionsMainTitle: string;
		modalUserPermissionsMessage: string;
		modalUserPermissionsBtn: string;
		modaldownServicesMainTitle: string;
		modaldownServicesMessage: string;
		modaldownServicesBtn: string;
		folderEmptyState: {
			mainTitle: string;
			desc: string;
		};
		addTemplate: string;
		noTeamTitle: string;
		noTeamText: string;
		noTeamUnderstand: string;
		daystoExpireError: string;
		emailMessageError: string;
		optionalConfig: string;
		docAccessCode: string;
		qualifiedOptionalLabel: string;
	};
	steps: {
		documentation: string;
		configuration: string;
		confirmation: string;
	};
	radioSignatureTypes: {
		[key: string]: string;
	};
	radioRecipientList: {
		signer: string;
		cc: string;
	};
}

export interface Template {
	createdDateTime: string;
	is21CFRPart11: string;
	ownerName: string;
	recipientsUri: string;
	senderCompany: string;
	senderEmail: string;
	senderName: string;
	status: string;
	subject: string;
	templateId: string;
	templateUri: string;
	name?: string;
	description?: string;
	signatureType?: string;
}

export interface Subsidiary {
	company_id: number;
	glcs: string;
	id: number;
	name: string;
	value: string;
}

export interface InputsToValidate {
	signatureType: SignatureTypes;
	recipientList: SignerRecipient[];
	glcsList?: string;
	daysToEspire: string;
	docAccessCode: boolean[];
}

export interface ResetDataInput {
	reset: boolean;
	id: string;
}

export interface CodeValue {
	id: number;
	cardId: number;
	accessCode: string;
}

export const enum RecipientRoles {
	CLIENT = 'client',
	EMPLOYEE = 'employee'
}
