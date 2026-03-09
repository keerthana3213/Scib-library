export type ControlManager = 'local' | 'delegate' | 'localInfiniteScroll';

export interface TooltipConfig {
	tableId: string;
	cell: TableCell;
	formatterParams: any;
	tooltipText?: string;
	isHeader?: boolean;
}

export const defaultConfig = {
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
export enum EventsAnalytics {
	CREATE_MODAL = 'createView',
	VIEW_SELECTOR = 'viewSelector',
	SELECT_A_VIEW = 'selectAVieww',
	CHIP_FILTERS = 'chipFilters',
	SEND_FILTER = 'sendFilter',
	SIZE_TABS = 'sizeTabs',
	ITEMS_VISIBLE = 'itemsVisible'
}
export interface LoadingOption {
	rowId?: string;
}

export type LoadingOptions = LoadingOption[];

export enum TableCustomEvents {
	CELL_ACTION_MENU = 'cellActionMenu',
	CELL_ACTION_LINK = 'cellActionLink',
	SELECTED_ROWS = 'selectedRows',
	CELL_SHOW_DETAIL = 'cellShowDetail',
	CELL_SHOW_INFO = 'cellShowInfo',
	CELL_DELETE = 'cellDelete',
	HEADER_COLUMN_ACTION_MENU = 'headerColumnActionMenu',
	CLICKED_OPTION = 'clickedOption',
	MOVE_ROW_UP = 'moveRowUp',
	MOVE_ROW_DOWN = 'moveRowDown',
	CUSTOM_ACTION = 'customAction',
	REMOVE_ROW = 'removeRow'
}

export enum TableCustomInternalEvents {
	CHANGE_VALUE_CHECKBOX = 'changeValueCheckbox',
	CHANGE_VALUE_RADIO = 'changeValueRadio'
}
export interface AnalyticsObject {
	label01?: string;
	label02?: string;
	eventCategory?: string;
}
export interface TableCell {
	_cell: {
		calcs: any;
		column: any;
		component: any;
		element: boolean;
		height: number;
		initialValue: any;
		loaded: boolean;
		minWidth: number;
		modules: any;
		oldValue: any;
		row: any;
		table: any;
		value: any;
		width: number;
	};
	checkHeight();
	getColumn();
	getData();
	getElement();
	getField();
	getInitialValue();
	getOldValue();
	getRow();
	getTable();
	getValue();
	restoreInitialValue();
	restoreOldValue();
	setValue(any);
	_getSelf();
}

export enum RowSizesEnum {
	SMALL = 'small',
	MEDIUM = 'medium',
	LARGE = 'large'
}

export class RowSizes {
	static readonly small = { id: 0, value: RowSizesEnum.SMALL, icon: 'row-separation-s' };
	static readonly medium = { id: 1, value: RowSizesEnum.MEDIUM, icon: 'row-separation-m' };
	static readonly large = { id: 2, value: RowSizesEnum.LARGE, icon: 'row-separation-l' };

	static getRowSizeByById(id: number | string): RowSizesEnum {
		const key = Object.keys(RowSizes).find((key) => RowSizes[key].id + '' === id + '');
		return RowSizes[key].value;
	}
}

export interface UserViewConfig {
	customViews?: MenuPanelItems;
	rowSizeSelected?: RowSizesEnum;
}

export interface MenuPanelItem {
	id: VIEW_TYPES_ENUM;
	title?: string;
	type: string;
	views: View[];
}

export interface View {
	id: string;
	label: string;
	favourite: boolean;
	rowSize?: RowSizesEnum;
	columns?: any; //Falta tipar
	row?: any;
}
export interface ILiterals {
	[key: string]: any;
}

export type MenuPanelItems = MenuPanelItem[];

export enum FROZEN_FORMATTER_LEFT {
	ROW_SELECTION = 'rowSelectionCheckbox',
	RADIO = 'rowSelectionRadio'
}

export enum FROZEN_FORMATTER_RIGHT {
	ACTION_TABLE = 'actionTable'
}

export const WIDTH_DEFAULT_ICONS_ACTION = 45;
export const WIDTH_DEFAULT_RADIO_BOX_SELECTION = 31;

export const LIST_FROZEN_FORMATTER_LEFT = [FROZEN_FORMATTER_LEFT.ROW_SELECTION, FROZEN_FORMATTER_LEFT.RADIO];

/**
 * Name of formatter action table to move row
 */
export const ACTION_TABLE_NAME_MOVE_ROW = 'moveRow';

/**
 * Name of formatter action table to show detail
 */
export const ACTION_TABLE_NAME_SHOW_DETAIL = 'showDetail';

/**
 * Name of formatter action table to move custom Actions
 */
export const ACTION_TABLE_NAME_CUSTOM_ACTION = 'customActions';

/**
 * Name of formatter action table to move action Menu
 */
export const ACTION_TABLE_NAME_ACTION_MENU = 'actionMenu';

/**
 * Name of formatter action table to move Show Info
 */
export const ACTION_TABLE_NAME_SHOW_INFO = 'showInfo';

/**
 * List order action to show in table, the order is define in position of the follow list
 */
export const LIST_ORDER_ACTION = [
	ACTION_TABLE_NAME_MOVE_ROW,
	ACTION_TABLE_NAME_SHOW_DETAIL,
	ACTION_TABLE_NAME_CUSTOM_ACTION,
	ACTION_TABLE_NAME_ACTION_MENU,
	ACTION_TABLE_NAME_SHOW_INFO
];

/**
 * Tabulator have a error when use renderHorizontal virtual, unsort list frozen right, so LIST_FROZEN_FORMATTER_RIGHT must be a list with only 1 elemente
 * while tabulator not fix this, last version tabulator with the error checked this 6.2
 */
export const LIST_FROZEN_FORMATTER_RIGHT = [FROZEN_FORMATTER_RIGHT.ACTION_TABLE];

/**
 * This list will removed when the diferents teams refactor the use of table
 *
 * @deprecated
 */
export const ListColumnsExclude = ['actionMenu', 'showDetail', 'showInfo', 'moveUp', 'moveDown', 'deleteRow'];

/**
 * the fixed columns of actions right will removed, use on unique column
 *
 * @deprecated
 */
export const fixedColumnsDeprecated = {
	actionTable: {
		titleFormatter: 'actionTableHeader',
		maxWidth: false,
		hozAlign: 'center',
		headerSort: false,
		resizable: false,
		frozen: true
	},
	actionMenu: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		resizable: false,
		frozen: true
	},
	showDetail: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		resizable: false,
		frozen: true
	},
	showInfo: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		resizable: false,
		frozen: true
	},
	actionLink: {},
	moveUp: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		resizable: false,
		frozen: true
	},
	moveDown: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		resizable: false,
		frozen: true
	},
	deleteRow: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		resizable: false,
		headerSort: false,
		frozen: true
	}
};

