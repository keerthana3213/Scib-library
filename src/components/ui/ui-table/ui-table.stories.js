import { getStoryConfig, parseBoolean, parseNumber, parseObject, render } from '@storybook/utils';
import agGridLiterals from './literals/ag-grid.js';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Table',
	...getStoryConfig('scib-ui-table', {status: 'deprecated'}),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-table
		show-skeleton='${parseBoolean(args.showSkeleton)}'
		table-id='${args.tableId}'
		column-defs='${parseObject(args.columnDefs)}'
		row-data='${parseObject(args.rowData)}'
		top-buttons='${parseObject(args.topButtons)}'
		element-name='${args.elementName}'
		is-editable='${parseBoolean(args.isEditable)}'
		is-selectable='${parseBoolean(args.isSelectable)}'
		has-rendered-icons='${parseBoolean(args.hasRenderedIcons)}'
		is-draggable='${parseBoolean(args.isDraggable)}'
		is-downloadable='${parseBoolean(args.isDownloadable)}'
		pagination-page-size='${parseNumber(args.paginationPageSize)}'
		literals='${parseObject(args.literals)}'
	></scib-ui-table>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	tableId: 'table-id',
	literals: {
		download: 'Download',
		downloadSelection: 'Download Selection',
		total: 'Total',
		selected: 'Selected',
		localeText: agGridLiterals,
	},
	columnDefs: [
		{
			headerName: 'Nombre Petición',
			field: 'nombre',
		},
		{
			headerName: 'Dominio',
			field: 'dominio',
		},
		{ headerName: 'Fecha Solicitud', field: 'fecha', dataType: 'date', disableDefaultSort: true},
		{ headerName: 'Candidatos', field: 'candidatos', filter: 'number' },
		{ headerName: 'Acciones', field: 'actions' },
	],
	rowData: [
		{
			hiddenId: 'contratoMcDonalds',
			extensionType: 'xls',
			nombre: 'InGen',
			dominio: 'SBGM',
			fecha: '18/11/2019',
			candidatos: 0,
			actions: {
                icon: 'icon-download',
                event: 'downloadOnefile',
                actionName: 'Download'
            }
		},
		{
			hiddenId: '002',
			extensionType: 'pdf',
			nombre: 'Petición Appian',
			dominio: 'SBGM',
			fecha: '16/11/2019',
			candidatos: 1,
			actions: {
                icon: 'icon-download',
                event: 'downloadOnefile',
                actionName: 'Download',
				disabled: true
            }
		},
		{
			hiddenId: '003',
			extensionType: 'pdf',
			nombre: 'Petición BLUES',
			dominio: 'SBGM',
			fecha: '18/11/2019',
			candidatos: 0,
			actions: [
				{
					icon: 'icon-download',
					event: 'downloadOnefile',
					actionName: 'Download',
					disabled: true
				},
				{
					icon: 'icon-add_files',
					event: 'addfile',
					actionName: 'add file',
					disabled: false
				}
			]
		},
		{
			hiddenId: '004',
			extensionType: '',
			nombre: 'Petición Appian',
			dominio: 'SBGM',
			fecha: '16/11/2019',
			candidatos: 1,
			actions: {
                icon: 'icon-download',
                event: 'downloadOnefile',
                actionName: 'Download'
            }
		},
		{
			hiddenId: '005',
			extensionType: 'pdf',
			nombre: 'Digital Platform',
			dominio: 'SBGM',
			fecha: '30/11/2019',
			candidatos: 2,
			actions: {
                icon: 'icon-download',
                event: 'downloadOnefile',
                actionName: 'Download'
            }
		},
	],
	topButtons: [
		{
			text: 'Download',
			icon: 'icon-download',
			eventId: 'downloadMessageFiles',
			showIfAnySelectedOnly: true,
			link: true,
		},
		{
			text: 'Test',
			icon: 'icon-download',
			eventId: 'downloadMessageFiles',
			showIfAnySelectedOnly: false,
			hiddenIfAnySelectedOnly: true,
			link: true,
		},
		{
			text: 'Export table as CSV',
			icon: 'icon-download',
			eventId: 'hello Test',
			csvExport: true,
			showIfAnySelectedOnly: false,
			link: true,
		},
	],
	elementName: 'elemento(s)',
	isEditable: true,
	isSelectable: true,
	hasRenderedIcons: true,
	isDraggable: true,
	isDownloadable: true,
	paginationPageSize: 3,
	// Add default values here
};


