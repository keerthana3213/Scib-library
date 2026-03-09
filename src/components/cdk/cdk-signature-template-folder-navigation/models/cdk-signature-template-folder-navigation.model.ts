export interface Literals {
	folderEmptyState: {
		mainTitle: string;
		desc: string;
	};
}

export interface Folder {
	idFolder: string;
	nameFolder: string;
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
	description?: string;
	signatureType?: string;
}

export interface SelectedTemplate {
	asignedTemplate: Template;
}
