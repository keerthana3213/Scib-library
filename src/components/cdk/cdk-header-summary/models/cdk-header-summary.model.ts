export interface ILiterals {
	[key: string]: any;
}
/** Modelo para botones */
export interface ICDKHeaderSummaryData {
	/** Titulo del encabezado */
	titleName: string;
	/** Header's subititle */
	subtitleName: string;
	/** Numero de items */
	countedItems?: number;
	/** Numero de items en la parte*/
	progressPart?: number;
	/** Numero de items en el total */
	progressTotal?: number;
	/**  Numero de items en la lista inferior*/
	tableListCount?: number;
	/** Tipo de boton */
	buttons?: ICDKButton[];

	buttonsAlign?: boolean;
}

export interface ICDKButton {
	/** Nombre del evento del boton */
	eventName: string;
	/** Nombre del icono (opcional)*/
	iconName?: string;
	/** Tipo de boton */
	type: CDKButtonTypeEnum;
	/** Option to disable button */
	disabled?: boolean;
}

/** Modelo para los literales del componente */
export interface ICDKHeaderSummaryLiterals {
	countedItemsName: string;
	progressItemsLabel: string;
	progressItemsName: string;
	tableListLabel: string;
	tableListName: string;
	buttonLabelList: string[];
}

/** Lista de variantes de botones */
export enum CDKButtonTypeEnum {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	TERTIARY = 'tertiary',
	LINK = 'link',
	NO_BACKGROUND = 'nobackground',
}