/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const TemplateLateralScroll = (args) => render(args, `
	<scib-ui-card disable-hover="true">
		<scib-ui-table
			show-skeleton='${parseBoolean(args.showSkeleton)}'
			table-id='${args.tableId}'
			detail-header='${args.detailHeader}'
			column-defs='${parseObject(args.columnDefs)}'
			row-data='${parseObject(args.rowData)}'
			top-buttons='${parseObject(args.topButtons)}'
			element-name='${args.elementName}'
			is-editable='${parseBoolean(args.isEditable)}'
			is-selectable='${parseBoolean(args.isSelectable)}'
			has-rendered-icons='${parseBoolean(args.hasRenderedIcons)}'
			is-draggable='${parseBoolean(args.isDraggable)}'
			is-downloadable='${parseBoolean(args.isDownloadable)}'
			activate-horizontal-scroll='${parseNumber(args.activateHorizontalScroll)}'
			pagination-page-size='${parseNumber(args.paginationPageSize)}'
			literals='${parseObject(args.literals)}'
		></scib-ui-table>
	</scib-ui-card>
`);

// Lateral scroll Story
export const LateralScroll = TemplateLateralScroll.bind();
LateralScroll.args = {
	tableId: 'table-id',
	literals: {
		download: 'Download',
		downloadSelection: 'Download Selection',
		total: 'Total',
		selected: 'Selected',
		localeText: agGridLiterals,
	},
	columnDefs: [
		{
			headerName: 'Booking Unit',
			field: 'booking',
		},
		{
			headerName: 'Producto',
			field: 'product',
		},
		{
			headerName: 'Identificador BO',
			field: 'identifier',
		},
		{
			headerName: 'Counterparty Desc.',
			field: 'descCounterparty',
		},
		{
			headerName: 'GLCS',
			field: 'glcs',
		},
		{
			headerName: 'Counterparty to negotiatie',
			field: 'negCounterparty',
		},
		{
			headerName: 'Trade Date',
			field: 'tradeDate',
			filter: 'date',
		},
		{
			headerName: 'Maturity Date',
			field: 'maturityDate',
			filter: 'date',
		},
		{
			headerName: 'Divisa (Asset)',
			field: 'divisaAsset',
		},
		{
			headerName: 'Divisa (Liab)',
			field: 'divisaLiab',
		},
		{
			headerName: 'Indice (Asset)',
			field: 'indexAsset',
			filter: 'number',
		},
		{
			headerName: 'Indice (Liab)',
			field: 'indexLiab',
			filter: 'number',
		},
		{
			headerName: 'Indice (Total)',
			field: 'indexTotal',
			filter: 'number',
		},
		{
			headerName: 'Situ Legal',
			field: 'situ',
		},
		{
			headerName: 'Master Agreement REF',
			field: 'masterAgreement',
		},
		{
			headerName: 'Collateral Agreement REF',
			field: 'collateralAgreement',
		},
	],
	rowData: [
		{
			hiddenId: '000',
			detail: 2,
			booking: 'contrato 01',
			product: 'pdf',
			identifier: 'InGen',
			descCounterparty: 'SBGM',
			glcs: 0,
			negCounterparty: 'icono',
			tradeDate: '18/11/2019',
			maturityDate: '12/03/2020',
			divisaAsset: 'something',
			divisaLiab: 'divisaLiab',
			indexAsset: 'indexAsset',
			indexLiab: 'something',
			indexTotal: 'something',
			situ: 'something',
			masterAgreement: 'something',
			collateralAgreement: 'something',
		},
		{
			hiddenId: '001',
			detail: 5,
			booking: 'contrato 02',
			product: 'pdf',
			identifier: 'InGen',
			descCounterparty: 'SBGM',
			glcs: 0,
			negCounterparty: 'icono',
			tradeDate: '18/11/2019',
			maturityDate: '12/03/2020',
			divisaAsset: 'something',
			divisaLiab: 'divisaLiab',
			indexAsset: 'indexAsset',
			indexLiab: 'something',
			indexTotal: 'something',
			situ: 'something',
			masterAgreement: 'something',
			collateralAgreement: 'something',
		},
		{
			hiddenId: '002',
			detail: 3,
			booking: 'contrato 03',
			product: 'pdf',
			identifier: 'InGen',
			descCounterparty: 'SBGM',
			glcs: 0,
			negCounterparty: 'icono',
			tradeDate: '18/11/2019',
			maturityDate: '12/03/2020',
			divisaAsset: 'something',
			divisaLiab: 'divisaLiab',
			indexAsset: 'indexAsset',
			indexLiab: 'something',
			indexTotal: 'something',
			situ: 'something',
			masterAgreement: 'something',
			collateralAgreement: 'something',
		},
	],
	topButtons: [
		{
			text: 'Assign group',
			icon: 'icon-size_refresh',
			eventId: 'hello Test',
			showIfAnySelectedOnly: false,
			link: false,
			disableIfNoneSelected: true,
			isDisabled: false,
		},
		{
			text: 'Download Selected',
			icon: 'icon-download',
			eventId: 'downloadMessageFiles',
			showIfAnySelectedOnly: true,
			link: true,
		},
		{
			text: 'Download All',
			icon: 'icon-download',
			eventId: 'downloadMessageFiles',
			showIfAnySelectedOnly: false,
			hiddenIfAnySelectedOnly: true,
			link: true,
		},
	],
	detailHeader: 'Contratos',
	elementName: 'elemento(s)',
	isSelectable: true,
	hasRenderedIcons: true,
	activateHorizontalScroll: -1,
	isDraggable: true,
	isDownloadable: true,
	paginationPageSize: 10,
	// Add default values here
};


