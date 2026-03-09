import { DefaultFocusState, MDCMenu } from '@material/menu';
import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { cloneDeep, first, get, has, isEmpty, isEqual, isNumber, kebabCase, merge, omit, remove, trimEnd } from 'lodash';
import { DateTime } from 'luxon';
import { registerClickOutside, removeClickOutside } from 'stencil-click-outside';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { v4 as uuidv4 } from 'uuid';
import { CheckboxValue } from '../../../../components';
import { assetUrl, configKeysToOmitForTables, getPublicUrl, parseProp, removeColumnKeys } from '../../../../utils/helpers/common';
import { PaginationEvent } from '../../../molecules/paginator/models/paginator.model';
import { calculateMinWidthAction, References } from '../formatters/common-utils';
import { booleanHeaderFilter } from '../formatters/filters/boolean-header-filter';
import { betweenFilter } from '../formatters/filters/custom-between-filter';
import { dropdownHeaderFilter } from '../formatters/filters/dropdown-header-filter';
import { rangeHeaderFilter } from '../formatters/filters/range-header-filter';
import { textFieldHeaderFilter } from '../formatters/filters/text-field-header-filter';
import { OrganismsOptimizedDataTableFiltersCard } from '../fragments/optimized-data-table-filters-card';
import {
	ActiveFilters,
	AnalyticsObject,
	ControlManager,
	defaultConfig,
	EventsAnalytics,
	FILTER_TYPE,
	filtersRangesTypes,
	fixedColumns,
	FunctionsTable,
	ILiterals,
	LIST_FROZEN_FORMATTER_LEFT,
	LIST_FROZEN_FORMATTER_RIGHT,
	ListColumnsExclude,
	LoadingOptions,
	MenuPanelItem,
	MenuPanelItems,
	RESERVED_PROPERTIES_TABULATOR,
	RowSizes,
	RowSizesEnum,
	SIMPLE_CUSTOM_VIEW,
	TABLE_ROW_SIZES_WITH_BORDER,
	TABLE_SIZE_CODE_ALL,
	TABLE_SIZE_ROWS_DEFAULT,
	TableCell,
	TableCustomEvents,
	View,
	VIEW_TYPES_ENUM
} from '../models/optimized-data-table.model';
import { getCustomEditors } from '../modules/editors';
import { getCustomFormatters, getCustomHeaderFormatters } from '../modules/formatters';
import { applyDefaultConfigToColumns } from '../utils/columns';
import { formatNumber } from '../utils/number-fortmat';
const privateConfig = ['ajaxURL', 'sortMode', 'filterMode', 'ajaxRequestFunc', 'footerElement', 'columns', 'data'];

/**
 * Component description
 *
 * @status stable
 *
 * @slot header-actions - Header actions section slot | Optimized data table header actions
 */
@Component({
	tag: 'scib-organisms-optimized-data-table',
	styleUrl: 'optimized-data-table.scss',
	shadow: true
})
export class OrganismsOptimizedDataTable {
	private _paginatorRef: HTMLScibMoleculesPaginatorElement;
	private _tableInstance: Tabulator;
	private _tableReferences: References;
	private _skeletonRef: HTMLElement;
	private _lastColumn: any;
	private _oldIndex: number;
	private _selectedColumn: any;
	private _tableUuid: string;
	private _menuPanel: MDCMenu;
	private _sizeSelector: MDCMenu;
	private _eventsRegistered: boolean = false;
	public statusMultipleSelected: CheckboxValue = 'unchecked';
	private _updateHeightAfterRender: boolean = false;
	private _currentOrderParams = {
		pagination: {},
		sorters: {},
		filters: []
	};

	/**
	 *
	 */
	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@State() $openSizeSelectorPanel: boolean = false;

	/**
	 * Control for filters style
	 */
	@State() _showFilterRow: boolean = false;

	/**
	 * Control overflow visible for filters
	 */
	@State() $headerOverflowIsVisble: boolean = false;

	/**
	 * List for the active filters
	 */
	@State() $activeFilters: ActiveFilters[] = [];

	/**
	 * Control for modified views
	 */
	@State() $hasChanges: boolean = false;

	/**
	 *
	 */
	@State() $openChipFilters: boolean = false;

	/**
	 *
	 */
	@State() $currentOpenChipFiltersColumn: string = '';

	/**_showFilterRow
	 *
	 */
	@State() $allHidden: boolean = false;

	/**
	 *
	 */
	@State() $currentViewName: string = '';

	/**
	 *
	 */
	@State() $chips: any[] = [];

	/**
	 *
	 */
	@State() $closeModal: boolean = false;

	/**
	 *
	 */
	@State() $deleteView: boolean = false;

	/**
	 *
	 */
	@State() $editingView: View;

	/**
	 *
	 */
	@State() $hiddenColumns: any = [];

	/**
	 *
	 */
	@State() $hiddenColumnsFixed: any = [];

	/**
	 *
	 */
	@State() $shownColumns: any = [];

	/**
	 *
	 */
	@State() $currentViewObject: { currentView: View; idType: VIEW_TYPES_ENUM.CUSTOM_VIEWS | VIEW_TYPES_ENUM.DEFAULT_VIEWS };

	/**
	 *
	 */
	@State() $countCustomViews: number;

	/**
	 *
	 */
	@State() $topPosition: number;

	/**
	 *
	 */
	@State() $prviousViewObjectIdType: VIEW_TYPES_ENUM;

	/**
	 *
	 */
	@State() $itemHeight: number = 40;

	/**
	 *
	 */
	@State() $openViewsMenu: boolean = false;

	/**
	 *
	 */
	@State() $openModalView: boolean = false;

	/**
	 *
	 */
	@State() $createModal: boolean;

	/**
	 *
	 */
	@State() $topPositionRowSelector: number;

	/**
	 *
	 */
	@State() $localInfiniteScroll: boolean;

	/**
	 *
	 */
	@State() $skeletonReady: boolean = false;

	/**
	 * Control for filters management
	 */
	@State() $delegateFilterManagement: boolean = false;

	/**
	 * Control for filters management
	 */
	@State() $elementFilterPositionRef: any = null;

	/**
	 * El nombre de la tabla
	 */
	@Prop({ reflect: false }) name: string;

