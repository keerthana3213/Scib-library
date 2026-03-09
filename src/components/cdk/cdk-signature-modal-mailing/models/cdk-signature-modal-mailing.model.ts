export interface Literals {
	dialog: {
		confirmationTitle: string;
		resumeTitleSiganture: string;
		resumeTitleDoc: string;
		resumeTitleExpiry: string;
		resumeRecipientListTitle: string;
		resumeCustomizeMailTitle: string;
		resumeSubjectLabel: string;
		resumeSubjectPlaceholder: string;
		resumeMessageLabel: string;
		resumeMessagePlaceholder: string;
		maxLengthError: string;
		emailNotification: string;
	};
}

export interface SignatureMessage {
	subject: string | undefined;
	message: string | undefined;
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

export interface RecipientList {
	id: string;
	value: string;
}

export interface RecipientListWithLabel extends RecipientList {
	label: string;
	isChecked: boolean;
}

export interface RecipientListOnlyCC extends RecipientList {
	label: string;
	isChecked: boolean;
}
