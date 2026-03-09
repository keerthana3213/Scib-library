export interface ILiterals {
	[key: string]: any;
}

/** Modelo para un fichero */
export interface IDocumentPreviewFile {
	name: string;
	extension: DocumentPreviewExtensions;
	size: string;
	path?: string;
	uploading?: boolean;
	downloadble?: boolean;
	disableRemoveFile?: boolean;
	error?: string;
	[key: string]: any;
}

/** Modos de visualización del layout de tarjetas */
export type LayoutMode = 'rows' | 'columns';

/** Extensiones permitidas en la subida de documentos */
export enum DocumentPreviewExtensions {
	'pdf' = 'pdf',
	'xls' = 'xls',
	'jpg' = 'jpg'
}

export enum IconFormat {
	jpg = 'icon-image',
	jpeg = 'icon-image',
	png = 'icon-image',
	tif = 'icon-image',
	mov = 'icon-video',
	odt = 'icon-video',
	avi = 'icon-video',
	wmv = 'icon-video',
	mpeg = 'icon-video',
	flv = 'icon-video',
	zip = 'icon-comprimir',
	rar = 'icon-comprimir'
}

export enum FileColors {
	'xls' = '#216f42',
	'.xlsx' = '#216f42',
	'csv' = '#216f42',
	'.csv' = '#216f42',
	'doc' = '#005298',
	'.doc' = '#005298',
	'docx' = '#005298',
	'.docx' = '#005298',
	'ppt' = '#ec4321',
	'.pptx' = '#ec4321',
	'pdf' = '#c31530',
	'.pdf' = '#c31530'
}
