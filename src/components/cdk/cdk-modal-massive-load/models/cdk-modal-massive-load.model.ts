import { ICDKModelFormData } from '../../cdk-modal-form/models/cdk-modal-form.model';

export interface ICDKModelMassiveLoadData extends ICDKModelFormData {
	title?: string;
	showIsRequired?: boolean;
	buttonList?: ICDKButton[];
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
export interface ICDKModalMassiveLoadLiterals {
	title: string;
	legend: string;
	message: string;
	selectOrDrag: string;
	showIsRequired: boolean;
	isRequiredLabel: string;
	close: keyTxtLiteral;
	downloadcsv: keyTxtLiteral;
	buttonList: Array<keyTxtLiteral>;
	loadingImgSrc: string;
	fileSelector: {
		titleselector: string;
		titleselectorMobile: string;
		errorMaxFiles: string;
		errorFormat: string;
		fileSelectedText: string;
	};
	notification: {
		label: string;
		formName: string;
		placeholder: string;
		subMessaje: string;
	};
}

interface keyTxtLiteral {
	eventName: string;
	text: string;
	type: CDKButtonTypeEnum;
	disabledIfRequired?: boolean;
	iconName?: string;
}

/** Lista de variantes de botones */
enum CDKButtonTypeEnum {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	TERTIARY = 'tertiary',
	LINK = 'link',
	NO_BACKGROUND = 'nobackground',
}
