import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { OrganismsAdvancedDataTable } from '../component/advanced-data-table';
import { isEmpty } from 'lodash';
import { Arrow } from '../../../../components';

/**
 *
 */
export class References {
	private static _instance: References = new References();
	private static _scrollGap: number = 0;

	private _component: Map<string, OrganismsAdvancedDataTable> = new Map();
	private _containerRef: Map<string, HTMLElement> = new Map();
	private _actionMenu: Map<string, HTMLElement> = new Map();
	private _tooltipRef: Map<string, HTMLElement> = new Map();
	private _hostRef: Map<string, HTMLElement> = new Map();

	constructor() {
		if (References._instance) {
			throw new Error('Error: Instantiation failed: Use References.instance instead of new.');
		}
		References._instance = this;
	}

	/**
	 *
	 */
	static get instance(): References {
		return References._instance;
	}

	static get scrollGap(): number {
		return References._scrollGap;
	}

	static set scrollGap(newScrollGap) {
		References._scrollGap = newScrollGap;
	}

	/**
	 *
	 * @param ref
	 * @param tableId
	 */
	setComponent(tableId: string, ref: OrganismsAdvancedDataTable) {
		this._component.set(tableId, ref);
	}

	/**
	 *
	 * @param ref
	 * @param tableId
	 */
	setScrollGap(tableId: string) {
		const _hostRef = References.instance.getHostRef(tableId);
		const table: HTMLElement = _hostRef?.shadowRoot.querySelector('.tabulator-table');
		const tableCoords = table.getBoundingClientRect();
		References._scrollGap = tableCoords.x;
	}

	/**
	 *
	 * @param ref
	 * @param tableId
	 */
	setHostRef(tableId: string, ref: HTMLElement) {
		this._hostRef.set(tableId, ref);
	}

	/**
	 *
	 * @param tableId
	 */
	getComponent(tableId: string): OrganismsAdvancedDataTable {
		return this._component.get(tableId);
	}

	/**
	 *
	 * @param tableId
	 */
	getHostRef(tableId: string): HTMLElement {
		return this._hostRef.get(tableId);
	}

	/**
	 *
	 * @param tableId
	 */
	reset(tableId: string) {
		this._component.delete(tableId);
		this._hostRef.delete(tableId);
		this._containerRef.delete(tableId);
		if (this._actionMenu.has(tableId)) {
			const menuRef = this._actionMenu.get(tableId);
			menuRef?.remove();
		}
		if (this._tooltipRef.has(tableId)) {
			const tooltipRef = this._tooltipRef.get(tableId);
			tooltipRef?.remove();
		}
		this._actionMenu.delete(tableId);
		this._tooltipRef.delete(tableId);
	}

	/**
	 *
	 * @param tableId
	 */
	getContainerRef(tableId: string): HTMLElement {
		if (!this._containerRef.has(tableId) && this._hostRef.has(tableId)) {
			const hostRef = this._hostRef.get(tableId);
			const tableNode = hostRef.shadowRoot.querySelector('.table-container') as HTMLElement;
			this._containerRef.set(tableId, tableNode);
		}
		return this._containerRef.get(tableId);
	}

	/**
	 *
	 * @param tableId
	 */
	getActionMenuRef(tableId: string): any {
		if (!this._actionMenu.has(tableId)) {
			const container = this.getContainerRef(tableId);
			const _actionMenuComponent = document.createElement('scib-ui-v2-menu-panel');
			_actionMenuComponent?.classList.add('tabulator-action-menu');
			this._actionMenu.set(tableId, _actionMenuComponent);
			container.appendChild(_actionMenuComponent);
		}
		return this._actionMenu.get(tableId);
	}

	/**
	 *
	 * @param tableId
	 */
	getTooltipRef(tableId: string): any {
		if (!this._tooltipRef.has(tableId)) {
			const container = this.getContainerRef(tableId);
			const _tooltipComponent = document.createElement('div');
			_tooltipComponent?.classList.add('tabulator-tooltip__box');
			this._tooltipRef.set(tableId, _tooltipComponent);
			container.appendChild(_tooltipComponent);
		}
		return this._tooltipRef.get(tableId);
	}
}