/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const TemplateAvatars = (args) => render(args, `
	<scib-ui-card disable-hover="true">
		<scib-ui-table
			show-skeleton='${parseBoolean(args.showSkeleton)}'
			table-id='${args.tableId}'
			column-defs='${parseObject(args.columnDefs)}'
			avatars='${parseObject(args.avatars)}'
			row-data='${parseObject(args.rowData)}'
			element-name='${args.elementName}'
			top-buttons='${parseObject(args.topButtons)}'
			is-editable='${parseBoolean(args.isEditable)}'
			is-selectable='${parseBoolean(args.isSelectable)}'
			has-rendered-icons='${parseBoolean(args.hasRenderedIcons)}'
			is-draggable='${parseBoolean(args.isDraggable)}'
			is-downloadable='${parseBoolean(args.isDownloadable)}'
			pagination-page-size='${parseNumber(args.paginationPageSize)}'
			literals='${parseObject(args.literals)}'
		></scib-ui-table>
	</scib-ui-card>
`);

// Lateral scroll Story
export const Avatars = TemplateAvatars.bind();
Avatars.args = {
	tableId: 'table-id',
	literals: {
		download: 'Download',
		downloadSelection: 'Download Selection',
		total: 'Total',
		selected: 'Selected',
		localeText: agGridLiterals,
	},
	columnDefs: [
		{
			headerName: 'Nombre',
			field: 'nombre',
		},
		{
			headerName: 'Inclusion date',
			field: 'date', filter: 'date',
		},
		{ headerName: 'Role', field: 'role' },
		{ headerName: 'Company', field: 'company' },
	],
	rowData: [
		{
			hiddenId: '1234',
			nombre: 'Juan Ejemplo',
			date: '18/11/2019',
			role: 'Administrator',
			company: 'Repsol',
		},
		{
			hiddenId: '1235',
			nombre: 'Juan Ejemplo',
			date: '18/11/2019',
			role: 'Administrator',
			company: 'Repsol',
		},
		{
			hiddenId: '1236',
			nombre: 'Juan Ejemplo',
			date: '18/11/2019',
			role: 'Administrator',
			company: 'Repsol',
		},
		{
			hiddenId: '1237',
			nombre: 'Juan Ejemplo',
			date: '18/11/2019',
			role: 'Administrator',
			company: 'Repsol',
		},
	],
	avatars: [
		{
			'isEmployee': true,
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'memberId': '1234',
		},
		{
			'isEmployee': false,
			'imgSrc': '',
			'memberId': '1235',
		},
		{
			'isEmployee': false,
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'memberId': '1236',
		},
		{
			'isEmployee': true,
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'memberId': '1237',
		},
	],
	topButtons: [],
	elementName: 'elemento(s)',
	isEditable: true,
	isDraggable: true,
	paginationPageSize: 10,
	// Add default values here
};



