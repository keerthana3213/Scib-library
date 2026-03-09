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
	/** Añade una funcion para hacer el custom shorting */
	comparator?: (valueA?, valueB?, nodeA?, nodeB?, isInverted?) => number;
	/** Indica si quiero anular la ordenación de la columna por defecto */
	disableDefaultSort?: boolean;

	sortType?: string;
}

export enum UIISimpleTableDataType {
	text = 'text',
	number = 'number',
	date = 'date',
}

export interface UIISimpleTableRowData {
	/** Identificador oculto para cada fila */
	hiddenId: string;
	/** Valor del campo*/
	[key: string]: string | number;
}

export interface UIISimpleTableGridOptions {
	/** Definición de los encabezamientos de las columnas */
	columnDefs: UIISimpleTableColumnDefs[];
	/** Datos que irán en las filas */
	rowData: UIISimpleTableRowData[];
	/** Definición de los atributos por defecto*/
	defaultColDef: {
		/** Opción de si las filas son ordenables por campo */
		sortable: boolean;
		/** Opción de si se puede modificar el ancho de las columnas */
		resizable: boolean;
		/** Opción de si se puede filtrar por campo */
		filter: boolean;
		/** Opción de si las columnas son movibles */
		lockPosition: boolean;
		/** Opción de si los campos son editables */
		editable: boolean;
	};
	/** Opción para mostrar siempre el icono de ordenación */
	unSortIcon: boolean;
	/** Opción de cambiar el layout de la tabla*/
	domLayout: string;
	/** Opción de si se elimina la barra de scroll lateral*/
	suppressHorizontalScroll: boolean;
	/** Opción de no permitir quitar columnas cuando se arrastran fuera */
	suppressDragLeaveHidesColumns: boolean;
	/** Opción de no permitir seleccionar con un click en la fila */
	suppressRowClickSelection: boolean;
	/** Opción de paginación */
	pagination: boolean;
	/** Número de elementos por página */
	paginationPageSize?: number;
	/** Tipo de selección para las filas*/
	rowSelection?: UIISimpleTableSelectionType;
	/** Literales propios de la libreria */
	localeText?: any;
	/** API de la libreria ag-grid para usar metodos propios */
	api?: any;
	/** API de las columnas de la libreria ag-grid para usar metodos propios */
	columnApi?: any;
	/** API de la libreria ag-grid para usar metodos propios */
	icons?: any;
	/** Evento lanzado cuando hay cambio en las filas seleccionadas */
	onSelectionChanged?: any;
	/** Evento lanzado cuando se ahce click en una fila */
	onRowClicked?: any;
	/** Evento lanzado cuando se carga los primeros datos */
	onFirstDataRendered?: any;
	headerHeight?: number;
}

export enum UIISimpleTableSelectionType {
	single = 'single',
	multiple = 'multiple',
}

export enum UIISimpleTableSortType {
	date = 'date',
	milis = 'milis',
	currency = 'currency',
}