/**
 *
 * @param cell
 * @param icon
 * @param classes
 * @param alignment
 */
export const cellIconStyle = (cell: TableCell, icon: string, classes: string[], alignment: string = 'center') => {
	const parent = cell.getElement();
	const iconElement = document.createElement('i');
	parent.style.setProperty('display', 'inline-flex');
	parent.style.setProperty('justify-content', alignment);
	parent.style.setProperty('align-items', 'center');
	parent.style.setProperty('padding', '0');
	parent.style.setProperty('overflow', 'initial');
	parent.style.setProperty('--icon-content', `var(--theme-scib-icon-${icon})`);
	iconElement?.classList.add('icon');
	classes.forEach((element) => iconElement?.classList.add(element));
	return iconElement;
};

/**
 *
 * @param cell
 * @param icon
 * @param classes
 * @param alignment
 */
export const headerIconStyle = (cell: TableCell, icon: string, classes: string[]) => {
	const parent = cell.getElement();
	const iconElement = document.createElement('i');
	parent.style.setProperty('width', '100%');
	parent.style.setProperty('--icon-content', `var(--theme-scib-icon-${icon})`);
	iconElement?.classList.add('icon');
	classes.forEach((element) => iconElement?.classList.add(element));
	return iconElement;
};

/**
 *
 */
export const cellLoading = () => {
	const loading = document.createElement('scib-atoms-loading');
	loading.setAttribute('size', 'xs');
	return loading;
};

/**
 *
 * @param tableId
 * @param name
 * @param customData
 */
export const emitCustomEvent = (tableId: string, name: TableCustomEvents, customData: any) => {
	const _table: OrganismsAdvancedDataTable = References.instance.getComponent(tableId);
	const event = _table[name];
	if (event && event.emit) {
		event.emit(customData);
	}
};

/**
 *
 * @param tableId
 * @param position
 * @param content
 */
export const showTooltip = (tableId: string, position: string, content: string, offset: number) => {
	const _offset = position === 'left' || position === 'right' ? offset : Math.abs(offset);
	const tooltip = References.instance.getTooltipRef(tableId);
	tooltip.style.setProperty('opacity', '1');
	tooltip.style.setProperty('z-index', '100');
	tooltip.style.setProperty('--offset', `${_offset}px`);
	tooltip?.classList.add(`tabulator-tooltip__box--${position}`);
	tooltip.innerHTML = content;
};

/**
 *
 * @param tableId
 * @param position
 * @param content
 */
export const hideTooltip = (tableId: string, position: string, content: string) => {
	const tooltip = References.instance.getTooltipRef(tableId);
	tooltip.style.removeProperty('opacity');
	tooltip.style.removeProperty('z-index');
	tooltip.style.removeProperty('--offset');
	tooltip?.classList.remove(`tabulator-tooltip__box--${position}`);
	tooltip.innerHTML = content;
};

/**
 *
 * @param tableId
 * @param element
 */
export const getPosition = (tableId: string, element: HTMLElement) => {
	const _hostRef = References.instance.getHostRef(tableId);
	const table: HTMLElement = _hostRef?.shadowRoot.querySelector('.tabulator-tableholder');
	const tableHeader: HTMLElement = _hostRef?.shadowRoot.querySelector('.tabulator-header');
	const tableCoords = table.getBoundingClientRect();
	const elementCoords = element.getBoundingClientRect();
	const scrollLeft = table.scrollLeft;
	// const scrollTop = table.scrollTop;
	const verticalScrollBarWidth = table.offsetWidth - table.clientWidth;
	const top = elementCoords.top - tableCoords.top - element?.offsetHeight / 2;
	const right = table.clientWidth - element.offsetLeft - element.offsetWidth + scrollLeft + verticalScrollBarWidth + 1;
	const left = element.offsetLeft - scrollLeft - verticalScrollBarWidth;
	return {
		elementCoords,
		left,
		right,
		top,
		scroll: scrollLeft,
		width: elementCoords?.width,
		height: elementCoords?.height,
		topOffset: tableHeader?.offsetHeight,
		tableCoords
	};
};