/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const TemplateTableAdmin = (args) => render(args, `
 <scib-ui-card disable-hover="true">
	 <scib-ui-table
		 table-id='${args.tableId}'
		 column-defs='${parseObject(args.columnDefs)}'
		 avatars='${parseObject(args.avatars)}'
		 row-data='${parseObject(args.rowData)}'
		 literals='${parseObject(args.literals)}'
		 pagination-page-size='10'
	 ></scib-ui-table>
 </scib-ui-card>
`);

// Admin table
export const TableAdmin = TemplateTableAdmin.bind();
TableAdmin.args = {
	tableId: 'table-id',
	literals: {"total":"Total","localeText":{"selectAll":"Seleccionar todo","selectAllSearchResults":"Selecciona todos los resultados de la búsqueda","searchOoo":"Buscar...","blanks":"Blancos","noMatches":"Sin coincidencias","filterOoo":"Filtrar...","equals":"Igual","notEqual":"No igual","lessThan":"Menor que","greaterThan":"Mayor que","lessThanOrEqual":"Menor o igual que","greaterThanOrEqual":"Mayor o igual que","inRange":"En rango","inRangeStart":"a","inRangeEnd":"de","contains":"Contiene","notContains":"No contiene","startsWith":"Comienza con","endsWith":"Termina con","dateFormatOoo":"Yyyy-mm-dd","andCondition":"y","orCondition":"o","applyFilter":"Aplicar","resetFilter":"Resetear","clearFilter":"Limpiar","cancelFilter":"Cancelar","columns":"Colummnas","filters":"Filtros","pivotMode":"Modo pivot","groups":"Grupos de fila","rowGroupColumnsEmptyMessage":"Arrastra aquí para establecer grupos de filas","values":"Valores","valueColumnsEmptyMessage":"Arrastre aquí para agregar","pivots":"Etiquetas de columna","pivotColumnsEmptyMessage":"Arrastre aquí para establecer las etiquetas de las columnas","group":"Grupo","loadingOoo":"Cargando...","noRowsToShow":" ","enabled":"Habilitado","pinColumn":"Colummna Pin","pinLeft":"Pin izquierdo","pinRight":"Pin derecho","noPin":"Sin Pin","valueAggregation":"Valor agregado","autosizeThiscolumn":"Autoredimension de columna","autosizeAllColumns":"Autoredimensionar todas las columnas","groupBy":"Grupo por","ungroupBy":"Desagrupar por","resetColumns":"Reiniciar coluumnas","expandAll":"Expandir todo","collapseAll":"Cerrar todo","copy":"Copiar","ctrlC":"Ctrl+C","copyWithHeaders":"Copiar con cabeceras","paste":"Pegar","ctrlV":"Ctrl+V","export":"Exportar","csvExport":"Exportar CSV","excelExport":"Exportar Excel (.xlsx)","excelXmlExport":"Exportar Excel (.xml)","sum":"Sum","min":"Min","max":"Max","none":"Ninguno","count":"Cuenta","avg":"Promedio","filteredRows":"Filtrado","selectedRows":"Seleccionado","totalRows":"Columnas totales","totalAndFilteredRows":"Filas","page":"Página","more":"Más","to":"hacia","of":"de","next":"Siguiente","last":"Último","first":"Primero","previous":"Anterior","pivotChartAndPivotMode":"Gráfica y modo Pivot","pivotChart":"Gráfica Pivot","chartRange":"Rango de gráfica","columnChart":"Columna","groupedColumn":"Agrupado","stackedColumn":"Apilado","normalizedColumn":"100% apilado","barChart":"Barra","groupedBar":"Agrupado","stackedBar":"Apilado","normalizedBar":"100% apilado","pieChart":"Tarta","pie":"Tarta","doughnut":"Donut","line":"Línea","xyChart":"X Y (Dispersión)","scatter":"Dispersión","bubble":"Burbuja","areaChart":"Área","area":"Área","stackedArea":"Apilado","normalizedArea":"100% apilado","histogramChart":"Histograma","pivotChartTitle":"Gráfica Pivot","rangeChartTitle":"Rango de gráfica","settings":"Ajustes","data":"Datos","format":"Formato","categories":"Categorías","defaultCategory":"(Ninguna)","series":"Series","xyValues":"Valores x y","paired":"Modo de emparejamiento","axis":"Eje","navigator":"Navegador","color":"Color","thickness":"Grosor","xType":"Tipo x","automatic":"Automático","category":"Categoría","number":"Número","time":"Tiempo","xRotation":"Rotación x","yRotation":"Rotación y","ticks":"Ticks???????","width":"Ancho","height":"Alto","length":"Largo","padding":"Padding","spacing":"Espacio","chart":"Gráfica","title":"Título","titlePlaceholder":"Títulod e la g´rafica - doble click para editar","background":"Fondo","font":"Fuente","top":"Arriba","right":"Derecha","bottom":"Abajo","left":"Izquierda","labels":"Etiquetas","size":"Tamaño","minSize":"Tamaño mínimo","maxSize":"Tamaño máximo","legend":"Leyenda","position":"Posición","markerSize":"Marcador de tamaño","markerStroke":"Marcador de forma","markerPadding":"Marcador de padding","itemSpacing":"Espacio entre elementos","itemPaddingX":"Padding X","itemPaddingY":"Padding Y","layoutHorizontalSpacing":"Espacio horizontal","layoutVerticalSpacing":"Espacio vertical","strokeWidth":"Ancho de la forma","offset":"Offset","offsets":"Offsets","tooltips":"Información de herramientas","callout":"Llamada","markers":"Marcadores","shadow":"Sombra","blur":"Blur","xOffset":"X Offset","yOffset":"Y Offset","lineWidth":"Ancho de línea","normal":"Normal","bold":"Negrita","italic":"Itálica","boldItalic":"Negrita itálica","predefined":"Predefinido","fillOpacity":"Opacidad de relleno","strokeOpacity":"Opacidad de línea","histogramBinCount":"Contador bin","columnGroup":"Columna","barGroup":"Barra","pieGroup":"Pie","lineGroup":"Line","scatterGroup":"X Y (Scatter)","areaGroup":"Area","histogramGroup":"Histogram","groupedColumnTooltip":"Grouped","stackedColumnTooltip":"Stacked","normalizedColumnTooltip":"100% Stacked","groupedBarTooltip":"Grouped","stackedBarTooltip":"Stacked","normalizedBarTooltip":"100% Stacked","pieTooltip":"Pie","doughnutTooltip":"Doughnut","lineTooltip":"Line","groupedAreaTooltip":"Area","stackedAreaTooltip":"Stacked","normalizedAreaTooltip":"100% Stacked","scatterTooltip":"Scatter","bubbleTooltip":"Bubble","histogramTooltip":"Histogram","noDataToChart":"No data available to be charted.","pivotChartRequiresPivotMode":"Gráfico Pivot requiere Modo Pivot habilitado."}},
	columnDefs: [
        {
            "headerName": "USUARIO",
            "field": "fullName"
        },
        {
            "headerName": " E-MAIL",
            "field": "client_identifier"
        },
        {
            "headerName": "ROL",
            "field": "rol"
        },
        {
            "headerName": "GRUPO FINANCIERO",
            "field": "company"
        },
        {
            "headerName": "ENTIDAD",
            "field": "subsidiary"
        },
        {
            "headerName": "ÚLTIMA CONEXIÓN",
            "field": "last_connection"
        },
        {
            "headerName": "FECHA DE CREACIÓN",
            "field": "created_on"
        }
    ],
	rowData: [
		{
			"id": 1207,
			"role": "AT",
			"client_identifier": "alejandro.ibanez.peiro@everis.com",
			"created_on": "2020/01/23",
			"modified_on": "2021/02/09",
			"state": "A",
			"language": "es-ES",
			"subsidiary_id": 396,
			"provider_id": null,
			"state_reason": null,
			"avatar": null,
			"application": "SCIBDP",
			"num_login_err": 0,
			"num_profile_changes": 0,
			"ldap_uid": "RJIWsx9U",
			"email": null,
			"name": "Blanca",
			"surname": "Ros",
			"last_connection": "2021/03/01",
			"last_password_change": "2021-02-25T17:19:46",
			"fullName": "Blanca Ros",
			"hiddenId": 1207,
			"blank": "-",
			"subsidiary": "JP MORGAN CHASE BANK NATIONAL ASSOCIATION LONDON",
			"company": "JP MORGAN CHASE",
			"rol": "Admin Tesorero",
			"permission": true,
			"permissionEdit": true
		},
		{
			"id": 1298,
			"role": "AT",
			"client_identifier": "santiago.fernando.ojeda.botan@everis.com",
			"created_on": "2020/03/25",
			"modified_on": "2020/12/15",
			"state": "A",
			"language": "es-ES",
			"subsidiary_id": 5503,
			"provider_id": null,
			"state_reason": null,
			"avatar": "undefined",
			"application": "SCIBDP",
			"num_login_err": 0,
			"num_profile_changes": 0,
			"ldap_uid": "J9B9Ci0V",
			"email": "undefined",
			"name": "Santiago",
			"surname": "Fernando",
			"last_connection": "2021/02/22",
			"last_password_change": "2020-12-15T22:58:52",
			"fullName": "Santiago Fernando",
			"hiddenId": 1298,
			"blank": "-",
			"subsidiary": "BANCO SANTANDER MEXICO S.A. INSTITUCION DE BANCA MULTIPLE GRUPO FINANC",
			"company": "BANCO SANTANDER",
			"rol": "Admin Tesorero",
			"permission": true,
			"permissionEdit": true
		},
		{
			"id": 1395,
			"role": "T",
			"client_identifier": "asdfqwer@everis.com",
			"created_on": "2020/11/24",
			"modified_on": "2020/11/24",
			"state": "A",
			"language": "es-ES",
			"subsidiary_id": 3724,
			"provider_id": null,
			"state_reason": null,
			"avatar": null,
			"application": "SCIBDP",
			"num_login_err": 0,
			"num_profile_changes": 0,
			"ldap_uid": "fl5nvWU6",
			"email": "asdfqwer@everis.com",
			"name": "",
			"surname": "",
			"last_connection": "NaN/NaN/NaN",
			"last_password_change": "",
			"fullName": " ",
			"hiddenId": 1395,
			"blank": "-",
			"subsidiary": "EVERIS",
			"company": "EVERIS",
			"rol": "Tesorero",
			"permission": true,
			"permissionEdit": true
		},
		{
			"id": 1477,
			"role": "T",
			"client_identifier": "joseluis_925@hotmail.com",
			"created_on": "2021/01/08",
			"modified_on": "2021/01/08",
			"state": "A",
			"language": "es-ES",
			"subsidiary_id": 3727,
			"provider_id": null,
			"state_reason": null,
			"avatar": "",
			"application": "SCIBDP",
			"num_login_err": 0,
			"num_profile_changes": 0,
			"ldap_uid": "r5pR5I2j",
			"email": "joseluis_925@hotmail.com",
			"name": "",
			"surname": "",
			"last_connection": "NaN/NaN/NaN",
			"last_password_change": "",
			"fullName": " ",
			"hiddenId": 1477,
			"blank": "-",
			"subsidiary": "EVERIS SPAIN S.L.",
			"company": "EVERIS",
			"rol": "Tesorero",
			"permission": true,
			"permissionEdit": true
		},
		{
			"id": 1595,
			"role": "T",
			"client_identifier": "popoquequeque@everis.com",
			"created_on": "2021/03/08",
			"modified_on": "2021/03/08",
			"state": "UP",
			"language": "es-ES",
			"subsidiary_id": 1042,
			"provider_id": null,
			"state_reason": null,
			"avatar": null,
			"application": "SCIBDP",
			"num_login_err": 0,
			"num_profile_changes": 0,
			"ldap_uid": "kZCsY62c",
			"email": "popoquequeque@everis.com",
			"name": "popo",
			"surname": "popo",
			"last_connection": "2021/03/08",
			"last_password_change": "2021-03-08T14:37:45",
			"fullName": "popo popo",
			"hiddenId": 1595,
			"blank": "-",
			"subsidiary": "BARCLAYS BANK PLC",
			"company": "BARCLAYS",
			"rol": "Tesorero",
			"permission": true,
			"permissionEdit": true
		},
	],
	avatars: [
		{
			'isEmployee': false,
			'imgSrc': "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png", // url válida
			'memberId': 1207,
		},
		{
			'isEmployee': false,
			'imgSrc': "",
			'memberId': 1298,
		},
		{
			'isEmployee': false,
			'imgSrc': "https://outpostrecruditment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png", // url errónea
			'memberId': 1395,
		},
		{
			'isEmployee': true,
			'imgSrc': 'lerele',
			'memberId': 1477,
		},
		{
			'isEmployee': false,
			'imgSrc': "",
			'memberId': 1595,
		},
	],
	topButtons: [],
	elementName: 'elemento(s)',
	isEditable: true,
	isDraggable: true,
	paginationPageSize: 10,
	argTypes: { onSortDate: { action: 'onSortDate' } },
	// Add default values here
};
