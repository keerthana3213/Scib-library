import { get, isNil, omitBy } from 'lodash';
import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { cellIconStyle, emitCustomEvent, getTableId } from './common-utils';
import { tooltip } from './tooltip';

export const colorIcon = (cell: TableCell, formatterParams) => {
	const rowData = cell.getRow().getData();
	const field = cell.getColumn().getField();
	const _tableId = getTableId(cell);
	const alignment = cell.getColumn().getDefinition().hozAlign || 'center';
	const colorIconConfig = get(rowData, ['colorIconRowConfig', field], null);

	let cliclableElement: any = null;
	let colorIconElement: any = null;

	if (colorIconConfig) {
		const { icon, color, isHidden, allowClick, hasTooltip, fontSize } = colorIconConfig;
		if (!isHidden) {
			const classes = ['tabulator-action-link'];
			const iconElement = cellIconStyle(cell, icon, classes, alignment);
			iconElement.style.setProperty('font-size', `${fontSize}px`);
			iconElement.style.setProperty('color', `${color}`);
			if (alignment !== 'center') {
				iconElement.style.setProperty('padding', '16px');
			}
			cliclableElement = iconElement;
			colorIconElement = iconElement;
			if (allowClick) {
				cliclableElement.onclick = () => {
					const data = omitBy(rowData, isNil);
					emitCustomEvent(_tableId, TableCustomEvents.CELL_ACTION_LINK, { field, data });
				};
			}
			if (hasTooltip) {
				tooltip(cell, formatterParams);
			}
		}
	}

	return colorIconElement;
};
