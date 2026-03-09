import { TableCell } from '../models/data-table.model';
import { get } from 'lodash';

export const statusDot = (cell: TableCell, formatterParams) => {
	const value = cell.getValue();
	let color = get(formatterParams, value, 'transparent');
	const mapKey = get(formatterParams, 'mapKey');
	const isBold = get(formatterParams, 'isBold', false);
	if (mapKey) {
		const rowData = cell.getRow().getData();
		const id = get(rowData, mapKey, value);
		color = get(formatterParams, ['values', id], 'transparent');
	}
	const classes = isBold ? 'status_cell bold_cell' : 'status_cell';

	return `<div class="${classes}">
				<div class="statusdot_cell" style="background:${color};"></div> 
				${value} 
			</div>`;
};
