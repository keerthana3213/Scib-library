import { TableCell } from '../models/optimized-data-table.model';
import { calculateMinWidthAction } from '../formatters/common-utils';

export const actionTableHeader = () => (cell: TableCell) => {
	const formatterParams = cell.getColumn().getDefinition().formatterParams;
	const containerActions = document.createElement('div');
	containerActions.classList.add('tabulator-action-table-header');
	cell.getColumn().getElement().classList.add('tabulator-action-table-header-col');
	cell.getElement().style.minWidth = `${calculateMinWidthAction(formatterParams)}px`;
	return containerActions;
};
