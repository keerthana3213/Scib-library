import { TableCell } from '../models/advanced-data-table.model';
import { cellIconStyle } from '../formatters/common-utils';

export const actionMenuHeader = () => (cell: TableCell) => {
	const classes = ['tabulator-action-link'];
	const iconElement = cellIconStyle(cell, '3-dots-horizontal', classes);
	iconElement.onclick = () => {};
	return iconElement;
};
