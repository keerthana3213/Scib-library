export const tooltipHeader = () => (cell) => {
	const columnDefinition = cell.getColumn()._column.definition;
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

	const tooltipHeader = document.createElement('scib-atoms-tooltip-info');
	tooltipHeader?.classList.add('tooltip-header');
	tooltipHeader.arrow = 'bottom';
	tooltipHeader.repositionMarginHorizontal = 45;
	tooltipHeader.literalsTooltip = columnDefinition?.titleDescription || cell.getValue();
	tooltipHeader.appendChild(textContainer);
	tooltipHeader.appendChild(textContainerHiddenForTitWidthCalculate);
	return tooltipHeader;
};
