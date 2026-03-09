# Documentación del Componente Optimized Data Table

## Descripción General

El componente Optimized Data Table es una potente tabla de datos diseñada para mostrar y manipular información tabular de manera eficiente. Proporciona amplias funcionalidades para ordenación, filtrado, paginación y personalización, manteniendo un rendimiento óptimo incluso con grandes volúmenes de datos.

## Índice

1. [Configuración Básica](#configuración-básica)
2. [Tipos de Control de Datos](#tipos-de-control-de-datos)
3. [Tamaños de Fila](#tamaños-de-fila)
4. [Gestión de Vistas](#gestión-de-vistas)
5. [Filtrado](#filtrado)
6. [Columnas Congeladas](#columnas-congeladas)
7. [Formateadores](#formateadores)
    - [Status (Estado)](#status-estado)
    - [Status Dot (Punto de Estado)](#status-dot-punto-de-estado)
    - [Action Link (Enlace de Acción)](#action-link-enlace-de-acción)
    - [Traffic Lights (Semáforos)](#traffic-lights-semáforos)
    - [Inline Status (Estado en Línea)](#inline-status-estado-en-línea)
    - [Uppercase (Mayúsculas)](#uppercase-mayúsculas)
    - [Bold (Negrita)](#bold-negrita)
    - [Editor](#editor)
    - [Color Icon (Icono a Color)](#color-icon-icono-a-color)
    - [Text Icon (Texto con Icono)](#text-icon-texto-con-icono)
    - [Image (Imagen)](#image-imagen)
    - [Extension File (Archivo de Extensión)](#extension-file-archivo-de-extensión)
    - [Raw Value (Valor Bruto)](#raw-value-valor-bruto)
    - [Date Range (Rango de Fechas)](#date-range-rango-de-fechas)
    - [Tooltip](#tooltip)
    - [Set Custom Formatters (Establecer Formateadores Personalizados)](#set-custom-formatters-establecer-formateadores-personalizados)
    - [Action Table (Tabla de Acciones)](#action-table-tabla-de-acciones)
    - [Default Cells (Celdas Predeterminadas)](#default-cells-celdas-predeterminadas)
    - [Radio Button (Botón de Radio)](#radio-button-botón-de-radio)
    - [Checkbox (Casilla de Verificación)](#checkbox-casilla-de-verificación)
8. [Formateadores de Filtros de Encabezado](#formateadores-de-filtros-de-encabezado)
    - [Text Field Header Filter](#text-field-header-filter)
    - [Boolean Header Filter](#boolean-header-filter)
    - [Date Range Header Filter](#date-range-header-filter)
    - [Number Range Header Filter](#number-range-header-filter)
    - [Dropdown Header Filter](#dropdown-header-filter)
    - [Custom Between Filter](#custom-between-filter)
9. [Formateadores de Encabezados](#formateadores-de-encabezados)
    - [Action Menu Header](#action-menu-header)
    - [Show Detail Header](#show-detail-header)
    - [Show Info Header](#show-info-header)
    - [Checkbox Header](#checkbox-header)
    - [Filter Manager Header](#filter-manager-header)
    - [Tooltip Header](#tooltip-header)
    - [Action Table Header](#action-table-header)
10. [Eventos](#eventos)
11. [Paginación](#paginación)
12. [Integración de Analytics](#integración-de-analytics)
13. [Funcionalidades Adicionales](#funcionalidades-adicionales)
    - [Referencias](#referencias)
    - [Altura del Contenido de la Tabla](#altura-del-contenido-de-la-tabla)
    - [Ordenación](#ordenación)
    - [Control de Columnas](#control-de-columnas)
    - [Selección de Filas](#selección-de-filas)
    - [Columnas Totalizadoras](#columnas-totalizadoras)

## Configuración Básica

El componente se puede configurar con varias propiedades:

```tsx
<scib-organisms-optimized-data-table
  name="Securizaciones"
  manageFunctionalities='{"showManageViews":true,"showFilters":true,"showRowsize":true,"showPaginator":true}'
  controlManager="local"
  analytics='{"label01":"ui_kit","eventCategory":"ui_kit"}'
  literals='{"favouriteCheckbox":"Establecer como vista favorita",...}'
  config='{"paginationSizeSelector":[10,20,30],...}'
  columns='[...]'
  rowData='[...]'
  loading={false}
  rowsize="medium"
>
  <div slot="header-actions">
    <!-- Contenido de las acciones del encabezado -->
  </div>
</scib-organisms-optimized-data-table>
```

### Configuración por Defecto

```javascript
const defaultConfig = {
	responsiveLayoutCollapseUseFormatters: false,
	responsiveLayoutCollapseStartOpen: false,
	layoutColumnsOnNewData: true,
	debugInitialization: false,
	resizableColumnFit: true,
	responsiveLayout: false,
	movableColumns: false,
	layout: 'fitColumns',
	variant: 'optimized',
	maxHeight: '100%',
	pagination: true,
	language: 'en',
	height: '100%',
	columnDefaults: {
		tooltip: false
	},
	tooltipDelay: 0,
	applyFiltersByTabulator: true
};
```

## Tipos de Control de Datos

La tabla admite tres tipos de gestión de datos:

-   **local**: Todos los datos se cargan a la vez y se gestionan en el cliente
-   **delegate**: La gestión de datos se delega al componente padre
-   **localInfiniteScroll**: Utiliza desplazamiento infinito para grandes conjuntos de datos

```tsx
<scib-organisms-optimized-data-table controlManager="local">
```

## Tamaños de Fila

La tabla admite tres tamaños diferentes de fila:

-   **small**: Filas compactas (22px de altura)
-   **medium**: Filas estándar (25px de altura)
-   **large**: Filas expandidas (41px de altura)

```tsx
<scib-organisms-optimized-data-table rowsize="medium">
```

## Gestión de Vistas

El componente soporta la gestión de vistas personalizadas, permitiendo a los usuarios guardar y cambiar entre diferentes configuraciones de tabla:

```javascript
const itemList = [
  {
    title: 'Vistas predeterminadas',
    type: 'view',
    id: 'default-views',
    views: [
      {
        favourite: true,
        label: 'Predeterminado',
        id: 'default',
        rowSize: 'medium',
        columns: [...]
      }
    ]
  },
  {
    title: 'Vistas personalizadas',
    type: 'view',
    id: 'custom-views',
    views: [...]
  }
];
```

## Filtrado

La tabla admite capacidades avanzadas de filtrado:

```javascript
const filters = [
	{
		field: 'status',
		fieldTitle: 'Estado',
		type: 'in',
		label: 'Estado',
		value: ['Emitido', 'Emitido2']
	},
	{
		field: 'invoiceAmount',
		fieldTitle: 'Monto de factura',
		type: '>',
		label: 'Monto de factura',
		value: 1001
	}
];
```

Tipos de filtros soportados:

-   `textFieldHeaderFilter`: Para campos de texto
-   `booleanHeaderFilter`: Para valores booleanos
-   `dateRangeHeaderFilter`: Para selección de rango de fechas
-   `numberRangeHeaderFilter`: Para selección de rango numérico
-   `dropdownHeaderFilter`: Para selección de opciones predefinidas

## Columnas Congeladas

La tabla admite columnas congeladas tanto en el lado izquierdo como en el derecho:

-   Formateadores para columnas congeladas izquierda: `rowSelectionCheckbox`, `rowSelectionRadio`
-   Formateador para columna congelada derecha: `actionTable`

## Formateadores

### Status (Estado)

El formateador `status` muestra indicadores de estado con colores:

```javascript
{
  title: 'Estado',
  field: 'status',
  formatter: 'status',
  formatterParams: {
    mapKey: 'statusId',
    isBold: true,
    values: {
      'active1': '#137E84',
      'warning2': '#FFCC33',
      'error1': '#990000'
    }
  }
}
```

Sintaxis alternativa:

```javascript
formatterParams: {
  'Emitido': 'green',
  'Pendiente de pago': 'blue'
}
```

### Status Dot (Punto de Estado)

El formateador `statusDot` muestra un punto de color según el estado:

```javascript
{
  title: 'Estado',
  field: 'statusDot',
  formatter: 'statusDot',
  formatterParams: {
    'Activo': '#137E84',
    'Advertencia': '#FFCC33',
    'Error': '#990000'
  }
}
```

### Action Link (Enlace de Acción)

El formateador `actionLink` crea enlaces clickeables en las celdas:

```javascript
{
  title: 'Descargar',
  field: 'Download',
  formatter: 'actionLink',
  formatterParams: {
    icon: 'download',
    columnData: 'comment'  // Opcional: columna para mostrar en el tooltip
  }
}
```

Puedes personalizar los enlaces de acción por fila:

```javascript
rowData: [
	{
		// otros datos de la fila
		actionLinkRowConfig: {
			showMoreInfo: {
				isHidden: false, // Mostrar/ocultar el enlace
				text: 'texto 1', // Texto a mostrar
				allowClick: true, // Hacer que el texto sea clickeable
				newIcon: 'hide-eye', // Cambiar el icono predeterminado
				hasTooltip: true, // Habilitar tooltip
				tooltipText: 'texto tooltip', // Texto del tooltip personalizado
				iconFirst: true, // Posicionar el icono antes del texto
				fullText: true // Usar ancho completo con elipsis
			}
		}
	}
];
```

### Traffic Lights (Semáforos)

El formateador `trafficLights` muestra iconos basados en umbrales de valor:

```javascript
{
  title: 'SLA',
  field: 'sla',
  formatter: 'trafficLights',
  formatterParams: {
    lights: [
      {
        icon: 'circle-success',
        color: '#81B484',
        min: 0,
        max: 50
      },
      {
        icon: 'info-circle',
        color: '#B19645',
        min: 50,
        max: 100
      },
      {
        icon: 'warning',
        color: '#F14040',
        min: 100
      }
    ]
  }
}
```

### Inline Status (Estado en Línea)

El formateador `inlineStatus` muestra valores booleanos como indicadores de estado coloridos:

```javascript
{
  title: 'Estado',
  field: 'active',
  formatter: 'inlineStatus',
  formatterParams: {
    field: 'active',
    trueTitle: 'Activado',
    falseTitle: 'Inactivo'
  }
}
```

### Uppercase (Mayúsculas)

El formateador `uppercase` convierte el texto a mayúsculas:

```javascript
{
  title: 'Código',
  field: 'code',
  formatter: 'uppercase'
}
```

### Bold (Negrita)

El formateador `bold` muestra el texto en negrita:

```javascript
{
  title: 'Nombre',
  field: 'name',
  formatter: 'bold'
}
```

### Editor

El formateador `editor` muestra un icono de edición junto al valor:

```javascript
{
  title: 'Comentario',
  field: 'comment',
  formatter: 'editor'
}
```

### Color Icon (Icono a Color)

El formateador `colorIcon` muestra un icono con color personalizado:

```javascript
{
  title: 'Icono',
  field: 'iconsCell',
  formatter: 'colorIcon',
  formatterParams: {
    icon: 'warning',
    color: '#F14040'
  }
}
```

Configuración personalizada por fila:

```javascript
rowData: [
	{
		// otros datos de fila
		colorIconRowConfig: {
			iconsCell: {
				icon: 'checkmark-bold',
				color: '#66FF33',
				allowClick: false,
				fontSize: 60,
				hasTooltip: true,
				tooltipText: 'No clickeable (no lanza evento)',
				isHidden: false
			}
		}
	}
];
```

### Text Icon (Texto con Icono)

El formateador `textIcon` muestra texto con un icono:

```javascript
{
  title: 'Estado',
  field: 'status',
  formatter: 'textIcon',
  formatterParams: {
    icon: 'circle-success',
    alignment: 'left'
  }
}
```

### Image (Imagen)

El formateador `image` muestra una imagen:

```javascript
{
  title: 'Avatar',
  field: 'supplierName',
  formatter: 'image',
  formatterParams: {
    imageField: 'avatarImg'
  }
}
```

### Extension File (Archivo de Extensión)

El formateador `extensionFile` muestra un icono basado en la extensión de archivo:

```javascript
{
  title: 'Archivo',
  field: 'fileName',
  formatter: 'extensionFile'
}
```

### Raw Value (Valor Bruto)

El formateador `rawValue` muestra el valor sin formato:

```javascript
{
  title: 'Datos',
  field: 'data',
  formatter: 'rawValue'
}
```

### Date Range (Rango de Fechas)

El formateador `dateRange` formatea fechas:

```javascript
{
  title: 'Fecha',
  field: 'date',
  formatter: 'dateRange',
  formatterParams: {
    inputFormat: 'yyyy-LL-dd',
    outputFormat: 'dd/LL/yyyy'
  }
}
```

### Tooltip

El formateador `tooltip` agrega un tooltip a una celda:

```javascript
{
  title: 'Comentario',
  field: 'comment',
  formatter: 'tooltip',
  formatterParams: {
    text: 'Comentario:',
    columnData: 'comment',
    inverseHoz: true
  }
}
```

### Set Custom Formatters (Establecer Formateadores Personalizados)

El formateador `setCustomFormatters` permite usar diferentes formateadores basados en una condición:

```javascript
{
  title: 'Fecha',
  field: 'date',
  formatter: 'setCustomFormatters',
  formatterParams: {
    formatterMapKey: 'invoiced',
    values: {
      true: 'bold',
      false: 'datetime'
    }
  }
}
```

### Action Table (Tabla de Acciones)

El formateador `actionTable` agrega múltiples acciones en una columna:

```javascript
{
  field: 'actionTable',
  formatter: 'actionTable',
  formatterParams: {
    actionMenu: {
      items: [
        {
          id: 'option_1',
          label: 'Opción 1',
          icon: 'edit-pencil',
          action: 'opt_1'
        },
        {
          id: 'option_2',
          label: 'Opción 2',
          action: 'opt_2'
        }
      ]
    },
    moveRow: true,
    showDetail: true,
    showInfo: {},
    customActions: [
      {
        icon: 'trash-bin',
        action: 'removeRow'
      }
    ]
  },
  frozen: true
}
```

### Default Cells (Celdas Predeterminadas)

El formateador `defaultCells` aplica un formato predeterminado a las celdas:

```javascript
{
  title: 'Datos',
  field: 'data',
  formatter: 'defaultCells'
}
```

### Radio Button (Botón de Radio)

El formateador `rowSelectionRadio` muestra un botón de radio para selección única:

```javascript
{
  formatter: 'rowSelectionRadio',
  hozAlign: 'center',
  headerSort: false,
  width: 31,
  frozen: true
}
```

### Checkbox (Casilla de Verificación)

El formateador `rowSelectionCheckbox` muestra una casilla para selección múltiple:

```javascript
{
  formatter: 'rowSelectionCheckbox',
  titleFormatter: 'checkboxHeader',
  hozAlign: 'center',
  headerSort: false,
  width: 31,
  frozen: true
}
```

## Formateadores de Filtros de Encabezado

### Text Field Header Filter

Filtro de entrada de texto para el encabezado:

```javascript
{
  title: 'Nombre',
  field: 'name',
  headerFilterType: 'textFieldHeaderFilter',
  headerFilterLiveFilter: false
}
```

### Boolean Header Filter

Filtro booleano para el encabezado:

```javascript
{
  title: 'Facturado',
  field: 'invoiced',
  headerFilterType: 'booleanHeaderFilter',
  headerFilterLiveFilter: false
}
```

### Date Range Header Filter

Filtro de rango de fechas para el encabezado:

```javascript
{
  title: 'Fecha',
  field: 'date',
  headerFilterType: 'dateRangeHeaderFilter',
  headerFilterLiveFilter: false,
  headerFilterParams: {
    timepicker: true
  }
}
```

### Number Range Header Filter

Filtro de rango numérico para el encabezado:

```javascript
{
  title: 'Monto',
  field: 'amount',
  headerFilterType: 'numberRangeHeaderFilter',
  headerFilterLiveFilter: false
}
```

### Dropdown Header Filter

Filtro de lista desplegable para el encabezado:

```javascript
{
  title: 'Estado',
  field: 'status',
  headerFilterType: 'dropdownHeaderFilter',
  filterSelectOptions: [
    {
      id: 1,
      value: 'Pendiente de pago'
    },
    {
      id: 2,
      value: 'Emitido'
    }
  ],
  filterSingleValue: false
}
```

### Custom Between Filter

Filtro personalizado entre valores:

```javascript
{
  title: 'Rango',
  field: 'range',
  headerFilterFunc: 'between',
  headerFilterParams: {
    min: 0,
    max: 100
  }
}
```

## Formateadores de Encabezados

### Action Menu Header

Formateador para encabezado de menú de acción:

```javascript
{
	titleFormatter: 'actionMenuHeader';
}
```

### Show Detail Header

Formateador para encabezado de mostrar detalle:

```javascript
{
	titleFormatter: 'showDetailHeader';
}
```

### Show Info Header

Formateador para encabezado de mostrar información:

```javascript
{
	titleFormatter: 'showInfoHeader';
}
```

### Checkbox Header

Formateador para encabezado de casilla de verificación:

```javascript
{
	titleFormatter: 'checkboxHeader';
}
```

### Filter Manager Header

Formateador para encabezado de gestor de filtros:

```javascript
{
	titleFormatter: 'filterManagerHeader';
}
```

### Tooltip Header

Formateador para encabezado con tooltip:

```javascript
{
  titleFormatter: 'tooltipHeader',
  titleDescription: 'Descripción del campo'
}
```

### Action Table Header

Formateador para encabezado de tabla de acciones:

```javascript
{
	titleFormatter: 'actionTableHeader';
}
```

## Eventos

La tabla emite varios eventos a los que puedes escuchar:

-   **cellActionMenu**: Cuando se hace clic en el menú de acción de una celda
-   **cellActionLink**: Cuando se hace clic en un enlace de acción de una celda
-   **selectedRows**: Cuando cambia la selección de filas
-   **cellShowDetail**: Cuando se hace clic en mostrar detalle
-   **cellShowInfo**: Cuando se hace clic en mostrar información
-   **moveRowUp**: Cuando se hace clic en el botón de mover arriba
-   **moveRowDown**: Cuando se hace clic en el botón de mover abajo
-   **customAction**: Cuando se activa una acción personalizada
-   **removeRow**: Cuando se hace clic en eliminar fila
-   **cellEdited**: Cuando se edita un valor de celda
-   **paginationChanges**: Cuando cambia la paginación
-   **filterChange**: Cuando cambian los filtros
-   **sortersChanges**: Cuando cambia la ordenación

## Paginación

La tabla soporta paginación con opciones configurables:

```javascript
config: {
  paginationSizeSelector: [10, 20, 30],
  paginationButtonCount: 3,
  paginationInitialPage: 1,
  enableSizeSelectorAll: true,  // Habilitar opción "Todos"
  paginationSize: 10,
  totalItems: 200,
  hideTotal: false,
  language: 'es'
}
```

## Integración de Analytics

El componente admite integración con analytics:

```javascript
analytics: {
  label01: 'ui_kit',           // Página/sección que contiene la tabla
  label02: 'section',          // Pestaña que contiene la tabla (opcional)
  eventCategory: 'ui_kit'      // Categoría de evento para analytics
}
```

## Funcionalidades Adicionales

### Referencias

El componente utiliza un sistema de referencias para gestionar diferentes instancias de tablas y sus elementos relacionados como menús de acción y tooltips.

### Altura del Contenido de la Tabla

La tabla ajusta automáticamente su altura basándose en el número de filas visibles y el tamaño de fila seleccionado.

### Ordenación

Soporta ordenación de columnas con indicadores visuales personalizables:

```javascript
config: {
	headerSortElement: '<i class="icon icon-chevron-up-small">';
}
```

### Control de Columnas

Permite mostrar/ocultar columnas y guardar estas preferencias en vistas personalizadas.

### Selección de Filas

Soporta selección única (radio) o múltiple (checkbox) de filas con eventos asociados.

### Columnas Totalizadoras

Permite mostrar totales en la parte superior de las columnas numéricas:

```javascript
columnDefaults: {
	topCalcFormatter: (cell) => {
		return !!cell.getValue() ? References.instance.tooltipTotals(literals, cell) : '';
	};
}
```

---

Esta documentación cubre las principales características y configuraciones del componente Optimized Data Table. Para información más detallada sobre formateadores o configuraciones específicas, consulte la documentación de la API o el código del componente.
