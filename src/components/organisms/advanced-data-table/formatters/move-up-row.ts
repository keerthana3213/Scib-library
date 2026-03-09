import { cellIconStyle, emitCustomEvent, setMaxWidth, getTableId } from './common-utils';
import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { isNil, omitBy } from 'lodash';

export const moveUp = (cell: TableCell) => {
	setMaxWidth(cell);
	const _tableId = getTableId(cell);
	const classes = ['tabulator-action-link'];
	const iconElement = cellIconStyle(cell, 'chevron-up', classes);
	const cellPosition = cell.getRow().getPosition();
	if (cellPosition === 1) {
		iconElement.style.color = 'var(--color-icon-disabled)';
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
