import { DefaultFocusState, MDCMenu } from '@material/menu';
import { Component, Element, Event, EventEmitter, Host, Listen, Method, Prop, State, Watch, h } from '@stencil/core';
import { first, get, has, isEmpty, isNull, kebabCase, merge, omit, remove } from 'lodash';
import { registerClickOutside, removeClickOutside } from 'stencil-click-outside';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { v4 as uuidv4 } from 'uuid';
import { assetUrl, configKeysToOmitForTables, parseProp, removeColumnKeys } from '../../../../utils/helpers/common';
import { PaginationEvent } from '../../../molecules/paginator/models/paginator.model';
import { References } from '../formatters/common-utils';
import { booleanHeaderFilter } from '../formatters/filters/boolean-header-filter';
import { dropdownHeaderFilter } from '../formatters/filters/dropdown-header-filter';
import { rangeHeaderFilter } from '../formatters/filters/range-header-filter';
import { textFieldHeaderFilter } from '../formatters/filters/text-field-header-filter';
import { OrganismsAdvancedDataTableFiltersCard } from '../fragments/advanced-data-table-filters-card';
import {
	ActiveFilters,
	AnalyticsObject,
	ControlManager,
	EventsAnalytics,
	FILTER_TYPE,
	ILiterals,
	LimitedSkeletonTypes,
	LoadingOptions,
	MenuPanelItem,
	MenuPanelItems,
	RowSizes,
	RowSizesStringToNumber,
	TABLE_ROW_SIZES,
	TABLE_ROW_SIZES_GAPS,
	TableCell,
	View,
	defaultConfig,
	filtersRangesTypes,
	fixedColumns,
	viewTypes
} from '../models/advanced-data-table.model';
import { getCustomEditors } from '../modules/editors';
import { getCustomFormatters, getCustomHeaderFormatters } from '../modules/formatters';
import { applyDefaultConfigToColumns } from '../utils/columns';

const privateConfig = ['ajaxURL', 'sortMode', 'filterMode', 'ajaxRequestFunc', 'footerElement', 'columns', 'data'];

/**
 * Component description
 *
 * @status stable
 *
 * @slot header-actions - Header actions section slot | Advanced data table header actions
 */
@Component({
	tag: 'scib-organisms-advanced-data-table',
	styleUrl: 'advanced-data-table.scss',
	shadow: true
})
export class OrganismsAdvancedDataTable {
	private _paginatorRef: HTMLScibMoleculesPaginatorElement;
	private _tableInstance: Tabulator;
	private _resizeObserver: ResizeObserver;
	private _observerOfscroll: ResizeObserver;
	private _tableReferences: References;
	private _skeletonRef: HTMLElement;
	private _lastColumn: any;
	private _oldIndex: number;
	private _selectedColumn: any;
	private _tableUuid: string;
	private _menuPanel: MDCMenu;
	private _sizeSelector: MDCMenu;
	private _cardFilterReference: any;
	private _firstLoad: boolean;
	private _currentOrderParams = {
		pagination: {},
		sorters: {},
		filters: []
	};
	private _scrollTimer: NodeJS.Timeout | null = null;

	/**
	 *
	 */
	@Element() _hostRef: HTMLElement;

	@Prop({ reflect: false }) customSkeleton?: LimitedSkeletonTypes = 'advancedTable';

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
	 * Control overflow visible for filters
	 */
	@State() $setVisibleFilters = [];

	/**
	 * List for the active filters
	 */
	@State() $activeFilters: ActiveFilters[] = [];

	/**
	 * List for the total active filters
	 */
	@State() $totalActiveFilters = [];

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
	@State() $openChipFiltersColumn: boolean = false;

	/**
	 *
	 */
	@State() $currentOpenChipFiltersColumn: string = '';

	/**
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
	@State() $currentViewObject: { currentView: View; idType: string };

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
	@State() $infiniteScroll: boolean;

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
	@State() $headerFilterElementPositionRef: any = null;

	/**
	 * El nombre de la tabla
	 */
	@Prop({ reflect: false }) name: string;

