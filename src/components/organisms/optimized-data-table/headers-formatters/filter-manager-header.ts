import { get } from 'lodash';
import { FormatModule } from 'tabulator-tables';
import { getTableId, getTooltipElement, handleMouseEnter, handleMouseLeave, References } from '../formatters/common-utils';
import { TableCell } from '../models/optimized-data-table.model';
import { getCustomFormatters } from '../modules/formatters';

export const filterManagerHeader = (optimizedTable) => (cell: TableCell, formatterParams) => {
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
		const _tableId = getTableId(cell);
		const elementFilter = cell?.getElement().querySelector('.header-filters-icon-container');
		References.instance.getComponent(_tableId).openCardFilterChips({ field: cell.getColumn().getField(), elementFilter });
	};
	iconElement.style.setProperty('overflow', 'visible');
	iconContainer.appendChild(iconElement);
	const textContainer = document.createElement('div');
	textContainer.innerText = cell.getValue();
	textContainer?.classList.add('header-text-container');
	const tooltipIcon = getTooltipElement('top', optimizedTable.$literals.columnFilters);
	tooltipIcon.style.setProperty('--atoms-tooltip-info-top-bottom-distance', '100%');

	const formatterName = get(formatterParams, 'titleFormatterFunc', '');
	let formatter: Function;
	const container = document.createElement('div');
	const formatters = { ...getCustomFormatters, ...FormatModule.formatters };
	if (formatterName) {
		formatter = formatters[formatterName];
		if (formatter) {
			const _cell = {
				...cell,
				getData: () => {
					return {
						...cell.getColumn().getDefinition(),
						columnData: cell.getValue()
					};
				}
			};
			const tableId = getTableId(cell);
			textContainer.onmouseenter = () => handleMouseEnter(tableId, _cell, formatterParams, cell.getValue(), true);
			textContainer.onmouseleave = () => handleMouseLeave(tableId, _cell);

			container.appendChild(textContainer);
		} else {
			container.appendChild(formatterParams.titleFormatterFunc(cell, formatterParams));
		}
	}

	tooltipIcon.classList.add('header-filters-icon-container');
	container?.classList.add('header-container');
	tooltipIcon.appendChild(iconContainer);
	container.appendChild(tooltipIcon);

	return container;
};
