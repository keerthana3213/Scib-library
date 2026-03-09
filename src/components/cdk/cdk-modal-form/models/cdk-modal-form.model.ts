export interface ICDKModelFormData {
	title?: string;
	text?: string;
	legend?: string;
	showIsRequired?: boolean;
	buttonList?: ICDKButton[];
	loadingImgSrc?: string;
	steps?: string[];
}
interface ICDKButton {
	/** Nombre del evento del boton */
	eventName: string;
	/** Nombre del icono (opcional)*/
	iconName?: string;
	/** Tipo de boton */
	type: CDKButtonTypeEnum;
	/** Opción de deshabilitar el botón si es requerido y no tiene un valor valido */
	disabledIfRequired?: boolean;
}

/** Modelo para los literales del componente */
export interface ICDKModelFormLiterals {
	loading: string;
	isRequiredLabel: string;
	next?: string;
	buttonLabelList: string[];
}

/** Lista de variantes de botones */
enum CDKButtonTypeEnum {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	TERTIARY = 'tertiary',
	LINK = 'link',
	NO_BACKGROUND = 'nobackground',
}
