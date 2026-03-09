export interface IUIFileHistoryData {
	/** Identificador del evento del boton */
	id: string;
	/** Nombre del evento del boton */
	fileName: string;
	/** Nombre extensión */
	fileExtension?: string;
	/** Opción de resaltar nombre del archivo */
	highlightedName?: boolean;
	/** lista de atributos*/
	attributeList?: string[];
	/** lista de botones */
	buttonList?: IUIButton[];
	/** lista de data labels */
	dataLabelList?: IUILabel[];
}
interface IUIButton {
	/** Nombre del evento del boton */
	eventName: string;
	/** Nombre del icono (opcional)*/
	iconName?: string;
	/** Opción de deshabilitar el botón */
	disabled?: boolean;
	/** Opción de ocultar texto */
	hideTxt?: boolean;
	/** Opción de añadir separador con el siguiente botón */
	separator?: boolean;
}

/** Modelo para los literales del componente */
export interface IUIFileHistoryLiterals {
	title?: string;
	buttonLabelList?: string[];
}

interface IUILabel {
	title: string;
	description: string;
}