	/**
	 *
	 */
	@Prop({ reflect: false }) showSubHeaderTotals: boolean = false;

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: false }) emptyStateTitle: string = 'No results found';
	@State() $emptyStateTitle: string;
	@Watch('emptyStateTitle') _emptyStateTitleHandler(newValue: string) {
		this.$emptyStateTitle = newValue;
	}
	/**
	 *
	 */
	@Prop({ mutable: true, reflect: false }) emptyStateDescription: string = 'Try to change the search inputs to get other results.';
	@State() $emptyStateDescription: string;
	@Watch('emptyStateDescription') _emptyStateDescriptionHandler(newValue: string) {
		this.$emptyStateDescription = newValue;
	}
	/**
	 *
	 */
	@Prop({ mutable: true, reflect: false }) emptyStateImage: string = 'i-laptop-coffee.svg';
	@State() $emptyStateImage: string;
	@Watch('emptyStateImage') _emptyStateImageHandler(newValue: string) {
		this.$emptyStateImage = newValue;
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) controlManager: ControlManager = 'local';
	@Watch('controlManager') _controlManagerHandler(newValue: ControlManager) {
		this.$infiniteScroll = newValue === 'infiniteScroll' || newValue === 'localInfiniteScroll';
		this.$delegateFilterManagement = ['delegate', 'infiniteScroll'].includes(newValue);
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
		this.$literals = parseProp<ILiterals>(newLiterals as string);
		if (this._tableInstance) {
			requestAnimationFrame(() => {
				this._columnsHandler(this.columns);
				this._filtersHandler(this.filters);
			});
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) config: string | { [key: string]: any };
	@State() $config: { [key: string]: any };
	@Watch('config') _configHandler(newValue: string | { [key: string]: any }) {
		this.$config = omit(merge({}, defaultConfig, parseProp<{ [key: string]: any }>(newValue, {})), privateConfig);
		if (this._tableInstance) {
			requestAnimationFrame(() => {
				const config = merge({}, defaultConfig, this._tableInstance.options, this.$config);
				this._tableInstance.options = omit(config, ['pagination', ...configKeysToOmitForTables]);
				this._tableInstance.redraw();
				this._updatePaginatorConfig();
			});
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) columns: string | any[];
	@State() $columns: any[];
	@Watch('columns') _columnsHandler(newValue: string | any[]) {
		const columns = parseProp<any[]>(newValue, []).map((column) => {
			const _formatter = column?.formatter || null;
			if (fixedColumns[_formatter]) {
				return {
					...column,
					...fixedColumns[_formatter]
				};
			}
			return column;
		});
		this.$columns = applyDefaultConfigToColumns(columns, this.$literals);
		let shownFields: string[] =
			this.$currentViewObject?.currentView?.columns?.map((column) => column.field) || this.$columns?.map((column) => column.field);
		this.setVisibleColumns(shownFields, this.$currentViewObject?.currentView || { columns: this.$columns });
		this._setFrozenColumns();
		if (this._tableInstance) {
			this._showFilterRow = true;
			this.showFilterRow(true);
			requestAnimationFrame(() => {
				this.setView(this.$currentViewObject?.currentView || ({ columns: this.$columns } as View));
				this._tableInstance.redraw();
				if (this.controlManager === 'local') {
					this._updatePaginatorConfig();
				}
			});
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
			window?.requestAnimationFrame(() => {
				this._tableInstance.setData(this.$rowData).then(() => {
					const { currentPage, itemsPerPage } = this._currentOrderParams?.pagination || ({ currentPage: 1, itemsPerPage: 10 } as any);
					this._tableInstance.setPageSize(itemsPerPage);
					this._tableInstance.setPage(currentPage);
					this._tableInstance.redraw(true);
					this._disableAutoLoading();
					if (this.$infiniteScroll) {
						this._hideInfiniteScrollLoading();
					}
					if (this.controlManager === 'local') {
						this._updatePaginatorConfig();
					}
				});
			});
			this._validateTableData();
		}
	}

	/**
	 * SubHeader
	 */
	@Prop({ reflect: false }) showSubHeader: boolean;
	@State() $showSubHeader: boolean;
	@Watch('showSubHeader') _showSubHeaderHandler(newValue: boolean) {
		this.$showSubHeader = newValue;
		this.setColumnsFilterSubHeader();
		this._hostRef?.style.setProperty('--tabulator-table-sub-header-min-height', `${this.$showSubHeader ? 20 : 0}px`);
		this._hostRef?.style.setProperty('--tabulator-table-sub-header-justify-content', this.$showSubHeader ? 'flex-start' : 'center');
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) subHeaderData: any;
	@State() $subHeaderData: any;
	@Watch('subHeaderData') _subHeaderDataHandler(subHeaderData: any) {
		this.$subHeaderData = parseProp<any>(subHeaderData, {});
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
			paginationSize: Number(paginationSize),
			hideTotal,
			totalItems: Number(totalItems) || (this.$rowData || []).length,
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
		} else {
			this._updateTableHeight();
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: false }) loadingIds: string | LoadingOptions;
	@State() $loadingIds: LoadingOptions;
	@Watch('loadingIds') _loadingIdsHandler(newValue: string | LoadingOptions) {
		const loadingSelected = parseProp<LoadingOptions>(newValue, []);
		this.$loadingIds = loadingSelected;
		this.redrawTable();
	}

	/**
	 *
	 */
	@Prop({ reflect: true, mutable: true }) rowsize: RowSizes = 'medium';
	@State() $rowsize: RowSizes;
	@Watch('rowsize') _rowsizeHandler(newValue: RowSizes) {
		this.$rowsize = newValue;
		this._updateTableHeight();
		this._redraw();
	}

	/**
	 * TODO: REVIEW
	 */
	@Prop({ reflect: false }) itemList: string | MenuPanelItems;
	@State() $itemList: MenuPanelItems;
	@Watch('itemList') _itemListHandler(newValue: string | MenuPanelItems) {
		this.$itemList = parseProp(newValue);
		this._countCustomViews();
		this.$topPosition = 0;
		const row = get(this.$itemList[0], 'views[0].row', {});
		if (row.topPosition === false) {
			this.$topPosition = -this.$itemList.length * this.$itemHeight - this.$itemHeight;
		}
		this.getFavouriteView();
	}

	/**
	 * Filters
	 */
	@Prop({ reflect: false }) filters: string | ActiveFilters[];
	@State() $filters: ActiveFilters[];
	@Watch('filters') _filtersHandler(newValue: string | ActiveFilters[]) {
		this.$activeFilters = parseProp(newValue, []);
		this.clearChips();
		if (this._tableInstance && !this.$delegateFilterManagement) {
			this._tableInstance.clearFilter(true);
			this.updateCurrentFilters();
			this._applyDefaultFilters();
		}
	}
	/**
	 * Activate validation control
	 */
	@Prop({ reflect: false }) validationControl: boolean;
	@State() $validationControl: boolean;
	@Watch('validationControl') _validationControlHandler(newValue: boolean) {
		this.$validationControl = newValue;
		this._validateTableData();
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
					case 'infiniteScroll':
						this.delegateChanges.emit(this._currentOrderParams);
						break;
					case 'localInfiniteScroll':
						break;
					default:
						this._tableInstance.setPageSize(itemsPerPage);
						this._tableInstance.setPage(currentPage);
				}
				this.$paginatorConfig.paginationSize = itemsPerPage;
				this.$paginatorConfig.paginationInitialPage = currentPage;
			}
		}
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

	/**
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
	 * Event that emits information about the cell that has been edited
	 */
	@Event() cellEdition: EventEmitter<any>;
	/**
	 *
	 * @param event
	 */
	@Listen('cellShowFilters')
	_cellShowFilters(event: CustomEvent) {
		const { cell } = event?.detail || {};
		if (cell) {
			this.$currentOpenChipFiltersColumn = cell.getColumn()?.getField();
			this.$headerFilterElementPositionRef = cell;
			this.$openChipFiltersColumn = true;
			this.$openChipFilters = false;
		}
	}
	/**
	 *Event that sends the information when a validation fails, meaning incorrect data was introduced on a editable cell
	 */
	@Event() sendValidationFailed: EventEmitter<any>;

	/**
	 *
	 */
	@Event() clickAction: EventEmitter<string>;

	/**
	 *
	 */
	@Event() delegateChanges: EventEmitter<any>;

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
	@Event() cellShowFilters: EventEmitter<any>;

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
		this._emptyStateTitleHandler(this.emptyStateTitle);
		this._emptyStateDescriptionHandler(this.emptyStateDescription);
		this._emptyStateImageHandler(this.emptyStateImage);
		this._controlManagerHandler(this.controlManager);
		this._filtersHandler(this.filters);
		this._loadingHandler(this.loading);
		this._loadingIdsHandler(this.loadingIds);
		this._configHandler(this.config);
		this._rowDataHandler(this.rowData);
		this._rowsizeHandler(this.rowsize);
		this._itemListHandler(this.itemList);
		this._columnsHandler(this.columns);
		this._subHeaderDataHandler(this.subHeaderData);
		this._showSubHeaderHandler(this.showSubHeader);
		this._updatePaginatorConfig({
			paginationSize: get(parseProp(this.config), 'paginationSize'),
			infinitePaginator: get(parseProp(this.config), 'infinitePaginator')
		});
		this._validationControlHandler(this.validationControl);
		this._analyticsHandler(this.analytics);
	}

	/** TODO: REVIEW
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		const emptyState = this._hostRef.shadowRoot.getElementById('placeholder');
		const paginator = this.$infiniteScroll
			? this._hostRef.shadowRoot.getElementById('size-and-rows')
			: this._hostRef.shadowRoot.querySelector('scib-molecules-paginator');
		const tableContainer: HTMLElement = this._hostRef.shadowRoot.querySelector('.table-container');
		const tableElement = document.createElement('div');
		const config = merge({}, defaultConfig, this.$config, this._getControlConfig());
		const existDetail = this.$visibleColumns.find((elem) => elem.formatter && elem.formatter === 'showDetail');
		const existInfo = this.$visibleColumns.find((elem) => elem.formatter && elem.formatter === 'showInfo');
		this._tableInstance = new Tabulator(tableElement, {
			id: this._tableUuid,
			...omit(config, [...configKeysToOmitForTables, this.$infiniteScroll ? 'pagination' : '']),
			...(config.pagination ? { footerElement: paginator } : {}),
			headerSortElement: '<i class="icon icon-chevron-up-small">',
			columnHeaderVertAlign: 'middle',
			columns: removeColumnKeys(this.$visibleColumns),
			data: this.$rowData,
			placeholder: emptyState,
			selectableCheck: (row) => {
				const rowData = row.getData();
				return !rowData.isDisabled;
			},
			rowFormatter: (row) => {
				const rowData = row.getData();
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

				const isSelected = rowData.isSelected;
				if (isSelected && this._firstLoad === undefined) {
					this._firstLoad = true;
				}
				if (isSelected && !rowData.isDisabled) {
					row.select();
				}
			}
		});
		this._initListeners(tableContainer);

		this._registerCustomModules();
		this._applyDefaultFilters();
		this._menuPanel = MDCMenu.attachTo(this._hostRef.shadowRoot.querySelector('.menu-item'));
		this._menuPanel.setDefaultFocusState(DefaultFocusState.NONE);
		this._menuPanel.listen('MDCMenuSurface:closed', () => {
			this._hostRef.removeAttribute('open');
			this._toggleMenu(false);
		});
		if (this.$infiniteScroll) {
			this._sizeSelector = MDCMenu.attachTo(this._hostRef.shadowRoot.querySelector('.size-selector-menu'));
			this._sizeSelector.setDefaultFocusState(DefaultFocusState.NONE);
			this._sizeSelector.listen('MDCMenuSurface:closed', () => {
				this._hostRef.removeAttribute('open');
				this._toggleSizeSelector(false);
			});
		}
		const chipsContainer: any = this._hostRef.shadowRoot.getElementById('chip-container');
		if (chipsContainer) {
			registerClickOutside(
				this,
				chipsContainer,
				() => {
					if (chipsContainer?.classList.contains('chips-container--open') || this.$openChipFiltersColumn) {
						this.closeFiltersChips();
					}
				},
				{ exclude: '.filters-container' }
			);
		}
	}

	/**
	 *
	 */
	_checkActionButtonsPosition() {
		if (this._tableInstance.element) {
			const container = this._tableInstance.element.querySelector('.tabulator-tableholder');
			const rows = this._tableInstance.element.querySelector('.tabulator-table');
			container?.clientWidth < rows?.scrollWidth
				? this._hostRef.style.setProperty('--_organisms-advanced-data-table-action-button-position', 'sticky')
				: this._hostRef.style.removeProperty('--_organisms-advanced-data-table-action-button-position');
		}
	}
	/**
	 * Validation control function
	 */
	private _validateTableData() {
		if (this.$validationControl) {
			let validators = [];
			let cells = this._tableInstance?.validate() || [];
			if (cells.length > 0) {
				cells?.forEach((cell) => {
					validators.push({ value: cell.getValue(), validators: cell.validate() });
				});
			}
			this.sendValidationFailed.emit(validators);
		}
	}

	/**
	 *
	 */
	componentDidRender() {
		this._tableReferences = References.instance;
		this._tableReferences.setComponent(this._tableUuid, this);
		this._tableReferences.setHostRef(this._tableUuid, this._hostRef);
		if (this._tableInstance) {
			this._validateTableData();
		}
	}

	/**
	 *
	 */
	private _applyDefaultFilters() {
		if (!this.$delegateFilterManagement) {
			this.$activeFilters?.forEach((element) => {
				this._tableInstance.addFilter(element.field, element.type, element.value);
			});
		}
		this._getActiveFiltersChips(this.$activeFilters);
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
	 * Redraw the table
	 * @param force
	 */
	private redrawTable(force?: boolean) {
		if (this._tableInstance && this._tableInstance.redraw) {
			try {
				this._tableInstance.redraw(force);
			} catch (_) {}
		}
	}

	/**
	 *
	 */
	private _setFrozenColumns() {
		const frozenColumns = (this.$visibleColumns || []).filter((column) => {
			const _formatter = column?.formatter || null;
			return column.frozen && !!fixedColumns[_formatter];
		});
		if (frozenColumns.length > 0) {
			this._hostRef.style.setProperty('--frozen-columns-raw-width', `${frozenColumns.length * 45}px`);
			this._hostRef.style.setProperty('--frozen-columns-width', `${frozenColumns.length * 45 - 3}px`);
		}
	}

	/**
	 *
	 */
	private _destroy() {
		if (this._tableReferences && this._tableReferences.reset && this._resizeObserver && this._resizeObserver.unobserve) {
			this._tableReferences.reset(this._tableUuid);
			this._resizeObserver.unobserve(this._tableInstance.element);
		}
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

	/**
	 * TODO: REVIEW
	 */
	private _initListeners(tableContainer: HTMLElement) {
		this._tableInstance.on('tableBuilt', () => {
			tableContainer.appendChild(this._tableInstance.element);
			const header = tableContainer.querySelector('.tabulator-header');
			const overlay = document.createElement('div');
			overlay?.classList.add('tabulator-headers-overlay');
			header.appendChild(overlay);
			const tableHolder: HTMLElement = tableContainer.querySelector('.tabulator-tableholder');
			if (this.$infiniteScroll) {
				const loadingRow: HTMLElement = document.createElement('div');
				const spinner: HTMLElement = document.createElement('scib-atoms-loading');
				spinner.setAttribute('level', 'primary');
				spinner.setAttribute('size', 'xs');
				spinner.setAttribute('variant', 'circular');
				loadingRow?.classList.add('loading-row');
				loadingRow.appendChild(spinner);
				tableHolder.appendChild(loadingRow);
				const rows = this._tableInstance.element.querySelector('.tabulator-table');
				this._observerOfscroll = new ResizeObserver(() => {
					this._checkActionButtonsPosition();
				});
				this._observerOfscroll.observe(rows);
			}
			this._updateTableHeight();
			this.tableBuilt.emit();
		});

		this._tableInstance.on('dataChanged', () => {
			this._updateTableHeight();
		});
		this._tableInstance.on('dataFiltered', () => {
			this._updateTableHeight();
			if (this.$rowData.length < this.$config.paginationSize) {
				delete this._tableInstance.options.maxHeight;
				this._hostRef?.style.setProperty('--tabulator-table-height', '100%');
			}
		});

		this._tableInstance.on('pageLoaded', () => {
			this._updateTableHeight();
		});

		this._tableInstance.on('scrollHorizontal', (event) => {
			this._hostRef.style.setProperty('--table-scroll-translations', `${-event}px`);
			this.closeFiltersChips();
			this.tooltipReposition();
			this._checkActionButtonsPosition();
		});

		this._tableInstance.on('scrollVertical', (event) => {
			let scrollMovement = 0;
			const tableHolder: HTMLElement = tableContainer.querySelector('.tabulator-tableholder');
			scrollMovement = Math.trunc(event + tableHolder.offsetHeight - 18);
			if (
				!this.$localInfiniteScroll &&
				scrollMovement == tableHolder.scrollHeight &&
				tableHolder.scrollHeight != tableHolder.offsetHeight - 17 &&
				typeof this.$paginatorConfig?.paginationSize !== 'string'
			) {
				this._showInfiniteScrollLoading();
				this.loadMoreData.emit();
			}
			this.tooltipReposition();
		});

		this._tableInstance.on('renderComplete', () => {
			const _tableElement = this._tableInstance.element;
			const _tableHeader = _tableElement.querySelector('.tabulator-header');
			if (_tableHeader) {
				this._hostRef.style.setProperty('--frozen-columns-raw-height', `${_tableHeader?.offsetHeight || 0}px`);
			}
		});

		this._tableInstance.on('rowSelectionChanged', (data, rows) => {
			if (this._firstLoad) {
				this._firstLoad = false;
			} else {
				this._clearUnselectableRows(rows);
				const selectedData = data.filter((row) => !row?.isDisabled);
				this.selectedRows.emit(selectedData);
			}
		});

		this._tableInstance.on('rowDeselected', function (row) {
			if (row.getData().isSelected) row.getData().isSelected = false;
			const checkboxElement = row.getElement().querySelector('scib-ui-v2-checkbox');
			if (checkboxElement) checkboxElement.value = 'unchecked';
		});

		this._tableInstance.on('rowSelected', function (row) {
			const checkboxElement = row.getElement().querySelector('scib-ui-v2-checkbox');
			if (!row.getData().isDisabled && checkboxElement) checkboxElement.value = 'checked';
		});

		this._tableInstance.on('cellEdited', (cell: TableCell) => {
			let cellInfo = {
				data: cell.getValue(),
				rowIndex: cell.getRow()?.getPosition(),
				column: cell.getColumn().getDefinition()?.field,
				rowData: cell.getRow().getData()
			};
			this.cellEdition.emit(cellInfo);
			this._validateTableData();
		});

		this._resizeObserver = new ResizeObserver(() => {
			this._checkActionButtonsPosition();
			this._updateTableHeight();
		});
		this._resizeObserver.observe(this._tableInstance?.element);
	}

	/**
	 *
	 * @returns
	 */
	private chipsFiltersNumber(): string {
		return `Reset (${
			this.$openChipFilters
				? this.$totalActiveFilters.length
				: this.$totalActiveFilters.filter((filter) => filter.field === this.$currentOpenChipFiltersColumn).length
		})`;
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

	/**
	 *
	 * @param rows
	 */
	private _clearUnselectableRows(rows: any[]): void {
		(rows || []).forEach((row) => {
			const rowData = row.getData();
			const isSelectable = !rowData.isDisabled;
			if (!isSelectable) {
				row.deselect();
			}
		});
	}

	/**
	 *
	 */
	private _showInfiniteScrollLoading() {
		const findLoadingRow: HTMLElement = this._hostRef.shadowRoot.querySelector('.loading-row');
		findLoadingRow.style.display = 'block';
	}

	/**
	 *
	 */
	private _hideInfiniteScrollLoading() {
		const findLoadingRow: HTMLElement = this._hostRef.shadowRoot.querySelector('.loading-row');
		findLoadingRow.style.display = 'none';
	}

	/**
	 *
	 */
	private _updateTableHeight() {
		if (this._tableInstance) {
			requestAnimationFrame(() => {
				const itemsVisible = this.$paginatorConfig.paginationSize;
				if (this.$infiniteScroll && itemsVisible !== 'all' && this.$rowData?.length > 0) {
					const items = itemsVisible > this.$rowData?.length ? this.$rowData?.length : itemsVisible;
					const tableholder = this._tableInstance?.element.querySelector('.tabulator-tableholder');
					const scrollBarHeight = tableholder?.offsetHeight - tableholder?.clientHeight - TABLE_ROW_SIZES_GAPS[this.$rowsize];
					const height = items * TABLE_ROW_SIZES[this.$rowsize] + scrollBarHeight;
					this._hostRef?.style.setProperty('--tabulator-table-container-min-height', `auto`);
					this._hostRef?.style.setProperty('--tabulator-table-height', `${height}px`);
					this._tableInstance.options.maxHeight = `${height}px`;
					this._tableInstance.options.height = 'auto';
				}
				this.redrawTable();
			});
		}
	}

	/**
	 *
	 */
	private _getControlConfig() {
		switch (this.controlManager) {
			case 'delegate':
			case 'infiniteScroll':
				this.$delegateFilterManagement = true;
				const _infiniteScroll = this.controlManager === 'infiniteScroll';
				return {
					...(this.$config.pagination === false ? { pagination: false } : {}),
					ajaxURL: 'delegate',
					sortMode: 'remote',
					filterMode: 'remote',
					ajaxRequestFunc: (_url, _config, params) => {
						if (!_infiniteScroll) {
							this._loadingHandler(true);
						}
						const { sort } = params;
						const sorters = sort.reduce((acc, item) => {
							const { field, dir } = item;
							acc[field] = dir;
							return acc;
						}, {});
						this._currentOrderParams = { ...this._currentOrderParams, sorters };
						this.delegateChanges.emit(this._currentOrderParams);
						return Promise.resolve(this.$rowData);
					}
				};
			default:
				this.$delegateFilterManagement = false;
				return {
					...(this.$config.pagination === false && this.$infiniteScroll ? { pagination: false } : { pagination: 'local' }),
					paginationSize: get(this.$paginatorConfig, 'paginationSize'),
					paginationSizeSelector: get(this.$paginatorConfig, 'paginationSizeSelector'),
					paginationInitialPage: get(this.$paginatorConfig, 'paginationInitialPage'),
					paginationButtonCount: get(this.$paginatorConfig, 'paginationButtonCount')
				};
		}
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
		Tabulator.extendModule('format', 'formatters', getCustomHeaderFormatters(this._tableUuid, this._tableInstance, this));
		Tabulator.extendModule('edit', 'editors', getCustomEditors);
	}

	/**
	 *
	 */
	private onTabChange(idTab: string, fromViewSelector?: boolean) {
		this.$rowsize = {
			'1': 'small',
			'2': 'medium',
			'3': 'large'
		}[idTab || '2'] as RowSizes;
		if (this.$currentViewObject?.idType === viewTypes.CUSTOM_VIEWS) {
			const localStorageRowSizeId = this.$currentViewObject.currentView.id + '-idTabRowSize';
			const currentIdTab = window.localStorage.getItem(localStorageRowSizeId);
			if (currentIdTab !== idTab) {
				this.selectRowSize.emit(this.$rowsize);
				window.localStorage.setItem(localStorageRowSizeId, idTab);
			}
		}
		if (!fromViewSelector) {
			this.setDataLayer(EventsAnalytics.SIZE_TABS, this.$rowsize);
		} else {
			this.changeView.emit(this.$currentViewObject?.currentView.id);
		}
		this._updateTableHeight();
		this._redraw();
	}

	/**
	 *
	 */
	private _countCustomViews() {
		const customViews = get(first(this.$itemList.filter((type) => type.id === viewTypes.CUSTOM_VIEWS)), 'views', []);
		this.$countCustomViews = customViews.length;
	}

	/**
	 *
	 */
	setHeaderLeft(value: number) {
		this._hostRef.style.setProperty('--header-left-position', value + 'px');
	}

	/**
	 *
	 */
	setTableLeft(value: number) {
		this._hostRef.shadowRoot.querySelector('.tabulator-tableholder').scrollLeft = value;
	}

	/**
	 *
	 */
	setVisibleFilters(actualColumn: string, isActive: boolean) {
		if (!!this.$setVisibleFilters.find((element) => element.type === actualColumn)) {
			this.$setVisibleFilters.map((element) => {
				if (element.type === actualColumn) {
					element.status = isActive;
				}
			});
		} else {
			this.$setVisibleFilters.push({ type: actualColumn, status: isActive });
		}
		this.$headerOverflowIsVisble = !!this.$setVisibleFilters.find((element) => element.status === true);
	}

	/**
	 *
	 */
	getFavouriteView() {
		let favouriteView: { view: View; idType: string };
		(this.$itemList || []).map((item) => {
			const favourite = item.views.filter((view) => view.favourite);
			if (favourite.length) {
				favouriteView = {
					view: favourite[0],
					idType: item.id
				};
			}
		});
		if (favouriteView) {
			this.$currentViewObject = {
				idType: favouriteView.idType,
				currentView: favouriteView.view
			};
		} else {
			const tableViews = get(this.$itemList.filter((type) => type.id === 'default-views')[0], 'views', []);
			this.$currentViewObject = {
				idType: get(this.$itemList.filter((type) => type.id === 'default-views')[0], 'id', ''),
				currentView: tableViews.find((view) => view.id === 'default')
			};
			this.$currentViewObject.currentView.favourite = true;
		}
	}

	/**
	 *
	 */
	deleteView() {
		const customViews = get(first(this.$itemList.filter((type) => type.id === viewTypes.CUSTOM_VIEWS)), 'views', []);
		customViews.splice(customViews.indexOf(this.$currentViewObject.currentView), 1);
		this._countCustomViews();
		this.getFavouriteView();
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
		this.setColumnsFilterSubHeader();
	}
	private setView(view: View) {
		let shownFields: string[] = this.$currentViewObject?.currentView.columns.map((column) => column.field);
		this.setVisibleColumns(shownFields, view);
		this.setFilterColumnIcons(this.getColumnsWithFilters());
		if (this._tableInstance) {
			this._tableInstance.setColumns(this.$visibleColumns);
			this._tableReferences.setScrollGap(this._tableUuid);
		}
	}

	/**
	 *
	 */
	private _redraw(): void {
		if (this._tableInstance) {
			requestAnimationFrame(() => {
				this.redrawTable();
				if (this._tableInstance.element.querySelector('.tabulator-tableholder')?.classList.contains('scroll-tableholder')) {
					this._tableInstance.element.querySelector('.tabulator-tableholder').scrollTo(0, 0);
				}
				if (this.controlManager === 'local') {
					this._updatePaginatorConfig();
				}
			});
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
		const idTab = window.localStorage.getItem(this.$currentViewObject?.currentView?.id + '-idTabRowSize');
		const idTabRowSizeDefault = RowSizesStringToNumber?.[this.$currentViewObject?.currentView?.rowSize];
		!!idTab ? this.onTabChange(idTab, true) : this.onTabChange(idTabRowSizeDefault, true);
		this.$shownColumns = this.$currentViewObject.currentView.columns;
		this.setView(this.$currentViewObject.currentView);
		this._toggleMenu(false, false);
		this.setDataLayer(EventsAnalytics.SELECT_A_VIEW, this.$currentViewObject);
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
		this._paginationChangeHandler({ detail: { tableUuid: this._tableUuid, currentPage: 0, itemsPerPage: number || 10 } } as any);
		this._updateTableHeight();
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
				this.$currentViewObject.idType = viewTypes.CUSTOM_VIEWS;
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
			),
				this.$createModal
					? this.createCustomViews()
					: this.$itemList.map((type, typeId) =>
							type.views.map((view, viewId) => {
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
			this.customizedViews.emit(this.$itemList.filter((type) => type.id === viewTypes.CUSTOM_VIEWS)[0]);
		} else {
			if (deleteView) {
				this.deleteView();
				this.customizedViews.emit(this.$itemList.filter((type) => type.id === viewTypes.CUSTOM_VIEWS)[0]);
			}
			if (this.$hasChanges) {
				this._openModalCancel(true);
			}
		}
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
		if (!this.$itemList.filter((type) => type.id === viewTypes.CUSTOM_VIEWS)[0]) {
			this.$itemList.push({
				title: this.$literals.titleCustomViews,
				type: 'view',
				id: viewTypes.CUSTOM_VIEWS,
				views: []
			});
		}
		this.$editingView = {
			...this.$editingView,
			rowSize: 'medium'
		};
		this.$itemList.filter((type) => type.id === viewTypes.CUSTOM_VIEWS)[0].views.push(this.$editingView);
		this.$currentViewObject.idType = viewTypes.CUSTOM_VIEWS;
		this._countCustomViews();
		const idTabRowSizeDefault = get(RowSizesStringToNumber, this.$editingView.rowSize, '1');
		this.onTabChange(idTabRowSizeDefault);
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
		this.$shownColumns = this._modifyColumns(state, column, this.$shownColumns);
		this.$editingView.columns = this._modifyColumns(state, column, this.$editingView.columns);
		this.$hiddenColumns = this._modifyColumns(!state, column, this.$hiddenColumns);
		this._setHiddenColumnsFixed();
		this.$hasChanges = true;
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
			this.$shownColumns = this.$shownColumns.concat(this.$hiddenColumns);
			this.$editingView.columns = this.$editingView.columns.concat(this.$hiddenColumns);
			this.$hiddenColumns = [];
		} else {
			this.$hiddenColumns = this.$hiddenColumns.concat(this.$shownColumns);
			const columnsHidden = this.$shownColumns.map((doc) => doc.field);
			this.$editingView.columns = this.$editingView.columns.filter((columns) => !columnsHidden.includes(columns.field));
			this.$shownColumns = [];
		}
		this._setHiddenColumnsFixed();
		this.$hasChanges = true;
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

	/**
	 *
	 * @param newFilter
	 */
	public updateCurrentFilters(newFilter?: ActiveFilters | ActiveFilters[] | null) {
		if (this.$delegateFilterManagement) {
			if (isNull(newFilter)) {
				this.$activeFilters = [];
			} else if (Array.isArray(newFilter)) {
				this.$activeFilters = newFilter;
			} else if (!isEmpty(newFilter)) {
				this.$activeFilters.push(newFilter);
			}
		} else {
			this.$activeFilters = this._tableInstance?.getFilters() || this.$activeFilters || [];
		}
		this.setFilterColumnIcons(this.getColumnsWithFilters());
		this._getActiveFiltersChips(this.$activeFilters);
		this.$headerFilterElementPositionRef = null;
		this.$openChipFiltersColumn = false;
		this.$openChipFilters = false;
		this._emitFilters();
	}

	/**
	 *
	 */
	public deleteOneFilter(filter: ActiveFilters, isFromColumn: boolean) {
		if (filter.type === 'in') {
			const filterToDelete = this.$activeFilters.filter((element) => element.field === filter.field);
			if (!this.$delegateFilterManagement) {
				this._tableInstance.removeFilter(filterToDelete[0].field, filterToDelete[0].type, filterToDelete[0].value);
				remove(this.$activeFilters as never, ({ field, type, value }) => {
					return field === filterToDelete[0].field && type === filterToDelete[0].type && value === filterToDelete[0].value;
				});
			} else {
				remove(this.$activeFilters as never, ({ field, type, value }) => {
					return field === filterToDelete[0].field && type === filterToDelete[0].type && value === filterToDelete[0].value;
				});
			}
		} else if (!this.$delegateFilterManagement) {
			this._tableInstance.removeFilter(filter.field, filter.type, filter.value);
			remove(this.$activeFilters as never, ({ field, type, value }) => {
				return field === filter.field && type === filter.type && value === filter.value;
			});
		} else {
			remove(this.$activeFilters as never, ({ field, type, value }) => {
				return field === filter.field && type === filter.type && value === filter.value;
			});
		}
		if (
			(this.$activeFilters.length == 0 && !isFromColumn) ||
			(this.$activeFilters.filter((filter) => filter.field === this.$currentOpenChipFiltersColumn) && isFromColumn)
		) {
			this.clearChips();
		}
		this.updateCurrentFilters();
	}

	/**
	 *
	 */
	public deleteAllFilterOneColumn(column: string) {
		if (!this.$delegateFilterManagement) {
			(this._tableInstance?.getFilters() || []).forEach((filter) => {
				if (filter.field === column) {
					this._tableInstance.removeFilter(filter.field, filter.type, filter.value);
				}
			});
		} else {
			remove(this.$activeFilters as never, ({ field }) => field === column);
		}
		this.clearChips();
		this.updateCurrentFilters();
	}

	/**
	 *
	 */
	private _getActiveFiltersChips(activeFilters: ActiveFilters[]) {
		const columnTitles = this.$visibleColumns.reduce((acc, column) => {
			const { title, field } = column;
			acc[field] = title;
			return acc;
		}, {});
		requestAnimationFrame(() => {
			this.$totalActiveFilters = activeFilters.map((filter) => ({
				fieldTitle: columnTitles[filter?.field || ''],
				field: filter.field,
				type: filter.type,
				value: filter.value
			}));
			this.$chips = (this.$totalActiveFilters || []).map((filter, index) => {
				const { field, type, value, fieldTitle } = filter;
				const showType = type !== 'equal';
				const _fieldTitle = fieldTitle || '';
				return {
					id: index,
					field: field || '',
					label: showType ? `${_fieldTitle} ${type}` : _fieldTitle,
					value: value || ''
				};
			});
		});
	}

	/**
	 *
	 */
	public deleteAllFilter() {
		if (!this.$delegateFilterManagement) {
			this._tableInstance.clearFilter(true);
		}
		this.clearChips();
		this.updateCurrentFilters(null);
	}

	/**
	 *
	 */
	public getColumnsWithFilters(): string[] {
		const activeFilters = this.$delegateFilterManagement ? this.$activeFilters : this._tableInstance?.getFilters();
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
		this.$headerFilterElementPositionRef = null;
		this.$openChipFiltersColumn = false;
		this.$openChipFilters = false;
	}

	/**
	 *
	 */
	private tooltipReposition() {
		if (this._scrollTimer !== null) {
			clearTimeout(this._scrollTimer);
		}
		this._scrollTimer = setTimeout(() => this.horizontalScroll.emit(), 700);
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
		const customViews: MenuPanelItem[] = this.$itemList.filter((type) => type.id === viewTypes.CUSTOM_VIEWS);
		return this.$createModal && customViews.length && customViews[0].views.some((view) => view.label === this.$editingView.label);
	}

	/**
	 *
	 */
	public setFilterColumnIcons(columnWithFilters: any[]): void {
		this.$visibleColumns = this.$visibleColumns.map((element) => {
			const { field, titleFormatter } = element;
			const filterFields = columnWithFilters.map((filterElement) => filterElement.field);
			const _titleFormatter = filterFields.includes(field)
				? 'filterManagerHeader'
				: titleFormatter === 'filterManagerHeader'
				? undefined
				: titleFormatter;
			return {
				...element,
				titleFormatter: _titleFormatter
			};
		});
		this._tableInstance.setColumns(this.$visibleColumns);
		this._tableInstance.redraw();
	}

	/**
	 *
	 */
	private setColumnsFilterSubHeader() {
		this.$visibleColumns?.forEach((column) => {
			const subHeader = {
				...this.$subHeaderData?.data?.find((item) => item.field === column.field),
				searchDate: this.$subHeaderData?.searchDate
			};
			let defaultWidthFilter = column.width;
			let componentFilterToRender = null;
			switch (column?.headerFilterType) {
				case FILTER_TYPE.text_field.name:
					componentFilterToRender = textFieldHeaderFilter(this, this._showFilterRow, this.$showSubHeader, subHeader);
					defaultWidthFilter = FILTER_TYPE.text_field.widthDefault;
					break;
				case FILTER_TYPE.dropdown.name:
					componentFilterToRender = dropdownHeaderFilter(this, this.$rowData, this._showFilterRow, this.$showSubHeader, subHeader);
					defaultWidthFilter = FILTER_TYPE.dropdown.widthDefault;
					break;
				case FILTER_TYPE.boolean.name:
					componentFilterToRender = booleanHeaderFilter(this, this._showFilterRow, this.$showSubHeader, subHeader);
					defaultWidthFilter = FILTER_TYPE.boolean.widthDefault;
					break;
				case FILTER_TYPE.date_range.name:
					componentFilterToRender = rangeHeaderFilter(this, filtersRangesTypes.DATE, this._showFilterRow, this.$showSubHeader, subHeader);
					defaultWidthFilter = FILTER_TYPE.date_range.widthDefault;
					break;
				case FILTER_TYPE.number_range.name:
					componentFilterToRender = rangeHeaderFilter(this, filtersRangesTypes.AMOUNT, this._showFilterRow, this.$showSubHeader, subHeader);
					defaultWidthFilter = FILTER_TYPE.number_range.widthDefault;
					break;
				default:
					break;
			}

			if ((this._showFilterRow || this.$showSubHeader) && !!componentFilterToRender) {
				column.headerFilter = componentFilterToRender;
			} else {
				delete column.headerFilter;
			}

			if (this._showFilterRow && column.headerFilterType) {
				const widthFilter = get(column, 'defaultWidthFilter', defaultWidthFilter);
				const widthTitle = column.widthTitle ?? column.width ?? column.minWidth;
				column.width = widthTitle < widthFilter ? widthFilter : widthTitle;
			} else {
				// when widthTitle define like 0, means that columns size are define for content of cels row, por this, tabulator needs not fill the field width and minwidth
				if (column.widthTitle === 0) {
					delete column.width;
				} else {
					// Do if beacuse tabulator understand undefined like a value to rendert table. The path is if not is filled, not create attribute inside object
					if (column.width || column.minWidth) {
						column.width = get(column, 'widthTitle', column.width ?? column.minWidth);
					}
				}
			}

			column.headerFilterEmptyCheck = function (value) {
				return !value; //only filter when the value is true
			};
		});
		if (this._tableInstance) {
			this._setFrozenColumns();
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
		if (this._showFilterRow) {
			_filtersHeader?.classList.add('show-filter-row');
		} else {
			_filtersHeader?.classList.remove('show-filter-row');
		}
	}

	/**
	 *
	 * @param newFilter
	 * @param column
	 */
	public sendSelectedFilters(column) {
		this.setDataLayer(EventsAnalytics.SEND_FILTER, column);
		this.updateCurrentFilters();
	}

	/**
	 *
	 * @param filters
	 */
	private _emitFilters() {
		if (this.$delegateFilterManagement) {
			this._currentOrderParams = {
				...this._currentOrderParams,
				filters: this.$activeFilters || []
			};
			this.delegateChanges.emit(this._currentOrderParams);
		}
	}

	/**
	 *
	 */
	showAllFiltersChipsCard() {
		const chips = this._cardFilterReference.querySelector('.chips-container');
		if (this.$activeFilters.length > 0) {
			this.$openChipFilters = !this.$openChipFilters;
			chips.style.top = '24px';
			chips.style.left = '200px';
		}
	}

	/**
	 *
	 * @returns
	 */
	render() {
		const _filterCardParams = {
			openChipFilters: this.$openChipFilters,
			openChipFiltersColumn: this.$openChipFiltersColumn,
			literals: this.$literals,
			currentOpenChipFiltersColumn: this.$currentOpenChipFiltersColumn,
			chips: this.$chips,
			totalActiveFilters: this.$totalActiveFilters,
			deleteAllFilter: this.deleteAllFilter.bind(this),
			deleteAllFilterOneColumn: this.deleteAllFilterOneColumn.bind(this),
			chipsFiltersNumber: this.chipsFiltersNumber.bind(this),
			deleteOneFilter: this.deleteOneFilter.bind(this),
			elementPositionRef: this.$headerFilterElementPositionRef,
			hostRef: this._hostRef
		};
		return (
			<Host>
				<div id="header" class={'top-bar-table'}>
					<div class={'left-side'}>
						<div class={'container-title'}>
							{this.name && <span class={'title'}>{this.name}</span>}
							{this.$paginatorConfig.totalItems && !this.$config?.hideTotal && (
								<span class={'counter'}>{this.$paginatorConfig.totalItems}</span>
							)}
						</div>
						{/* Inicio Menu */}
						{(!isEmpty(this.name) || (this.$paginatorConfig.totalItems && !this.$config?.hideTotal)) &&
							(!this.$config?.hideViews || !this.$config?.hideFilters) && <div class="separator-views"></div>}
						{this.$itemList && !this.$config?.hideViews && (
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
										{this.$currentViewObject.idType !== viewTypes.DEFAULT_VIEWS && (
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
						{!this.$config?.hideFilters && (
							<div class={'filters-container'}>
								<scib-atoms-tooltip-info
									delay={this.$config.tooltipDelay}
									arrow="bottom"
									literalsTooltip={this.$literals.viewAllFilters}
									class={'tooltipFilterIcon'}
								>
									<div
										onClick={() => {
											this.showAllFiltersChipsCard();
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
								<div ref={(elementRef) => (this._cardFilterReference = elementRef)}>
									<OrganismsAdvancedDataTableFiltersCard {...{ ..._filterCardParams, openChipFiltersColumn: false }} />
								</div>
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
								'subheader-format': !this._showFilterRow && this.$showSubHeader,
								'is-visible': this.$headerOverflowIsVisble,
								'hide-sub-header-totals': !this.showSubHeaderTotals,
								'infinite-scroll': this.$infiniteScroll
							}}
							table-id={this._tableUuid}
						></div>
						<div class="empty-state" id="placeholder">
							<scib-ui-v2-empty-state
								description={this.$emptyStateDescription}
								image={assetUrl('/assets/images/' + this.$emptyStateImage)}
								main-title={this.$emptyStateTitle}
								size="md"
							></scib-ui-v2-empty-state>
						</div>
						{this.$infiniteScroll && (
							<div class={{ paginator: true }} id="size-and-rows">
								<scib-atoms-tooltip-info
									delay={this.$config.tooltipDelay}
									class="tooltip-padding"
									arrow="top"
									literalsTooltip={this.$literals.paddingSelector}
								>
									<scib-atoms-icon-tabs
										tabs='[{"id":1,"icon":"row-separation-s"},{"id":2,"icon":"row-separation-m"},{"id":3,"icon":"row-separation-l"}]'
										active-index={{ small: '1', medium: '2', large: '3' }[this.$rowsize]}
										onEventTabChange={(event) => this.onTabChange(event.detail)}
									></scib-atoms-icon-tabs>
								</scib-atoms-tooltip-info>
								<div class="size-selector-container">
									<span class="size-selector-text">{this.$literals.paginator}</span>
									<a class="size-selector-button" onClick={() => this._toggleSizeSelector(!this.$openSizeSelectorPanel)}>
										{this.$paginatorConfig.paginationSize}
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
										{this.$paginatorConfig.paginationSizeSelector.map((number, index) => (
											<li class="mdc-list-item" role="menuitem" key={index} onClick={() => this._handleSizeClicked(number)}>
												<span class="mdc-list-item__text">{number}</span>
											</li>
										))}
									</ul>
								</div>
							</div>
						)}
						{this.$config.pagination && !this.$infiniteScroll && (
							<scib-molecules-paginator
								dropdownPosition="up"
								class={{ paginator: true }}
								{...this.$paginatorConfig}
								itemsPerPageText={this.$literals.paginator}
								ref={(element) => (this._paginatorRef = element)}
							>
								<div slot="custom-paginator-content" class="customize__table__container">
									<div class="custom__view__selector__container">
										<scib-atoms-tooltip-info
											class="tooltip-padding"
											arrow="top"
											delay={this.$config.tooltipDelay}
											literalsTooltip={this.$literals.paddingSelector}
										>
											<scib-atoms-icon-tabs
												class="padding-tabs"
												tabs='[{"id":1,"icon":"row-separation-s"},{"id":2,"icon":"row-separation-m"},{"id":3,"icon":"row-separation-l"}]'
												active-index={{ small: '1', medium: '2', large: '3' }[this.$rowsize]}
												onEventTabChange={(event) => this.onTabChange(event.detail)}
											></scib-atoms-icon-tabs>
										</scib-atoms-tooltip-info>
									</div>
								</div>
							</scib-molecules-paginator>
						)}
					</div>
					<div>
						<OrganismsAdvancedDataTableFiltersCard {...{ ..._filterCardParams, openChipFilters: false }} />
					</div>
					<scib-atoms-skeleton
						class={{ skeleton: true, loaded: !this.$loading, 'not-ready': !this.$skeletonReady }}
						skeletonType={this.customSkeleton}
					/>
				</div>
				{/* Modal de Vistas */}
				{this.$openModalView && (
					<scib-ui-v2-dialog
						dialog-title={
							this.$currentViewObject.idType === viewTypes.CUSTOM_VIEWS ? this.$literals.typeCustomView : this.$literals.typeTableView
						}
						open={this.$openModalView}
						preventClose={this.$hasChanges}
						prevent-close="true"
						onDialogClosing={() => (this.$hasChanges ? this._openModalCancel(true) : (this.$openModalView = false))}
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
										this.$currentViewObject.idType === viewTypes.CUSTOM_VIEWS
											? this.$literals.typeCustomView
											: 'this.$literals.typeCustomView'
									}
									label={this.$literals.inputLabelName}
									value={this.$editingView.label}
									type="text"
									invalid={!this.$editingView.label}
									readOnly={this.$currentViewObject.idType === viewTypes.DEFAULT_VIEWS}
									required={!this.$createModal && this.$currentViewObject.idType === viewTypes.CUSTOM_VIEWS}
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
								{(this.$createModal || this.$currentViewObject.idType !== viewTypes.DEFAULT_VIEWS) && (
									<div class="modal-views-content__view-input hideAll">
										<scib-atoms-button
											onClick={() => this._changeVisivilityAll(this.$allHidden)}
											text={!this.$shownColumns.length ? this.$literals.showAll : this.$literals.hideAll}
											icon={!this.$shownColumns.length ? 'visibility-on' : 'visibility-off'}
											size="s"
											level="tertiary"
											icon-position="trailing"
											type="button"
										></scib-atoms-button>
									</div>
								)}
							</div>
							{this.$shownColumns.length || this.$hiddenColumns.length ? (
								<div>
									<div class="list-titles">
										<span>{this.$literals.titleColumnShown}:</span>
										<span>{this.$literals.titleColumnHidden}: </span>
									</div>
									<div class={'modal-list'}>
										{!this.$allHidden ? (
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
														drag={this.$createModal || this.$currentViewObject.idType !== viewTypes.DEFAULT_VIEWS}
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
																			this.$currentViewObject.idType !== viewTypes.DEFAULT_VIEWS) && (
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
																		this.$currentViewObject.idType !== viewTypes.DEFAULT_VIEWS) && (
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
																	this.$currentViewObject.idType !== viewTypes.DEFAULT_VIEWS) && (
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
										onClick={() => (this.$hasChanges ? this._openModalCancel(true) : '')}
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
