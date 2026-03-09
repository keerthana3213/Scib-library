import { TableCell, TableCustomEvents } from '../models/data-table.model';
import { OrganismsDataTable } from '../component/data-table';
import { get, isEmpty } from 'lodash';

/**
 *
 */
export class References {
	private static _instance: References = new References();

	private _component: Map<string, OrganismsDataTable> = new Map();
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

	/**
	 *
	 * @param ref
	 * @param tableId
	 */
	setComponent(tableId: string, ref: OrganismsDataTable) {
		this._component.set(tableId, ref);
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
	getComponent(tableId: string): OrganismsDataTable {
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
	const _table: OrganismsDataTable = References.instance.getComponent(tableId);
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
 * Find the first ancestor with non-null horizontal scroll
 * @param element
 * @returns HTMLElement | null
 */
const findScrollingParent = (element: HTMLElement): HTMLElement | null => {
	while (element && element !== document.body) {
		if (element.scrollLeft > 0) {
			return element;
		}
		element = element.parentElement;
	}
	return null;
};

/**
 *
 * @param tableId
 * @param element
 */
export const getPosition = (tableId: string, element: HTMLElement) => {
	const _hostRef = References.instance.getHostRef(tableId);
	const table: HTMLElement = _hostRef?.shadowRoot.querySelector('.tabulator-table');
	const tableHeader: HTMLElement = _hostRef?.shadowRoot.querySelector('.tabulator-header');
	const tableCoords = table.getBoundingClientRect();
	const elementCoords = element.getBoundingClientRect();
	// try to get the container who has horizontal scroll
	const scrollingParent = findScrollingParent(table);
	const scrollLeft = scrollingParent?.scrollLeft ?? 0;
	const top = elementCoords.top - tableCoords.top;
	const left = elementCoords.left - tableCoords.left - scrollLeft; // we need to apply the scrollLeft to the left position
	return { left, top, width: elementCoords.width, height: elementCoords.height, topOffset: tableHeader?.offsetHeight, tableCoords };
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
export const setTooltip = (tableId: string, cell: TableCell, formatterParams, tooltipText?: string) => {
	const data = cell.getData();
	const columnData = get(data, formatterParams.columnData);
	const tooltip = References.instance.getTooltipRef(tableId);
	const position = cell.getColumn().getDefinition().hozAlign || 'center';
	cell.getElement().onmouseenter = () => {
		const { left, top, width, height, topOffset, tableCoords } = getPosition(tableId, cell.getElement());
		const textToShow = tooltipText || columnData;
		if (!!textToShow) {
			let offsetRight = 0;
			const content = document.createElement('span');
			content?.classList.add('tabulator-tooltip__text');
			if (!isEmpty(get(formatterParams, 'text'))) {
				content?.classList.add('tabulator-tooltip__text--prefix');
				content.innerHTML = formatterParams.text;
			}
			content.appendChild(sanitizer(textToShow, true));
			const nodeStr = content.outerHTML as string;
			tooltip.innerHTML = nodeStr;
			const tooltipCoords = tooltip.getBoundingClientRect();
			const tooltipWidth = tooltipCoords.width;
			if (position === 'left') {
				const _gap = getTooltipGap(tableCoords, tooltipWidth, left);
				offsetRight = _gap < 0 ? _gap : 0;
				tooltip.style.setProperty('left', `${left + offsetRight}px`);
			} else if (position === 'right') {
				// TODO: review offset
				tooltip.style.setProperty('left', `${left + (width - tooltipWidth) + offsetRight}px`);
			} else {
				const _gap = getTooltipGap(tableCoords, tooltipWidth, left);
				offsetRight = _gap < 0 ? _gap / 2 + width / 2 - 24 : 0;
				tooltip.style.setProperty('left', `${left + (width / 2 - tooltipWidth / 2) + offsetRight}px`);
			}
			tooltip.style.setProperty('top', `${top + height + topOffset}px`);
			showTooltip(tableId, position, nodeStr, offsetRight);
			tooltip.onmouseenter = () => showTooltip(tableId, position, nodeStr, offsetRight);
			tooltip.onmouseleave = () => hideTooltip(tableId, position, '');
		}
	};
	cell.getElement().onmouseleave = () => hideTooltip(tableId, position, '');
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
