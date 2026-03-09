import { setTooltip, getTableId, sanitizer } from './common-utils';
import { TableCell } from '../models/data-table.model';

export const tooltip = (cell: TableCell, formatterParams) => {
	const _tableId = getTableId(cell);
	setTooltip(_tableId, cell, formatterParams);
	return `<span>${sanitizer(cell.getValue())}</span>`;
};
