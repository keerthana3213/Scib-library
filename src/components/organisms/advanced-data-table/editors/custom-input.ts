import { TableCell } from '../models/advanced-data-table.model';

export const customInput = (cell: TableCell, onRendered, success, cancel, editorParams) => {
	const containerElement = document.createElement('div');
	containerElement?.classList.add('editor-element');
	let cellValue = cell.getValue();
	const input = document.createElement('scib-ui-v2-text-field');
	input.value = typeof cellValue !== 'undefined' ? cellValue : '';
	input.classList.add('edit-input');

	onRendered(function () {
		input.focus();
		input.removeEventListener('blur', () => {});
		cell.getElement().removeEventListener('blur', () => {});
		input.showCleanIcon = editorParams?.showClearIcon;
		input.invalid = editorParams?.invalid;
		input.type = editorParams?.type;
		input.icon = editorParams?.icon;
	});

	function onChange() {
		if (((cellValue === null || typeof cellValue === 'undefined') && input.value !== '') || input.value !== cellValue) {
			if (success(input.value)) {
				input.removeEventListener('blur', () => {});
				cell.getElement().removeEventListener('blur', () => {});
				cellValue = input.value;
			}
		}
		input.removeEventListener('valueChange', () => {});
		input.removeEventListener('blur', () => {});
	}

	cell.getElement().addEventListener('blur', (event: any) => {
		let element: HTMLElement = event.relatedTarget;

		if (element != cell.getElement() && element != input && !cell.getElement().contains(element)) {
			cancel();
		}
	});
	input.addEventListener('blur', () => {
		onChange();
	});
	input.addEventListener('keydown', function (event) {
		switch (event.keyCode) {
			case 13:
				onChange();
				break;
			case 27:
				cancel();
				break;
		}
	});

	containerElement.appendChild(input);
	input.removeEventListener('blur', () => {});
	cell.getElement().removeEventListener('blur', () => {});
	return containerElement;
};
