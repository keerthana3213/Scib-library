import {
	ActionTableConfig,
	ACTION_TABLE_NAME_ACTION_MENU,
	ACTION_TABLE_NAME_CUSTOM_ACTION,
	ACTION_TABLE_NAME_MOVE_ROW,
	ACTION_TABLE_NAME_SHOW_DETAIL,
	ACTION_TABLE_NAME_SHOW_INFO,
	LIST_ORDER_ACTION,
	TableCell,
	TableCustomEvents,
	WIDTH_DEFAULT_ICONS_ACTION,
	TooltipConfig
} from '../models/optimized-data-table.model';
import { OrganismsOptimizedDataTable } from '../component/optimized-data-table';
import { get, isEmpty, isNil } from 'lodash';
import { Arrow } from '../../../../components';

/**
 *
 */
export class References {
	private static _instance: References = new References();
	private static _scrollGap: number = 0;

	private _component: Map<string, OrganismsOptimizedDataTable> = new Map();
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
	setComponent(tableId: string, ref: OrganismsOptimizedDataTable) {
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
	getComponent(tableId: string): OrganismsOptimizedDataTable {
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
	calcFormatter(literals, cell: TableCell) {
		return !!cell.getValue() ? this.tooltipTotals(literals, cell) : '';
	}

	formatNumber(number: number): string {
		const parts = number.toString().split('.');
		const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		const decimalPart = parts[1];
		return `${integerPart}.${decimalPart || '00'}`;
	}

	tooltipTotals(literals, cell: TableCell) {
		const textContainer = document.createElement('div');
		textContainer.innerText = this.formatNumber(cell.getValue());
		textContainer?.classList.add('tooltip-text');
		const tooltipTotals = document.createElement('scib-atoms-tooltip-info');
		tooltipTotals.arrow = 'bottom';
		const hozAlign = cell.getColumn()._column?.hozAlign;
		tooltipTotals?.classList.add('tooltip-total');
		if (hozAlign === 'left') {
			tooltipTotals?.classList.add('tooltip-total__aling_left');
		}
		// tooltipTotals.disableReposition = true;
		tooltipTotals.literalsTooltip = literals.columnSum;
		tooltipTotals.appendChild(textContainer);
		return tooltipTotals;
	}
}

export const wrapBoxEllipsis = (content: string | number | Node) => {
	if (!isNil(content)) {
		const textContainer = document.createElement('div');
		textContainer.classList.add('ellipsis-box');
		if (typeof content === 'string' || typeof content === 'number') {
			textContainer.innerText = content + '';
		} else if (content instanceof Node) {
			textContainer.appendChild(content);
		}
		return textContainer;
	} else {
		return null;
	}
};

export const cellIconStyleOnLayoutTabulator = (cell: TableCell, icon: string, classes: string[], alignment: string = 'center') => {
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
export const elementIconStyle = (icon: string, classes: string[], alignment: string = 'center') => {
	const iconElement = document.createElement('i');
	const element = document.createElement('div');
	element.style.setProperty('display', 'flex');
	element.style.setProperty('width', `${WIDTH_DEFAULT_ICONS_ACTION}px`);
	element.style.setProperty('min-width', `${WIDTH_DEFAULT_ICONS_ACTION}px`);
	element.style.setProperty('justify-content', alignment);
	element.style.setProperty('align-items', 'center');
	element.style.setProperty('padding', '0');
	element.style.setProperty('overflow', 'initial');
	element.style.setProperty('--icon-content', `var(--theme-scib-icon-${icon})`);
	iconElement?.classList.add('icon');
	classes.forEach((element) => iconElement?.classList.add(element));
	element.appendChild(iconElement);
	return element;
};

export const cellEmptyAction = () => {
	const element = document.createElement('div');
	element.style.setProperty('width', `${WIDTH_DEFAULT_ICONS_ACTION}px`);
	element.style.setProperty('min-width', `${WIDTH_DEFAULT_ICONS_ACTION}px`);
	element.style.setProperty('padding', '0');
	return element;
};

export const calculateMinWidthAction = (params: ActionTableConfig) => {
	const { customActions } = params;

	const listOrderedActionToShow = Object.keys(params)
		?.filter((actionName) => LIST_ORDER_ACTION.includes(actionName))
		.sort((action1, action2) => LIST_ORDER_ACTION.indexOf(action1) - LIST_ORDER_ACTION.indexOf(action2));

	let minWidth = listOrderedActionToShow.includes(ACTION_TABLE_NAME_SHOW_DETAIL) ? WIDTH_DEFAULT_ICONS_ACTION : 0;
	minWidth += listOrderedActionToShow.includes(ACTION_TABLE_NAME_MOVE_ROW) ? WIDTH_DEFAULT_ICONS_ACTION * 2 : 0;
	minWidth += listOrderedActionToShow.includes(ACTION_TABLE_NAME_SHOW_INFO) ? WIDTH_DEFAULT_ICONS_ACTION : 0;
	minWidth += listOrderedActionToShow.includes(ACTION_TABLE_NAME_ACTION_MENU) ? WIDTH_DEFAULT_ICONS_ACTION : 0;
	minWidth +=
		listOrderedActionToShow.includes(ACTION_TABLE_NAME_CUSTOM_ACTION) && customActions.length > 0
			? customActions.length * WIDTH_DEFAULT_ICONS_ACTION
			: 0;
	return minWidth;
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
export const emitCustomEvent = (tableId: string, name: TableCustomEvents | string, customData: any) => {
	const _table: OrganismsOptimizedDataTable = References.instance.getComponent(tableId);
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
	const top = elementCoords.top - tableCoords.top - element?.offsetHeight / 3.5;
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
	const visibleTableWidth = tableCoords.width;
	const rightEdgePosition = left + tooltipWidth + 24;
	return visibleTableWidth - rightEdgePosition;
};
/**
 * Tooltip for input
 */
export const showTooltipForInput = async (tooltip, tooltipText) => {
	const box = tooltip.shadowRoot.querySelector('.tooltip-info__box') as HTMLElement;
	const tooltipCompoenentLiteral = tooltip.shadowRoot.querySelector('.tooltip-info__literals');
	if (!isEmpty(tooltipText) && tooltipCompoenentLiteral && box) {
		tooltipCompoenentLiteral.innerText = tooltipText;
		box.style.visibility = 'visible';
		box.style.top = '25px';

		setTimeout(() => {
			box.style.visibility = 'hidden';
		}, 1500);
	}
};
/**
 *
 * @param cell
 */
export const setMaxWidth = (cell: TableCell) => {
	const _cell = cell.getColumn()._getSelf();
	const { maxWidth, minWidth } = _cell;
	const _maxWidth = maxWidth || minWidth || `${WIDTH_DEFAULT_ICONS_ACTION}`;
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

const calculateTooltipPosition = (
	position: string,
	tooltipWidth: number,
	left: number,
	width: number,
	tableCoords: DOMRect,
	scrollLeft: number = 0
): { left: number; offsetRight: number } => {
	let offsetRight = 0;
	let leftPosition = left;

	const gap = getTooltipGap(tableCoords, tooltipWidth, leftPosition);

	switch (position) {
		case 'left':
			offsetRight = gap < 0 ? gap : 0;
			leftPosition = leftPosition + offsetRight;
			break;
		case 'right':
			leftPosition = leftPosition + (width - tooltipWidth) + offsetRight;
			break;
		default: // center
			offsetRight = gap < 0 ? gap / 2 + width / 2 - 24 : 0;
			leftPosition = leftPosition + (width / 2 - tooltipWidth / 2) + offsetRight;
	}

	return { left: leftPosition, offsetRight };
};

const createTooltipContent = (formatterParams: any, textToShow: string): string => {
	const content = document.createElement('span');
	content?.classList.add('tabulator-tooltip__text');

	if (!isEmpty(get(formatterParams, 'text'))) {
		content?.classList.add('tabulator-tooltip__text--prefix');
		content.innerHTML = formatterParams.text;
	}

	content.appendChild(sanitizer(textToShow, true));
	return content.outerHTML;
};

/**
 * Calculates the horizontal position of the tooltip considering scroll and alignment
 */
const calculateTooltipHorizontalPosition = (
	isHeader: boolean,
	position: string,
	element: HTMLElement,
	left: number,
	width: number,
	tooltipWidth: number,
	tableCoords: DOMRect,
	scroll: number
): { left: number; offsetRight: number } => {
	// For headers with scroll, use absolute position
	let tooltipLeft = left;
	if (isHeader && scroll > 0) {
		tooltipLeft = element.getBoundingClientRect().left - tableCoords.left;
	}

	// Calculate available space
	const visibleTableWidth = tableCoords.width;
	const rightEdgePosition = tooltipLeft + tooltipWidth + 24; // 24px margin
	const gap = visibleTableWidth - rightEdgePosition;
	let offsetRight = 0;

	// Adjust according to alignment
	switch (position) {
		case 'left':
			offsetRight = gap < 0 ? gap : 0;
			tooltipLeft += offsetRight;
			break;
		case 'right':
			tooltipLeft += width - tooltipWidth + offsetRight;
			break;
		default: // center
			offsetRight = gap < 0 ? gap / 2 + width / 2 - 24 : 0;
			tooltipLeft += width / 2 - tooltipWidth / 2 + offsetRight;
	}

	return { left: tooltipLeft, offsetRight };
};

/**
 * Handles mouse leave event for tooltips.
 */
export const handleMouseLeave = (tableId: string, cell: TableCell) => {
	const position = cell.getColumn().getDefinition().hozAlign || 'center';
	hideTooltip(tableId, position, '');
};

/**
 * Sets tooltip for a cell or header.
 */
export const setTooltip = ({ tableId, cell, formatterParams, tooltipText, isHeader = false }: TooltipConfig) => {
	cell.getElement().onmouseenter = () => handleMouseEnter(tableId, cell, formatterParams, tooltipText, isHeader);
	cell.getElement().onmouseleave = () => handleMouseLeave(tableId, cell);
};

export const setTooltipHeader = (tableId: string, cell: TableCell, formatterParams: any, tooltipText?: string) => {
	setTooltip({ tableId, cell, formatterParams, tooltipText, isHeader: true });
};

/**
 * Handles mouseenter event for tooltips
 */
export const handleMouseEnter = (tableId: string, cell: TableCell, formatterParams: any, tooltipText: string | undefined, isHeader: boolean) => {
	// 1. Get the necessary data and references
	const tooltip = References.instance.getTooltipRef(tableId);
	const element = isHeader ? cell.getColumn()._column.element : cell.getElement();
	const position = cell.getColumn().getDefinition().hozAlign || 'center';

	// 2. Get text to display
	const data = cell.getData();
	const columnData = get(data, formatterParams.columnData);
	const textToShow = tooltipText || columnData;
	if (!textToShow) return;

	// 3. Get positioning
	const { left, top, width, height, topOffset, tableCoords, scroll } = getPosition(tableId, element);

	// 4. Create tooltip content
	const nodeStr = createTooltipContent(formatterParams, textToShow);
	tooltip.innerHTML = nodeStr;

	// 5. Calculate horizontal position considering scroll for headers
	const tooltipCoords = tooltip.getBoundingClientRect();
	const tooltipPosition = calculateTooltipHorizontalPosition(isHeader, position, element, left, width, tooltipCoords.width, tableCoords, scroll);

	// 6. Apply styles to tooltip
	tooltip.style.setProperty('left', `${tooltipPosition.left}px`);
	tooltip.style.setProperty('top', `${top + height + topOffset}px`);

	// 7. Show tooltip and set events
	showTooltip(tableId, position, nodeStr, tooltipPosition.offsetRight);
	tooltip.onmouseenter = () => showTooltip(tableId, position, nodeStr, tooltipPosition.offsetRight);
	tooltip.onmouseleave = () => hideTooltip(tableId, position, '');
};
