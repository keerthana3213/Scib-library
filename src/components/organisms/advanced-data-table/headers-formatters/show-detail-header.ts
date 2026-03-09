import { cellIconStyle } from '../formatters/common-utils';

export const showDetailHeader = () => (cell: any) => {
	const classes = ['tabulator-action-link'];
	const iconElement = cellIconStyle(cell, 'refresh-reload-screen', classes);
	iconElement.onclick = () => {
		// emitCustomEvent(_tableId, TableCustomEvents.CELL_SHOW_DETAIL, { field, data, element });
	};
	return iconElement;
};
