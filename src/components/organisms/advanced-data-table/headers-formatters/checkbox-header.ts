import { TableCell } from '../models/advanced-data-table.model';

export const checkboxHeader = (tableInstance) => (_cell: TableCell) => {
	const checkboxElement = document.createElement('scib-ui-v2-checkbox');
	checkboxElement.addEventListener('valueChange', () => {
		if (tableInstance.modules.selectRow.selectedRows.length) {
			checkboxElement.value = 'unchecked';
			tableInstance.deselectRow();
		} else {
			checkboxElement.value = 'indeterminate';
			tableInstance.selectRow();
		}
	});
	document.addEventListener('selectedRows', (event: any) => {
		checkboxElement.value = event.detail.length ? 'indeterminate' : 'unchecked';
	});
	tableInstance.modules.selectRow.registerHeaderSelectCheckbox(checkboxElement);
	return checkboxElement;
};
