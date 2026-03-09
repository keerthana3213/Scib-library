import { Component, Event, EventEmitter, h, Host, Prop, State, Watch } from '@stencil/core';
import { Grid } from 'ag-grid-community';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { UITableSimpleSkeleton } from '../fragments/ui-table-simple-skeleton.fragment';
import { UIISimpleTableColumnDefs, UIISimpleTableRowData, UIISimpleTableSortType } from '../models/ui-table-simple.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-table-simple',
	styleUrl: 'ui-table-simple.scss',
	shadow: false,
	scoped: false
})
export class UITableSimple {
	@Prop({ reflect: true }) tableId: string = 'simple-table';

	/*Indica si se mostrará la tarjeta como un skeleton*/
	@Prop({ reflect: true }) showSkeleton: boolean;

	@Prop({ reflect: true, mutable: true }) paginator: boolean = false;

	/** Indicate if sorting rows is case insensitive */
	@Prop() caseInsensitive: boolean = false;

	/** Emite un evento con la tab activa */
	@Event() userAction: EventEmitter;

	/** Emite un evento para ordenar las columnas con la fecha */
	@Event() eventSortDate: EventEmitter<any>;

	/** Número de elementos por página, si es 0 no hay paginación */
	@Prop({ reflect: true }) paginationPageSize: number = null;

	/** Rendering element for the table */
	@State() _table: HTMLElement;

	@Prop({ reflect: true }) isOpen: boolean;
	@State() _isOpen: boolean;
	@Watch('isOpen') parseOpen(newOpen: boolean) {
		this._isOpen = _parseProp<boolean>(newOpen as boolean);
	}

	@State() _defaultColumns: any[] = [
		{
			headerName: 'Hidden Id',
			field: 'hiddenId',
			hide: true,
			lockPosition: true
		}
	];

	@Prop() autoHeight: string = 'autoHeight';
	@Prop() sortable = true;

	@State() _gridOptions: any = {
		columnDefs: this._defaultColumns,
		rowData: [],
		accentedSort: this.caseInsensitive,
		defaultColDef: {
			sortable: this.sortable,
			resizable: true,
			filter: false,
			lockPosition: true,
			editable: false
		},
		domLayout: this.autoHeight,
		suppressHorizontalScroll: true,
		suppressDragLeaveHidesColumns: true,
		suppressRowClickSelection: true,
		pagination: this.paginator,
		paginationPageSize: this.paginationPageSize,
		unSortIcon: true,
		headerHeight: 36,
		icons: {
			sortAscending: '<i class="u-icon icon-order-arrow"/>',
			sortDescending: '<i class="u-icon icon-order-arrow --down"/>',
			sortUnSort: '<i class="u-icon icon-order"/>',
			menu: '<i class="u-icon icon-filter"/>'
		},
		getRowStyle: (params) => {
			if (params.data.style?.rowStyle) {
				return params.data.style.rowStyle;
			}
		},

		onSortChanged: (event) => {
			this.eventSortDate.emit({
				type: 'sortChangeEvent',
				payload: event.api.getSortModel()
			});
		}
	};

	literalsCounter: number = 0;
	@Prop({ reflect: true }) literals?: any | string;
	@State() _literals: any;
	@Watch('literals') parseLiterals(newLiterals: any | string) {
		if (newLiterals && this.literalsCounter !== 0) this.parseRowData(this.rowData);
		this._literals = _parseProp(newLiterals);
		this.literalsCounter++;
	}

	colsCounter = 0;
	@Prop({ mutable: true, reflect: true }) columnDefs: UIISimpleTableColumnDefs[] | string;
	@Watch('columnDefs') parseColumnDefs(newVal: UIISimpleTableColumnDefs[] | string) {
		if (this.colsCounter > 0) {
			const _newVal = JSON.parse(newVal.toString());
			for (let i = 0; i < _newVal.length; i++) {
				this._columnDefs[i + 1].headerName = _newVal[i].headerName;
			}
			this._gridOptions.api ? this._gridOptions.api.setColumnDefs(this._columnDefs) : null;
		} else {
			const parsedColumnDefs = _parseProp(newVal);
			this._columnDefs = [...this._defaultColumns, ...parsedColumnDefs];
			const columnSortFunc = this._columnDefs.filter((col) => col.hasOwnProperty('disableDefaultSort') && col.disableDefaultSort);
			if (columnSortFunc.length > 0) {
				this._columnDefs.map((el) => {
					if (el?.disableDefaultSort) {
						switch (el.sortType) {
							case UIISimpleTableSortType.date:
								el.comparator = this.dateComparatorDefault;
								break;
							case UIISimpleTableSortType.milis:
								el.comparator = this.dateComparatorMilis;
								break;
							case UIISimpleTableSortType.currency:
								el.comparator = this.currencyComparator;
								break;
							default:
								el.comparator = () => 0;
								break;
						}
					}
				});
			}
			this.colsCounter++;
		}
	}

	@State() _columnDefs: UIISimpleTableColumnDefs[];

	rowDataCounter = 0;
	@Prop({ mutable: true, reflect: true }) rowData: UIISimpleTableRowData[] | string;
	@Watch('rowData') parseRowData(newVal: UIISimpleTableRowData[] | string) {
		if (newVal) {
			this._rowData = _parseProp(newVal, []);
			this._gridOptions.rowData = this._rowData;
			if (this._rowData) {
				this._gridOptions.api ? this._gridOptions.api.setRowData(this._rowData) : null;
			}
			this.rowDataCounter++;
		} else {
			this._gridOptions.api.setRowData(this._rowData);
		}
	}
	@State() _rowData: UIISimpleTableRowData[];