export const fixedColumns = {
	actionTable: {
		titleFormatter: 'actionTableHeader',
		maxWidth: false,
		hozAlign: 'center',
		headerSort: false,
		resizable: false,
		frozen: true
	},
	rowSelectionCheckbox: {
		hozAlign: 'center',
		headerSort: false,
		resizable: false,
		frozen: true,
		width: WIDTH_DEFAULT_RADIO_BOX_SELECTION
	}
};

export enum VIEW_TYPES_ENUM {
	CUSTOM_VIEWS = 'custom-views',
	DEFAULT_VIEWS = 'default-views'
}

export interface ActiveFilters {
	delegated?: boolean;
	label?: string;
	fieldTitle: string;
	field: string;
	type: string;
	value: any;
	id: string;
}

export const FILTER_TYPE = {
	text_field: { name: 'textFieldHeaderFilter', widthDefault: 150 },
	boolean: { name: 'booleanHeaderFilter', widthDefault: 100 },
	date_range: { name: 'dateRangeHeaderFilter', widthDefault: 500 },
	number_range: { name: 'numberRangeHeaderFilter', widthDefault: 400 },
	dropdown: { name: 'dropdownHeaderFilter', widthDefault: 150 }
};

export const PADDING_DEFAULT_HEADER = 16;

export enum filtersWidthDefaultTypes {
	TEXT_FIELD = 'textFieldHeaderFilter',
	BOOLEAN = 'booleanHeaderFilter',
	DATE_RANGE = 'dateRangeHeaderFilter',
	NUMBER_RANGE = 'numberRangeHeaderFilter',
	DROPDOWN = 'dropdownHeaderFilter'
}

export enum filtersRangesTypes {
	AMOUNT = 'amount',
	DATE = 'date'
}

export const TABLE_ROW_SIZES_WITH_BORDER = {
	small: 22,
	medium: 25,
	large: 41
};

export class FunctionsTable {
	showManageViews: boolean;
	showFilters: boolean;
	showRowsize: boolean;
	showPaginator: boolean;
}

export const TABLE_ROW_SIZES_GAPS = {
	small: 2,
	medium: 5,
	large: 5
};

export const SIMPLE_CUSTOM_VIEW = {
	currentView: { id: 'SIMPLE_CUSTOM_VIEW', label: 'SIMPLE_CUSTOM_VIEW', favourite: true },
	idType: VIEW_TYPES_ENUM.CUSTOM_VIEWS
};

export const TABLE_SIZE_CODE_ALL = 'ALL';

export const TABLE_SIZE_ROWS_DEFAULT = 10;

export const RESERVED_PROPERTIES_TABULATOR = {
	ACTIVE: 'active' // Reserved word of tabulator to check when a row is active by filter. WARNING if a data container have a property with this name, its posible some funcionalities don't work properly, ej: the calculate of height not work
};

export interface ActionTableConfig {
	actionMenu?: {
		icon: string;
		items: { id: string; label: string; icon: string; action: string }[];
	};
	moveRow?: boolean;
	showDetail?: boolean | { showIconFn: Function };
	showInfo?: { icon: string };
	customActions?: CustomActionConfig[];
}

export interface CustomActionConfig {
	icon: string;
	action: string;
	customActionDisabledFn?: (rowData: any) => boolean;
	getRowElementDetail?: boolean;
}

export type Formatter = (cell: TableCell, formatterParams, onRendered) => string | HTMLElement;
