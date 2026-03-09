export interface IUITab {
	/** ID de la tab */
	id: string;
	/** Texto que se mostrará en la pestaña de la tab */
	label: string;
	/** Indica el icono de la pestaña de la tab */
	icon?: string;
	/** Indica la posición left o right para el icono */
	iconPosition?: string;
	/** Indica si se quiere ocultar el texto de la tab */
	hideText?: boolean;
	/** Indica si el tab está deshabilitado */
	disabled?: boolean;
}
