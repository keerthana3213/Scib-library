import { Component, Element, Event, EventEmitter, h, Host, Listen, Method, Prop, State, Watch } from '@stencil/core';
import { get, has, isEmpty, isEqual, merge, omit } from 'lodash';
import { TabulatorFull as Tabulator } from 'tabulator-tables';
import { v4 as uuidv4 } from 'uuid';
import { VariantTypes } from '../../../../shared/models';
import { configKeysToOmitForTables, parseProp } from '../../../../utils/helpers/common';
import { PaginationEvent } from '../../../molecules/paginator/models/paginator.model';
import { MenuPanelItem } from '../../../ui-v2/ui-v2-menu-panel/models/ui-v2-menu-panel.model';
import { References } from '../formatters/common-utils';
import { ControlManager, defaultConfig, LoadingOptions } from '../models/data-table.model';
import { getCustomFormatters } from '../modules/formatters';
import { applyDefaultConfigToColumns } from '../utils/columns';

const privateConfig = ['ajaxURL', 'sortMode', 'filterMode', 'ajaxRequestFunc', 'footerElement', 'columns', 'data', 'headerSortElement'];

@Component({
	tag: 'scib-organisms-data-table',
	styleUrl: 'data-table.scss',
	shadow: true
})
export class OrganismsDataTable {
	private _tableInstance: Tabulator;
	private _resizeObserver: ResizeObserver;
	private _tableReferences: References;
	private _currentOrderParams = {
		pagination: {},
		sorters: {}
	};
	private _tableUuid: string;
	private _paginatorRef: HTMLScibMoleculesPaginatorElement;
	private _firstLoad: boolean;

	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 *
	 */
	@Prop() controlManager: ControlManager = 'local';

	/**
	 * Skeleton type.
	 */
	@Prop() skeletonHostPath: string;
	@State() $skeletonHostPath: string;
	@Watch('skeletonHostPath') _skeletonHostPathHandeler(newValue: string) {
		this.$skeletonHostPath = newValue;
	}

	/**
	 *
	 */
	@Prop({ mutable: true }) config: string | { [key: string]: any };
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
	@Prop({ mutable: true }) columns: string | any[];
	@State() $columns: any[];
	@Watch('columns') _columnsHandler(newValue: string | any[]) {
		const columns = parseProp<any[]>(newValue, []);
		this.$columns = applyDefaultConfigToColumns(columns);
		if (this._tableInstance) {
			requestAnimationFrame(() => {
				this._tableInstance.setColumns(this.$columns);
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
	@Prop({ mutable: true }) rowData: string | any[];
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
			requestAnimationFrame(() => {
				this._tableInstance.replaceData(this.$rowData);
				this._tableInstance.redraw();
				this._disableAutoLoading();
				if (this.controlManager === 'local') {
					this._updatePaginatorConfig();
				}
			});
		}
	}

	/**
	 *
	 */
	@State() $paginatorConfig: { [key: string]: any };
	private _updatePaginatorConfig(newValue?: { [key: string]: any }) {
		const {
			paginationSizeSelector = [10, 20, 30],
			paginationButtonCount = 3,
			paginationInitialPage = 1,
			paginationSize = 10,
			infinitePaginator = false,
			totalItemsText = 'Total:',
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
			infinitePaginator,
			totalItems: Number(totalItems) || (this.$rowData || []).length,
			language,
			tableUuid: this._tableUuid,
			totalItemsText,
			...newValue
		};
	}

	/**
	 *
	 */
	@Prop() loading: boolean = true;
	@State() $loading: boolean = true;
	@Watch('loading') _loadingHandler(newValue: boolean) {
		if (typeof newValue === 'boolean') {
			this.$loading = newValue;
			if (this.$loading === false) {
				this._updateTableHeight();
			}
		}
	}

	/**
	 *
	 */
	@Prop() loadingIds: string | LoadingOptions;
	@State() $loadingIds: LoadingOptions;
	@Watch('loadingIds') _loadingIdsHandler(newValue: string | LoadingOptions) {
		const loadingSelected = parseProp<LoadingOptions>(newValue, []);
		const _prevLoadingIds = this.$loadingIds;
		this.$loadingIds = loadingSelected;
		if (this._tableInstance && !isEqual(this.$loadingIds, _prevLoadingIds)) {
			this._tableInstance.redraw(true);
		}
	}

	/**
	 *
	 * @param event
	 */
	@Listen('paginationChange') _paginationChangeHandler(event: CustomEvent<PaginationEvent>) {
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
					// case 'remote':
					// 	// TODO: Loading logic
					// 	// TODO: future option
					// 	break;
					default:
						this._tableInstance.setPageSize(itemsPerPage);
						this._tableInstance.setPage(currentPage);
				}
			}
		}
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
	@Event() cellActionMenu: EventEmitter<MenuPanelItem>;

	/**
	 *
	 */
	@Event() cellShowDetail: EventEmitter<any>;

