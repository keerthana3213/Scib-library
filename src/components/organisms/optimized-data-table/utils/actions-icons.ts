import { compact, get, includes, isNil, omit, omitBy } from 'lodash';
import { cellLoading, elementIconStyle, emitCustomEvent, getPosition, getTableId, References } from '../formatters/common-utils';
import { CustomActionConfig, TableCell, TableCustomEvents, WIDTH_DEFAULT_ICONS_ACTION } from '../models/optimized-data-table.model';

export const actionMenu = (cell: TableCell, formatterParams) => {
	const _tableId = getTableId(cell);
	const _componentRef = References.instance.getComponent(_tableId);
	const { icon = '3-dots-horizontal', items = [] } = formatterParams;
	const rowId = cell.getRow().getData().rowId;
	const rowIds = (_componentRef?.$loadingIds || []).map((element) => element.rowId);
	const rowData = cell.getRow().getData();
	const classes = ['tabulator-action-link'];
	const menuRowConfig = get(rowData, ['actionMenuRowConfig'], {});
	const { disabled = false, disabledItemIds = [] } = menuRowConfig;
	const iconElement = elementIconStyle(icon, classes);
	if (disabled) {
		return '';
	}
	if (includes(rowIds, rowId)) {
		const element = document.createElement('div');
		element.style.setProperty('display', 'flex');
		element.style.setProperty('width', `${WIDTH_DEFAULT_ICONS_ACTION}px`);
		element.style.setProperty('min-width', `${WIDTH_DEFAULT_ICONS_ACTION}px`);
		element.style.setProperty('justify-content', 'center');
		element.style.setProperty('align-items', 'center');
		element.style.setProperty('padding', '0');
		element.style.setProperty('overflow', 'initial');
		element.appendChild(cellLoading());
		return element;
	}
	iconElement.onclick = () => {
		const { top, height, topOffset } = getPosition(_tableId, cell.getElement());
		const topGap = 8;
		const field = cell.getColumn().getField();
		const rowId = get(cell.getRow().getData(), ['rowId']);
		const data = omit(omitBy(cell.getRow().getData(), isNil), 'rowId');
		const itemList = items.map((item) => {
			const { id = null, label, icon, action } = item;
			const disableItem = disabledItemIds.includes(id);
			return disableItem
				? null
				: {
						label: get(_componentRef.literals, label, label),
						icon,
						data: {
							field,
							action,
							rowId,
							row: data
						}
				  };
		});
		const menu = References.instance.getActionMenuRef(_tableId);
		const tablescroll: HTMLElement = References.instance.getHostRef(_tableId).shadowRoot.querySelector('.tabulator-tableholder');
		menu.setAttribute('item-list', JSON.stringify(compact(itemList)));
		const widthScroll = tablescroll ? tablescroll.offsetWidth - tablescroll.clientWidth : 0;
		menu.style.setProperty('right', `${widthScroll}px`);
		menu.style.setProperty('top', `${top + height + (topOffset - topGap)}px`);
		menu.openMenu();
	};
	return iconElement;
};

export const customActionSimple = (cell: TableCell, formatterParams: CustomActionConfig) => {
	const _tableId = getTableId(cell);
	const { icon, action } = formatterParams;
	const classes = ['tabulator-action-link'];
	let iconElement;
	iconElement = elementIconStyle(icon, classes);
	if (formatterParams.customActionDisabledFn && formatterParams.customActionDisabledFn(cell.getRow().getData())) {
		iconElement.style.setProperty('cursor', 'not-allowed');
		iconElement.style.setProperty('opacity', '0.3');
		iconElement.style.setProperty('pointer-events', 'none');
	} else {
		iconElement.onclick = () => {
			const field = cell.getColumn().getField();
			const data = omitBy(cell.getRow().getData(), isNil);
			const rowPosition = cell.getRow().getPosition();
			const row = cell.getRow().getElement();
			const rowElement = formatterParams.getRowElementDetail ? row : null;
			emitCustomEvent(_tableId, TableCustomEvents.CUSTOM_ACTION, { field, data, rowPosition, action, rowElement });
		};
	}
	return iconElement;
};

