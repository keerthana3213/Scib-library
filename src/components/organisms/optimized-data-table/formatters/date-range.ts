import { DateTime } from 'luxon';
import { TableCell } from '../models/optimized-data-table.model';
export const dateRange = (cell: TableCell, formatterParams) => {
	let cellValue = cell.getValue().split('|');
	let rangeDate;
	if (
		DateTime.fromISO(cellValue[0]).toFormat(cell.getColumn().getDefinition().formatterParams.outputFormat) != 'Invalid DateTime' &&
		DateTime.fromISO(cellValue[1]).toFormat(cell.getColumn().getDefinition().formatterParams.outputFormat) != 'Invalid DateTime'
	) {
		rangeDate = `
			${DateTime.fromISO(cellValue[0]).toFormat(cell.getColumn().getDefinition().formatterParams.outputFormat)}
			${formatterParams.outputDivider}
		${DateTime.fromISO(cellValue[1]).toFormat(cell.getColumn().getDefinition().formatterParams.outputFormat)}`;
	} else {
		rangeDate = document.createElement('div');
	}

	return rangeDate;
};
