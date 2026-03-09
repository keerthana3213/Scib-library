import { get } from 'lodash';
import { TableCell } from '../models/advanced-data-table.model';
import { getCustomFormatters } from '../modules/formatters';
import { FormatModule } from 'tabulator-tables';

export const setCustomFormatters = (cell: TableCell, formatterParams, onRendered) => {
	const value = cell.getValue();
	const div = document.createElement('div');
	let formattedElement: Function;
	let formatter;
	const formatters = { ...getCustomFormatters, ...FormatModule.formatters };
	let type = '';
	const mapKey = get(formatterParams, 'formatterMapKey') ?? value;
	if (mapKey) {
		const rowData = cell.getRow().getData();
		const id = get(rowData, mapKey, value);
		type = get(formatterParams, ['values', id], '');
		formatter = formatters[type];
		if (formatter) {
			formattedElement = formatter(cell, formatterParams, onRendered);
		} else {
			div.innerHTML = value;
		}
	}

	return formattedElement || div;
};
