import { getTableId, References } from '../formatters/common-utils';
import { TableCell } from '../models/optimized-data-table.model';

export const customInput = (cell: TableCell, onRendered, success, cancel, editorParams) => {
	const _tableId = getTableId(cell);
	const containerElement = document.createElement('div');
	containerElement?.classList.add('editor-element');
	let editedValue = cell.getValue();
	const input = document.createElement('scib-ui-v2-text-field');

	if (editorParams.propsInput) {
		Object.keys(editorParams.propsInput).forEach((attribute) => {
			if (typeof editorParams.propsInput[attribute] === 'function') {
				input.setAttribute(attribute, editorParams.propsInput[attribute](editedValue, cell));
			} else {
				input.setAttribute(attribute, editorParams.propsInput[attribute]);
			}
		});
	}
	input.setAttribute('value', editedValue);
	input.invalid = editorParams.validationFn ? !editorParams.validationFn(editedValue, cell) : false;
	input.setAttribute('show-clean-icon', 'false');

	input.addEventListener('deactivateFocus', () => {
		input.invalid = editorParams.validationFn ? !editorParams.validationFn(editedValue, cell) : false;
		References.instance.getComponent(_tableId).emitEditedCell(editedValue, cell);

		if (editorParams?.cancelWhenDeactivateFocus) {
			cancel();
		} else {
			success(editedValue);
		}
	});

	input.addEventListener('valueChange', (event: any) => {
		input.invalid = editorParams.validationFn ? !editorParams.validationFn(event.detail, cell) : false;
		editedValue = event.detail;
		References.instance.getComponent(_tableId).emitEditingCell(editedValue, cell);
	});

	containerElement.appendChild(input);

	onRendered(function () {
		input.getInputRef().then((data) => {
			data.focus();
		});
		cell.getElement().removeEventListener('blur', () => {});
	});

	return containerElement;
};
