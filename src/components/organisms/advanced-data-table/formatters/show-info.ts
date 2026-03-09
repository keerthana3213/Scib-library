import { cellIconStyle, emitCustomEvent, setMaxWidth, getTableId } from './common-utils';
import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { get, isNil, omitBy } from 'lodash';
export const showInfo = (cell: TableCell, formatterParams) => {
	setMaxWidth(cell);
	const _tableId = getTableId(cell);
	const { icon = 'arrow-right' } = formatterParams;
	const rowData = cell.getRow().getData();
	const classes = ['tabulator-action-link'];
	const showInfoConfig = get(rowData, ['actionShowInfoConfig'], {});
	const { disabled = false } = showInfoConfig;
	const cellIcon = get(showInfoConfig, 'icon') || icon;
	const iconElement = cellIconStyle(cell, cellIcon, classes);
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