	/**
	 * Data object to able functionalities of table
	 */
	@Prop({ reflect: true }) manageFunctionalities: FunctionsTable | string =
		'{"showManageViews":true,"showFilters":true,"showRowsize":true,"showPaginator":true}';
	@State() $manageFunctionalities: FunctionsTable = {
		showManageViews: true,
		showFilters: true,
		showRowsize: true,
		showPaginator: true
	};
	@Watch('manageFunctionalities') _manageFunctionalitiesHandler(newManageFunctionalities) {
		if (!isEmpty(newManageFunctionalities)) {
			this.$manageFunctionalities = parseProp<FunctionsTable>(newManageFunctionalities as FunctionsTable);
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) showSubHeaderTotals: boolean = false;
	@Watch('showSubHeaderTotals') _showSubHeaderTotalsHandler() {
		this._updateHeightAfterRender = true;
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) currentViewObject: { currentView: View; idType: VIEW_TYPES_ENUM } = null;
	@Watch('currentViewObject') _currentViewObjectHandler(newValue: { currentView: View; idType: VIEW_TYPES_ENUM }) {
		if (this.$manageFunctionalities.showManageViews) {
			this.$currentViewObject = parseProp<{ currentView: View; idType: VIEW_TYPES_ENUM }>(newValue);
		} else {
			this.$currentViewObject = SIMPLE_CUSTOM_VIEW;
			this.$currentViewObject.currentView.columns = this.$columns?.map((column) => cloneDeep(column));
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) controlManager: ControlManager = 'local';
	@Watch('controlManager') _controlManagerHandler(newValue: ControlManager) {
		this.$delegateFilterManagement = ['delegate'].includes(newValue);
		this.$localInfiniteScroll = newValue === 'localInfiniteScroll';
	}

	/** // TODO: REVIEW
	 * This object collects information like the page that contains the table label01 (ex:Overview, home...), the tab if exists label02(ex:Active...) and eventCategory (ex:rita_securitizations...)
	 */
	@State() $visibleColumns;

	@Prop({ reflect: false }) analytics: AnalyticsObject = { label01: 'ui_kit', eventCategory: 'ui_kit' };
	@State() $analytics: AnalyticsObject;
	analyticsFilters: string[] = [];
	@Watch('analytics') _analyticsHandler(analyticsValue: AnalyticsObject) {
		this.$analytics = analyticsValue;
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) literals: ILiterals | string;
	@State() $literals: ILiterals;
	firstTimeNewView: boolean = true;
	@Watch('literals') _parseLiterals(newLiterals: ILiterals | string) {
		this.$literals = parseProp<ILiterals>(newLiterals as string) ?? {};
		if (this._tableInstance) {
			this._columnsHandler(this.columns);
			this._filtersHandler(this.filters);
			this._tableInstance.options.placeholder = this.getEmptyState();
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) config: string | { [key: string]: any };
	@State() $config: { [key: string]: any };
	@Watch('config') _configHandler(newValue: string | { [key: string]: any }) {
		this.$config = omit(merge({}, defaultConfig, parseProp<{ [key: string]: any }>(newValue, {})), privateConfig);
		this._showFilterRow = this.$config.initialOpenFilters ?? this._showFilterRow;
		if (this._tableInstance) {
			const config = merge({}, defaultConfig, this._tableInstance.options, this.$config);
			this._tableInstance.options = omit(config, ['pagination', ...configKeysToOmitForTables]);
			this._updatePaginatorConfig();
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) columns: string | any[];
	@State() $columns: any[];
	@Watch('columns') _columnsHandler(newValue: string | any[]) {
		this.$columns = this.reorganizeColumnsTable(newValue);
		if (!this.$manageFunctionalities.showManageViews) {
			// only need update de currentview object when dont use the manage of views, beacuse the current view is a dummy view with all columns config by param
			this.$currentViewObject.currentView.columns = this.$columns?.map((column) => cloneDeep(column));
		}

		let shownFields: string[] =
			this.$currentViewObject?.currentView?.columns?.map((column) => column.field) || this.$columns?.map((column) => column.field);
		this.setVisibleColumns(shownFields, this.$currentViewObject?.currentView || { columns: this.$columns });

		if (this._tableInstance) {
			this._showFilterRow = !(this.$config.initialOpenFilters ?? this._showFilterRow);
			this.showFilterRow(true);
			this.setView(this.$currentViewObject?.currentView || ({ columns: this.$columns } as View));
			if (this.controlManager === 'local') {
				this._updatePaginatorConfig();
			}
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) rowData: string | any[];
	@State() $rowData: any[];
	@Watch('rowData') _rowDataHandler(newValue: string | any[]) {
		const parsed = parseProp<any[]>(newValue, []);
		this.$rowData = parsed.map((item, i) => {
			item.topPosition = true;
			if (this.controlManager !== 'local' && i > Math.ceil(parsed.length / 2)) {
				item.topPosition = false;
			}
			if (!has(item, 'rowId')) {
				const { id } = item;
				const rowId = id ? `row-${id}` : `row-${i + 1}`;
				item = merge({}, item, { rowId });
			}
			return item;
		});
		if (this._tableInstance) {
			this._tableInstance.setData(this.$rowData).then(() => {
				this._disableAutoLoading();
				if (this.controlManager === 'local') {
					this._updatePaginatorConfig();
				}
				this._updateHeightAfterRender = true;
			});
			this.changeValueMultiselectCheckbox();
		}
	}

	/**
	 * can and an text option to paginationSizeSelector to see all data without pagination, when no pagination is
	 */
	@State() $paginatorConfig: { [key: string]: any };
	private _updatePaginatorConfig(newValue?: { [key: string]: any }) {
		const {
			paginationSizeSelector = [10, 20, 30],
			paginationButtonCount = 3,
			paginationInitialPage = 1,
			enableSizeSelectorAll = false,
			totalItemsText = 'Total:',
			paginationSize = 10,
			totalItems,
			hideTotal = false,
			language
		} = this.$config;
		this.$paginatorConfig = {
			paginationSizeSelector,
			paginationButtonCount: Number(paginationButtonCount),
			paginationInitialPage: Number(paginationInitialPage),
			enableSizeSelectorAll,
			paginationSize: Number(paginationSize),
			hideTotal,
			totalItems: Number(totalItems) ?? (this.$rowData || []).length,
			tableUuid: this._tableUuid,
			variant: 'advanced',
			totalItemsText,
			language,
			...newValue
		};
		this._currentOrderParams = merge({}, this._currentOrderParams, {
			pagination: { currentPage: paginationInitialPage, itemsPerPage: paginationSize }
		});
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) loading: boolean = false;
	@State() $loading: boolean = false;
	@Watch('loading') _loadingHandler(newValue: boolean) {
		this.$loading = Boolean(newValue);
		if (this.$loading) {
			this._setSkeletonMinHeight();
		}
	}

	@Prop() globalLanguage: string = 'es';
	@State() $globalLanguage: string = 'es';
	@Watch('globalLanguage') _globalLanguageHandler(newValue: string) {
		this.$globalLanguage = newValue;
	}
	/**
	 *
	 */
	@Prop({ reflect: false }) loadingIds: string | LoadingOptions;
	@State() $loadingIds: LoadingOptions;
	@Watch('loadingIds') _loadingIdsHandler(newValue: string | LoadingOptions) {
		const loadingSelected = parseProp<LoadingOptions>(newValue, []);
		this.$loadingIds = loadingSelected;
	}

	/**
	 *
	 */
	@Prop({ reflect: true, mutable: true }) rowsize: RowSizesEnum;
	@State() $rowsize: RowSizesEnum | number = RowSizesEnum.MEDIUM;
	@Watch('rowsize') _rowsizeHandler(newValue: RowSizesEnum) {
		this.$rowsize = this._parseRowsizeValue(newValue);

		// Solo establecer propiedad CSS si es un valor numérico
		if (![RowSizesEnum.SMALL, RowSizesEnum.MEDIUM, RowSizesEnum.LARGE].includes(this.$rowsize as RowSizesEnum)) {
			this._hostRef.style.setProperty('--_organisms-optimized-data-table-cell-height', `${this.$rowsize}px`);
		}

		this.$rowsize = newValue;
		this._resetContainer();
		this._updateHeightAfterRender = true;
	}

	/**
	 * Analiza el valor de rowsize y lo convierte al formato correcto
	 * @param value Valor de rowsize (enum, número o string)
	 * @returns Valor normalizado de rowsize
	 */
	private _parseRowsizeValue(value: RowSizesEnum | number | string): RowSizesEnum | number {
		// Caso 1: Es un enum válido
		if (typeof value === 'string' && Object.values(RowSizesEnum).includes(value as RowSizesEnum)) {
			return value as RowSizesEnum;
		}

		// Caso 2: Es un string con formato "Xpx"
		if (typeof value === 'string' && value.includes('px')) {
			const numericValue = Number(value.replace('px', ''));
			return numericValue;
		}

		// Caso 3: Es un número o string numérico
		if (typeof value === 'number' || !isNaN(Number(value))) {
			return typeof value === 'number' ? value : Number(value);
		}

		// Valor por defecto
		return RowSizesEnum.MEDIUM;
	}

	/**
	 * TODO: REVIEW
	 */
	@Prop({ reflect: false }) itemList: string | MenuPanelItems;
	@State() $itemList: MenuPanelItems;
	@Watch('itemList') _itemListHandler(newValue: string | MenuPanelItems) {
		if (this.$manageFunctionalities.showManageViews) {
			this.$itemList = parseProp(newValue);
			this._countCustomViews();
			this.$topPosition = 0;
			const row = get(this.$itemList[0], 'views[0].row', {});
			if (row.topPosition === false) {
				this.$topPosition = -this.$itemList.length * this.$itemHeight - this.$itemHeight;
			}
			this.getFavouriteView();
		}
	}

	/**
	 * Filters
	 */
	@Prop({ reflect: false }) filters: ActiveFilters[] | string;
	@Watch('filters') _filtersHandler(newValue: string | ActiveFilters[]) {
		this.$activeFilters = parseProp(newValue, []).map((activeFilter) => {
			return {
				...activeFilter,
				id: uuidv4(),
				delegated: !!this.$columns.find((column) => column.field === activeFilter.field).delegatedFilter
			};
		});
		this._getActiveFiltersChips();
	}
	/**
	 * Activate validation control
	 */
	@Prop() validationControl: boolean;
	@State() $validationControl: boolean;
	@Watch('validationControl') _validationControlHandler(newValue: boolean) {
		this.$validationControl = newValue;
	}

	/**
	 *
	 * @param event
	 */
	@Listen('paginationChange')
	_paginationChangeHandler(event: CustomEvent<PaginationEvent>) {
		if (this._tableUuid === event.detail.tableUuid) {
			const detail = omit(event.detail, ['tableUuid']);
			const { currentPage, itemsPerPage } = detail;
			this._currentOrderParams = {
				...this._currentOrderParams,
				pagination: detail
			};
			if (this._tableInstance) {
				switch (this.controlManager) {
					case 'delegate':
						this._loadingHandler(true);
						this.delegateChanges.emit(this._currentOrderParams);
						break;
					case 'localInfiniteScroll':
						this._tableInstance.setPageSize(itemsPerPage);
						this._tableInstance.setPage(currentPage);
						break;
					default:
						this._tableInstance.setPageSize(itemsPerPage);
						this._tableInstance.setPage(currentPage);
				}
				this.paginationChanges.emit(this._currentOrderParams.pagination as PaginationEvent);
			}
		}
		this._resetContainer();
	}

	/**
	 * // TODO: REVIEW
	 * @param event
	 */
	@Listen('headerColumnActionMenu') _headerColumnActionMenuHandler(event: CustomEvent) {}

	/**
	 * @param event
	 */
	@Listen('skeletonReference') _headerSkeletonReference(event: CustomEvent) {
		const { detail } = event;
		this._skeletonRef = detail;
		this._setSkeletonMinHeight();
	}

	/**
	 *
	 * @param event
	 */
	@Listen('selectedOption') _actionMenuselectedOptionHandler(event: CustomEvent) {
		const { detail } = event;
		this.cellActionMenu.emit(detail);
	}

	/**j
	 *Event to control when the table has reached the bottom if it has scroll
	 */
	@Event() loadMoreData: EventEmitter<void>;

	/**
	 *Event that sends the information when a row is moved one position up
	 */
	@Event() moveRowUp: EventEmitter<void>;
	/**
	 *Event that sends the information when a row is moved one position down
	 */
	@Event() moveRowDown: EventEmitter<void>;
	/**
	 *Event that sends the information when a row is deleted
	 */
	@Event() removeRow: EventEmitter<void>;

	/**
	 *Event that sends the information when a row is deleted
	 */
	@Event() customAction: EventEmitter<{ field: string; data: any; rowPosition: number; action: string }>;

	/**
	 * Event that emits information about the cell that has been edited
	 */
	@Event() cellEdited: EventEmitter<{ value: any; cell: TableCell }>;

	/**
	 * Event that emits information about the cell that is editing
	 */
	@Event() cellEditing: EventEmitter<{ value: any; cell: TableCell }>;

	@Event() sendColumnResized: EventEmitter<any>;

	/**
	 *
	 */
	@Event() clickAction: EventEmitter<string>;

	/**
	 * TODO This event must be removed for other 3 for emit change filter, pagination or order, this event must be of tabulator and this component in stencil
	 * only should map result and save inside component for other utilities. (Remember this callback of tabulator NEVER NEVER NEVER must update any prop or state
	 * of stencil for dont start lifecycle of stencil)
	 *
	 * @Deprecated
	 */
	@Event() delegateChanges: EventEmitter<any>;

	/**
	 * Event to send the information of sorters event
	 */
	@Event() sortersChanges: EventEmitter<{ [key: string]: unknown }>;

	/**
	 * Event to send the information of pagination event
	 */
	@Event() paginationChanges: EventEmitter<PaginationEvent>;
	/**
	 * Event to send just filters
	 */
	@Event() filterChange: EventEmitter<ActiveFilters[]>;
	/**
	 *
	 */
	@Event() tableRenderComplete: EventEmitter<any>;

	/**
	 *
	 */
	@Event() cellActionLink: EventEmitter<any>;

	/**
	 *
	 */
	@Event() cellShowDetail: EventEmitter<any>;

	/**
	 *
	 */
	@Event() cellActionMenu: EventEmitter<MenuPanelItem>;

	/**
	 *
	 */
	@Event() customizedViews: EventEmitter<MenuPanelItem>;

	/**
	 *
	 */
	@Event() cellShowInfo: EventEmitter<any>;

	/**
	 *
	 */
	@Event() selectedRows: EventEmitter<any[]>;

	/**
	 *
	 */
	@Event() userConfigUpdated: EventEmitter<any>;

	/**
	 *
	 */
	@Event() headerColumnActionMenu: EventEmitter<any>;

	/**
	 *
	 */
	@Event() selectRowSize: EventEmitter<any>;

	/**
	 *
	 */
	@Event() changeView: EventEmitter<any>;

	/**
	 *
	 */
	@Event() horizontalScroll: EventEmitter<any>;

	/**
	 *
	 */
	@Event() tableBuilt: EventEmitter<any>;

	/**
	 *
	 */
	@Method() async getTableInstance() {
		return this._tableInstance;
	}

	/**
	 * This method is published to update the rendered table height when any content is attached inside the table detail section from microfrontends.
	 */
	@Method()
	async updateTableHeight() {
		this._updateTableHeight();
	}

	/**
	 * Method to unselect all rows or some by ids
	 */
	@Method() async unSelectRows(rows?: string[] | number[] | string | undefined) {
		this._unSelectRows(rows);
	}

	/**
	 * Method to select all rows or some by ids
	 */
	@Method() async selectRows(rows?: string[] | number[] | string) {
		this._selectRows(rows);
	}

	/**
	 *
	 */
	@Method() async disableNext() {
		return this._paginatorRef.disableNext();
	}

	/**
	 *
	 */
	@Method() async enableNext() {
		return this._paginatorRef.enableNext();
	}

	/**
	 *
	 */
	@Method() async resetPagination() {
		this._paginatorRef && this._paginatorRef.moveToPage(1, false);
		this.enableNext();
		this._currentOrderParams.pagination = { ...this._currentOrderParams.pagination, currentPage: 1 };
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._parseLiterals(this.literals);
		this._tableUuid = uuidv4();
		this._manageFunctionalitiesHandler(this.manageFunctionalities);
		this._currentViewObjectHandler(this.currentViewObject);
		this._controlManagerHandler(this.controlManager);
		this._loadingHandler(this.loading);
		this._loadingIdsHandler(this.loadingIds);
		this._configHandler(this.config);
		this._rowDataHandler(this.rowData);
		this._rowsizeHandler(this.rowsize);
		this._itemListHandler(this.itemList);
		this._columnsHandler(this.columns);
		this._filtersHandler(this.filters);
		this._updatePaginatorConfig({
			paginationSize: get(parseProp(this.config), 'paginationSize')
		});
		this._validationControlHandler(this.validationControl);
		this._analyticsHandler(this.analytics);
		this.loadAssetsImagesUrl();
		this._globalLanguageHandler(this.globalLanguage);
	}

	/**
	 * This function must be only functionality that not update any prop or state, only implements functionality that affects visuality after
	 * render tabulator
	 */
	componentDidUpdate() {
		// For paginator
		if (this.showScibUiPaginator()) {
			this._hostRef.style.setProperty('--_organisms-optimized-data-table-border-bottom-last-row', '1px solid rgba(0,0,0,.12)');
		} else {
			this._hostRef.style.setProperty('--_organisms-optimized-data-table-border-bottom-last-row', 'none');
		}

		//for filter
		let localFilters = this.$activeFilters.filter((filter) => !filter?.delegated);
		if (!this.$delegateFilterManagement && this._tableInstance) {
			this._tableInstance.setFilter(localFilters);
		}

		//for update height when use scroll vertical
		if (this._updateHeightAfterRender) {
			this._updateHeightAfterRender = false;
			this._updateTableHeight();
		}
	}

	/** TODO: REVIEW
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		const paginator = this.$localInfiniteScroll
			? this._hostRef.shadowRoot.getElementById('size-and-rows')
			: this._hostRef.shadowRoot.querySelector('scib-molecules-paginator');
		const tableContainer: HTMLElement = this._hostRef.shadowRoot.querySelector('.table-container');
		const tableElement = document.createElement('div');
		const config = merge({}, defaultConfig, this.$config, this._getControlConfig());
		const tableActionColumns = this.$visibleColumns.find((elem) => elem.formatter && elem.formatter === 'actionTable');
		const existDetail = tableActionColumns?.formatterParams?.showDetail;
		const existInfo = !isEmpty(tableActionColumns?.formatterParams?.showInfo);
		this.$delegateFilterManagement = ['delegate'].includes(this.controlManager) || !this.$config?.applyFiltersByTabulator;

		this._tableInstance = new Tabulator(tableElement, {
			id: this._tableUuid,
			...omit(config, configKeysToOmitForTables),
			...(config.pagination ? { footerElement: paginator } : {}),
			headerSortElement: '<i class="icon icon-chevron-up-small">',
			columnHeaderVertAlign: 'middle',
			columns: removeColumnKeys(this.setColumnIconFilter(this.$visibleColumns)),
			data: this.$rowData,
			placeholder: this.getEmptyState(),
			initialFilter: this.$activeFilters.filter((filter) => !filter?.delegated),
			selectableCheck: (row) => {
				const rowData = row.getData();
				return !rowData.isDisabled;
			},
			columnDefaults: {
				...config.columnDefaults,
				titleFormatter: 'tooltipHeader',
				formatter: 'defaultCells',
				topCalcFormatter: (cell: TableCell) => {
					return !!cell.getValue() ? References.instance.tooltipTotals(this.$literals, cell) : '';
				}
			},
			rowFormatter: (row) => {
				if (existDetail) {
					const element = row.getElement();
					const detailDiv = document.createElement('div');
					detailDiv?.classList.add(`detail-view`);
					element.appendChild(detailDiv);
				}
				if (existInfo) {
					const element = row.getElement();
					const infoDiv = document.createElement('div');

					infoDiv?.classList.add(`info-view`);
					element.appendChild(infoDiv);
				}
			}
		});

		this._registerCustomModules();
		if (this.$itemList && this.$manageFunctionalities.showManageViews) {
			this._menuPanel = MDCMenu.attachTo(this._hostRef.shadowRoot.querySelector('.menu-item'));
			this._menuPanel.setDefaultFocusState(DefaultFocusState.NONE);
			this._menuPanel.listen('MDCMenuSurface:closed', () => {
				this._hostRef.removeAttribute('open');
				this._toggleMenu(false);
			});
		}

		if (this.$localInfiniteScroll && this.$manageFunctionalities.showPaginator) {
			this._sizeSelector = MDCMenu.attachTo(this._hostRef.shadowRoot.querySelector('.size-selector-menu'));
			this._sizeSelector.setDefaultFocusState(DefaultFocusState.NONE);
			this._sizeSelector.listen('MDCMenuSurface:closed', () => {
				this._hostRef.removeAttribute('open');
				this._toggleSizeSelector(false);
			});
		}
		const chipsContainer: any = this._hostRef.shadowRoot.getElementById('chip-container');
		if (chipsContainer) {
			registerClickOutside(this, chipsContainer, () => {
				if (this.$openChipFilters) {
					this.closeFiltersChips();
				}
			});
		}
		this._getActiveFiltersChips();
		this._initListeners(tableContainer);
	}

	openCardFilterChips(dataFilter?: { field?: string; elementFilter: HTMLElement }) {
		const { field, elementFilter } = dataFilter ?? {};
		this.$currentOpenChipFiltersColumn = field;
		this.$elementFilterPositionRef = elementFilter;
		this.$openChipFilters = true;
	}

	/**
	 *
	 * @returns
	 */
	getEmptyState() {
		return `<div class="empty-state">
					<scib-ui-v2-empty-state
						description="${this.$literals.emptyStateTableDescription ?? 'Try to change the search inputs to get other results.'}"
						image="${assetUrl(this.$config.emptyStateTablePathIcon ?? '/assets/images/i-laptop-coffee.svg')}"
						main-title="${this.$literals.emptyStateTableTitle ?? 'No results found'}"
						size="md">
					</scib-ui-v2-empty-state>
				</div>`;
	}
	setColumnIconFilter(columns: any) {
		const columnWithFilters = this.getColumnsWithFilters();
		let newColumns = columns.map((element) => {
			const filterFields = columnWithFilters.map((filterElement) => filterElement.field);
			if (filterFields.includes(element.field)) {
				let _titleFormatter = 'filterManagerHeader';
				return (element = {
					...element,
					titleFormatter: _titleFormatter,
					titleFormatterParams: {
						...element.titleFormatterParams,
						titleFormatterFunc: element?.titleFormatterParams?.titleFormatterFunc ?? element.titleFormatter
					}
				});
			} else {
				return (element = {
					...element,
					titleFormatter: element?.titleFormatterParams?.titleFormatterFunc ?? element.titleFormatter ?? 'tooltipHeader'
				});
			}
		});
		return newColumns;
	}

	loadAssetsImagesUrl() {
		const pathAssets = trimEnd(getPublicUrl(), '/');

		this._hostRef.style.setProperty('--url-assets-images-arrow-up', `url(${pathAssets}/assets/images/arrow_up.svg)`);
		this._hostRef.style.setProperty('--url-assets-images-arrow-up-hover', `url(${pathAssets}/assets/images/arrow_up_hover.svg)`);
		this._hostRef.style.setProperty('--url-assets-images-arrow-down', `url(${pathAssets}/assets/images/arrow_down.svg)`);
		this._hostRef.style.setProperty('--url-assets-images-arrow-down-hover', `url(${pathAssets}/assets/images/arrow_down_hover.svg)`);
		this._hostRef.style.setProperty('--url-assets-images-arrow-left', `url(${pathAssets}/assets/images/arrow_left.svg)`);
		this._hostRef.style.setProperty('--url-assets-images-arrow-left-hover', `url(${pathAssets}/assets/images/arrow_left_hover.svg)`);
		this._hostRef.style.setProperty('--url-assets-images-arrow-right', `url(${pathAssets}/assets/images/arrow_right.svg)`);
		this._hostRef.style.setProperty('--url-assets-images-arrow-right-hover', `url(${pathAssets}/assets/images/arrow_right_hover.svg)`);
	}

	/**
	 * Prepare list of columns
	 */
	reorganizeColumnsTable(newValue: string | any[]) {
		const listFrozenLeft = [];
		const listFrozenContent = [];
		const listContentData = [];
		const listFrozenRight = [];
		let columns = [...parseProp<any[]>(newValue, [])];
		// when remove this deprecated, isnt necesary refactor code
		columns = this.restructureListColumnsForUniqueColumnRight(columns);
		columns = this.setColumnIconFilter(columns);
		columns.forEach((column) => {
			const _formatter = column?.formatter || null;
			if (LIST_FROZEN_FORMATTER_LEFT.some((columnFormatter) => columnFormatter === _formatter)) {
				listFrozenLeft.push({ ...column, ...fixedColumns.rowSelectionCheckbox });
			} else if (LIST_FROZEN_FORMATTER_RIGHT.some((columnFormatter) => columnFormatter === _formatter)) {
				if (_formatter === 'actionTable') {
					const columnRewrite = {
						...column,
						...fixedColumns.actionTable
					};

					this._hostRef?.style.setProperty(
						'--tabulator-min-width-action-table',
						`${calculateMinWidthAction(columnRewrite.formatterParams)}px`
					);

					listFrozenRight.push(columnRewrite);
				} else {
					listFrozenRight.push(column);
				}
			} else if (column.frozen) {
				listFrozenContent.push(column);
			} else {
				listContentData.push(column);
			}
		});
		const listColumnsReorganized = [].concat(listFrozenLeft, listFrozenContent, listContentData, listFrozenRight);

		return applyDefaultConfigToColumns(listColumnsReorganized);
	}
	/**
	 * Remove this method when all team use unique folumn frozen
	 *
	 * @param columns
	 * @deprecated
	 */
	private restructureListColumnsForUniqueColumnRight(columns: any[]) {
		let columnsReorganized = columns ?? [];

		const fakeColumnAction = {
			field: 'actionTable',
			formatter: 'actionTable',
			maxWidth: false,
			resizable: false,
			frozen: true,
			formatterParams: {}
		};

		columnsReorganized = columnsReorganized.reduce((acc, column) => {
			const _formatter = column?.formatter || null;

			if (ListColumnsExclude.some((formatter) => formatter === _formatter)) {
				if (_formatter === 'actionMenu' || _formatter === 'showInfo') {
					fakeColumnAction.formatterParams[_formatter] = column?.formatterParams;
				} else if (_formatter === 'moveUp' || _formatter === 'moveDown') {
					fakeColumnAction.formatterParams['moveRow'] = true;
				} else if (_formatter === 'showDetail') {
					fakeColumnAction.formatterParams['showDetail'] = {};
				} else if (_formatter === 'deleteRow') {
					fakeColumnAction.formatterParams['customActions'] = [
						{
							icon: 'trash-bin',
							action: TableCustomEvents.REMOVE_ROW
						}
					];
				}
			} else {
				acc.push(column);
			}

			return acc;
		}, []);

		if (!isEmpty(fakeColumnAction.formatterParams)) {
			columnsReorganized.push(fakeColumnAction);
		}

		return columnsReorganized;
	}

	/**
	 * Before component render
	 */
	componentWillRender() {}
	/**
	 *
	 */
	componentDidRender() {
		this._tableReferences = References.instance;
		this._tableReferences.setComponent(this._tableUuid, this);
		this._tableReferences.setHostRef(this._tableUuid, this._hostRef);
	}
	/**
	 *
	 */
	private _setSkeletonMinHeight() {
		if (this._skeletonRef) {
			this._hostRef?.style.setProperty('--tabulator-table-container-min-height', `${this._skeletonRef?.offsetHeight}px`);
			this._hostRef?.style.setProperty('--tabulator-table-skeleton-visibility', 'visible');
			requestAnimationFrame(() => (this.$skeletonReady = true));
		}
	}

	/**
	 *
	 */
	private _destroy() {
		// Limpiar listeners de Tabulator antes de destruir otros componentes
		this._cleanListenerTabultator();

		if (!isEmpty(this._menuPanel) && this._menuPanel.destroy) {
			this._menuPanel.unlisten('MDCMenu:selected', () => {});
			this._menuPanel.unlisten('MDCMenuSurface:closed', () => {});
			this._menuPanel.destroy();
		}
		if (!isEmpty(this._sizeSelector) && this._sizeSelector.destroy) {
			this._sizeSelector.unlisten('MDCMenu:selected', () => {});
			this._sizeSelector.unlisten('MDCMenuSurface:closed', () => {});
			this._sizeSelector.destroy();
		}
		removeClickOutside(this, this._hostRef.shadowRoot.getElementById('chip-container'), () => {});
	}

	private _cleanListenerTabultator() {
		// Limpiar listeners de Tabulator solo si la instancia existe y los eventos han sido registrados
		if (this._tableInstance && this._eventsRegistered) {
			this._tableInstance.off('renderComplete');
			this._tableInstance.off('tableBuilt');
			this._tableInstance.off('scrollHorizontal');
			this._tableInstance.off('columnResized');
			this._tableInstance.off('dataSorting');
			this._tableInstance.off('cellEdited');
			this._tableInstance.off('rowSelectionChanged');
			this._eventsRegistered = false;
		}
	}

	/**
	 * TODO: REVIEW
	 */
	private _initListeners(tableContainer: HTMLElement) {
		tableContainer.appendChild(this._tableInstance.element);
		if (!this._tableInstance) return;

		this._cleanListenerTabultator();
		this._tableInstance.on('tableBuilt', () => {
			// overlay its necessary because, at use overflow visible for filter inputs, the width for row its higher
			// so to hidden the header columns frozen its necesary another div on this to simulate
			const header = tableContainer.querySelector('.tabulator-header');
			const overlay = document.createElement('div');
			overlay?.classList.add('tabulator-headers-overlay');
			overlay.style.setProperty('--_organisms-optimized-data-table-header-filter-row-visibility', `${this._showFilterRow ? 'block' : 'none'}`);
			overlay.style.display = 'var(--_organisms-optimized-data-table-header-filter-row-visibility)';
			header.appendChild(overlay);

			this._updateTableHeight();
			this.changeValueMultiselectCheckbox();

			this._tableInstance.redraw();
			this.tableBuilt.emit();
		});

		this._tableInstance.on('scrollHorizontal', (event) => {
			this._hostRef.style.setProperty('--table-scroll-translations', `${-event}px`);
		});

		this._tableInstance.on('columnResized', (event) => {
			this.resizedColumnSaver(event);
			this.sendColumnResized.emit(this.$columns);
			// this is necesary because we need recalculate witdh of overlay in case of user resize width column of table actions, this is mandatory because the free space
			// in case that column not fill the table, this free space es joint at last column
			this._recalculateOverlayFrozenColumns();
		});

		this._tableInstance.on('renderComplete', () => {
			this.tableRenderComplete.emit();
		});

		this._tableInstance.on('dataSorting', (sorters) => {
			if (sorters) {
				const listOrder = sorters.reduce((acc, item) => {
					const { field, dir } = item;
					acc[field] = dir;
					return acc;
				}, {});
				if (!isEqual(this._currentOrderParams.sorters, listOrder)) {
					this._currentOrderParams = { ...this._currentOrderParams, sorters: listOrder };
					if (this.$delegateFilterManagement) {
						this.delegateChanges.emit(this._currentOrderParams);
					}
					this.sortersChanges.emit(this._currentOrderParams.sorters);
				}
			}
		});

		// Marcar que los eventos han sido registrados
		this._eventsRegistered = true;
	}

	emitEditingCell(value: any, cell: TableCell) {
		this.cellEditing.emit({ value, cell });
	}

	emitEditedCell(value: any, cell: TableCell) {
		this.cellEdited.emit({ value, cell });
	}

	private selectedRowTabulator(cellTabulator) {
		if (cellTabulator.getRow().getData().isSelectedCheckbox || cellTabulator.getRow().getData().isSelectedRadio) {
			cellTabulator.getRow().select();
		} else {
			cellTabulator.getRow().deselect();
		}
	}

	/**
	 *
	 */
	private _recalculateOverlayFrozenColumns() {
		const actionColumns = (this.$visibleColumns || []).find((column) => {
			return column.frozen && column?.formatter === 'actionTable';
		});

		if (actionColumns) {
			const containerData = this._tableInstance.element.querySelector('.tabulator .tabulator-tableholder');
			const haveScrollVertical = containerData?.scrollHeight > containerData?.clientHeight;

			const heightHeader =
				this._tableInstance.element.querySelector('.tabulator .tabulator-header')?.clientHeight || this._calculateDefaultHeader();

			const frozenActionHeader = this._tableInstance.element.querySelector('.tabulator .tabulator-action-table-header-col');

			this._hostRef.style.setProperty('--frozen-columns-raw-height', `${heightHeader || 0}px`); // less 2 for border content table
			this._hostRef.style.setProperty(
				'--frozen-columns-raw-width',
				`${(frozenActionHeader?.clientWidth ?? calculateMinWidthAction(actionColumns.formatterParams)) + (haveScrollVertical ? 17 : 0)}px`
			);
		}
	}

	private resizedColumnSaver(column) {
		const resizedColumns = this.$columns.map((col) => {
			if (col.field === column.getDefinition().field) {
				const newWidth = column.getWidth();
				col.width = newWidth;
			}
			return col;
		});
		this.$columns = resizedColumns;
	}

	/**
	 *
	 */
	private _unSelectRows(ids: string[] | number[] | string | undefined) {
		if (this._tableInstance) {
			if (isEmpty(ids)) {
				this._tableInstance.deselectRow();
			} else {
				const lisOfIds = this._idsToArray(ids);
				this._tableInstance.deselectRow(lisOfIds);
			}
		}
	}

	/**
	 *
	 */
	private _selectRows(ids: string[] | number[] | string | undefined) {
		if (this._tableInstance) {
			if (isEmpty(ids)) {
				this._tableInstance.selectRow();
			} else {
				const lisOfIds = this._idsToArray(ids);
				this._tableInstance.selectRow(lisOfIds);
			}
		}
	}

	/**
	 *
	 */
	private _idsToArray(ids: string[] | number[] | string) {
		return typeof ids === 'string' ? ids.split(',') : ids;
	}

	private async calculateContentTableHeight() {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				const itemsVisible = this.$paginatorConfig.paginationSize;
				const itemsTableVisible = this._tableInstance.getDataCount(RESERVED_PROPERTIES_TABULATOR.ACTIVE) ?? this.$rowData.length;
				const rowLenght = this.$rowData.length > itemsTableVisible ? itemsTableVisible : this.$rowData.length;
				const items =
					(rowLenght && itemsVisible > rowLenght) || itemsVisible === TABLE_SIZE_CODE_ALL
						? rowLenght
						: itemsVisible > 0
						? itemsVisible
						: TABLE_SIZE_ROWS_DEFAULT;
				const heightContentByTabulator = this._tableInstance.element.querySelector('.tabulator-tableholder .tabulator-table')?.clientHeight;

				// Usar el valor personalizado si $rowsize es un número, de lo contrario usar el valor definido en TABLE_ROW_SIZES_WITH_BORDER
				const rowHeight = typeof this.$rowsize === 'number' ? this.$rowsize : TABLE_ROW_SIZES_WITH_BORDER[this.$rowsize as RowSizesEnum];

				let heightContent = items * rowHeight;

				if (items < itemsVisible && itemsVisible !== TABLE_SIZE_CODE_ALL) {
					const limitMaxPerSize = itemsVisible * rowHeight;
					heightContent =
						limitMaxPerSize < heightContentByTabulator && heightContentByTabulator > rowHeight
							? limitMaxPerSize
							: heightContentByTabulator;
				}

				resolve(heightContent);
			});
		});
	}

	/**
	 * Tabulator only need define a height when is infinite scroll vertical
	 *
	 */
	private async _updateTableHeight() {
		if (this._tableInstance) {
			if (this.$localInfiniteScroll) {
				const containerData = this._tableInstance.element.querySelector('.tabulator .tabulator-tableholder');

				const haveScrollHorizontal = containerData?.scrollWidth > containerData?.clientWidth;

				const heightContent = await this.calculateContentTableHeight();

				const heightHeader =
					this._tableInstance.element.querySelector('.tabulator .tabulator-header')?.clientHeight || this._calculateDefaultHeader();

				const totalHeight = heightHeader + heightContent + (haveScrollHorizontal ? 20 : 0) + 3; // Last 3 is for

				//If table instance dont have child elemente means that dont charge yet in DOM, so you can update options data before charge without redraw it
				if (this._tableInstance.element.childElementCount > 0) {
					this._tableInstance.setHeight(totalHeight);
				} else {
					this._tableInstance.options.height = `${totalHeight}px`;
				}
				// the reset is necesary to recalculate de horizontal scroll and the long of negative margin left on header in x axis
				if (this._tableInstance.element.querySelector('.tabulator-tableholder')) {
					this._tableInstance.element.querySelector('.tabulator-tableholder').scrollTo({ left: 0 });
					this._hostRef.style.setProperty('--table-scroll-translations', `0px`);
				}
			} else {
				// To avoid a redraw when the table is not in DOM. It is a console error if there is not a check.
				if (this._tableInstance.element?.checkVisibility()) {
					requestAnimationFrame(() => {
						try {
							this._tableInstance.redraw();
						} catch (_) {}
					});
				}
			}

			this._recalculateOverlayFrozenColumns();
		}
	}

	/**
	 *
	 */
	private _calculateDefaultHeader() {
		// TODO refactor this how calculate default value for precharge table
		return 28;
	}

	/**
	 * Set config mandatory by managerControl
	 */
	private _getControlConfig() {
		let typePaginationDefualt = { pagination: this.$config.pagination };

		if (this.$localInfiniteScroll) {
			return { pagination: false, maxHeight: '100%' };
		} else if (this.$delegateFilterManagement) {
			typePaginationDefualt = { pagination: true };
		}

		return {
			...{ typePaginationDefualt },
			paginationSize: get(this.$paginatorConfig, 'paginationSize'),
			paginationSizeSelector: get(this.$paginatorConfig, 'paginationSizeSelector'),
			paginationInitialPage: get(this.$paginatorConfig, 'paginationInitialPage'),
			paginationButtonCount: get(this.$paginatorConfig, 'paginationButtonCount')
		};
	}

	/**
	 *
	 */
	private _disableAutoLoading() {
		if (this.controlManager !== 'local') {
			this._loadingHandler(false);
		}
	}

	/**
	 *
	 */
	private _registerCustomModules() {
		Tabulator.extendModule('format', 'formatters', getCustomFormatters);
		Tabulator.extendModule('format', 'formatters', getCustomHeaderFormatters(this._tableInstance, this));
		Tabulator.extendModule('edit', 'editors', getCustomEditors);
		Tabulator.extendModule('filter', 'filters', { between: betweenFilter });
	}

	/**
	 *
	 */
	private onTabRowSizeChange(idTab: RowSizesEnum) {
		this.setTabRowSize(idTab);

		if (this.$currentViewObject?.idType === VIEW_TYPES_ENUM.CUSTOM_VIEWS) {
			this.selectRowSize.emit(this.$rowsize);
		}
	}

	private setTabRowSize(idTab: RowSizesEnum) {
		// Establecer el estado con el valor correcto
		this.$rowsize = idTab;

		// Actualizaciones necesarias para aplicar el cambio
		this._resetContainer();
		this._updateHeightAfterRender = true;
	}

	/**
	 *
	 */
	private _countCustomViews() {
		const customViews = get(first(this.$itemList.filter((type) => type.id === VIEW_TYPES_ENUM.CUSTOM_VIEWS)), 'views', []);
		this.$countCustomViews = customViews.length;
	}

	/**
	 * this function are callback for event change input of row selection by checkbox
	 * @param data
	 */
	public changeRowSelectionCheckbox(data: { field: string; value: any; cell: any; rowData: any }) {
		data.rowData.isSelectedCheckbox = data.value.checkboxValue === 'indeterminate' || data.value.checkboxValue === 'checked';
		this.changeValueMultiselectCheckbox();
		this.emitChangeMultipleCheckbox();
		this.selectedRowTabulator(data.cell);
	}

	public changeValueMultiselectCheckbox() {
		const haveMultiselect = this._tableInstance.options.columns.some(
			(column) => column.titleFormatter === 'checkboxHeader' && column.formatter === 'rowSelectionCheckbox'
		);
		if (haveMultiselect) {
			const listSelected = this._tableInstance.getRows().map((row) => row.getData());
			const multipleValue = listSelected.every((rowData) => rowData.isSelectedCheckbox)
				? 'checked'
				: listSelected.some((rowData) => rowData.isSelectedCheckbox)
				? 'indeterminate'
				: 'unchecked';
			this._tableInstance.columnManager.element.querySelector('scib-ui-v2-checkbox').value = multipleValue;
			this.statusMultipleSelected = multipleValue;
		}
	}

	/**
	 *this function are callback for event change input of row selection by radio
	 * @param data
	 */
	public changeRowSelectionRadio(data: { field: string; value: boolean; cell: any; rowData: any }) {
		this._tableInstance.getRows().forEach((row) => {
			row.getData().isSelectedRadio = false;
			if (row.getElement().querySelector('scib-atoms-group-radio-button'))
				row.getElement().querySelector('scib-atoms-group-radio-button').shadowRoot.querySelector('input').checked = false;
		});
		data.rowData.isSelectedRadio = data.value;
		data.cell.getElement().querySelector('scib-atoms-group-radio-button').shadowRoot.querySelector('input').checked =
			data.rowData.isSelectedRadio;
		this.selectedRows.emit(
			this._tableInstance
				.getRows()
				.map((row) => row.getData())
				.filter((rowData) => rowData.isSelectedRadio)
		);
		this.selectedRowTabulator(data.cell);
	}

	/**
	 *this function are callback for event change input of row selection by radio
	 * @param data
	 */
	public emitChangeMultipleCheckbox() {
		this.selectedRows.emit(
			this._tableInstance
				.getRows()
				.map((row) => row.getData())
				.filter((rowData) => rowData.isSelectedCheckbox)
		);
	}

	/**
	 *this function are callback for event ischanging input of editor cell
	 * @param data
	 */
	public emitChangingValueCell() {
		this.selectedRows.emit(
			this._tableInstance
				.getRows()
				.map((row) => row.getData())
				.filter((rowData) => rowData.isSelectedCheckbox)
		);
	}

	/**
	 *
	 */
	getFavouriteView() {
		let favouriteView: { view: View; idType: VIEW_TYPES_ENUM };
		(this.$itemList || []).forEach((item) => {
			const favourite = item.views.filter((view) => view.favourite);
			if (favourite.length) {
				favouriteView = {
					view: favourite[0],
					idType: item.id
				};
			}
		});
		if (isEmpty(this.$currentViewObject)) {
			if (favouriteView) {
				this.$currentViewObject = {
					idType: favouriteView.idType,
					currentView: favouriteView.view
				};
			} else {
				const defaultView = this.$itemList.find((type) => type.id === VIEW_TYPES_ENUM.DEFAULT_VIEWS);
				if (!isEmpty(defaultView)) {
					const tableViews = get(defaultView, 'views', []);
					this.$currentViewObject = {
						idType: get(defaultView, 'id', VIEW_TYPES_ENUM.DEFAULT_VIEWS),
						currentView: tableViews.find((view) => view.id === 'default')
					};
					this.$currentViewObject.currentView.favourite = true;
				} else {
					this.$currentViewObject = {
						idType: this.$itemList[0].id,
						currentView: this.$itemList[0].views[0]
					};
				}
			}
			this.setTabRowSize(this.$currentViewObject.currentView.rowSize);
		}
	}

	/**
	 *
	 */
	deleteView() {
		const customViews = get(first(this.$itemList.filter((type) => type.id === VIEW_TYPES_ENUM.CUSTOM_VIEWS)), 'views', []);
		customViews.splice(customViews.indexOf(this.$currentViewObject.currentView), 1);
		this._countCustomViews();
		this.$currentViewObject = null;
		this.getFavouriteView();
		this.setView(this.$currentViewObject.currentView);
		this.$deleteView = false;
	}

	/**
	 *
	 */
	setColumns() {
		this.$shownColumns = this.$editingView.columns;
		this._setHiddenColumnsFixed();
		this.$hiddenColumns = this.$hiddenColumnsFixed;
	}

	/**
	 *
	 */
	private setVisibleColumns(showFields, view) {
		let orderCols = [...this.$columns.filter((column) => showFields?.includes(column.field))].sort(
			(firstField, laterField) => showFields.indexOf(firstField.field) - showFields.indexOf(laterField.field)
		);
		let existCheckOrRadio =
			orderCols.filter((column) => column.formatter && !column.field).length > 0
				? []
				: this.$columns.filter((column) => column.formatter && !column.field);
		let checkForActionsColumns =
			orderCols.filter((column) => !column.title && column.field).length > 0
				? []
				: this.$columns.filter((column) => !column.title && column.field);
		let newCols = [...existCheckOrRadio, ...orderCols, ...checkForActionsColumns];
		this.$visibleColumns = newCols.map((column) => {
			if (view?.columns.some((c) => c.field == column.field || column?.fixed || column?.frozen)) column.visible = true;
			else column.visible = false;
			return column;
		});
		this.$visibleColumns = this.reorganizeColumnsTable(this.$visibleColumns);
		this.setColumnsFilterSubHeader();
		this._resetContainer();
	}
	@Method() async setView(view: View) {
		this.$currentViewObject.currentView = view;
		let shownFields: string[] = this.$currentViewObject?.currentView.columns.map((column) => column.field);
		this.setVisibleColumns(shownFields, view);
		this.setFilterColumnIcons();
		if (this._tableInstance) {
			this._tableInstance.setColumns(this.$visibleColumns);
			this._tableReferences.setScrollGap(this._tableUuid);
		}
	}

	/**
	 *
	 */
	private _resetContainer(): void {
		if (this._tableInstance) {
			if (this._tableInstance.element.querySelector('.tabulator-tableholder')) {
				this._tableInstance.element.querySelector('.tabulator-tableholder').scrollTo(0, 0);
				this._hostRef.style.setProperty('--table-scroll-translations', `0px`);
			}
			if (this.controlManager === 'local') {
				this._updatePaginatorConfig();
			}
		}
	}

	/**
	 *
	 */
	private _setCurrentViewName(newName: string) {
		this.$currentViewName = newName;
	}

	/**
	 *
	 * @param type
	 * @param value
	 */
	setDataLayer(type: string, value, view?: View) {
		switch (type) {
			case EventsAnalytics.CHIP_FILTERS:
				if (value) {
					(window as any).dataLayer?.push({
						event: 'ev_element',
						element: {
							actionName: 'show',
							elementName: 'filters',
							'01': this.$analytics.label01,
							'02': this.$analytics.label02 || ''
						},
						event_category: this.$analytics.eventCategory,
						event_action: 'show',
						event_label: 'filters'
					});
				}
				break;
			case EventsAnalytics.CREATE_MODAL:
				let newCols = [];
				let newColsNames = [];
				let eventModal: any = {
					event: value ? 'ev_start_process' : 'ev_end_process',
					process: {
						category: 'custom_view',
						name: 'create',
						step: value ? 1 : 2,
						feedback: value ? 'uncomplete' : 'complete',
						label01: this.$analytics.label01,
						label02: this.$analytics.label02 || ''
					},
					event_category: this.$analytics.eventCategory,
					event_action: 'create',
					event_label: 'custom_view'
				};
				if (!value) {
					newCols = this.$columns.filter((column) => column.visible && (column.titleDescription || column.title));
					newCols.forEach((column) => {
						if (column.titleDescription) {
							newColsNames.push(column.titleDescription?.replace(/\s+/g, '_').toLowerCase());
						} else if (column.title) {
							newColsNames.push(column.title?.replace(/\s+/g, '_').toLowerCase());
						}
					});
					eventModal.process.label04 = view.favourite;
					eventModal.process.label05 = newColsNames.join('|');
				}
				(window as any).dataLayer?.push(eventModal);
				break;
			case EventsAnalytics.SELECT_A_VIEW:
				let actionName: string = '';
				if (value?.idType == 'custom-views') {
					actionName = 'custom';
				} else {
					actionName = 'default';
				}
				{
					(window as any).dataLayer?.push({
						event: 'ev_element',
						element: {
							clickZone: 'content',
							actionName: actionName,
							elementName: 'select_view',
							'01': this.$analytics.label01,
							'02': this.$analytics.label02 || ''
						},
						event_category: this.$analytics.eventCategory,
						event_action: actionName,
						event_label: 'select_view'
					});
				}
				break;

			case EventsAnalytics.SIZE_TABS:
				(window as any).dataLayer?.push({
					event: 'ev_element',
					element: {
						clickZone: 'content',
						actionName: value,
						elementName: 'fit_width',
						'01': this.$analytics.label01,
						'02': this.$analytics.label02 || ''
					},
					event_category: this.$analytics.eventCategory,
					event_action: value,
					event_label: 'fit_width'
				});
				break;
			case EventsAnalytics.VIEW_SELECTOR:
				(window as any).dataLayer?.push({
					event: 'ev_element',
					element: {
						clickZone: 'content',
						actionName: value ? 'open' : 'closed',
						elementName: 'select_view',
						'01': this.$analytics.label01,
						'02': this.$analytics.label02 || ''
					},
					event_category: this.$analytics.eventCategory,
					event_action: value ? 'open' : 'closed',
					event_label: 'select_view'
				});
				break;
			case EventsAnalytics.ITEMS_VISIBLE:
				(window as any).dataLayer?.push({
					event: 'ev_element',
					element: {
						clickZone: 'content',
						actionName: value,
						elementName: 'items_visible',
						'01': this.$analytics.label01,
						'02': this.$analytics.label02 || ''
					},
					event_category: this.$analytics.eventCategory,
					event_action: value,
					event_label: 'items_visible'
				});
				break;
			case EventsAnalytics.SEND_FILTER:
				if (this.controlManager == 'local' || this.controlManager == 'localInfiniteScroll') {
					this._tableInstance.getFilters().forEach((element) => {
						if (!this.analyticsFilters.includes(element.field)) {
							this.analyticsFilters.push(element.field);
						}
					});
					(window as any).dataLayer?.push({
						event: 'ev_apply_flter',
						filter: {
							type: 'table',
							desing: 'boxFilter',
							bubbles: this.analyticsFilters.join('|'),
							'01': this.$analytics.label01,
							'02': this.$analytics.label02 || ''
						},
						event_category: this.$analytics.eventCategory,
						event_action: 'boxFilter',
						event_label: 'items_visible'
					});
				}
				break;
		}
	}

	/**
	 *
	 */
	handleClickedOption(menuIndex: number, submenuIndex?: number) {
		this.$currentViewObject = {
			idType: this.$itemList[menuIndex].id,
			currentView: get(this.$itemList[menuIndex].views, submenuIndex)
		};
		this.$shownColumns = this.$currentViewObject.currentView.columns;
		this.setView(this.$currentViewObject.currentView);
		this._toggleMenu(false, false);
		this.setDataLayer(EventsAnalytics.SELECT_A_VIEW, this.$currentViewObject);
		this.setTabRowSize(this.$currentViewObject.currentView.rowSize);
	}

	/**
	 *
	 */
	private _toggleMenu(open: boolean, fromHandler?: boolean) {
		this.$openViewsMenu = open;
		if (this._menuPanel && (this.$itemList || []).length > 0) {
			this._menuPanel.open = !!this.$openViewsMenu;
		}
		if (!fromHandler) {
			this.setDataLayer(EventsAnalytics.VIEW_SELECTOR, this.$openViewsMenu);
		}
	}

	/**
	 *
	 * @param open
	 */
	private _toggleSizeSelector(open) {
		this.$openSizeSelectorPanel = open;
		this._sizeSelector.open = this.$openSizeSelectorPanel;
	}

	/**
	 *
	 * @param number
	 */
	_handleSizeClicked(number: number) {
		this._toggleSizeSelector(false);
		this.$paginatorConfig.paginationSize = number;
		this._updateHeightAfterRender = true;
		this._paginationChangeHandler({ detail: { tableUuid: this._tableUuid, currentPage: 0, itemsPerPage: number || 10 } } as any);
		this.setDataLayer(EventsAnalytics.ITEMS_VISIBLE, this.$paginatorConfig.paginationSize);
	}

	/**
	 *
	 */
	private _menuActions(action: string) {
		switch (action) {
			case 'create':
				this.$editingView = {
					id: undefined,
					label: undefined,
					favourite: false,
					columns: []
				};
				this.setColumns();
				this.$createModal = true;
				this.$openModalView = true;
				this.$currentViewName = '';
				this.$prviousViewObjectIdType = this.$currentViewObject.idType;
				this.$currentViewObject.idType = VIEW_TYPES_ENUM.CUSTOM_VIEWS;
				this.setDataLayer(EventsAnalytics.CREATE_MODAL, true);
				break;
			case 'personalise':
				this.$editingView = { ...this.$currentViewObject.currentView };
				this.setColumns();
				this.$createModal = false;
				this.$openModalView = true;
				this.$currentViewName = this.$editingView.label;
				break;
			case 'delete':
				this.$deleteView = true;
				this._openModalCancel(true);
				break;
			default:
				console.error('no event matched');
				break;
		}
	}

	/**
	 *
	 */
	private _saveHandler(save?: boolean, deleteView?: boolean) {
		if (save) {
			this.$itemList.forEach((type) =>
				type.views.forEach((view) => {
					if (view.id !== this.$editingView.id && this.$editingView.favourite && view.favourite) {
						view.favourite = false;
					}
				})
			);
			this.$createModal
				? this.createCustomViews()
				: this.$itemList.forEach((type, typeId) =>
						type.views.forEach((view, viewId) => {
							if (view.id == this.$editingView.id) {
								this.$itemList[typeId].views[viewId] = this.$editingView;
							}
						})
				  );
			this.setColumns();
			this.$currentViewObject.currentView = this.$editingView;
			this.setView(this.$currentViewObject.currentView);
			if (this.$createModal) {
				this.setDataLayer(EventsAnalytics.CREATE_MODAL, false, this.$currentViewObject.currentView);
			}
			this.customizedViews.emit(this.$itemList.filter((type) => type.id === VIEW_TYPES_ENUM.CUSTOM_VIEWS)[0]);
		} else {
			if (deleteView) {
				this.deleteView();
				this.customizedViews.emit(this.$itemList.filter((type) => type.id === VIEW_TYPES_ENUM.CUSTOM_VIEWS)[0]);
			}
			if (this.$hasChanges) {
				this.$currentViewObject.idType = this.$prviousViewObjectIdType || this.$currentViewObject.idType;
			}
		}
		this.changeView.emit(this.$currentViewObject?.currentView.id);
		this.$openModalView = false;
		this.$openViewsMenu = false;
		this.$closeModal = false;
		this.$hasChanges = false;
		this.firstTimeNewView = true;
		this.$editingView = {
			id: undefined,
			label: undefined,
			favourite: false,
			columns: []
		};
	}

	/**
	 *
	 */
	private createCustomViews() {
		if (!this.$itemList.filter((type) => type.id === VIEW_TYPES_ENUM.CUSTOM_VIEWS)[0]) {
			this.$itemList.push({
				title: this.$literals.titleCustomViews,
				type: 'view',
				id: VIEW_TYPES_ENUM.CUSTOM_VIEWS,
				views: []
			});
		}
		this.$editingView = {
			...this.$editingView,
			rowSize: (this.$rowsize ?? RowSizesEnum.MEDIUM) as RowSizesEnum
		};
		this.$itemList.filter((type) => type.id === VIEW_TYPES_ENUM.CUSTOM_VIEWS)[0].views.push(this.$editingView);
		this.$currentViewObject.idType = VIEW_TYPES_ENUM.CUSTOM_VIEWS;
		this._countCustomViews();
		this.setTabRowSize(this.$editingView.rowSize);
	}

	/**
	 *
	 */
	private _setFavourite(event) {
		this.$editingView.favourite = event.detail.checkboxValue === 'checked';
		this.$hasChanges = true;
	}

	/**
	 *
	 */
	private _openModalCancel(open: boolean) {
		this.$closeModal = open;
	}

	private _closeModalViews() {
		this.$openModalView = false;
		this.$currentViewObject.idType = this.$prviousViewObjectIdType || this.$currentViewObject.idType;
	}

	/**
	 *
	 */
	private _setLabelView(event: CustomEvent) {
		this.$editingView.label = event.detail;
		this._setCurrentViewName(event.detail);
		if (this.$createModal) this.$editingView.id = kebabCase(event.detail);
		this.$hasChanges = true;
	}

	/**
	 *
	 */
	private _searchColumns(event: string) {
		this.$shownColumns = this.$editingView.columns.filter((column) => column.title.toLowerCase().includes(event.toLowerCase()));
		this.$hiddenColumns = this.$hiddenColumnsFixed.filter((column) => column.title.toLowerCase().includes(event.toLowerCase()));
	}

	/**
	 *
	 */
	private _changeVisivility(state: boolean, column: any) {
		if ((state && this.validateAddToViewColumns(this.$editingView.columns.length + 1)) || !state) {
			this.$shownColumns = this._modifyColumns(state, column, this.$shownColumns);
			this.$editingView.columns = this._modifyColumns(state, column, this.$editingView.columns);
			this.$hiddenColumns = this._modifyColumns(!state, column, this.$hiddenColumns);
			this._setHiddenColumnsFixed();
			this.$hasChanges = true;
		}
	}

	/**
	 *
	 */
	private _modifyColumns(state: boolean, column: any, arrayColumns: any) {
		return state ? [...arrayColumns, column] : arrayColumns.filter((columnE) => columnE.field !== column.field);
	}

	/**
	 *
	 */
	private _setHiddenColumnsFixed() {
		this.$hiddenColumnsFixed = [];
		this.$allHidden = this.$shownColumns.length !== 0;
		const columns = parseProp<any[]>(this.columns, []);
		columns.forEach((column) => {
			const columnHidden = this.$editingView.columns.filter((elem) => elem.field === column.field);
			if (!columnHidden.length && column.title) {
				this.$hiddenColumnsFixed.push({ title: column.title, field: column.field });
			}
		});
	}

	/**
	 *
	 */
	private _changeVisivilityAll(state: boolean) {
		if (!state) {
			if (this.validateAddToViewColumns(this.$editingView.columns.length + this.$hiddenColumns.length)) {
				this.$shownColumns = this.$shownColumns.concat(this.$hiddenColumns);
				this.$editingView.columns = this.$editingView.columns.concat(this.$hiddenColumns);
				this.$hiddenColumns = [];
				this._setHiddenColumnsFixed();
				this.$hasChanges = true;
			}
		} else {
			this.$hiddenColumns = this.$hiddenColumns.concat(this.$shownColumns);
			const columnsHidden = this.$shownColumns.map((doc) => doc.field);
			this.$editingView.columns = this.$editingView.columns.filter((columns) => !columnsHidden.includes(columns.field));
			this.$shownColumns = [];
			this._setHiddenColumnsFixed();
			this.$hasChanges = true;
		}
	}

	private validateAddToViewColumns(newLength: number) {
		return !(isNumber(this.$config?.maxColumnsPerView) && newLength > this.$config?.maxColumnsPerView);
	}

	private checkAbleShowAll() {
		return (
			!isNumber(this.$config?.maxColumnsPerView) ||
			(isNumber(this.$config?.maxColumnsPerView) &&
				this.$editingView.columns.length + this.$hiddenColumns.length < this.$config?.maxColumnsPerView)
		);
	}

	/**
	 *
	 */
	dragOverHandler(column: any) {
		if (column.field !== this._selectedColumn.field) {
			this._lastColumn = column;
		}
	}

	/**
	 *
	 */
	onDropHandler() {
		this._oldIndex = this.$editingView.columns.indexOf(this._selectedColumn);
		let currentIndex = this.$editingView.columns.indexOf(this._lastColumn);
		let removingValue = this.$editingView.columns.filter((value, index) => {
			if (index != this._oldIndex) {
				return value;
			}
		});
		this.$editingView.columns = removingValue.slice(0, currentIndex).concat(this._selectedColumn, removingValue.slice(currentIndex));
		this.$hasChanges = true;
	}

	commonFilterActions() {
		this.setFilterColumnIcons();
		this._getActiveFiltersChips();
		this.$elementFilterPositionRef = null;
		this.$openChipFilters = false;
		this._emitFilters();
	}
	/**
	 *
	 * @param newFilter
	 */
	public addFilters(newFilter?: ActiveFilters | null) {
		this._tableInstance.clearFilter(true);
		let serchForFilter = this.$activeFilters.find(
			(element) => element?.field === newFilter?.field && element?.value === newFilter?.value && newFilter?.type === element?.type
		);
		if (!serchForFilter) {
			const newActiveFilter: ActiveFilters = parseProp(newFilter);
			newActiveFilter.id = uuidv4();
			this.$activeFilters.push(newActiveFilter);
		} // TODO UPDATE value if exist??
		this.commonFilterActions();
	}

	/**
	 *
	 */
	public deleteFilters(listFilterToDelete: any[]) {
		// The type its same $chips, replace any for the type of chips of component scib-v2-chips
		remove(this.$activeFilters as never, ({ id }) => listFilterToDelete.some((chipsToDelete) => chipsToDelete.id === id));
		this.clearChips();
		this.commonFilterActions();
	}
	formatValues(value: any, field: any) {
		let searchColumnParams = this.$visibleColumns.find((column) => column.field === field);
		let dateFormat = searchColumnParams?.formatterParams?.outputFormat || 'dd/mm/yyyy';
		let inputFormat = searchColumnParams?.formatterParams?.inputFormat || 'yyyy-LL-dd';
		let formatedValue = '';
		const isTextFilterType = searchColumnParams?.headerFilterType === 'textFieldHeaderFilter';
		const shouldFormatAsNumber = !isTextFilterType && Number(value) && !isNaN(Number(value));
		if (shouldFormatAsNumber) {
			formatedValue = formatNumber(value, searchColumnParams.formatterParams);
		} else if (inputFormat == 'iso') {
			formatedValue = DateTime.fromISO(value).toFormat(dateFormat);
		} else if (DateTime.fromFormat(value, inputFormat)?.isValid) {
			formatedValue = DateTime.fromFormat(value, inputFormat).toFormat(dateFormat);
		} else {
			formatedValue = value;
		}
		return formatedValue;
	}
	/**
	 *
	 */
	private _getActiveFiltersChips() {
		requestAnimationFrame(() => {
			this.$chips = (this.$activeFilters || []).map((filter) => {
				const blankLiteral =
					this.$literals.blankChip && this.$literals.symbol ? `${this.$literals?.blankChip} (${this.$literals.symbol})` : 'Blank';
				const { field, type, value, label, fieldTitle } = filter;
				let showValue: string = value;
				let addType = type !== '=' && type !== 'between' ? type : ' '; //Ux has decided that between filter and equal will be not shown any symbol
				if (Array.isArray(value)) {
					if (type == 'between') {
						showValue = this.formatValues(value[0], filter.field) + ' - ' + this.formatValues(value[1], filter.field);
					} else {
						showValue =
							addType + ' ' + filter.value.map((value: any) => (value === '' ? blankLiteral : this.formatValues(value, filter.field)));
					}
				} else {
					showValue = value === '' ? addType + ' ' + blankLiteral : addType + ' ' + this.formatValues(value, filter.field);
				}
				return {
					id: filter.id,
					field: field || '',
					label: this.$literals[label] || label || fieldTitle || field,
					value: value || '', //tooltip value
					showValue: showValue //chip value
				};
			});
		});
	}

	/**
	 *
	 */
	public getColumnsWithFilters(): ActiveFilters[] {
		const activeFilters = this.$activeFilters;
		const columns = (activeFilters || []).map((element) => element.field);
		return (activeFilters || []).filter((element) => columns.includes(element.field));
	}

	/**
	 *
	 */
	private clearChips() {
		this.$currentOpenChipFiltersColumn = '';
		this.closeFiltersChips();
	}

	/**
	 *
	 */
	private closeFiltersChips() {
		this.$elementFilterPositionRef = null;
		this.$openChipFilters = false;
	}

	/**
	 *
	 * @returns
	 */
	private enableSaveView(): boolean {
		return !this.$hasChanges || !this.$allHidden || this.$currentViewName.trim() == '' || this.checkCustomViewRepeat();
	}

	/**
	 *
	 * @returns
	 */
	private checkCustomViewRepeat(): boolean {
		const customViews: MenuPanelItem[] = this.$itemList.filter((type) => type.id === VIEW_TYPES_ENUM.CUSTOM_VIEWS);
		return (
			this.$createModal &&
			customViews.length &&
			customViews[0].views.some((view) => view.label.toLowerCase() === this.$editingView.label.toLowerCase())
		);
	}

	/**
	 *
	 */
	public setFilterColumnIcons(): void {
		this.$visibleColumns = this.setColumnIconFilter(this.$visibleColumns);
		this._tableInstance?.setColumns(this.$visibleColumns);
		this._updateHeightAfterRender = true;
	}

	/**
	 *
	 */
	private setColumnsFilterSubHeader() {
		this.$visibleColumns?.forEach((column) => {
			let defaultWidthFilter = column.baseWidth;
			let componentFilterToRender = null;
			switch (column?.headerFilterType) {
				case FILTER_TYPE.text_field.name:
					defaultWidthFilter = FILTER_TYPE.text_field.widthDefault;
					componentFilterToRender = textFieldHeaderFilter(this, this._showFilterRow);
					break;
				case FILTER_TYPE.dropdown.name:
					defaultWidthFilter = FILTER_TYPE.dropdown.widthDefault;
					componentFilterToRender = dropdownHeaderFilter(this, this.$rowData, this._showFilterRow);
					break;
				case FILTER_TYPE.boolean.name:
					defaultWidthFilter = FILTER_TYPE.boolean.widthDefault;
					componentFilterToRender = booleanHeaderFilter(this, this._showFilterRow);
					break;
				case FILTER_TYPE.date_range.name:
					defaultWidthFilter = FILTER_TYPE.date_range.widthDefault;
					componentFilterToRender = rangeHeaderFilter(this, filtersRangesTypes.DATE, this._showFilterRow);
					break;
				case FILTER_TYPE.number_range.name:
					defaultWidthFilter = FILTER_TYPE.number_range.widthDefault;
					componentFilterToRender = rangeHeaderFilter(this, filtersRangesTypes.AMOUNT, this._showFilterRow);
					break;
				default:
					break;
			}

			if (this._showFilterRow && !!componentFilterToRender) {
				column.headerFilter = componentFilterToRender;
			} else {
				delete column.headerFilter;
				column.width = column.baseWidth;
			}

			if (this._showFilterRow && column.headerFilterType) {
				const widthFilter = get(column, 'defaultWidthFilter', defaultWidthFilter);
				const widthTitle = column.width ?? defaultWidthFilter ?? column.minWidth;
				column.width = (widthTitle ?? 0) < widthFilter ? widthFilter : widthTitle;
			}

			column.headerFilterEmptyCheck = function (value) {
				return !value; //only filter when the value is true
			};
		});

		if (this._tableInstance) {
			this._tableInstance.setColumns(this.$visibleColumns);
		}
	}

	/**
	 *
	 */
	public showFilterRow(fromColumnsHandler?: boolean) {
		this._showFilterRow = !this._showFilterRow;
		this.setColumnsFilterSubHeader();
		if (!fromColumnsHandler) this.setDataLayer(EventsAnalytics.CHIP_FILTERS, this._showFilterRow);
		const _filtersHeader = this._hostRef.shadowRoot.querySelector('.tabulator-headers');
		this._hostRef.style.setProperty('--_organisms-optimized-data-table-header-filter-row-visibility', this._showFilterRow ? 'block' : 'none');

		if (this._showFilterRow) {
			_filtersHeader?.classList.add('show-filter-row');
		} else {
			_filtersHeader?.classList.remove('show-filter-row');
		}
		this._updateHeightAfterRender = true;
	}

	/**
	 *
	 * @param newFilter
	 * @param column
	 */
	public sendSelectedFilters(filter: ActiveFilters) {
		this.setDataLayer(EventsAnalytics.SEND_FILTER, filter.field);
		this.addFilters(filter);
	}

	/**
	 *
	 * @param filters
	 */
	private _emitFilters() {
		if (this.$delegateFilterManagement || this.controlManager === 'localInfiniteScroll') {
			this._currentOrderParams = {
				...this._currentOrderParams,
				filters: this.$activeFilters || []
			};
			this.delegateChanges.emit(this._currentOrderParams);
			this.filterChange.emit(this.$activeFilters);
		}
	}

	/**
	 *
	 */
	showAllFiltersChipsCard(elementClicked) {
		const chipsContainer = elementClicked;
		if (this.$activeFilters.length > 0) {
			this.openCardFilterChips({ elementFilter: chipsContainer });
		}
	}

	buildListItemPageInfiniteScroll() {
		const listItemSize = [];
		this.$paginatorConfig?.paginationSizeSelector?.forEach((paginationSize) => {
			listItemSize.push({ literal: paginationSize, value: paginationSize });
		});
		if (this.$paginatorConfig.enableSizeSelectorAll) {
			listItemSize.push({ literal: this.$literals.paginationSizeAll ?? TABLE_SIZE_CODE_ALL, value: TABLE_SIZE_CODE_ALL });
		}
		return listItemSize;
	}

	private showScibUiPaginator() {
		return this.$config.pagination && !this.$localInfiniteScroll;
	}

	/**
	 *
	 * @returns
	 */
	render() {
		const _filterCardParams = {
			openChipFilters: this.$openChipFilters,
			tittleFilter: this.$manageFunctionalities.showFilters
				? !this.$currentOpenChipFiltersColumn
					? this.$literals.tittleChipContainer
					: this.$literals.tittleColumnChipContainer
				: '',
			currentOpenChipFiltersColumn: this.$currentOpenChipFiltersColumn,
			chips: this.$chips,
			deleteFilters: this.deleteFilters.bind(this),
			elementPositionRef: this.$elementFilterPositionRef,
			hostRef: this._hostRef
		};
		return (
			<Host>
				<div id="header" class={'top-bar-table'}>
					<div class={'left-side'}>
						{!this.$loading && (
							<div class={'container-title'}>
								{this.name && <span class={'title'}>{this.name}</span>}
								{!this.$config?.hideTotal && this.$paginatorConfig.totalItems && (
									<span class={'counter'}>{this.$paginatorConfig.totalItems}</span>
								)}
							</div>
						)}
						{/* Inicio Menu */}
						{!this.$loading &&
							(!isEmpty(this.name) || (!this.$config?.hideTotal && this.$paginatorConfig.totalItems)) &&
							(this.$manageFunctionalities.showManageViews || this.$manageFunctionalities?.showFilters) && (
								<div class="separator-views"></div>
							)}
						{this.$manageFunctionalities.showManageViews && this.$itemList && (
							<div class={'views-container'}>
								<div class={'button-menu span-view'}>
									{this.$literals.view}
									{this.$currentViewObject.currentView.favourite && (
										<span
											style={{
												'--icon-content': `var(--theme-scib-icon-star-fill)`
											}}
										>
											<i class="icon menu__icon" />
										</span>
									)}
								</div>
								<scib-atoms-tooltip-info
									delay={this.$config.tooltipDelay}
									arrow="bottom"
									literalsTooltip={this.$literals.tableViewSelector}
								>
									<div class="view-selector" onClick={() => this._toggleMenu(!this.$openViewsMenu)}>
										{this.$currentViewObject.currentView.label}
										<span
											style={{
												'--icon-content': this.$openViewsMenu
													? `var(--theme-scib-icon-chevron-up)`
													: `var(--theme-scib-icon-chevron-down)`
											}}
										>
											<i class="icon view-selector-icon" />
										</span>
									</div>
								</scib-atoms-tooltip-info>
								<div class="mdc-menu menu-item mdc-menu-surface menu" style={{ transform: `translateY(${this.$topPosition}px)` }}>
									<ul class="mdc-list" aria-hidden="true" aria-orientation="vertical">
										{this.$itemList.map((item, index) => (
											<li>
												<ul class="mdc-list" role="menu">
													{item.views.length > 0 && <span class="mdc-list-item__titles">{item.title} </span>}
													{item.views.map((view, submenuIndex) => (
														<li
															class="mdc-list-item"
															role="menuitem"
															key={submenuIndex}
															onClick={() => this.handleClickedOption(index, submenuIndex)}
														>
															<span
																class="mdc-list-item__item-container"
																style={{
																	'--icon-content': `var(--theme-scib-icon-${
																		this.$currentViewObject.currentView.id === view.id ? 'checkmark-bold' : 'none'
																	})`
																}}
															>
																<i class="icon mdc-list-item__icon__selected" />
															</span>
															{view.favourite && (
																<span
																	class="mdc-list-item"
																	style={{
																		'--icon-content': `var(--theme-scib-icon-star-fill)`
																	}}
																>
																	<i class="icon mdc-list-item__icon__star" />
																</span>
															)}

															<span class="mdc-list-item__text">{view.label}</span>
														</li>
													))}
												</ul>
												{item.views.length > 0 && <hr class="menu-separator"></hr>}
											</li>
										))}
										<li class="mdc-list-item" role="menuitem" onClick={() => this._menuActions('personalise')}>
											<span
												class="mdc-list-item__item-container"
												style={{
													'--icon-content': `var(--theme-scib-icon-edit)`
												}}
											>
												<i class="icon mdc-list-item__icon" />
											</span>
											<span class="mdc-list-item__text">{this.$literals.personalise}</span>
										</li>
										{this.$currentViewObject.idType !== VIEW_TYPES_ENUM.DEFAULT_VIEWS && (
											<li class="mdc-list-item" role="menuitem" onClick={() => this._menuActions('delete')}>
												<span
													class="mdc-list-item__item-container"
													style={{
														'--icon-content': `var(--theme-scib-icon-trash-bin)`
													}}
												>
													<i class="icon mdc-list-item__icon" />
												</span>
												<span class="mdc-list-item__text">{this.$literals.delete}</span>
											</li>
										)}
										{this.$countCustomViews < 3 && (
											<li class="mdc-list-item" role="menuitem" onClick={() => this._menuActions('create')}>
												<span
													class="mdc-list-item__item-container"
													style={{
														'--icon-content': `var(--theme-scib-icon-add-thin)`
													}}
												>
													<i class="icon mdc-list-item__icon" />
												</span>
												<span class="mdc-list-item__text">{this.$literals.createNew}</span>
											</li>
										)}
									</ul>
								</div>
							</div>
						)}

						{/* Final Menu */}
						{this.$manageFunctionalities?.showFilters && (
							<div class="filters-container">
								<scib-atoms-tooltip-info
									delay={this.$config.tooltipDelay}
									arrow="bottom"
									literalsTooltip={this.$literals.viewAllFilters}
									class={'tooltipFilterIcon'}
								>
									<div
										onClick={(event) => {
											event.preventDefault();
											event.stopImmediatePropagation();
											this.showAllFiltersChipsCard(event.currentTarget);
										}}
										class={'button-filter' + (this.$activeFilters.length > 0 ? ' button-filter--active' : '')}
									>
										<span
											style={{
												'--icon-content': `var(--theme-scib-icon-filter)`
											}}
										>
											<i class="icon" />
										</span>
										{this.$activeFilters.length > 0 && (
											<span class={'button-filter--counter'}>{'(' + this.$activeFilters.length + ')'}</span>
										)}
									</div>
								</scib-atoms-tooltip-info>
								<div class="chips-header-button">
									<scib-atoms-chip-selector
										selected={this._showFilterRow}
										chipText={this.$literals.chipOpenFilter}
										onClick={() => this.showFilterRow()}
									></scib-atoms-chip-selector>
								</div>
							</div>
						)}
					</div>
					<div class={'right-side'}>
						<slot name="header-actions" />
					</div>
				</div>
				<div class="main-container">
					<div class={{ 'data-table': true, [this.$rowsize]: true, loading: this.$loading }}>
						<div
							class={{
								'table-container': true,
								'filter-format': this._showFilterRow,
								'is-visible': this.$headerOverflowIsVisble,
								'hide-sub-header-totals': !this.showSubHeaderTotals
							}}
							table-id={this._tableUuid}
						></div>
						{this.$localInfiniteScroll && (this.$manageFunctionalities.showRowsize || this.$manageFunctionalities.showPaginator) && (
							<div
								class={{ 'paginator-infinite-scroll': true }}
								id="size-and-rows"
								style={{ display: this.$loading ? 'none' : 'flex' }}
							>
								{this.$manageFunctionalities.showRowsize ? (
									<scib-atoms-tooltip-info
										delay={this.$config.tooltipDelay}
										class="tooltip-padding"
										arrow="bottom"
										literalsTooltip={this.$literals.paddingSelector}
									>
										<scib-atoms-segmented-control
											class="padding-tabs"
											options={[
												{ value: RowSizes.small.id + '', icon: RowSizes.small.icon },
												{ value: RowSizes.medium.id + '', icon: RowSizes.medium.icon },
												{ value: RowSizes.large.id + '', icon: RowSizes.large.icon }
											]}
											value={JSON.stringify(RowSizes[this.$rowsize].id)}
											onValueChange={(event) => this.onTabRowSizeChange(RowSizes.getRowSizeByById(event.detail))}
										></scib-atoms-segmented-control>
									</scib-atoms-tooltip-info>
								) : (
									<div />
								)}
								{this.$manageFunctionalities.showPaginator && (
									<div>
										<div class="size-selector-container">
											<span class="size-selector-text">{this.$literals.paginator}</span>
											<a class="size-selector-button" onClick={() => this._toggleSizeSelector(!this.$openSizeSelectorPanel)}>
												{
													this.buildListItemPageInfiniteScroll().find(
														(sizePage) => sizePage.value === this.$paginatorConfig.paginationSize
													).literal
												}
												<i
													class={`icon u-icon mdc-list-item__icon`}
													style={{
														'--icon-content': `var(--theme-scib-icon-${
															this.$openSizeSelectorPanel ? 'chevron-up' : 'chevron-down'
														})`
													}}
												/>
											</a>
										</div>
										<div
											class=" mdc-menu size-selector-menu mdc-menu-surface menu"
											style={{ transform: `translateY(${this.$topPositionRowSelector}px)` }}
										>
											<ul class="mdc-list" aria-hidden="true" aria-orientation="vertical" role="menu">
												{this.buildListItemPageInfiniteScroll().map((itemSize, index) => (
													<li
														class="mdc-list-item"
														role="menuitem"
														key={index}
														onClick={() => this._handleSizeClicked(itemSize.value)}
													>
														<span class="mdc-list-item__text">{itemSize.literal}</span>
													</li>
												))}
											</ul>
										</div>
									</div>
								)}
							</div>
						)}
						{this.showScibUiPaginator() && (
							<scib-molecules-paginator
								style={{ display: this.$loading ? 'none' : 'inherit' }}
								dropdownPosition="up"
								class="paginator"
								{...this.$paginatorConfig}
								itemsPerPageText={this.$literals.paginator}
								ref={(element) => (this._paginatorRef = element)}
							>
								<div slot="custom-paginator-content" class="customize__table__container">
									<div class="custom__view__selector__container">
										{this.$manageFunctionalities.showRowsize && (
											<scib-atoms-tooltip-info
												class="tooltip-padding"
												arrow="bottom"
												delay={this.$config.tooltipDelay}
												literalsTooltip={this.$literals.paddingSelector}
											>
												<scib-atoms-segmented-control
													class="padding-tabs"
													options={[
														{ value: RowSizes.small.id + '', icon: RowSizes.small.icon },
														{ value: RowSizes.medium.id + '', icon: RowSizes.medium.icon },
														{ value: RowSizes.large.id + '', icon: RowSizes.large.icon }
													]}
													value={JSON.stringify(RowSizes[this.$rowsize].id)}
													onValueChange={(event) => this.onTabRowSizeChange(RowSizes.getRowSizeByById(event.detail))}
												></scib-atoms-segmented-control>
											</scib-atoms-tooltip-info>
										)}
									</div>
								</div>
							</scib-molecules-paginator>
						)}
					</div>
					<scib-atoms-skeleton
						class={{ skeleton: true, loaded: !this.$loading, 'not-ready': !this.$skeletonReady }}
						skeletonType="optimizedTable"
					/>
				</div>
				<div class="modal-chips-container">
					<OrganismsOptimizedDataTableFiltersCard {...{ ..._filterCardParams }} />
				</div>
				{/* Modal de Vistas */}
				{this.$openModalView && (
					<scib-ui-v2-dialog
						dialog-title={
							this.$currentViewObject.idType === VIEW_TYPES_ENUM.CUSTOM_VIEWS
								? this.$literals.typeCustomView
								: this.$literals.typeTableView
						}
						open={this.$openModalView}
						preventClose={this.$hasChanges}
						onDialogClosing={() => (this.$hasChanges ? this._openModalCancel(true) : this._closeModalViews())}
					>
						<div slot="content">
							<div
								class="modal-views-content__view"
								style={{
									gap: '10px'
								}}
							>
								<scib-ui-v2-text-field
									class="modal-views-content__view-input"
									variant="blue"
									dialog-title={
										this.$currentViewObject.idType === VIEW_TYPES_ENUM.CUSTOM_VIEWS
											? this.$literals.typeCustomView
											: 'this.$literals.typeCustomView'
									}
									label={this.$literals.inputLabelName}
									value={this.$editingView.label}
									type="text"
									invalid={!this.$editingView.label}
									readOnly={this.$currentViewObject.idType === VIEW_TYPES_ENUM.DEFAULT_VIEWS}
									required={!this.$createModal && this.$currentViewObject.idType === VIEW_TYPES_ENUM.CUSTOM_VIEWS}
									onValueChange={(event) => {
										this._setLabelView(event);
										this.firstTimeNewView = false;
									}}
								></scib-ui-v2-text-field>
								<div class="favourite">
									<scib-ui-v2-checkbox
										value={this.$editingView.favourite ? 'checked' : 'unchecked'}
										label={this.$literals.favouriteCheckbox}
										onValueChange={(event) => {
											this._setFavourite(event);
										}}
										class="favorite__check"
									></scib-ui-v2-checkbox>
									<div class="modal-views-content__view modal-views-content__view-favourite-icon">
										(
										<span
											style={{
												'--icon-content': `var(--theme-scib-icon-star-fill)`
											}}
										>
											<i class="icon modal-views__icon" />
										</span>
										)
									</div>
								</div>
							</div>
							{this.$currentViewObject.idType === 'default-views' ? (
								<div class="color-panel">
									<scib-atoms-color-panel
										panels={"[{'status':'info','icon':'circle-info','description':" + `${this.$literals.panelDescription}` + '}]'}
									></scib-atoms-color-panel>
								</div>
							) : (
								<hr class="modal-views-content__separator"></hr>
							)}
							<div class="modal-views-content__view modal-views-content__view-search-button-container">
								<scib-ui-v2-text-field
									class="modal-views-content__view-input"
									variant="white"
									label={this.$literals.inputLabelSearch}
									icon="search"
									value=""
									type="text"
									onValueChange={(event) => this._searchColumns(event.detail)}
								></scib-ui-v2-text-field>
								{(this.$createModal || this.$currentViewObject.idType !== VIEW_TYPES_ENUM.DEFAULT_VIEWS) && (
									<div class="modal-views-content__view-input hideAll">
										{!this.$shownColumns.length ? (
											<scib-atoms-tooltip-info
												class="modal-views-content__tooltip-hide-all"
												delay={1000}
												arrow="left"
												disableReposition={{
													horizontal: true,
													vertical: true
												}}
												literalsTooltip={
													this.checkAbleShowAll() ? this.$literals.tooltipShowAll : this.$literals.messageMaxColumnsPerView
												}
											>
												<scib-atoms-button
													onClick={() => this._changeVisivilityAll(this.$allHidden)}
													text={this.$literals.showAll}
													icon={'visibility-on'}
													disabled={!this.checkAbleShowAll()}
													size="s"
													level="tertiary"
													icon-position="trailing"
													type="button"
												></scib-atoms-button>
											</scib-atoms-tooltip-info>
										) : (
											<scib-atoms-button
												onClick={() => this._changeVisivilityAll(this.$allHidden)}
												text={this.$literals.hideAll}
												icon={'visibility-off'}
												size="s"
												level="tertiary"
												icon-position="trailing"
												type="button"
											></scib-atoms-button>
										)}
									</div>
								)}
							</div>
							{this.$shownColumns.length || this.$hiddenColumns.length ? (
								<div>
									<div class="list-titles">
										<span>
											{this.$literals.titleColumnShown}
											{isNumber(this.$config?.maxColumnsPerView) &&
												' (' +
													this.$editingView.columns.length +
													this.$literals.separtorMaxColumnsPerView +
													this.$config?.maxColumnsPerView +
													')'}
										</span>
										<span>{this.$literals.titleColumnHidden} </span>
									</div>
									<div class={'modal-list'}>
										{this.$editingView.columns.length === 0 ? (
											<div class="lists lists--empty">
												<img class="lists__img" src={assetUrl('/assets/images/i-laptop-woman-2.svg')}></img>
												<span class="lists__title">{this.$literals.emptyStateTitle}</span>
												<span class="lists__desc">{this.$literals.emptyStateDescription}</span>
											</div>
										) : (
											<scib-ui-v2-scroll-container class="scroll-list">
												<div class="lists">
													<scib-atoms-list
														id="shownList"
														drag={this.$createModal || this.$currentViewObject.idType !== VIEW_TYPES_ENUM.DEFAULT_VIEWS}
														onDrop={() => this.onDropHandler()}
													>
														{this.$shownColumns?.map((column) => (
															<scib-atoms-item-list
																key={`column-${column}`}
																onDragOver={() => {
																	this.dragOverHandler(column);
																}}
																onDragStart={() => {
																	this._selectedColumn = column;
																}}
															>
																<div class="modal-list__container">
																	<div class="modal-list__container__drag-icon-text">
																		{(this.$createModal ||
																			this.$currentViewObject.idType !== VIEW_TYPES_ENUM.DEFAULT_VIEWS) && (
																			<span
																				class="mdc-list-item draggable"
																				style={{
																					display: 'flex',
																					'--icon-content': `var(--theme-scib-icon-drag)`
																				}}
																			>
																				<i class="icon mdc-list-item__icon__draggable"></i>
																			</span>
																		)}
																		<span class="modal-list__item-text">{column.title}</span>
																	</div>
																	{(this.$createModal ||
																		this.$currentViewObject.idType !== VIEW_TYPES_ENUM.DEFAULT_VIEWS) && (
																		<span
																			onClick={() => this._changeVisivility(false, column)}
																			class="mdc-list-item visibility modal-list__icon"
																			style={{
																				'--icon-content': `var(--theme-scib-icon-visibility-on)`,
																				cursor: 'pointer'
																			}}
																		>
																			<i class="icon mdc-list-item__icon__visibility visibility"></i>
																		</span>
																	)}
																</div>
															</scib-atoms-item-list>
														))}
													</scib-atoms-list>
												</div>
											</scib-ui-v2-scroll-container>
										)}
										<scib-ui-v2-scroll-container class="scroll-list">
											<div class="lists">
												<scib-atoms-list>
													{this.$hiddenColumns.map((column) => (
														<scib-atoms-item-list key={`column-${column}`}>
															<div class="modal-list__container">
																<span class="modal-list__item-text">{column.title}</span>
																{(this.$createModal ||
																	this.$currentViewObject.idType !== VIEW_TYPES_ENUM.DEFAULT_VIEWS) &&
																	(!isNumber(this.$config?.maxColumnsPerView) ||
																		(isNumber(this.$config?.maxColumnsPerView) &&
																			this.$editingView.columns.length < this.$config?.maxColumnsPerView)) && (
																		<span
																			onClick={() => this._changeVisivility(true, column)}
																			class="mdc-list-item visibility modal-list__icon"
																			style={{
																				'--icon-content': `var(--theme-scib-icon-visibility-off)`
																			}}
																		>
																			<i class="icon mdc-list-item__icon__visibility visibility"></i>
																		</span>
																	)}
															</div>
														</scib-atoms-item-list>
													))}
												</scib-atoms-list>
											</div>
										</scib-ui-v2-scroll-container>
									</div>
								</div>
							) : (
								<div class="empty-state">
									<img class=" empty-state__img" src={assetUrl('/assets/images/box.svg')}></img>
									<div class="empty-state__texts">
										<span class="empty-state__texts--title">{this.$literals.searchEmptyStateTitle}</span>
										<span class="empty-state__texts--description">{this.$literals.searchEmptyStateDescription}</span>
									</div>
								</div>
							)}
						</div>
						<div slot="actions">
							<div class="modal-views-footer">
								<span class="modal-views-footer__required">
									{this.$currentViewObject.idType === 'custom-views' ? this.$literals.required : ``}
								</span>
								<div class="modal-views-footer__buttons">
									<scib-atoms-button
										text={this.$literals.cancel}
										size="s"
										level="secondary"
										type="button"
										class="modal-views-footer__cancel modal-views-footer__size"
										onClick={() => (this.$hasChanges ? this._openModalCancel(true) : this._closeModalViews())}
									></scib-atoms-button>
									<scib-atoms-button
										text={this.$literals.save}
										size="s"
										level="primary"
										type="button"
										class="modal-views-footer__size"
										onClick={() => this._saveHandler(true)}
										disabled={this.enableSaveView()}
									></scib-atoms-button>
								</div>
							</div>
						</div>
					</scib-ui-v2-dialog>
				)}
				{this.$closeModal && (this.$hasChanges || this.$deleteView) && (
					<scib-molecules-status-modal
						message={this.$literals.saveModalMessage}
						status="attention"
						open={this.$closeModal}
						disable-close="true"
					>
						<div slot="actions" class="modal-cancel">
							<scib-atoms-button
								text={this.$literals.cancel}
								size="s"
								level="secondary"
								type="button"
								class="modal-views-footer__cancel modal-views-footer__size"
								onClick={() => this._openModalCancel(false)}
							></scib-atoms-button>
							<scib-atoms-button
								text={this.$deleteView ? this.$literals.delete : this.$literals.dontSave}
								size="s"
								level="primary"
								type="button"
								class="modal-views-footer__size"
								onClick={() => this._saveHandler(false, this.$deleteView)}
							></scib-atoms-button>
						</div>
					</scib-molecules-status-modal>
				)}

				{/* Final Modal Vistas */}
			</Host>
		);
	}
}
