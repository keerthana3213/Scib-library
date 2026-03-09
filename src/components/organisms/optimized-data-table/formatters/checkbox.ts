import { TableCell } from '../models/optimized-data-table.model';
import { getTableId, References } from './common-utils';

export const rowSelectionCheckbox = (cell: TableCell) => {
	const _tableId = getTableId(cell);
	const field = cell.getColumn().getField();
	const row = cell.getRow();
	const rowData = row.getData();

	const checkboxElement = document.createElement('scib-ui-v2-checkbox');

	if (rowData.isDisabledCheckbox) {
		checkboxElement.disabled = true;
		checkboxElement.value = rowData.isSelectedCheckbox ? 'checked' : 'unchecked';
	} else {
		checkboxElement.value = rowData.isSelectedCheckbox ? 'checked' : 'unchecked';
		checkboxElement.addEventListener('valueChange', (event: any) => {
			References.instance.getComponent(_tableId).changeRowSelectionCheckbox({ field, value: event.detail, cell, rowData });
		});
	}
	return checkboxElement;
};
