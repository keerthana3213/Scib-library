import { TableCell } from '../models/advanced-data-table.model';
import { get } from 'lodash';

export const status = (cell: TableCell, formatterParams) => {
	const parent: HTMLElement = cell.getElement();
	const value = cell.getValue();
	let color = get(formatterParams, value, 'transparent');
	const mapKey = get(formatterParams, 'mapKey');
	const isBold = get(formatterParams, 'isBold', false);
	if (mapKey) {
		const rowData = cell.getRow().getData();
		const id = get(rowData, mapKey, value);
		color = get(formatterParams, ['values', id], 'transparent');
	}
	let newDiv = document.createElement('div');
	newDiv.innerText = value;
	parent.style.setProperty('padding', '0', 'important');
	const classes = isBold ? 'status_cell bold_cell' : 'status_cell';
	newDiv.setAttribute('class', classes);
	newDiv.style.setProperty('padding', '2px 8px', 'important');
	newDiv.style.setProperty('background-color', color + '10');
	newDiv.style.setProperty('--border-color', color);
	newDiv.style.setProperty('width', '100%');
	newDiv.style.setProperty('height', '100%');
	return newDiv;
};
