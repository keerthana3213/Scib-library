import { cellIconStyleOnLayoutTabulator, emitCustomEvent, getTableId } from './common-utils';
import { TableCell, TableCustomEvents } from '../models/optimized-data-table.model';
import { get, isEmpty, isNil, omitBy } from 'lodash';
import { tooltip } from './tooltip';

export const actionLink = (cell: TableCell, formatterParams) => {
	const _tableId = getTableId(cell);
	const { icon = 'viewdetail' } = formatterParams;
	const rowData = cell.getRow().getData();
	const field = cell.getColumn().getField();
	// TODO Refactor actionLinkRowConfig to be getted from formatterParams and not from rowData, the fucntion to calculate must me a funtion inside formatterParams and to be called inside this formatter like hidden from custom action
	const config = get(rowData, ['actionLinkRowConfig', field], {});
	const newIcon = get(config, 'newIcon', icon);
	const classes = ['tabulator-action-link'];
	const alignment = cell.getColumn().getDefinition().hozAlign || 'center';
	const iconElement = cellIconStyleOnLayoutTabulator(cell, newIcon, classes, alignment);
	let finalElement: any = null;
	let cliclableElement: any = null;
	const { isHidden, text, fullText, allowClick, iconFirst, subText, hasTooltip, textVariant } = config;

	if (!isHidden) {
		if (text || text === '') {
			const divElement = document.createElement('div');
			const spanElement = document.createElement('span');
			spanElement.innerHTML = text;
			if (!!textVariant) {
				spanElement.classList.add('tabulator-action-link-text-variant');
			} else {
				spanElement?.classList.add('tabulator-action-link-text');
			}
			divElement?.classList.add('tabulator-action-link-box');
			if (iconFirst) {
				divElement?.classList.add('tabulator-action-link-box--reverse');
			}
			if (fullText) {
				divElement?.classList.add('tabulator-action-link-box--full-text');
			}
			if (!!allowClick) {
				if (!!textVariant) {
					spanElement?.classList.add('tabulator-action-link-text-variant-action');
				} else {
					spanElement?.classList.add('tabulator-action-link-text-action');
				}
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
			divElement.appendChild(iconElement);
			cliclableElement = !!allowClick ? divElement : iconElement;
			finalElement = divElement;
		} else {
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
