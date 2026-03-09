import { cellIconStyle, emitCustomEvent, setMaxWidth, getTableId } from './common-utils';
import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { get, isNil, omitBy } from 'lodash';

export const showDetail = (cell: TableCell) => {
	setMaxWidth(cell);
	const tableId = getTableId(cell);
	const classes = ['tabulator-action-link'];
	const rowData = cell.getRow().getData();
	const hideActionDetail = get(rowData, ['actionShowDetailConfig', 'hide'], false);
	if (hideActionDetail) {
		return;
	}
	const iconElement = cellIconStyle(cell, 'chevron-down', classes);
	iconElement.onclick = () => toggleDetail(cell, tableId);
	return iconElement;
};

function toggleDetail(cell: TableCell, tableId: string) {
	const row = cell.getRow().getElement();
	const parent = cell.getElement();
	const detailElement = row.querySelector('.detail-view');

	if (detailElement?.classList.contains('open')) {
		closeDetail(detailElement, parent);
	} else {
		openDetail(cell, detailElement, parent, tableId);
	}
}

function closeDetail(detailElement: Element, parent: HTMLElement) {
	detailElement.classList.remove('open');
	parent.style.setProperty('--icon-content', 'var(--theme-scib-icon-chevron-down)');
	detailElement.innerHTML = '';
}

function openDetail(cell: TableCell, detailElement: Element, parent: HTMLElement, tableId: string) {
	detailElement.classList.add('open');
	const field = cell.getColumn().getField();
	const data = omitBy(cell.getRow().getData(), isNil);
	parent.style.setProperty('--icon-content', 'var(--theme-scib-icon-chevron-top)');
	emitCustomEvent(tableId, TableCustomEvents.CELL_SHOW_DETAIL, { field, data, element: detailElement });
}
