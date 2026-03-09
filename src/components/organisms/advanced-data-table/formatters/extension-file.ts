import { TableCell } from '../models/advanced-data-table.model';

export const extensionFile = (cell: TableCell) => {
	const value = cell.getValue();
	return `<scib-atoms-extension-icon fileextension="${value}""></scib-atoms-extension-icon>`;
};
