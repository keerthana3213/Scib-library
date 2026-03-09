import { TableCell } from '../models/data-table.model';

export const extensionFile = (cell: TableCell) => {
	const value = cell.getValue();
	return `<scib-atoms-extension-icon fileextension="${value}""></scib-atoms-extension-icon>`;
};
