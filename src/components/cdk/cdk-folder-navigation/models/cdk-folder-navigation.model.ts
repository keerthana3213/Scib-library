import { SignatureTypesEnum } from '../../cdk-signature-modal/models/cdk-signature-modal.model';

export interface ILiterals {
	[key: string]: any;
}
/** */
export interface Folder {
	idFolder: string;
	nameFolder: string;
	/**
	 * In case that the the object it´s null
	 * that's when we call the service
	 *  and search for the subfolders && templates*/
	subFolders: Folder[] | null;
	templates: Template[] | null;
	indexPosition?: number;
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
	signature_type?: SignatureTypesEnum;
}

export interface IECMVBreadcrumb {
	id: string;
	name: string;
	tooltip: string;
	active: boolean;
	position: number;
	indexPosition?: number[];
}
