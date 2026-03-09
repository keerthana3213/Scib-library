export enum IBreadcrumbLevel {
	PRIMARY = 'primary',
	SECONDARY = 'secondary',
	DEFAULT = ''
}

export interface IBreadcrumb {
	name: string;
	tooltip: string;
}

export interface IBreadcrumbWithPosition extends IBreadcrumb {
	active: boolean;
	position: number;
}

export interface IBreadcrumbArray {
	breadcrumbArray: IBreadcrumb[];
}

export type IBreadcrumbs = IBreadcrumb[];
export type IBreadcrumbsWithPosition = IBreadcrumbWithPosition[];

/**
 * Interface para los literales personalizables del componente breadcrumb
 */
export interface IBreadcrumbLiterals {
	/**
	 * Etiqueta de accesibilidad para la navegación de breadcrumbs
	 * @default 'Navegación de migas de pan'
	 */
	ariaLabel?: string;

	/**
	 * Etiqueta de accesibilidad para el botón de retroceso/icono de inicio
	 * @default 'Volver'
	 */
	backButtonAriaLabel?: string;

	/**
	 * Etiqueta para la página actual en lectores de pantalla
	 * @default 'Página actual'
	 */
	currentPageLabel?: string;

	/**
	 * Título del icono de inicio (cuando icon="home" y level="secondary")
	 * @default 'Ir al inicio'
	 */
	homeIconTitle?: string;

	/**
	 * Título del icono de flecha atrás
	 * @default 'Volver'
	 */
	backIconTitle?: string;

	/**
	 * Texto para el tooltip de los puntos suspensivos
	 * @default 'Más navegación'
	 */
	ellipsisTooltip?: string;

	/**
	 * Etiqueta para el elemento de puntos suspensivos
	 * @default 'Más navegación'
	 */
	ellipsisLabel?: string;

	/**
	 * Texto para el elemento de la página de inicio predeterminado cuando no hay breadcrumbs
	 * @default 'Home'
	 */
	defaultHomeName?: string;

	/**
	 * Tooltip para el elemento de la página de inicio predeterminado
	 * @default 'Go to Home'
	 */
	defaultHomeTooltip?: string;

	/**
	 * Texto que acompaña al icono (home o chevron)
	 * @default '' (vacío, no muestra texto)
	 */
	backButtonText?: string;
}
