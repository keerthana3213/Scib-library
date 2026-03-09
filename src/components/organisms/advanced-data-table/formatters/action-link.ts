import { cellIconStyle, emitCustomEvent, getTableId } from './common-utils';
import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { get, isEmpty, isNil, omitBy } from 'lodash';
import { tooltip } from './tooltip';

export const actionLink = (cell: TableCell, formatterParams) => {
	const _tableId = getTableId(cell);
	const { icon = 'viewdetail' } = formatterParams;
	const rowData = cell.getRow().getData();
	const field = cell.getColumn().getField();
	const config = get(rowData, ['actionLinkRowConfig', field], {});
	const newIcon = get(config, 'newIcon', icon);
	const classes = ['tabulator-action-link'];
	const alignment = cell.getColumn().getDefinition().hozAlign || 'center';
	const iconElement = cellIconStyle(cell, newIcon, classes, alignment);
	let finalElement: any = null;
	let cliclableElement: any = null;
	const { isHidden, text, fullText, allowClick, iconFirst, subText, hasTooltip } = config;
	if (!isHidden) {
		if (text || text === '') {
			const divElement = document.createElement('div');
			const spanElement = document.createElement('span');
			spanElement.innerHTML = text;
			spanElement?.classList.add('tabulator-action-link-text');
			divElement?.classList.add('tabulator-action-link-box');
			if (iconFirst) {
				divElement?.classList.add('tabulator-action-link-box--reverse');
			}
			if (fullText) {
				divElement?.classList.add('tabulator-action-link-box--full-text');
			}
			if (!!allowClick) {
				spanElement?.classList.add('tabulator-action-link-text-action');
			}
			if (isEmpty(text)) {
				spanElement.innerHTML = '-';
				divElement?.classList.add('tabulator-action-link-box--center');
			}
			divElement.appendChild(spanElement);
			if (subText) {
				const subSpanElement = document.createElement('span');
				subSpanElement.innerHTML = subText;
				subSpanElement?.classList.add('tabulator-action-link-text');
				divElement.appendChild(subSpanElement);
			}
			if (alignment !== 'center') {
				divElement.style.setProperty('padding', '16px');
			}
			divElement.appendChild(iconElement);
			cliclableElement = !!allowClick ? divElement : iconElement;
			finalElement = divElement;
		} else {
			if (alignment !== 'center') {
				iconElement.style.setProperty('padding', '16px');
			}
			cliclableElement = iconElement;
			finalElement = iconElement;
		}
		cliclableElement.onclick = () => {
			const data = omitBy(rowData, isNil);
			emitCustomEvent(_tableId, TableCustomEvents.CELL_ACTION_LINK, { field, data });
		};
		if (hasTooltip) {
			tooltip(cell, formatterParams);
		}
	}
	return finalElement;
};
