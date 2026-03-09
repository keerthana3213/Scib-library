import { getTableId, sanitizer, setTooltip } from './common-utils';
import { TableCell } from '../models/optimized-data-table.model';

export const tooltip = (cell: TableCell, formatterParams) => {
	const tableId = getTableId(cell);

	setTooltip({ tableId, cell, formatterParams });
	return `<span>${sanitizer(cell.getValue())}</span>`;
};