	/**
	 *
	 */
	@Event() selectedRows: EventEmitter<any[]>;

	/**
	 *
	 */
	@Method() async getTableInstance() {
		return this._tableInstance;
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
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._tableUuid = uuidv4();
		this._skeletonHostPathHandeler(this.skeletonHostPath);
		this._loadingHandler(this.loading);
		this._loadingIdsHandler(this.loadingIds);
		this._configHandler(this.config);
		this._columnsHandler(this.columns);
		this._rowDataHandler(this.rowData);
		this._updatePaginatorConfig();
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		const paginator = this._hostRef.shadowRoot.querySelector('scib-molecules-paginator');
		const tableContainer: HTMLElement = this._hostRef.shadowRoot.querySelector('.table-container');
		const tableElement = document.createElement('div');
		this._registerCustomModules();
		const config = merge({}, defaultConfig, this.$config, this._getControlConfig());
		const existDetail = this.$columns.find((elem) => elem.formatter && elem.formatter === 'showDetail');
		this._tableInstance = new Tabulator(tableElement, {
			...omit(config, [...configKeysToOmitForTables, this.controlManager === 'delegate' ? 'pagination' : '']),
			...(config.pagination ? { footerElement: paginator } : {}),
			headerSortElement: '<span><i class="icon"/></span>',
			data: this.$rowData || [],
			columns: this.$columns,
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
		setTimeout(() => {
			if (this._tableInstance && this._tableInstance.redraw) {
				this._tableInstance.redraw();
			}
		});
	}

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
	private _destroy() {
		if (this._tableReferences && this._tableReferences.reset && this._resizeObserver && this._resizeObserver.unobserve) {
			this._tableReferences.reset(this._tableUuid);
			this._resizeObserver.unobserve(this._tableInstance.element);
		}
	}

	/**
	 *
	 */
	private _initListeners(tableContainer: HTMLElement) {
		this._tableInstance.on('tableBuilt', () => {
			tableContainer.appendChild(this._tableInstance.element);
			this._updateTableHeight();
		});
		this._tableInstance.on('dataChanged', () => {
			this._updateTableHeight();
		});
		this._tableInstance.on('pageLoaded', () => {
			this._updateTableHeight();
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
		this._resizeObserver = new ResizeObserver(() => this._updateTableHeight());
		this._resizeObserver.observe(this._tableInstance.element);
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
	 * @param tableContainer
	 */
	private _updateTableHeight() {
		if (this._tableInstance) {
			requestAnimationFrame(() => {
				if (this._tableInstance?.element?.offsetWidth) {
					const skeletonHeight = this._hostRef.shadowRoot.querySelector('.skeleton');
					const height = get(skeletonHeight, 'offsetHeight', 0) || get(this._tableInstance, 'element.offsetHeight', 0);
					const element: HTMLElement = this._hostRef.shadowRoot.querySelector('.data-table');
					element.style.setProperty('height', `${height}px`);
				}
			});
		}
	}

	/**
	 *
	 * @returns
	 */
	private _getControlConfig() {
		let config = {};
		switch (this.controlManager) {
			case 'delegate':
				config = {
					...(this.$config.pagination === false ? { pagination: false } : {}),
					ajaxURL: 'delegate',
					sortMode: 'remote',
					filterMode: 'remote',
					ajaxRequestFunc: (_url, _config, params) => {
						this._loadingHandler(true);
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
				break;
			// case 'remote':
			// 	config = {
			// 		...(this.$config.pagination === false ? { pagination: false } : { pagination: 'remote' }),
			// 		ajaxURL: 'remote',
			// 		sortMode: 'remote',
			// 		filterMode: 'remote',
			// 		ajaxRequestFunc: (_url, _config, _params) => {
			// 			// TODO: loading logic
			// 			return Promise.resolve(this.$rowData);
			// 		},
			// 	};
			// 	break;
			default:
				config = {
					...(this.$config.pagination === false ? { pagination: false } : { pagination: 'local' }),
					paginationSize: get(this.$paginatorConfig, 'paginationSize'),
					paginationSizeSelector: get(this.$paginatorConfig, 'paginationSizeSelector'),
					paginationInitialPage: get(this.$paginatorConfig, 'paginationInitialPage'),
					paginationButtonCount: get(this.$paginatorConfig, 'paginationButtonCount')
				};
		}
		return config;
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

	render() {
		return (
			<Host>
				<div class="skeleton" style={{ display: this.$loading ? 'block' : 'none' }}>
					<scib-atoms-skeleton skeletonType="table" skeletonHostPath={this.$skeletonHostPath} />
				</div>
				<div class="data-table" style={{ display: this.$loading ? 'none' : 'block' }}>
					<div class="table-container" table-id={this._tableUuid}></div>
					{this.$config.pagination && (
						<scib-molecules-paginator
							ref={(element) => {
								this._paginatorRef = element;
							}}
							class="paginator"
							{...this.$paginatorConfig}
						/>
					)}
				</div>
			</Host>
		);
	}
}
