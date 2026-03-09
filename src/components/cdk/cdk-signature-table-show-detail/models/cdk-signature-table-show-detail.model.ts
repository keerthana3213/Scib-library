import { SignatureTypesEnum, SignatureTypesOptions } from '../../cdk-signature-modal/models/cdk-signature-modal.model';

export interface CDKISignatureTableLiterals {
	canceledStatusLabel: string;
	pendingStatusLabel: string;
	completedStatusLabel: string;
	rejectedStatusLabel: string;
	draftStatusLabel: string;
	menuButtonOptions: {
		resendButton: string;
		modifyButton: string;
		cancelButton: string;
		cloneButton: string;
		downloadButton: string;
	};
	accordionInfo: {
		signerTitle: string;
		ccTitle: string;
		resumeTitle: string;
		documentsTitle: string;
		resumeCreatedOn: string;
		resumeExpireDate: string;
		resumeSignatureType: string;
		resumeDocuments: string;
		[key: string]: any;
	};
}

export interface CDKISignatureTableRowData {
	/** Identificador oculto para cada fila */
	hiddenId: string;
	/** Valor del campo*/
	[key: string]: string | number | CDKISignatureTableEnvelope;
	accordion: CDKISignatureTableEnvelope;
}

export enum CDKISignatureTableSelectionType {
	single = 'single',
	multiple = 'multiple'
}

export interface CDKISignatureTableEnvelope {
	id: number;
	created_at: Date;
	updated_at: Date;
	senderName: string;
	senderLdapId: string;
	senderOriginApp: string;
	envelopeId: string;
	envelopeStatus: CDKISignatureTableEnvelopeStatus;
	envelopeLastChange: null;
	envelopeUiUri: string;
	signatureType: string;
	signatureTypeId: CDKISignatureTableEnvelopesignatureTypeId;
	emailSubject: string;
	emailBody: string;
	expirationDays: string;
	envelopeRecipient: CDKISignatureTableEnvelopeRecipient[];
	envelopeDocument: CDKISignatureTableEnvelopeDocument[];
	team: string;
	ceco: string;
	manager: string;
	mailSent: string;
	saved_in_filenet: boolean;
}

export interface CDKISignatureTableEnvelopesignatureTypeId {
	active: boolean;
	created_at: Date;
	id: number;
	name: string;
	options: SignatureTypesOptions;
	providerName: SignatureTypesEnum;
	updated_at: Date;
}

export interface CDKISignatureTableEnvelopeRecipient {
	id: number;
	created_at: Date;
	updated_at: Date;
	name: string;
	email: string;
	type: string;
	order: string;
	status: CDKISignatureTableRecipientStatus;
	date_delivered?: string;
	date_sent?: string;
	date_signed?: string;
}

export interface CDKISignatureTableEnvelopeDocument {
	id: number;
	created_at: Date;
	updated_at: Date;
	name: string;
	extension: string;
	order: string;
	uri: string;
	guid: string;
	size: string;
}

export enum CDKISignatureTableEnvelopeStatus {
	declined = 'declined',
	notValidEmail = 'NotValidEmail',
	draft = 'draft',
	sent = 'sent',
	signed = 'signed',
	completed = 'completed',
	delivered = 'delivered',
	voided = 'voided',
	pending = 'pending',
	rejected = 'rejected'
}

export enum CDKISignatureTableRecipientStatus {
	notValidEmail = 'NotValidEmail',
	sent = 'sent',
	signed = 'signed',
	completed = 'completed',
	delivered = 'delivered',
	pending = 'pending',
	rejected = 'rejected',
	declined = 'declined'
}

export interface EditRecipientEmail {
	envelopeId: string;
	allRecipients: Array<CDKISignatureTableEnvelopeRecipient>;
	recipientsToModifyEmail: Array<CDKISignatureTableEnvelopeRecipient>;
}
