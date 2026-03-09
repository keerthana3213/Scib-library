import { TableCell } from '../models/advanced-data-table.model';

export const customSelect = (cell: TableCell, onRendered, success, cancel, editorParams) => {
	const select = document.createElement('scib-ui-v2-select');
	select.classList.add('edit-select');
	const rowData = cell.getRow().getData();
	select.menuOptions = rowData.selectValues ? rowData.selectValues : editorParams?.selectValues;
	cell.getElement().style.overflow = 'visible';
	let cellValue = cell.getValue();
	onRendered(function () {
		select.focus();
		select.showCleanIcon = editorParams?.showClearIcon;
		select.value = cellValue;
		select.invalid = editorParams?.invalid;
		select.removeEventListener('valueChange', () => {});
		select.removeEventListener('blur', () => {});
		cell.getElement().removeEventListener('blur', () => {});
	});

	function onChange() {
		if (((cellValue === null || typeof cellValue === 'undefined') && select.value !== '') || select.value !== cellValue) {
			if (success(select.value)) {
				cellValue = select.value;
			}
		} else {
			cancel();
		}
	}

	select.addEventListener('valueChange', function () {
		onChange();
	});
	cell.getElement().addEventListener('blur', (event: any) => {
		let element: HTMLElement = event.relatedTarget;
		if (element?.classList.contains('tabulator-editable') || !element?.classList.contains('edit-select')) {
			cancel();
		} else if (!element?.classList.contains('edit-select')) {
			onChange();
		}
	});
	select.addEventListener('blur', (event: any) => {
		let element: HTMLElement = event.relatedTarget;
		if (element?.classList.contains('tabulator-editable')) {
			cancel();
		} else if (!element?.classList.contains('edit-select')) {
			onChange();
		}
	});
	select.addEventListener('keydown', function (event) {
		switch (event.keyCode) {
			case 13:
				onChange();
				break;
			case 27:
				cancel();
				break;
		}
	});
	cell.getElement().addEventListener('keydown', function (event) {
		switch (event.keyCode) {
			case 27:
				cancel();
				break;
		}
	});

	return select;
};
