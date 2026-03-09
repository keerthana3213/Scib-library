import { cellIconStyleOnLayoutTabulator } from '../formatters/common-utils';

export const showInfoHeader = () => (cell: any) => {
	const classes = ['tabulator-action-link'];
	const iconElement = cellIconStyleOnLayoutTabulator(cell, 'refresh-reload-screen', classes);
	iconElement.onclick = () => {
		// emitCustomEvent(_tableId, TableCustomEvents.CELL_SHOW_DETAIL, { field, data, element });
	};
	return iconElement;
};
