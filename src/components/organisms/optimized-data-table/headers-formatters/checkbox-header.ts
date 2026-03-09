import { getTableId, References } from '../formatters/common-utils';
import { TableCell } from '../models/optimized-data-table.model';

export const checkboxHeader = (tableInstance) => (_cell: TableCell) => {
	const _tableId = getTableId(_cell);
	const checkboxElement = document.createElement('scib-ui-v2-checkbox');
	checkboxElement.value = References.instance.getComponent(_tableId).statusMultipleSelected;
	checkboxElement.addEventListener('valueChange', (event: CustomEvent) => {
		const { detail } = event;
		if (!(detail.checkboxValue === 'indeterminate')) {
			if (detail.checkboxValue === 'checked') {
				tableInstance.getRows().forEach((row) => {
					if (!row.getData().isDisabledCheckbox) {
						row.getData().isSelectedCheckbox = true;
						if (row.getElement().querySelector('scib-ui-v2-checkbox'))
							row.getElement().querySelector('scib-ui-v2-checkbox').value = 'checked';
					}
				});
			} else if (detail.checkboxValue === 'unchecked') {
				tableInstance.getRows().forEach((row) => {
					if (!row.getData().isDisabledCheckbox) {
						row.getData().isSelectedCheckbox = false;
						if (row.getElement().querySelector('scib-ui-v2-checkbox'))
							row.getElement().querySelector('scib-ui-v2-checkbox').value = 'unchecked';
					}
				});
			}
			References.instance.getComponent(_tableId).changeValueMultiselectCheckbox();
			References.instance.getComponent(_tableId).emitChangeMultipleCheckbox();
		}
	});

	return checkboxElement;
};
