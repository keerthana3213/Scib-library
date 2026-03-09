import { ICDKMessagesFile } from '../../../ecmv/ecmv-modal-files/models/ecmv-modal-files.model';
import { IUIInputOption } from '../../../ui/ui-input/models/ui-input.model';

export const enum SignatureStepType {
	DOCUMENTATION = 'documentation',
	CONFIGURATION = 'configuration',
	CONFIRMATION = 'confirmation'
}

export type SignatureStepConfig = {
	[SignatureStepType.DOCUMENTATION]?: {
		skip?: boolean;
		block?: boolean;
		files?: SignatureStepFiles[];
	};
	[SignatureStepType.CONFIGURATION]?: {
		skip?: boolean;
		block?: boolean;
		data?: ConfigurationOptions;
	};
	[SignatureStepType.CONFIRMATION]?: {
		data?: ConfirmationOptions;
	};
};

export interface SignatureStep {
	order: number;
	type: SignatureStepType;
	name: string;
	skip?: boolean;
	block?: boolean;
	files?: SignatureStepFiles[];
	data?: {
		[key: string]: any;
	};
}

export interface SignatureStepFiles {
	fileName: string;
	base64Data: string;
	type: string;
	category?: string;
}

export const enum SignatureTypesEnum {
	SIMPLE = 'universalsignaturepen_imageonly',
	QUALIFIED = 'universalsignaturepen_signer_held_eu_qualified',
	QUALIFIED_ID_NOW = 'docusign_eu_qualified_idnow_tsp',
	QUALIFIED_SIGNER_HELD_MEXICO = 'signer_held_mexico',
	ADEVANCED = 'universalsignaturepen_opentrust_hash_tsp',
	ADVANCED_CERTIFICADE = 'signer_held_european_ades_qc'
}

export const enum SignatureTypesIdEnum {
	SIMPLE = 1,
	QUALIFIED = 4,
	QUALIFIED_ID_NOW = 5,
	ADEVANCED = 2,
	ADVANCED_CERTIFICADE = 8,
	QUALIFIED_SIGNER_HELD_MEXICO = 6
}

export interface SignatureTypes {
	id: number;
	type: SignatureTypesEnum;
	label?: string;
	value: number;
	disabled: boolean;
	options: SignatureTypesOptions[];
}

export interface SignatureTypesOptions {
	name: string;
	key: SignatureOptions | string | number;
	type: string;
	id?: string | number;
	label?: string;
	value?: string | number;
}

export const enum SignatureOptions {
	SMS = 'sms',
	ONE_TIME_PASSWORD = 'oneTimePassword'
}

