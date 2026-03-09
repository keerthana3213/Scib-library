import { cellIconStyle, emitCustomEvent, setMaxWidth, getTableId } from './common-utils';
import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { isNil, omitBy } from 'lodash';

export const moveDown = (cell: TableCell) => {
	setMaxWidth(cell);
	const _tableId = getTableId(cell);
	const classes = ['tabulator-action-link'];
	const iconElement = cellIconStyle(cell, 'chevron-down', classes);
	const cellPosition = cell.getRow().getPosition();
	if (cellPosition === cell.getTable().getDataCount()) {
		iconElement.style.color = 'var(--color-icon-disabled)';
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
