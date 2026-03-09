import { TableCell } from '../models/advanced-data-table.model';
import { cellIconStyle } from './common-utils';
import { get } from 'lodash';

export const textIcon = (cell: TableCell, formatterParams) => {
	const { icon = 'cancel', iconFirst = false, fontSize = 16, gap = 16 } = formatterParams;
	const value = cell.getValue();
	const rowData = cell.getRow().getData();
	const classes = ['tabulator-text-icon'];
	const iconElement = cellIconStyle(cell, icon, classes, 'flex-start');
	const isBold = get(formatterParams, 'isBold', false);
	const boldClass = isBold ? 'bold_cell' : '';
	const textIcon = get(rowData, 'textIcon', false);
	let finalElement: any = null;
	if (textIcon) {
		const divElement = document.createElement('div');
		if (boldClass !== '') {
			divElement?.classList.add(boldClass);
		}
		divElement.style.setProperty('display', 'inline-flex');
		divElement.style.setProperty('gap', `${gap}px`);
		iconElement.style.setProperty('font-size', `${fontSize}px`);
		if (iconFirst) {
			divElement?.classList.add('tabulator-text-icon--reverse');
		}
		divElement.innerHTML = value;
		divElement.appendChild(iconElement);
		finalElement = divElement;
	} else {
		finalElement = `<div class="${boldClass}"> ${value} </div>`;
	}
	return finalElement;
};
