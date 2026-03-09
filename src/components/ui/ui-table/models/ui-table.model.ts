export interface IUITableColumnDefs {
	/** Indica el id de la columna */
	colId?: string;
	/** Etiqueta del encabezado de la columna */
	headerName: string;
	/** Código del campo de la columna */
	field: string;
	/** Muestra si las filas són seleccionables */
	isSelectable?: boolean;
	/** Tipo de dato de la columna*/
	dataType?: IUITableDataType;
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
	/** Indica si quiero anular la ordenación de la columna por defecto */
	disableDefaultSort?: boolean;
	/** Indica el tamaño maximo de la columna */
	maxWidth?: number;
	/** Indica el tamaño minimo de la columna */
	minWidth?: number;
	/** Indica el tamaño inicial de la columna */
	width?: number;
	/** Indica si la columna se puede reajustar el ancho */
	resizable?: boolean;
	/** Personaliza la ordenación */
	comparator?: (a, b) => number;
}

export interface IUITableRowData {
	/** Identificador oculto para cada fila */
	hiddenId: string;
	/** Tipo de extensión */
	extensionType?: IUITableExtensionType;
	/** Valor del campo*/
	[key: string]: string | number;
}

export interface IUITableGridOptions {
	/** Definición de los encabezamientos de las columnas */
	columnDefs: IUITableColumnDefs[];
	/** Datos que irán en las filas */
	rowData: IUITableRowData[];
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
	rowSelection: IUITableSelectionType;
	/** Literales propios de la libreria */
	localeText: any;
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
	/** Evento lanzado cuando se cambiar el orden de la columna */
	onSortChanged?: any;
	/** Evento lanzado cuando se carga los primeros datos */
	onFirstDataRendered?: any;
	/** Evento lanzado cuando se actualiza los datos */
	onRowDataChanged?: any;
	/** Indica si la ordenación de las columnas distingue entre mayúsculas y minúsculas */
	accentedSort?: boolean;
}

export interface IUITableTopButtons {
	/** texto del boton */
	text: string;
	/** icono del boton */
	icon?: string;
	/** identificador del evento */
	eventId?: string;
	/** Opción de si el boton se muestra solo si hay algun elemento seleccionado evento */
	showIfAnySelectedOnly?: boolean;
	/** Opción de si el boton se oculta sòlo si hay algun elemento seleccionado evento */
	hiddenIfAnySelectedOnly?: boolean;
	/** Opción de si el boton se deshabilita si no hay elemntos seleccionados */
	disableIfNoneSelected?: boolean;
	/** Opción de exportar la tabla a un archivo descargable de csv */
	csvExport?: boolean;
	/** Opción de inhabilitar el boton */
	isDisabled?: boolean;
	/** Opción de aspecto link el boton */
	link?: boolean;
}

/** Enum para las opciones de tipo de selección */
export enum IUITableSelectionType {
	single = 'single',
	multiple = 'multiple',
}

/** Enum para las opciones de tipo de selección */
export enum IUITableDataType {
	text = 'text',
	number = 'number',
	date = 'date',
}

/** Enum para las opciones de tipo de selección */
export enum IUITableExtensionType {
	pdf = 'pdf',
}

