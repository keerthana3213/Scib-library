import { TableCell } from '../models/optimized-data-table.model';
import { getTableId, References } from './common-utils';

export const rowSelectionRadio = (cell: TableCell) => {
	const _tableId = getTableId(cell);
	const field = cell.getColumn().getField();
	const row = cell.getRow();
	const rowData = row.getData();

	const radioElement = document.createElement('scib-atoms-group-radio-button');

	if (rowData.isDisabledRadio) {
		radioElement.disabled = true;
	} else {
		radioElement.options = [{ value: 'true', id: row.getPosition(), label: '' }];
		radioElement.value = rowData.isSelectedRadio ? 'true' : null;
		radioElement.addEventListener('valueChange', (event: any) => {
			References.instance.getComponent(_tableId).changeRowSelectionRadio({ field, value: event.detail.value === 'true', cell, rowData });
		});
	}
	return radioElement;
};
