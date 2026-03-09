import { cellIconStyle, emitCustomEvent, setMaxWidth, getTableId } from './common-utils';
import { TableCell, TableCustomEvents } from '../models/data-table.model';
import { isNil, omitBy } from 'lodash';

export const showDetail = (cell: TableCell) => {
	setMaxWidth(cell);
	const _tableId = getTableId(cell);
	const classes = ['tabulator-action-link'];
	const iconElement = cellIconStyle(cell, 'chevron-down', classes);
	iconElement.onclick = () => {
		const row = cell.getRow().getElement();
		const parent = cell.getElement();
		const element = row.querySelector('.detail-view');
		if (element?.classList.contains('open')) {
			element?.classList.remove('open');
			parent.style.setProperty('--icon-content', `var(--theme-scib-icon-chevron-down)`);
			element.innerHTML = '';
		} else {
			element?.classList.add('open');
			const field = cell.getColumn().getField();
			const data = omitBy(cell.getRow().getData(), isNil);
			parent.style.setProperty('--icon-content', `var(--theme-scib-icon-chevron-up)`);
			emitCustomEvent(_tableId, TableCustomEvents.CELL_SHOW_DETAIL, { field, data, element });
		}
	};
	return iconElement;
};
