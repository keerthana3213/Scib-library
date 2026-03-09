import { TableCell } from '../models/data-table.model';
import { get } from 'lodash';
import { tooltip } from './tooltip';

export const status = (cell: TableCell, formatterParams) => {
	const parent = cell.getElement();
	const value = cell.getValue();
	let color = get(formatterParams, value, 'transparent');
	const mapKey = get(formatterParams, 'mapKey');
	const isBold = get(formatterParams, 'isBold', false);
	if (mapKey) {
		const rowData = cell.getRow().getData();
		const id = get(rowData, mapKey, value);
		color = get(formatterParams, ['values', id], 'transparent');
	}
	parent.style.setProperty('--border-color', color);
	const classes = isBold ? 'status_cell bold_cell' : 'status_cell';

	return `<div class="${classes}"> ${value} ${formatterParams.hasTooltip ? tooltip(cell, formatterParams) : ''}</div>`;
};
