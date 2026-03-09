import { getTableId, setTooltipHeader } from '../formatters/common-utils';
import { TableCell } from '../models/optimized-data-table.model';

export const generateTooltipHeader = (cell: TableCell, formatterParams) => {
	const textContainer = document.createElement('div');
	textContainer.innerText = cell.getValue();
	textContainer.style.setProperty('text-overflow', 'ellipsis');
	textContainer.style.setProperty('overflow', 'hidden');
	textContainer.style.setProperty('white-space', 'no-wrap');

	const textContainerHiddenForTitWidthCalculate = document.createElement('div');
	textContainerHiddenForTitWidthCalculate.innerText = cell.getValue();
	textContainerHiddenForTitWidthCalculate.classList.add('tooltip-with-fitcontent');
	textContainerHiddenForTitWidthCalculate.style.setProperty('width', 'fit-content');
	textContainerHiddenForTitWidthCalculate.style.setProperty('position', 'absolute');
	textContainerHiddenForTitWidthCalculate.style.setProperty('opacity', '0');
	textContainerHiddenForTitWidthCalculate.style.setProperty('top', '0');

	const _tableId = getTableId(cell);
	setTooltipHeader(
		_tableId,
		{
			...cell,
			getData: () => {
				return {
					...cell.getColumn().getDefinition(),
					columnData: cell.getValue()
				};
			}
		},
		formatterParams,
		cell.getValue()
	);
	return textContainer;
};

export const tooltipHeader = () => (cell: TableCell, formatterParams) => {
	const columnDefinition = cell.getColumn()._column.definition;
	if (columnDefinition?.titleDescription || columnDefinition.title) {
		return generateTooltipHeader(cell, formatterParams);
	}
	return null;
};
