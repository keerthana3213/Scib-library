import { TableCell } from '../models/optimized-data-table.model';
import { get } from 'lodash';

export const rawValue = (cell: TableCell, formatterParams) => {
	const isBold = get(formatterParams, 'isBold', false);
	return `<div class="${isBold ? 'raw-value_cell bold_cell' : 'raw-value_cell'}">${cell.getValue()}</div>`;
};