/** Modelo para los literales del componente */
export interface IUITableLiterals {
	download?: string;
	downloadSelection?: string;
	total?: string;
	selected?: string;
	[key: string]: any;
	/** Literals for labels of ag-Grid library */
	localeText: {
		// Set Filter
		selectAll: string;
		selectAllSearchResults: string;
		searchOoo: string;
		blanks: string;
		noMatches: string;

		// Number Filter & Text Filter
		filterOoo: string;
		equals: string;
		notEqual: string;

		// Number Filter
		lessThan: string;
		greaterThan: string;
		lessThanOrEqual: string;
		greaterThanOrEqual: string;
		inRange: string;
		inRangeStart: string;
		inRangeEnd: string;

		// Text Filter
		contains: string;
		notContains: string;
		startsWith: string;
		endsWith: string;

		// Date Filter
		dateFormatOoo: string;

		// Filter Conditions
		andCondition: string;
		orCondition: string;

		// Filter Buttons
		applyFilter: string;
		resetFilter: string;
		clearFilter: string;
		cancelFilter: string;

		// Side Bar
		columns: string;
		filters: string;

		// columns tool panel
		pivotMode: string;
		groups: string;
		rowGroupColumnsEmptyMessage: string;
		values: string;
		valueColumnsEmptyMessage: string;
		pivots: string;
		pivotColumnsEmptyMessage: string;

		// Header of the Default Group Column
		group: string;

		// Other
		loadingOoo: string;
		noRowsToShow: string;
		enabled: string;

		// Menu
		pinColumn: string;
		pinLeft: string;
		pinRight: string;
		noPin: string;
		valueAggregation: string;
		autosizeThiscolumn: string;
		autosizeAllColumns: string;
		groupBy: string;
		ungroupBy: string;
		resetColumns: string;
		expandAll: string;
		collapseAll: string;
		copy: string;
		ctrlC: string;
		copyWithHeaders: string;
		paste: string;
		ctrlV: string;
		export: string;
		csvExport: string;
		excelExport: string;
		excelXmlExport: string;

		// Enterprise Menu Aggregation and Status Bar
		sum: string;
		min: string;
		max: string;
		none: string;
		count: string;
		avg: string;
		filteredRows: string;
		selectedRows: string;
		totalRows: string;
		totalAndFilteredRows: string;
		page: string;
		more: string;
		to: string;
		of: string;
		next: string;
		last: string;
		first: string;
		previous: string;

		// Enterprise Menu (Charts)
		pivotChartAndPivotMode: string;
		pivotChart: string;
		chartRange: string;

		columnChart: string;
		groupedColumn: string;
		stackedColumn: string;
		normalizedColumn: string;

		barChart: string;
		groupedBar: string;
		stackedBar: string;
		normalizedBar: string;

		pieChart: string;
		pie: string;
		doughnut: string;

		line: string;

		xyChart: string;
		scatter: string;
		bubble: string;

		areaChart: string;
		area: string;
		stackedArea: string;
		normalizedArea: string;

		histogramChart: string;

		// Charts
		pivotChartTitle: string;
		rangeChartTitle: string;
		settings: string;
		data: string;
		format: string;
		categories: string;
		defaultCategory: string;
		series: string;
		xyValues: string;
		paired: string;
		axis: string;
		navigator: string;
		color: string;
		thickness: string;
		xType: string;
		automatic: string;
		category: string;
		number: string;
		time: string;
		xRotation: string;
		yRotation: string;
		ticks: string;
		width: string;
		height: string;
		length: string;
		padding: string;
		spacing: string;
		chart: string;
		title: string;
		titlePlaceholder: string;
		background: string;
		font: string;
		top: string;
		right: string;
		bottom: string;
		left: string;
		labels: string;
		size: string;
		minSize: string;
		maxSize: string;
		legend: string;
		position: string;
		markerSize: string;
		markerStroke: string;
		markerPadding: string;
		itemSpacing: string;
		itemPaddingX: string;
		itemPaddingY: string;
		layoutHorizontalSpacing: string;
		layoutVerticalSpacing: string;
		strokeWidth: string;
		offset: string;
		offsets: string;
		tooltips: string;
		callout: string;
		markers: string;
		shadow: string;
		blur: string;
		xOffset: string;
		yOffset: string;
		lineWidth: string;
		normal: string;
		bold: string;
		italic: string;
		boldItalic: string;
		predefined: string;
		fillOpacity: string;
		strokeOpacity: string;
		histogramBinCount: string;
		columnGroup: string;
		barGroup: string;
		pieGroup: string;
		lineGroup: string;
		scatterGroup: string;
		areaGroup: string;
		histogramGroup: string;
		groupedColumnTooltip: string;
		stackedColumnTooltip: string;
		normalizedColumnTooltip: string;
		groupedBarTooltip: string;
		stackedBarTooltip: string;
		normalizedBarTooltip: string;
		pieTooltip: string;
		doughnutTooltip: string;
		lineTooltip: string;
		groupedAreaTooltip: string;
		stackedAreaTooltip: string;
		normalizedAreaTooltip: string;
		scatterTooltip: string;
		bubbleTooltip: string;
		histogramTooltip: string;
		noDataToChart: string;
		pivotChartRequiresPivotMode: string;
	};
}

export interface IUITableAvatars {
	/** Identificador del miembro al que pertenece el avatar */
	memberId: string;
	/** Enlace del avatar */
	imgSrc: string;
	/** Indica si el miembro es empleado */
	isEmployee: boolean;
}
