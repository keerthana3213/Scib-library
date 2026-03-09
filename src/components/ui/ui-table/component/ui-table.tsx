import { Component, Event, EventEmitter, Host, h, Prop, State, Watch, Listen } from '@stencil/core';
import {
	IUITableColumnDefs,
	IUITableRowData,
	IUITableSelectionType,
	IUITableDataType,
	IUITableLiterals,
	IUITableTopButtons,
	IUITableAvatars,
} from '../models/ui-table.model';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { UITableDetail } from '../fragments/ui-table-detail.fragment';
import { UITableFile } from '../fragments/ui-table-file.fragment';
import { UITableSkeleton } from '../fragments/ui-table-skeleton.fragment';
import { Grid, GridOptions, RowNode } from 'ag-grid-community';
import { isNull, isUndefined } from 'lodash';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-table',
	styleUrl: 'ui-table.scss',
	shadow: false,
	scoped: false,
})
export class UITable {
	/** Id único para el componente */
	@Prop({ reflect: true }) tableId: string;

	/** Props to set manual pagination. Util for pagination from server-side */
	@Prop() enableNextPag: boolean = false;
	@Prop() enablePrevPag: boolean = false;
	@Prop() totalRows: string;
	@Prop() currentPagination: string;
	@Prop() disableFirstLastBtns: boolean = false;
	@Prop() hideCustomPagination?: boolean = false;
	@Prop() showTableLoading: boolean = false;
	@Prop() noCenter?: boolean = false;
	addedListenerNext = false;
	addedListenerPrev = false;

	/** Indicate if sorting rows is case insensitive */
	@Prop() caseInsensitive: boolean = false;

