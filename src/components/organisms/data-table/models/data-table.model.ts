// export type ControlManager = 'local' | 'remote' | 'delegate';
export type ControlManager = 'local' | 'delegate';

export const defaultConfig = {
	responsiveLayoutCollapseUseFormatters: false,
	responsiveLayoutCollapseStartOpen: false,
	layoutColumnsOnNewData: true,
	debugInitialization: false,
	resizableColumnFit: true,
	responsiveLayout: false,
	movableColumns: false,
	pagination: true,
	layout: 'fitColumns',
	maxHeight: '100%',
	height: '100%',
	columnDefaults: {
		tooltip: false,
	},
};

export interface LoadingOption {
	rowId?: string;
}

export type LoadingOptions = LoadingOption[];

export enum TableCustomEvents {
	CELL_ACTION_MENU = 'cellActionMenu',
	CELL_ACTION_LINK = 'cellActionLink',
	SELECTED_ROWS = 'selectedRows',
	CELL_SHOW_DETAIL = 'cellShowDetail',
	CELL_DELETE = 'cellDelete',
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
