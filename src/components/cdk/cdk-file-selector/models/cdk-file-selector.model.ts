export interface ICDKFiles {
	isClicked: boolean;
}

export interface ICDKDropAreaConfig {
	uploadServerSide: boolean; // Should file be uploaded serverside
	serverSideURL?: string; // URL of the server endpoint for file upload
	frontSideURL?: string; // URL of the server endpoint for fetching signed url
	formDataFileName?: string; // Name of the file in the formData
}

export interface ICDKFileSelectorLiterals {
	/** Label selector */
	labelSelector?: string;
	/** Titulo de selección*/
	titleselector?: string;
	/** Maximum number of files message*/
	errorMaxFiles?: string;
	/** Unsupported file format message*/
	errorFormat?: string;
	/** Duplicated filename */
	errorDuplicate?: string;
	/** Label on top of file selected*/
	fileSelectedText?: string;
	/** Name of file selected*/
	inputName?: string;
	/** ID of file selected*/
	inputID?: string;
	/** Downolad */
	download?: string;
	/** File List Title */
	fileListTitle?: string;
}

export interface ICDKFileSelectorAlterFile {
	id: number;
	created_at: string;
	updated_at: string;
	path: string;
	name: string;
	size: number;
	mime_type: string;
	verification: string;
	checked?: boolean;
	disabled?: boolean;
}