	@Event() resetGoToPage: EventEmitter;

	@Prop({ mutable: true }) goToPage: number;
	@Watch('goToPage') parseGoToPage(newVal: number) {
		if (this.goToPage !== -1) this._gridOptions.api.paginationGoToPage(newVal);
		this.resetGoToPage.emit();
	}

	@Prop({ mutable: true, reflect: true }) customRender: any | string;
	@Watch('customRender') parseCustomRender(newVal: any | string) {
		this._customRender = _parseProp(newVal);
	}
	@State() _customRender: any;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseColumnDefs(this.columnDefs);
		this.parseRowData(this.rowData);
		this.parseLiterals(this.literals);
		this.parseCustomRender(this.customRender);
		this.parseOpen(this.isOpen);
		this._customRender?.map((render) => {
			this.setCellRender(render.columnName, render.renderFunction);
		});
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {
		document.onkeydown = (e) => {
			if (e.key === 'Esc' || e.key === 'Escape') {
				this._isOpen = false;
			}
		};

		const table = document.getElementById(this.tableId);
		new Grid(table, this._gridOptions);

		const dateColumn = this._columnDefs.findIndex((column) => column.field === 'changes');
		if (dateColumn != -1) {
			this._columnDefs[dateColumn] = {
				headerName: this._columnDefs[dateColumn].headerName,
				field: 'changes',
				lockPosition: true,
				comparator: this.dateComparatorMilis
			};
		}

		this._gridOptions.api.setColumnDefs(this._columnDefs);

		this._gridOptions.onFirstDataRendered = () => {
			this.sizeColumnsToFit();

			const optionsBtns = document.getElementsByClassName('ui-simple-table__option-btn');
			for (let index = 0; index < optionsBtns.length; index++) {
				const option = optionsBtns[index] as HTMLElement;
				option.addEventListener('click', (ev) => {
					this.showOptions(ev);
				});
			}
		};
	}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	dateComparatorDefault(date1, date2) {
		const monthToComparableNumber = (date) => {
			if (date === undefined || date === null || date.length !== 10) {
				return null;
			}

			const yearNumber = date.substring(6, 10);
			const monthNumber = date.substring(3, 5);
			const dayNumber = date.substring(0, 2);

			const result = yearNumber * 10000 + monthNumber * 100 + dayNumber;
			return result;
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

	dateComparatorMilis(date1, date2) {
		const dateToMillis = (date) => {
			if (date === undefined || date === null) {
				return null;
			}
			const dateArgs = date.match(/\d{2,4}/g);
			const year = dateArgs[2];
			const month = parseInt(dateArgs[1]) - 1;
			const day = dateArgs[0];
			const hour = dateArgs[3];
			const minutes = dateArgs[4];
			const milliseconds = new Date(year, month, day, hour, minutes).getTime();
			return milliseconds;
		};

		const date1Number = dateToMillis(date1);
		const date2Number = dateToMillis(date2);

		if (date1Number === null && date2Number === null) {
			return 0;
		} else if (date1Number === null) {
			return -1;
		} else if (date2Number === null) {
			return 1;
		}
		return date1Number - date2Number;
	}

	currencyComparator(num1, num2) {
		let charA = num1[num1.length - 3];
		let charB = num2[num2.length - 3];

		if (charA === '.' && charB === '.') {
			num1 = num1.split(',').join('');
			num2 = num2.split(',').join('');
		} else if (charA === ',' && charB === ',') {
			num1 = num1.split('.').join('').replace(',', '.');
			num2 = num2.split('.').join('').replace(',', '.');
		}

		return num1 - num2;
	}

	clickDownloadFileRow(eventId, fileId) {
		this.userAction.emit({
			type: eventId,
			payload: fileId
		});
	}

	setCellRender(columnName, renderFunction) {
		//const funct = eval(renderFunction);
		const funct = eval(renderFunction);

		const columnIndex = this._columnDefs.findIndex((column) => column.field === columnName);

		this._columnDefs[columnIndex].cellRenderer = (params) => funct(params);
	}

	showOptions(rowData) {}

	sizeColumnsToFit() {
		if (window.innerWidth > 768) {
			this._gridOptions.api.sizeColumnsToFit();
		} else {
			this._gridOptions.suppressHorizontalScroll = false;
		}
	}

	openModal(data: any) {
		this._isOpen = !this._isOpen;
		this.modalLiterals = data.detail.literals;
		this.modalData = data.detail.data;
		this.userAction.emit(data);
	}

	render() {
		return this.showSkeleton ? (
			<div role="status" aria-busy="true" aria-live="polite" class="ui-table__skeleton">
				<figure class="ui-table__skeleton-figure">
					<UITableSimpleSkeleton />
				</figure>
			</div>
		) : (
			<Host>
				<div class="ui-simple-table">
					<div id={this.tableId} class="ag-theme-material ui-simple-table__table"></div>
				</div>
				{this._isOpen ? (
					<scib-cdk-ism-modal-detail
						open={this._isOpen}
						literals={this.modalLiterals}
						data={this.modalData}
						onEventChange={(event) => (this._isOpen = event.detail)}
					></scib-cdk-ism-modal-detail>
				) : null}
			</Host>
		);
	}

	@State() modalLiterals: any;
	@State() modalData: any = [];
}
