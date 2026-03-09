import { sanitizer } from './common-utils';
import { TableCell } from '../models/advanced-data-table.model';
import { get, isEmpty } from 'lodash';

export const tooltip = (cell: TableCell, formatterParams) => {
	const textContainer = document.createElement('span');
	textContainer.innerText = sanitizer(cell.getValue());
	const tooltipHeader = document.createElement('scib-atoms-tooltip-info');
	tooltipHeader.literalsTooltip = textContainer.innerText;
	const tooltipPosition = 'top';
	tooltipHeader.arrow = tooltipPosition;
	tooltipHeader.repositionMarginVertical = 125;
	if (!isEmpty(get(formatterParams, 'text'))) {
		const data = cell.getData();
		const columnData = get(data, formatterParams.columnData);
		tooltipHeader.literalsTooltip = `${formatterParams.text}${columnData}`;
	}
	tooltipHeader.appendChild(textContainer);
	return tooltipHeader;
};