/**
 * Converts every symbol of an HTML tag to his namesake is ASCII;
 * @param value
 * @param allowHTML
 */
export const sanitizer = (value?: string, allowHTML?: boolean): any => {
	if (!value) return '';
	if (typeof value != 'string') return value;
	if (allowHTML) {
		const div = document.createElement('div');
		if (!isEmpty(value)) {
			div.insertAdjacentHTML('beforeend', value);
		}
		return div;
	}
	return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
};

/**
 *
 * @param cell
 * @param formatterParams
 * @param tooltipText
 */
export const getTooltipElement = (position: Arrow, text: string): HTMLElement => {
	let tooltip = document.createElement('scib-atoms-tooltip-info');
	tooltip?.classList.add('tooltip-header');
	tooltip.arrow = position;
	tooltip.literalsTooltip = text;
	return tooltip;
};

/**
 *
 * @param tableCoords
 * @param tooltipWidth
 * @param left
 */
export const getTooltipGap = (tableCoords, tooltipWidth, left) => {
	const tablewidth = tableCoords.width;
	const _gap = tooltipWidth + left + 24;
	return tablewidth - _gap;
};
/**
 * Tooltip for input
 */
export const showTooltipForInput = async (tooltip, tooltipText) => {
	if (!isEmpty(tooltipText)) {
		tooltip.shadowRoot.querySelector('.tooltip-info__literals').innerText = tooltipText;
	}
	const box = tooltip.shadowRoot.querySelector('.tooltip-info__box') as HTMLElement;
	box.style.visibility = 'visible';
	box.style.top = '25px';

	setTimeout(() => {
		box.style.visibility = 'hidden';
	}, 1500);
};
/**
 *
 * @param cell
 */
export const setMaxWidth = (cell: TableCell) => {
	const _cell = cell.getColumn()._getSelf();
	const { maxWidth, minWidth } = _cell;
	const _maxWidth = maxWidth || minWidth || '60';
	cell.getElement().style.maxWidth = `${_maxWidth}px`;
};

/**
 *
 * @param cell
 */
export const getTableId = (cell: TableCell): string => {
	const tableContainerRef = cell.getTable().element.parentElement as HTMLElement;
	return tableContainerRef.getAttribute('table-id');
};

export const setSubHeader = (subHeaderData, literals): HTMLDivElement | HTMLScibAtomsTooltipInfoElement => {
	const subHeader = document.createElement('div');
	const subHeaderContainer = document.createElement('div');
	subHeaderContainer?.classList.add('tabulator-header-filter-date');
	subHeader.innerHTML = subHeaderData.value;
	subHeader.style.setProperty('text-overflow', 'ellipsis');
	subHeader.style.setProperty('overflow', 'hidden');
	subHeader.style.setProperty('text-align', subHeaderData.hozAlign === 'left' ? 'left' : 'right');
	if (subHeaderData.value !== subHeaderData.searchDate) {
		subHeaderContainer?.classList.add('tabulator-header-filter-date--show-value');
		subHeader?.classList.add('tabulator-header-filter-date--show-value');
		const iconElement = document.createElement('i');
		iconElement?.classList.add('icon');
		subHeader.appendChild(iconElement);
	}
	const tooltipSubheader = document.createElement('scib-atoms-tooltip-info');
	tooltipSubheader?.classList.add('tooltip-subheader');
	if (subHeaderData.hozAlign === 'right') {
		tooltipSubheader?.classList.add('tooltip-subheader-right');
	}
	tooltipSubheader.arrow = 'bottom';
	tooltipSubheader.literalsTooltip = literals.dataDateColumns;
	tooltipSubheader.appendChild(subHeader);
	subHeaderContainer.appendChild(tooltipSubheader);
	return subHeaderContainer;
};
