import { get } from 'lodash';
import { TableCell } from '../models/optimized-data-table.model';
import { getCustomEditors } from '../modules/editors';
import { EditModule } from 'tabulator-tables';

/**
 * Need refacor to use similar at input text events. Resume, the edition need update the rowData but and emited to integration with the same events that input text
 *
 * In Another hand, select have a bug with table, the list of option isnt absolute and made a scroll vertical more long
 *
 * @deprecated
 */
export const setCustomEditorByCell = (cell: TableCell, onRendered, success, cancel, editorParams) => {
	const value = cell.getValue();
	const mapKey = get(editorParams, 'editorMapKey') ?? value;
	const editors = { ...getCustomEditors, ...EditModule.editors };
	let editor;
	let type: string;
	let editorElememt: Function;
	if (mapKey) {
		const rowData = cell.getRow().getData();
		const id = get(rowData, mapKey, value);
		type = get(editorParams, ['values', id], '');
		let typeInLowerCase = type.toLocaleLowerCase();
		if (type == 'customDatePickerRange') {
			editorParams.isRange = true;
			type = 'customDatePicker';
		} else if (typeInLowerCase.toLocaleLowerCase().includes('custominput')) {
			delete editorParams.type;
			if (typeInLowerCase.includes('number')) {
				editorParams.type = 'number';
			} else if (typeInLowerCase.includes('email')) {
				editorParams.type = 'email';
			} else if (typeInLowerCase.includes('password')) {
				editorParams.type = 'password';
			} else if (typeInLowerCase.includes('time')) {
				editorParams.type = 'time';
			} else if (typeInLowerCase.includes('tel')) {
				editorParams.type = 'tel';
			} else if (typeInLowerCase.includes('url')) {
				editorParams.type = 'url';
			}
			type = 'customInput';
		} else {
			delete editorParams.isRange;
			delete editorParams.type;
		}
		editor = editors[type];
		if (editor) {
			editorElememt = editor(cell, onRendered, success, cancel, editorParams);
		}
	}
	return editorElememt;
};