export const enum SignatureOptionsId {
	SMS = 0,
	ONE_TIME_PASSWORD = 1,
	CERTIFICATED = 2
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

export interface ConfigurationOptions {
	signatureType?: SignatureTypesEnum;
	daysToExpire?: number;
	orderCheck?: boolean;
	recipients?: {
		name: string;
		email: string;
		type?: RecipientTypes | string;
	}[];
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
	order?: string;
	roleName?: string;
	glcs?: string; //Subsidiary;
	isQualifiedIDNow?: boolean;
	qualifiedType?: string;
	cardId: number;
	accessCode?: string;
}

export interface DocuSignRecipient {
	agents: [];
	carbonCopies: [] | DocuSignSigner[];
	certifiedDeliveries: [];
	editors: [];
	inPersonSigners: [];
	intermediaries: [];
	notaries: [];
	recipientCount: string;
	seals: [];
	signers: DocuSignSigner[];
	witnesses: [];
}

export interface DocuSignSigner {
	completedCount: string;
	creationReason: string;
	declinedReason: string;
	deliveryMethod: string;
	email: string;
	firstName: string;
	isBulkRecipient: string;
	lastName: string;
	name: string;
	note: string;
	recipientId: number;
	recipientIdGuid: string;
	recipientSignatureProviders: DocuSignRecipientSignatureProviders[];
	recipientType: string;
	requireIdLookup: string;
	requireUploadSignature: string;
	roleName: string;
	routingOrder: string;
	status: string;
	templateLocked: string;
	templateRequired: string;
	userId: string;
	accessCode?: string;
}

export interface DocuSignRecipientSignatureProviders {
	sealDocumentsWithTabsOnly: string;
	signatureProviderName: string;
	signatureProviderOptions: SignatureProviderOptions;
}
export interface SignatureProviderOptions {
	sms?: string;
	oneTimePassword?: string;
}
export interface ConfirmationOptions {
	subject?: string;
	message?: string;
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
		documentationTemplateTitle: string;
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
		recipientOptionsLabelInputSms: string;
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
		maxLengthError: string;
		qualifiedOptional: string;
		qualifiedOptionalInfo: string;
		emailNotification: string;
		saveConfig: string;
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
	managerModal: {
		selectManager: string;
		textManager: string;
		noResultsText: string;
		notListAbove: string;
		nameManager: string;
		emailManager: string;
		emailMessageError: string;
		requiredInputs: string;
		buttonCancel: string;
		buttonConfirm: string;
		errorManager?: string;
	};
}

export interface LangLiterals {
	'es-ES'?: Partial<Literals>;
	'en-GB'?: Partial<Literals>;
}

export interface SignatureCustomTheme {
	primary?: string;
	primaryTxt?: string;
	secondaryTxt?: string;
	tertiaryTxt?: string;
	warningTxt?: string;
	decoratorPrimary?: string;
	decoratorSecondary?: string;
	borderPrimary?: string;
	borderSecondary?: string;
	btnPrimary?: string;
	btnTextPrimary?: string;
	btnSecondary?: string;
	btnTextSecondary?: string;
	btnHover?: string;
	btnTextHover?: string;
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

export interface BackReqBodyStep1 {
	redirectUrl: string;
	clientId: string;
	recipients?: BackEnvelopeRecipient[]; // optional only when there is a template
	docs: BackEnvelopeDoc[];
	email: BackEnvelopeEmail;
	// status: BackEnvelopeType;
	expiresIn?: string;
	signatureTypeId?: number;
}
export interface BackReqBodyStep2 {
	envelopeId: string;
	recipients: BackEnvelopeRecipient[];
	document: DocumentBackReqBodyStep2[];
	signatureTypeId?: number;
	originalTemplateRecipients?: BackEnvelopeRecipient[];
}

export interface DocumentBackReqBodyStep2 {
	documentId: number;
	templateId?: string;
}
export interface BackReqBodyStep3 {
	clientId: string;
	envelopeId: string;
	redirectUrl: string;
	signatureTypeId?: number;
	email: BackEnvelopeEmail;
	expiresIn?: string;
	docs: BackEnvelopeDoc[];
	recipients: BackEnvelopeRecipient[];
}
export interface BackEnvelopeRecipient {
	name: string;
	email: string;
	cc: boolean;
	order: number;
	options?: Object;
	recipientId?: string | number;
	signatureTypeId?: number;
	signatureType?: {
		id: number;
		type: string;
	};
	subsidiary?: string; //_id: number;
	accessCode?: string;
}

interface BackEnvelopeDoc {
	name: string;
	b64: string;
	size: string;
	extension: string;
	order: number;
	category?: string;
	templateId?: string;
}

interface BackEnvelopeEmail {
	subject: string;
	body: string;
}

export enum BackEnvelopeType {
	Created = 'created'
}

export interface Subsidiary {
	company_id: number;
	glcs: string;
	id: number;
	name: string;
	value: string;
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

export interface SignatureMessage {
	subject: string | undefined;
	message: string | undefined;
}

export interface RecipientOptions {
	envelopeRecipient_name: string;
	envelopeRecipient_email: string;
}

export interface CurrentEnvelope {
	emailSubject: string;
	emailBody: string;
	signatureTypeId: {
		name: string;
	};
	expirationDays: string;
	envelopeRecipient: any;
}

export interface RecipientsData {
	recipentNameOptions: IUIInputOption[];
	recipentEmailOptions: IUIInputOption[];
	recipientsOrderCheck: boolean;
	emailInvalid: boolean;
	selectedSignatureType: SignatureTypes;
	recipentsOptions: RecipientOptions[];
	radioRecipientTypes: RecipientListWithLabel[];
	radioSignatureTypes: SignatureTypes[];
	recipientsList: SignerRecipient[];
	daysToExpireSiganture: string;
	selectedSignatureTypeIndex: number;
	selectedSignatureValue: number;
	loadTemplateData: boolean;
}

export interface SignatureTypesBack {
	active: boolean;
	code: string;
	enabled: boolean;
	id: number;
	name: string;
	options: SignatureTypesOptions[] | null;
	provider_name: SignatureTypesEnum;
}

export interface FSECases {
	id: string;
	what: string;
	how: FSECasesHow[];
}
export interface FSECasesHow {
	key: string;
	value: string;
	descrip: string;
}

export interface DraftStep {
	redirectUrl: string;
	envelopeId: string;
}

export interface StepData {
	signatureType: SignatureTypes;
	recipients: SignerRecipient[];
	daysToExpire: string;
	template: Template;
	message: SignatureMessage;
}

export const enum RecipientRoles {
	CLIENT = 'client',
	EMPLOYEE = 'employee'
}
export interface BodyBase {
	clientId: string;
	redirectUrl: string;
	signatureTypeId?: number;
	email: BackEnvelopeEmail;
	expiresIn?: string;
	docs: ICDKMessagesFile[];
	recipients: SignerRecipient[];
	document: DocumentBackReqBodyStep2[];
	originalTemplateRecipients: SignerRecipient[];
	recipientsOrderCheck?: boolean;
	idTemplate?: string;
}
