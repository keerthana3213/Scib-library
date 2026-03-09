export interface ILiterals {
	[key: string]: any;
}

export interface UIISimpleTableDefaultColumnDefs {
	flex?: number;
}

export interface UIISimpleTableColumnDefs {
	/** Indica el id de la columna */
	colId?: string;
	/** Etiqueta del encabezado de la columna */
	headerName: string;
	/** Código del campo de la columna */
	field: string;
	/** Muestra si las filas són seleccionables */
	isSelectable?: boolean;
	/** Tipo de dato de la columna*/
	dataType?: UIISimpleTableDataType;
	/** Tipo de dato de la columna para el filtro*/
	filter?: string | boolean;
	/** Renderiza los iconos de los archivos */
	iconRenderer?: boolean;
	/** campo para plantilla de rendering del header */
	headerComponentParams?: any;
	/** Opción de celda para renderizar el contenido */
	cellRenderer?: any;
	/** Columna oculta */
	hide?: boolean;
	/** Muestra el checkbox para cuando son seleccionables */
	checkboxSelection?: boolean;
	/** Muestra el checkbox en el header para cuando son seleccionables */
	headerCheckboxSelection?: boolean;
	/** impossibilita mover la columna y queda fija */
	lockPosition: boolean;
	/** Indica si la columna se puede ordenar */
	sortable?: boolean;
	/** Indica el tamaño maximo de la columna */
	maxWidth?: number;
	/** Indica el tamaño minimo de la columna */
	minWidth?: number;
	/** Indica el tamaño inicial de la columna */
	width?: number;
	/** Indica si la columna se puede reajustar el ancho */
	resizable?: boolean;
}

export enum UIISimpleTableDataType {
	text = 'text',
	number = 'number',
	date = 'date',
}
