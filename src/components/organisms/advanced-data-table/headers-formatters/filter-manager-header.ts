import { TableCell, TableCustomEvents } from '../models/advanced-data-table.model';
import { emitCustomEvent, getTooltipElement } from '../formatters/common-utils';

export const filterManagerHeader = (tableReferenceId, advancedTable) => (cell: TableCell) => {
	const classes = ['tabulator-action-link'];
	const iconContainer = document.createElement('span');
	iconContainer.style.setProperty('width', '100%');
	iconContainer.style.setProperty('--icon-content', `var(--theme-scib-icon-filter-fill)`);

	const iconElement = document.createElement('i');
	iconElement?.classList.add('icon');
	classes.forEach((element) => iconElement?.classList.add(element));
	iconElement.onclick = (event) => {
		event.preventDefault();
		event.stopImmediatePropagation();
		emitCustomEvent(tableReferenceId, TableCustomEvents.CELL_SHOW_FILTERS, { cell });
	};
	iconElement.style.setProperty('overflow', 'visible');
	iconContainer.appendChild(iconElement);
	const textContainer = document.createElement('div');
	textContainer.innerText = cell.getValue();
	textContainer?.classList.add('header-text-container');
	const tooltipIcon = getTooltipElement('bottom', advancedTable.$literals.columnFilters);
	const tooltipText = getTooltipElement('bottom', cell.getValue());
	tooltipText.appendChild(textContainer);
	tooltipIcon.appendChild(iconContainer);
	tooltipIcon.classList.add('header-filters-icon-container');
	const container = document.createElement('div');
	container?.classList.add('header-container');
	container.appendChild(tooltipText);
	container.appendChild(tooltipIcon);
	return container;
};
