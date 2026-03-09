import { TableCell } from '../models/optimized-data-table.model';
import { wrapBoxEllipsis } from './common-utils';

export const defaultCells = (cell: TableCell) => {
	let transformedValue = cell?.getValue()?.toString();
	return wrapBoxEllipsis(transformedValue);
};
