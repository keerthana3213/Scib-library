import { TableCell } from '../models/optimized-data-table.model';
import { cellIconStyleOnLayoutTabulator } from '../formatters/common-utils';

export const actionMenuHeader = () => (cell: TableCell) => {
	const classes = ['tabulator-action-link'];
	const iconElement = cellIconStyleOnLayoutTabulator(cell, '3-dots-horizontal', classes);
	iconElement.onclick = () => {};
	return iconElement;
};
