import { cellIconStyle, emitCustomEvent, setMaxWidth, getTableId } from './common-utils';
import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { isNil, omitBy } from 'lodash';

export const deleteRow = (cell: TableCell) => {
	setMaxWidth(cell);
	const _tableId = getTableId(cell);
	const classes = ['tabulator-action-link'];
	const iconElement = cellIconStyle(cell, 'trash-bin', classes);
	iconElement.onclick = () => {
		const field = cell.getColumn().getField();
		const data = omitBy(cell.getRow().getData(), isNil);
		const rowPosition = cell.getRow().getPosition();
		emitCustomEvent(_tableId, TableCustomEvents.REMOVE_ROW, { field, data, rowPosition });
	};
	return iconElement;
};
