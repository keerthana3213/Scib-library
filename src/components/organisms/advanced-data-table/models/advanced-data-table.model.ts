import { SkeletonTypes } from '../../../../components';

export type ControlManager = 'local' | 'remote' | 'delegate' | 'infiniteScroll' | 'localInfiniteScroll';

export type LimitedSkeletonTypes = Extract<SkeletonTypes, 'advancedTable' | 'advancedTableWhitelabel'>;

export const defaultConfig = {
	responsiveLayoutCollapseUseFormatters: false,
	responsiveLayoutCollapseStartOpen: false,
	layoutColumnsOnNewData: true,
	debugInitialization: false,
	resizableColumnFit: true,
	responsiveLayout: false,
	movableColumns: false,
	layout: 'fitColumns',
	variant: 'advanced',
	hideFilters: false,
	maxHeight: '100%',
	hideViews: false,
	pagination: true,
	language: 'en',
	height: '100%',
	columnDefaults: {
		tooltip: false
	},
	tooltipDelay: 0
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
	CELL_SHOW_FILTERS = 'cellShowFilters',
	CLICKED_OPTION = 'clickedOption',
	MOVE_ROW_UP = 'moveRowUp',
	MOVE_ROW_DOWN = 'moveRowDown',
	REMOVE_ROW = 'removeRow'
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
	setValue();
	_getSelf();
}

export type RowSizes = 'small' | 'medium' | 'large';

export enum RowSizesStringToNumber {
	small = 1,
	medium = 2,
	large = 3
}

export interface UserViewConfig {
	customViews?: MenuPanelItems;
	rowSizeSelected?: RowSizes;
}

export interface MenuPanelItem {
	id: string;
	title?: string;
	type: string;
	views: View[];
}

export interface View {
	id: string;
	label: string;
	favourite: boolean;
	rowSize?: string;
	columns?: any; //Falta tipar
	row?: any;
}
export interface ILiterals {
	[key: string]: any;
}

export type MenuPanelItems = MenuPanelItem[];

export const fixedColumns = {
	actionMenu: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		frozen: true
	},
	showDetail: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		frozen: true
	},
	showInfo: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		frozen: true
	},
	actionLink: {},
	moveUp: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		frozen: true
	},
	moveDown: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		frozen: true
	},
	deleteRow: {
		width: 45,
		minWidth: 45,
		maxWidth: 45,
		hozAlign: 'center',
		headerSort: false,
		frozen: true
	}
};

export enum viewTypes {
	CUSTOM_VIEWS = 'custom-views',
	DEFAULT_VIEWS = 'default-views'
}

export interface ActiveFilters {
	fieldTitle: string;
	field: string;
	type: string;
	value: any;
}

export const FILTER_TYPE = {
	text_field: { name: 'textFieldHeaderFilter', widthDefault: 100 },
	boolean: { name: 'booleanHeaderFilter', widthDefault: 50 },
	date_range: { name: 'dateRangeHeaderFilter', widthDefault: 300 },
	number_range: { name: 'numberRangeHeaderFilter', widthDefault: 200 },
	dropdown: { name: 'dropdownHeaderFilter', widthDefault: 150 }
};

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

export const TABLE_ROW_SIZES = {
	small: 20,
	medium: 24,
	large: 40
};

export const TABLE_ROW_SIZES_GAPS = {
	small: 2,
	medium: 5,
	large: 5
};
