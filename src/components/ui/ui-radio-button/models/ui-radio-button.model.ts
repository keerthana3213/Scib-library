export interface IURadioButtonOptions {
	groupName: string;
	options: IURadioButton[];
}

export interface IURadioButton {
	/** ID de la tab */
	id: string;
	/** Texto que se mostrará en la pestaña de la tab */
	label: string;
	/** Valor del input */
	value: string;
	/** Si debe estar activo */
	isChecked?: boolean;
	/** Texto para la descripción de la card */
	description?: string;
	/** Texto para la descripción de la card */
	list?: string[];
	/** Si debe estar deshabilitado */
	disabled?: boolean;
	/** Texto secundario para el label */
	subLabel?: string;
	/** Identifica si la row esta marcada como predefinida */
	isPredefined?: boolean;
	/** Permite mostrar la opción de que se pueda predefinir o no */
	dontShowIsPredefined?: boolean;
}

export interface ICDKActionMenu {
	hover: boolean;
	options: {
		id: number;
		text: string;
		separator: boolean;
		icon?: string;
		eventId: string;
	}[];
}
