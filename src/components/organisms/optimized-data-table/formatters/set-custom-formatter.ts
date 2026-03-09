import { get, isNull, isUndefined } from 'lodash';
import { Formatter, TableCell } from '../models/optimized-data-table.model';
import { getCustomFormatters } from '../modules/formatters';
import { FormatModule } from 'tabulator-tables';
import { wrapBoxEllipsis } from './common-utils';

export const setCustomFormatters = (cell: TableCell, formatterParams, onRendered) => {
	const value = cell.getValue();
	const div = document.createElement('div');
	let formattedElement: string | HTMLElement;
	let formatter: Formatter;
	const formatters: { [key: string]: Formatter } = { ...getCustomFormatters, ...FormatModule.formatters };
	const mapKey = get(formatterParams, 'formatterMapKey') ?? value;
	if (mapKey) {
		formatter = formatters[mapKey];
		if (formatter && !isNull(value) && !isUndefined(value) && value !== '') {
			formattedElement = formatter(cell, formatterParams, onRendered);
		} else {
			div.innerHTML = value ?? '';
		}
	}

	return formatterParams?.wrapEllipsis ? wrapBoxEllipsis(formattedElement ?? div) : formattedElement ?? div;
};
