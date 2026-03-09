import { cellIconStyle, cellLoading, getPosition, References, setMaxWidth, getTableId } from './common-utils';
import { compact, get, includes, isNil, omit, omitBy } from 'lodash';
import { TableCell } from '../models/data-table.model';

export const actionMenu = (cell: TableCell, formatterParams) => {
	setMaxWidth(cell);
	const _tableId = getTableId(cell);
	const _componentRef = References.instance.getComponent(_tableId);
	const { icon = 'options', items = [] } = formatterParams;
	const rowId = cell.getRow().getData().rowId;
	const rowIds = (_componentRef?.$loadingIds || []).map(element => element.rowId);
	const rowData = cell.getRow().getData();
	const classes = ['tabulator-action-link'];
	const menuRowConfig = get(rowData, ['actionMenuRowConfig'], {});
	const { disabled = false, disabledItemIds = [] } = menuRowConfig;
	const iconElement = cellIconStyle(cell, icon, classes);
	if (disabled) {
		return '';
	}
	if (includes(rowIds, rowId)) {
		const loading = cellLoading();
		return loading;
	}
	iconElement.onclick = () => {
		const { left, top, width, height, topOffset } = getPosition(_tableId, cell.getElement());
		const topGap = 8;
		const field = cell.getColumn().getField();
		const rowId = get(cell.getRow().getData(), ['rowId']);
		const data = omit(omitBy(cell.getRow().getData(), isNil), 'rowId');
		const itemList = items.map(item => {
			const { id = null, label, icon, action } = item;
			const disableItem = disabledItemIds.includes(id);
			return disableItem
				? null
				: {
						label,
						icon,
						data: {
							field,
							action,
							rowId,
							row: data,
						},
				  };
		});
		const menu = References.instance.getActionMenuRef(_tableId);
		menu.setAttribute('item-list', JSON.stringify(compact(itemList)));
		menu.style.setProperty('left', `${left + width}px`);
		menu.style.setProperty('top', `${top + height + (topOffset - topGap)}px`);
		menu.openMenu();
	};
	return iconElement;
};
