import { DateTime } from 'luxon';
import { TableCell } from '../models/optimized-data-table.model';

/**
 * Need refacor to use similar at input text events. Resume, the edition need update the rowData but and emited to integration with the same events that input text
 *
 * @deprecated
 */
export const customDatePicker = (cell: TableCell, onRendered, success, cancel, editorParams) => {
	const datePicker = document.createElement('scib-ui-v2-date-picker');
	datePicker?.classList.add('editor-datepicker');
	let inputFormat = cell.getColumn().getDefinition().formatterParams.inputFormat;
	let outputFormat = cell.getColumn().getDefinition().formatterParams.outputFormat;
	datePicker.config = { ...editorParams.config, borderless: true };
	cell.getElement().style.overflow = 'visible';
	let cellValue = cell.getValue();
	onRendered(function () {
		datePicker.removeEventListener('valueChange', () => {});
		datePicker.removeEventListener('blur', () => {});
		cell.getElement().removeEventListener('blur', () => {});
		datePicker.language = editorParams?.language || 'en';
		datePicker.locale = editorParams?.locale || 'en';
		datePicker.format = outputFormat;
		datePicker.range = editorParams?.isRange;
		datePicker.min = editorParams?.min;
		datePicker.max = editorParams?.max;
		datePicker.showCleanIcon = editorParams?.showCleanIcon;
		datePicker.invalid = editorParams?.invalid;

		if (cellValue !== null && typeof cellValue !== 'undefined' && cellValue !== '') {
			datePicker.value = `${DateTime.fromISO(cellValue.split('|')[0]).toFormat(outputFormat)}|${DateTime.fromISO(
				cellValue.split('|')[1]
			).toFormat(outputFormat)}`;
			if (editorParams.isRange) {
			} else {
				datePicker.value = DateTime.fromISO(cellValue).toFormat(outputFormat);
			}
		}
		datePicker.focus();
	});
	function onChange() {
		if (typeof cellValue !== 'undefined' && datePicker.value !== '') {
			if (editorParams.isRange) {
				if (
					cellValue.split('|')[1] !== DateTime.fromFormat(datePicker.value.split('|')[1], outputFormat).toFormat(inputFormat) ||
					cellValue.split('|')[0] !== DateTime.fromFormat(datePicker.value.split('|')[0], outputFormat).toFormat(inputFormat)
				) {
					success(
						DateTime.fromFormat(datePicker.value.split('|')[0], outputFormat).toFormat(
							inputFormat + '|' + DateTime.fromFormat(datePicker.value.split('|')[1], outputFormat).toFormat(inputFormat)
						)
					);
					cellValue = DateTime.fromFormat(datePicker.value.split('|')[0], outputFormat).toFormat(
						inputFormat + '|' + DateTime.fromFormat(datePicker.value.split('|')[1], outputFormat).toFormat(inputFormat)
					);
				}
			} else if (DateTime.fromFormat(datePicker.value, outputFormat).toFormat(inputFormat) !== cellValue) {
				success(DateTime.fromFormat(datePicker.value, outputFormat).toFormat(inputFormat) || cellValue);
				cellValue = datePicker.value;
			}
			cancel();
		} else {
			cancel();
		}
	}

	datePicker.addEventListener('valueChange', function () {
		onChange();
	});

	cell.getElement().addEventListener('blur', (event: any) => {
		let element: HTMLElement = event.relatedTarget;
		if (!element?.classList.contains('editor-datepicker')) {
			cancel();
		}
	});
	datePicker.addEventListener('blur', (event: any) => {
		let element: HTMLElement = event.relatedTarget;
		if (
			!element?.classList?.contains('editor-datepicker') &&
			!element?.firstElementChild?.classList?.contains('editor-datepicker') &&
			element !== null
		) {
			cancel();
		}
	});
	datePicker.addEventListener('keydown', function (event) {
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
	return datePicker;
};
