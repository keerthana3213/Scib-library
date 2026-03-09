import { TableCell, TableCustomEvents } from '../models/data-table.model';
import { emitCustomEvent, getTableId } from './common-utils';
import { isNil, omitBy } from 'lodash';

export const radio = (cell: TableCell) => {
	const _tableId = getTableId(cell);
	const field = cell.getColumn().getField();
	const rowData = cell.getRow().getData();
	const radioElement = document.createElement('input');
	radioElement.type = 'radio';
	radioElement.name = 'radio';
	radioElement.checked = rowData?.isDefaultRadio;
	radioElement.onclick = () => {
		const data = omitBy(cell.getRow().getData(), isNil);
		emitCustomEvent(_tableId, TableCustomEvents.SELECTED_ROWS, [{ field, data }]);
	};
	return radioElement;
};
