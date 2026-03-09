import { TableCell } from '../models/advanced-data-table.model';
import { cellIconStyle, sanitizer } from './common-utils';

export const editor = (cell: TableCell) => {
	const containerElement = document.createElement('div');
	containerElement?.classList.add('editor-element');
	const textElement = document.createElement('span');
	textElement.style.setProperty('overflow', 'hidden');
	textElement.style.setProperty('text-overflow', 'ellipsis');
	const classes = ['tabulator-action-link', 'editable-cell-icon'];
	const iconElement = cellIconStyle(cell, 'edit', classes);
	const value = cell.getValue();
	textElement.innerText = sanitizer(value);
	containerElement.appendChild(textElement);
	containerElement.appendChild(iconElement);
	return containerElement;
};
