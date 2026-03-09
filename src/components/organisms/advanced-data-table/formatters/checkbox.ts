import { TableCell } from '../models/advanced-data-table.model';

export const checkbox = (cell: TableCell) => {
	const checkboxElement = document.createElement('scib-ui-v2-checkbox');
	const table = cell.getTable();
	const row = cell.getRow();
	const rowData = row.getData();

	if (rowData.isDisabled) {
		checkboxElement.disabled = true;
	} else {
		checkboxElement.addEventListener('valueChange', () => {
			row.toggleSelect();
		});
		checkboxElement.value = row.isSelected() ? 'checked' : 'unchecked';
		table.modules.selectRow.registerRowSelectCheckbox(row, checkboxElement);
	}
	return checkboxElement;
};