	/** Literales a localizar del componente */
	@Prop({ mutable: true, reflect: false }) literals: IUITableLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: IUITableLiterals | string) {
		this._literals = _parseProp(newLiterals);
		this._gridOptions.localeText = this._literals.localeText;
		if (this._tableEl && this._tableEl.innerHTML.length > 0) {
			this._tableEl.innerHTML = '';
			new Grid(this._tableEl, this._gridOptions);
		}
		this.addedListenerNext = false;
		this.addedListenerPrev = false;
		if (!this.addedListenerNext && !this.addedListenerPrev && this._tableEl) {
			this.setManualPagination();
		}
	}
	@State() _literals: IUITableLiterals;

	colsCounter = 0;
	/** Definición de los encabezamientos de las columnas */
	@Prop({ mutable: true, reflect: true }) columnDefs: IUITableColumnDefs[] | string;
	@Watch('columnDefs') parseColumnDefs(newColumnDefs: IUITableColumnDefs[] | string) {
		const parsedColumnDefs = _parseProp(newColumnDefs);
		this._columnDefs = [...this._columnDefsStart, ...parsedColumnDefs];
		this._gridOptions.columnDefs = this._columnDefs;
		if (this.colsCounter > 0) {
			this._gridOptions.api.setColumnDefs(this._columnDefs);
		}
		this.colsCounter++;
		const actionColumn = this._columnDefs.findIndex(column => column.field === 'actions');
		if (actionColumn > 0) {
			this._columnDefs[actionColumn].field = 'detail';
			this._columnDefs[actionColumn].sortable = false;
			this._columnDefs[actionColumn].resizable = false;
			this._columnDefs[actionColumn].lockPosition = false;
			this._columnDefs[actionColumn].cellRenderer = params => {
				// verify action param type
				const actionsArr = params.data.actions.constructor === Array ? [...params.data.actions] : [params.data.actions];
				const actionIconsDivs = actionsArr.reduce((prev: string, curr: any) => {
					return (
						prev +
						`
						<div class="ui-table__actions ui-table__actions--align-center">
							<scib-ui-button
								disabled=${curr.disabled ? curr.disabled : false}
								class="ui-table__action-btn-download"
								link=true
								nobackground=true
								hide-txt=true
								disable-min-width=true
								icon='${curr.icon}'
								custom-data='{"type": "${curr.event}", "payload": "${params.data.hiddenId}", "disabled": ${curr.disabled ? curr.disabled : false}}'
							>
							${curr.actionName}
							</scib-ui-button>
						</div>
					`
					);
				}, '');
				const actionDiv = document.createElement('div');
				actionDiv.classList.add('ui-table__actions');
				if (this.noCenter) {
					actionDiv.classList.add('ui-table__actions--no-center');
				}

				actionDiv.innerHTML = actionIconsDivs;
				return actionDiv;
			};
		}
		const columnSortFunc = this._columnDefs.filter(col => col.hasOwnProperty('disableDefaultSort') && col.disableDefaultSort);
		if (columnSortFunc.length > 0) {
			this._columnDefs.forEach(el => {
				if (el.hasOwnProperty('disableDefaultSort') && el.disableDefaultSort) {
					if (!el.hasOwnProperty('dataType')) {
						el.comparator = () => 0;
					} else {
						switch (el.dataType) {
							case IUITableDataType.date:
								el.comparator = this.dateComparatorDefault;
								break;
						}
					}
				}
			});
		}
	}

	dateComparatorDefault(date1, date2) {
		const monthToComparableNumber = date => {
			if (date === undefined || date === null) {
				return null;
			}
			let dateSplit = date.split('/');
			if (dateSplit.length == 3) {
				const yearNumber = +dateSplit[2];
				const monthNumber = +dateSplit[1];
				const dayNumber = +dateSplit[0];

				const result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
				return result;
			} else {
				return 0;
			}
		};
		const date1Number = monthToComparableNumber(date1);
		const date2Number = monthToComparableNumber(date2);

		if (date1Number === null && date2Number === null) {
			return 0;
		}
		if (date1Number === null) {
			return -1;
		}
		if (date2Number === null) {
			return 1;
		}
		return date1Number - date2Number;
	}

	@Listen('eventClickWithData', { capture: true }) eventClickWithData({ detail }: any): void {
		this.userAction.emit(JSON.parse(detail));
	}

	/** Datos de las filas */
	rowDataCounter = 0;
	@Prop({ mutable: true, reflect: false }) rowData: IUITableRowData[] | string;
	@Watch('rowData') parseRowData(newRowData: IUITableRowData[] | string) {
		this._rowData = _parseProp(newRowData);
		this._rowData.map(i => {
			i.name = this._returnDashIfEmpty(i, 'name');
			i.surname = this._returnDashIfEmpty(i, 'surname');
			i.fullName = this._returnDashIfEmpty(i, 'fullName');
			i.email = this._returnDashIfEmpty(i, 'email');
			i.rol = this._returnDashIfEmpty(i, 'rol');
			i.subsidiary = this._returnDashIfEmpty(i, 'subsidiary');
			i.company = this._returnDashIfEmpty(i, 'company');
		});
		this._gridOptions.rowData = _parseProp(newRowData);
		if (this.rowDataCounter > 0) {
			this._gridOptions.api.setRowData(this._rowData);
		}
		this.rowDataCounter++;
	}

	/**
	 * Returns the real data if exists, else returns a dash.
	 * @param data user's data
	 * @param key Field data
	 * @returns dash or real data
	 */
	_returnDashIfEmpty(data, key) {
		return data[key] === '' ||
			data[key] === ' ' ||
			data[key] === 'undefined' ||
			isUndefined(data[key]) ||
			isNull(data[key]) ||
			data[key] === 'null' ||
			!data[key]
			? '-'
			: data[key];
	}
	/** Botones de las herramientas de la parte de arriba de la tabla */
	@Prop({ mutable: true, reflect: true }) topButtons: IUITableTopButtons[] | string;
	@Watch('topButtons') parseTopButtons(newTopButtons: IUITableTopButtons[] | string) {
		this._topButtons = _parseProp(newTopButtons);
	}

	_getObjectDataJSON(array: Array<{ src: string; alt: string }>) {
		const str = [...array];
		return JSON.stringify(str);
	}

	/** Avatares de los usuarios de la tabla */
	@Prop({ mutable: true, reflect: true }) avatars: string | IUITableAvatars[];
	@Watch('avatars') parseAvatars(newVal: string | IUITableAvatars[]) {
		this._avatars = _parseProp(newVal);
		if (this._avatars?.length > 0) {
			this._columnDefs[2].cellRenderer = params => {
				for (const avatar of this._avatars) {
					if (params.data.hiddenId === avatar.memberId) {
						return `
							<div class="ui-table-avatar">
								<scib-ui-avatar class="ui-table-avatar-image"
									is-employee=${avatar.isEmployee}
									images='${this._getObjectDataJSON([{ src: avatar.imgSrc, alt: params.value }])}'
									data='{"title":"${params.value}"}'
								></scib-ui-avatar>
							</div>
						`;
					}
				}
			};
		}
		if (this._tableEl && this._tableEl.innerHTML.length > 0) {
			this._tableEl.innerHTML = '';
			new Grid(this._tableEl, this._gridOptions);
		}
	}

	/** Etiqueta de los elementos */
	@Prop({ reflect: true }) elementName: string;

	/** Opción de si los campos son editables */
	@Prop({ reflect: true }) isEditable: boolean = false;

	/** Opción de si las filas son seleccionables */
	@Prop({ reflect: true }) isSelectable: boolean = false;

	/** Opción de si las columnas se pueden mover */
	@Prop({ reflect: true }) isDraggable: boolean = false;

	/** Opción de si se puede bajar en un archivo csv */
	@Prop({ reflect: true }) isDownloadable: boolean = false;

	/** Opción de si se ve el tipo de archivo en la primera columna*/
	@Prop({ reflect: true }) hasRenderedIcons: boolean = false;

	/** First column header for details*/
	@Prop({ reflect: true }) detailHeader: string = '';

	/** Número de elementos por página, si es 0 no hay paginación */
	@Prop({ reflect: true }) paginationPageSize: number = null;

	/** Opción de activar el scroll horizontal. Para activarlo hay que pasarle el valor -1 */
	@Prop({ reflect: true }) activateHorizontalScroll: number = 6;

	/*Indica si se mostrará la tarjeta como un skeleton*/
	@Prop({ reflect: true }) showSkeleton: boolean;

	/** Layout de la tabla */
	@Prop({ reflect: true }) domLayout: string = 'autoHeight';

	/** Rendering element for the table */
	@State() _tableEl: HTMLElement;

	/** Preconfigración de la tabla */
	@State() _columnDefsStart: IUITableColumnDefs[] = [
		{
			headerName: 'Hidden Id',
			field: 'hiddenId',
			hide: true,
			lockPosition: true,
		},
		{
			colId: 'extension',
			headerName: this.detailHeader,
			field: this.detailHeader.length > 0 ? 'detail' : 'extensionType',
			filter: this.detailHeader.length > 0 ? 'number' : false,
			headerComponentParams: this.hasRenderedIcons
				? {
						template: `<div class="ag-cell-label-container" role="presentation">
						<span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>
						<div ref="eLabel" class="ag-header-cell-label" role="presentation">
						  ${!this.detailHeader.length ? '<i class="u-icon icon-filepage"></i>' : ''}
						  <span ref="eText" class="ag-header-cell-text" role="columnheader"></span>
						  <span ref="eSortOrder" class="ag-header-icon ag-sort-order" ></span>
						  <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon" ></span>
						  <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon" ></span>
						  <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon" ></span>
						  <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>
						</div>
					  </div>`,
				  }
				: null,
			hide: !this.isSelectable && !this.hasRenderedIcons,
			checkboxSelection: this.isSelectable,
			headerCheckboxSelection: this.isSelectable,
			lockPosition: true,
			sortable: this.detailHeader.length > 0,
			resizable: false,
		},
	];
	@State() _columnDefs: IUITableColumnDefs[] = this._columnDefsStart;
	@State() _rowData: IUITableRowData[] = [];
	@State() _topButtons: IUITableTopButtons[];
	@State() _selectedRows: IUITableRowData[] = [];
	@State() _avatars: IUITableAvatars[] = [];
	@State() _activePagination: number;
	/** Estado de la grid tanto de datos como configuación */
	@State() _gridOptions: GridOptions = {
		columnDefs: this._columnDefs,
		rowData: this._rowData,
		accentedSort: this.caseInsensitive,
		defaultColDef: {
			sortable: true,
			resizable: true,
			filter: true,
			lockPosition: !this.isDraggable,
			editable: this.isEditable,
		},
		domLayout: this.domLayout,
		suppressHorizontalScroll: this._columnDefs && this._columnDefs.length < this.activateHorizontalScroll,
		suppressDragLeaveHidesColumns: true,
		suppressRowClickSelection: true,
		pagination: this.paginationPageSize && this.paginationPageSize > 0,
		paginationPageSize: this.paginationPageSize,
		rowSelection: IUITableSelectionType.multiple,
		localeText: {},
		unSortIcon: true,
		icons: {
			sortAscending: '<i class="u-icon icon-order-arrow"/>',
			sortDescending: '<i class="u-icon icon-order-arrow --down"/>',
			sortUnSort: '<i class="u-icon icon-order"/>',
			menu: '<i class="u-icon icon-filter"/>',
		},
		minColWidth: 200,
		onSelectionChanged: () => {
			this._selectedRows = this._gridOptions.api.getSelectedRows();
		},
		onRowClicked: event => {
			this.userAction.emit({
				type: 'rowClickedEvent',
				payload: event.data,
			});
		},
		onSortChanged: event => {
			this.userAction.emit({
				type: 'sortChangeEvent',
				payload: event.api.getSortModel(),
			});
		},
		onGridReady: params => {
			params.api.sizeColumnsToFit();

			window.addEventListener('resize', function () {
				setTimeout(function () {
					params.api.sizeColumnsToFit();
				});
			});
		},
	};

	/** Emite un evento con la tab activa */
	@Event() userAction: EventEmitter;

	/** Events when click custom pagination buttons */
	@Event() nextPagination: EventEmitter;
	@Event() prevPagination: EventEmitter;

	buttonClickHandler(eventId?) {
		if (eventId == 'csvExport') {
			this.userAction.emit({
				type: eventId,
				payload: '',
			});
			const params = {
				onlySelected: this.isSelectable,
			};
			this._gridOptions.api.exportDataAsCsv(params);
		} else {
			const selectedRows = this.enableNextPag || this.enablePrevPag ? this._selectedRows : this._gridOptions.api.getSelectedRows();
			this.userAction.emit({
				type: eventId,
				payload: selectedRows,
			});
			this._gridOptions.api?.deselectAll();
			this._selectedRows = [];
		}
	}

	clickDownloadFileRow(eventId, fileId) {
		this.userAction.emit({
			type: eventId,
			payload: fileId,
		});
	}

	changePaginationSize(paginationSize) {
		this._gridOptions.api.paginationSetPageSize(paginationSize);
		this._activePagination = paginationSize;
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.colsCounter = 0;
		this.rowDataCounter = 0;
		this.parseColumnDefs(this.columnDefs);
		this.parseRowData(this.rowData);
		this.parseTopButtons(this.topButtons);
		this.parseAvatars(this.avatars);
		this.parseLiterals(this.literals);
		this._gridOptions.columnDefs = this._columnDefs;
		this._gridOptions.rowData = this._rowData;
		this._gridOptions.localeText = this._literals.localeText;

		if (this.hasRenderedIcons && this.detailHeader.length > 0) {
			this._columnDefs[1].cellRenderer = params => (params.value ? <UITableDetail value={params.value} /> : '');
		} else if (this.hasRenderedIcons) {
			this._columnDefs[1].maxWidth = 100;
			this._columnDefs[1].minWidth = 100;
			this._columnDefs[1].width = 100;
			this._columnDefs[1].cellRenderer = params => (params.value ? <UITableFile value={params.value} /> : '');
		} else {
			this._columnDefs[1].maxWidth = 100;
			this._columnDefs[1].minWidth = 100;
			this._columnDefs[1].width = 100;
		}
	}

	componentDidLoad() {
		this._tableEl = document.getElementById(this.tableId);
		if (this._columnDefs && this._columnDefs.length > 0) {
			this._columnDefs.map((column, index) => {
				switch (column.filter) {
					case IUITableDataType.number: {
						this._columnDefs[index].filter = 'agNumberColumnFilter';
						break;
					}
					case IUITableDataType.date: {
						this._columnDefs[index].filter = 'agDateColumnFilter';
						break;
					}
					default: {
						break;
					}
				}
			});
		}
		this._gridOptions.onFirstDataRendered = () => {
			this.sizeColumnsToFit();
		};
		this._gridOptions.onRowDataChanged = () => {
			this.setManualPagination();
			if (this.enableNextPag || this.enablePrevPag) {
				this._selectedRows.map(selectedRow => {
					this._gridOptions.api.forEachNode((node: RowNode) =>
						node.data.hiddenId === selectedRow.hiddenId || (node as any).selected
							? node.setSelected(true)
							: node.setSelected(false),
					);
				});
			}
		};
		new Grid(this._tableEl, this._gridOptions);

		const footerPanel: HTMLElement = this._tableEl.querySelector('div.ag-paging-panel');

		footerPanel.appendChild(document.querySelector('div.ui-table-custom-footer'));
		footerPanel.insertBefore(document.querySelector('div.ui-table-custom-footer'), footerPanel.childNodes[0]);
		this.changePaginationSize(this.paginationPageSize ? this.paginationPageSize : 10);
	}

	sizeColumnsToFit() {
		if (this.activateHorizontalScroll != -1 && window.innerWidth > 768) {
			this._gridOptions.api.sizeColumnsToFit();
		}
	}

	setManualPagination() {
		const arrowNext = document.querySelectorAll('[ref="btNext"]')[0] as HTMLElement;
		const arrowPrev = document.querySelectorAll('[ref="btPrevious"]')[0] as HTMLElement;
		const paginationElement = document.getElementsByClassName('ag-paging-description')[0] as HTMLElement;
		const btnNext = document.querySelectorAll('[ref="btNext"] .ag-paging-button')[0] as HTMLElement;
		const btnPrev = document.querySelectorAll('[ref="btPrevious"] .ag-paging-button')[0] as HTMLElement;
		const btnFirst = document.querySelectorAll('[ref="btFirst"]')[0] as HTMLElement;
		const btnLast = document.querySelectorAll('[ref="btLast"]')[0] as HTMLElement;

		if (this.enableNextPag) {
			arrowNext.classList.remove('ag-disabled');
			if (!this.addedListenerNext) {
				btnNext.addEventListener('click', this._handleNextPagination.bind(this), false);
				this.addedListenerNext = true;
			}
		}

		if (this.enablePrevPag) {
			arrowPrev.classList.remove('ag-disabled');
			if (!this.addedListenerPrev) {
				btnPrev.addEventListener('click', this._handlePrevPagination.bind(this), false);
				this.addedListenerPrev = true;
			}
		}

		if (this.currentPagination) {
			paginationElement.innerHTML = this.currentPagination;
		}

		if (this.disableFirstLastBtns) {
			btnFirst.style.display = 'none';
			btnLast.style.display = 'none';
		}
	}

	_handleNextPagination() {
		if (this.enableNextPag) {
			this.nextPagination.emit();
		}
	}

	_handlePrevPagination() {
		if (this.enablePrevPag) {
			this.prevPagination.emit();
		}
	}

	render() {
		return this.showSkeleton ? (
			<div role="status" aria-busy="true" aria-live="polite" class="ui-table__skeleton">
				<figure class="ui-table__skeleton-figure">
					<UITableSkeleton />
				</figure>
			</div>
		) : (
			<Host class="ui-table-host">
				<div class={{ 'ui-table-host__loading': true, 'ui-table-host__loading--hidden': !this.showTableLoading }}>
					<scib-ui-loading
						literals='{"buttonText": "Loading"}'
						secondary={false}
						show={true}
						animation={false}
						button={false}
					></scib-ui-loading>
				</div>
				<div class="ui-table-buttons">
					{this._topButtons?.map(topButton => {
						if (
							(topButton.showIfAnySelectedOnly && this._selectedRows.length == 0) ||
							(topButton.hiddenIfAnySelectedOnly && this._selectedRows.length != 0)
						) {
							return null;
						} else {
							return (
								<scib-ui-button
									class="ui-table-button"
									data-cy="table-buttons"
									type="button"
									icon={topButton.icon}
									icon-left
									disableMinWidth
									link
									small
									disabled={topButton.isDisabled || (topButton.disableIfNoneSelected && this._selectedRows.length == 0)}
									disable-min-width
									onEventClick={() => this.buttonClickHandler(topButton.csvExport ? 'csvExport' : topButton.eventId)}
								>
									{topButton.text}
								</scib-ui-button>
							);
						}
					})}
				</div>
				<div id={this.tableId} class="ag-theme-material ui-table"></div>
				<div class="ui-table-custom-footer">
					{!this.currentPagination && (
						<div class="ui-table-total">
							{this._selectedRows.length > 0 ? (
								<span>
									<strong>{this._literals.selected}:</strong> {this._selectedRows.length}{' '}
								</span>
							) : (
								<span>
									<strong>{this._literals.total}:</strong> {this.totalRows ? this.totalRows : this._rowData.length}{' '}
								</span>
							)}
							{this.elementName && this.elementName}
						</div>
					)}
					{!this.hideCustomPagination && (
						<div class="ui-table-pagesize">
							<ul class="ui-table-page-list">
								{this._rowData.length > 10 && (
									<li
										class={{
											'ui-table-page-element': true,
											'--active': this._activePagination === 10,
										}}
										onClick={() => this.changePaginationSize(10)}
									>
										10
									</li>
								)}
								{this._rowData.length > 20 && (
									<li
										class={{
											'ui-table-page-element': true,
											'--active': this._activePagination === 20,
										}}
										onClick={() => this.changePaginationSize(20)}
									>
										20
									</li>
								)}
								{this._rowData.length > 30 && (
									<li
										class={{
											'ui-table-page-element': true,
											'--active': this._activePagination === 30,
										}}
										onClick={() => this.changePaginationSize(30)}
									>
										30
									</li>
								)}
							</ul>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
