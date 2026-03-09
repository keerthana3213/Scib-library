export interface ILiterals {
	dragFiles: string;
	docClassTitle: string;
	docClassMessage: string;
	docTypeTitle: string;
	docTypeMessage: string;
	documents: string;
}

export interface LangLiterals {
	'es-ES'?: Partial<ILiterals>;
	'en-GB'?: Partial<ILiterals>;
	'en-US'?: Partial<ILiterals>;
}
export type Languages = 'es-ES' | 'en-US' | 'en-GB';

export class IECMVDocTypeOption implements IECMVDocumentTypeValues {
	id_doc_type: string;
	t_name: string;
	t_description: string;
	id?: string;
	value?: string;
	label?: string;
}

export interface IECMVFiles {
	itemName: string;
}

export interface IECMVFormValues {
	label: string;
	value: Object;
}

export interface IECMVMetadataValues {
	id_doc_metadata: string;
	b_list: boolean;
	t_name: string;
	t_description: string;
	t_type: string;
	b_automatic: boolean;
	t_cardinality: string;
	t_list: string;
	t_list_value: string;
	options: IECMVMetadataOptionValues[];
	automatic_value?: string;
	required?: boolean;
}

export interface IECMVMetadataOptionValues {
	label: string;
	id: string;
	active: boolean;
	icon?: string;
}

export interface IECMVDocClassValues {
	id_doc_class: string;
	id_doc_type: string;
	t_name: string;
	t_description: string;
	documentyype: IECMVDocumentTypeValues[];
	icon?: string;
	// id?: string;
	name?: string;
}

export interface IECMVDocumentTypeValues {
	id_doc_type: string;
	t_name: string;
	t_description: string;
	id?: string;
	value?: string;
	label?: string;
}

export interface IECMVFormDataValues {
	id_attribute: string;
	values: any[];
}

export interface ICDKMessagesFile {
	/** Nombre del fichero (extensión incluída) */
	name: string;
	/** Extensión */
	extension: ECDKMessagesFileAvailableExtensions;
	/** Tamaño del archivo */
	size: string;
	/** Ruta del fichero */
	path?: string;
	/** Establece el fichero en estado "uploading" si no se ha subido */
	uploading?: boolean;
	/** Mensaje de error tipo "try again" para intentar relanzar el fichero al backend */
	error?: string;
	/** Id de la conversación donde está insertado el fichero (para propósitos ) */
	conversationId?: string;
	/** Datos adicionales para poder manejar identificadores o lo que se plazca */
	[key: string]: any;
}

/** Extensiones permitidas en la subida de documentos */
export enum ECDKMessagesFileAvailableExtensions {
	'pdf' = 'pdf',
	'xls' = 'xls',
	'jpg' = 'jpg'
	//...
}

export interface IAnalyticEvent {
	event: any;
	event_category: any;
	event_action: any;
	event_label: any;
	producto: any;
	user_id: string;
	user_area: string;
	user_geography: string;
}

export type IAnalyticEvents = Array<IAnalyticEvent>;

export interface ISaveInFNResult {
	state: 'ko' | 'ok' | 'duplicateFile';
	filenet_gn_id?: string;
	filename?: string;
	file?: any;
	duplicateDocument?: any;
	analyticsEvent?: IAnalyticEvent;
	error?: any;
	metadata?: any;
	storagePath?: any;
}

export interface IEmitEventSendFN {
	formData: any;
	files: any[];
	filesOK?: number;
	err?: any;
}