export const moveDown = (cell: TableCell) => {
	const _tableId = getTableId(cell);
	const classes = ['tabulator-action-link'];
	const iconElement = elementIconStyle('chevron-down', classes);
	const cellPosition = cell.getRow().getPosition();
	if (cellPosition === cell.getTable().getDataCount()) {
		iconElement.style.opacity = 'var(--color-icon-disabled)';
		iconElement.style.cursor = 'not-allowed';
	}
	iconElement.onclick = () => {
		const field = cell.getColumn().getField();
		const data = omitBy(cell.getRow().getData(), isNil);
		const oldRowPosition = cell.getRow().getPosition();
		const newRowPosition = oldRowPosition + 1;
		emitCustomEvent(_tableId, TableCustomEvents.MOVE_ROW_DOWN, { field, data, oldRowPosition, newRowPosition });
	};
	return iconElement;
};

export const moveUp = (cell: TableCell) => {
	const _tableId = getTableId(cell);
	const classes = ['tabulator-action-link'];
	const iconElement = elementIconStyle('chevron-up', classes);
	const cellPosition = cell.getRow().getPosition();
	if (cellPosition === 1) {
		iconElement.style.opacity = 'var(--color-icon-disabled)';
		iconElement.style.cursor = 'not-allowed';
	}
	iconElement.onclick = () => {
		const data = omitBy(cell.getRow().getData(), isNil);
		const field = cell.getColumn().getField();
		const oldRowPosition = cell.getRow().getPosition();
		const newRowPosition = oldRowPosition - 1;
		emitCustomEvent(_tableId, TableCustomEvents.MOVE_ROW_UP, { field, data, oldRowPosition, newRowPosition });
	};
	return iconElement;
};

export const showDetail = (cell: TableCell, formatterParams?: { showIconFn: Function } | boolean) => {
	if (
		formatterParams === true ||
		formatterParams === null ||
		formatterParams === undefined ||
		((formatterParams as { showIconFn: Function })?.showIconFn &&
			(formatterParams as { showIconFn: Function }).showIconFn(cell.getRow().getData()))
	) {
		const _tableId = getTableId(cell);
		const classes = ['tabulator-action-link'];
		const iconElement = elementIconStyle('chevron-down', classes);
		const parent = cell.getElement();
		const rowData = cell.getRow().getData();
		parent.setAttribute('aria-expanded', 'false');
		const hideActionDetail = get(rowData, ['actionShowDetailConfig', 'hide'], false);
		const row = cell.getRow().getElement();
		if (hideActionDetail) {
			return document.createElement('span');
		}
		iconElement.onclick = () => {
			const element = row.querySelector('.detail-view');
			if (element?.classList.contains('open') || parent?.classList.contains('open') || parent.getAttribute('aria-expanded') === 'true') {
				parent.setAttribute('aria-expanded', 'false');
				element?.classList.remove('open');
				parent?.classList.remove('open');

				parent.style.setProperty('--icon-content', `var(--theme-scib-icon-chevron-down)`);
				iconElement.style.setProperty('--icon-content', `var(--theme-scib-icon-chevron-down)`);

				if (element) element.innerHTML = '';
			} else {
				element?.classList.add('open');
				parent?.classList.add('open');

				parent.setAttribute('aria-expanded', 'true');

				const field = cell.getColumn().getField();
				const data = omitBy(cell.getRow().getData(), isNil);
				parent.style.setProperty('--icon-content', `var(--theme-scib-icon-chevron-up)`);
				iconElement.style.setProperty('--icon-content', `var(--theme-scib-icon-chevron-up)`);

				emitCustomEvent(_tableId, TableCustomEvents.CELL_SHOW_DETAIL, { field, data, element });
			}
		};
		return iconElement;
	} else {
		return document.createElement('span');
	}
};

export const showInfo = (cell: TableCell, formatterParams) => {
	const _tableId = getTableId(cell);
	const { icon = 'arrow-right' } = formatterParams;
	const rowData = cell.getRow().getData();
	const classes = ['tabulator-action-link'];
	const showInfoConfig = get(rowData, ['actionShowInfoConfig'], {});
	const { disabled = false } = showInfoConfig;
	const cellIcon = get(showInfoConfig, 'icon') || icon;
	const iconElement = elementIconStyle(cellIcon, classes);
	if (disabled) {
		return '';
	}
	iconElement.onclick = () => {
		const row = cell.getRow().getElement();
		const element = row.querySelector('.info-view');
		const field = cell.getColumn().getField();
		const data = omitBy(cell.getRow().getData(), isNil);
		emitCustomEvent(_tableId, TableCustomEvents.CELL_SHOW_INFO, { field, data, element });
	};
	return iconElement;
};
