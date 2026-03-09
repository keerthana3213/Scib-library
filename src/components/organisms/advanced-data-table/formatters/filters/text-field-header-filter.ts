import { setSubHeader, showTooltipForInput } from '../common-utils';

export const textFieldHeaderFilter = (advancedDataTable, filter, hasSubHeader, subHeader?) => (headerValue) => {
	const actualColumn = headerValue.getColumn().getField();
	const fieldTitle = headerValue.getColumn()._column.definition.title;
	const container = document.createElement('div');
	if (filter) {
		const textField = document.createElement('scib-ui-v2-text-field');
		const tooltip = document.createElement('scib-atoms-tooltip-info');
		tooltip.arrow = 'bottom';
		// tooltip.disableReposition = true;
		textField.addEventListener('activateFocus', () => {
			advancedDataTable.closeFiltersChips();
		});

		textField.addEventListener('valueChange', () => {
			textField.icon = textField.value !== '' ? 'arrow-right' : '';
			textField.style.setProperty('--_ui-v2-text-field-icon-cursor', 'pointer');
		});

		textField.addEventListener('iconClick', (event) => {
			const delegateFilterManagement = advancedDataTable.$delegateFilterManagement;
			const activeFilters = delegateFilterManagement ? advancedDataTable.$activeFilters : advancedDataTable._tableInstance.getFilters();
			const filterAllreadyExist = activeFilters.find((filter) => filter.value === event['detail'] && filter.field === actualColumn);
			if (event['detail'] !== '' && filterAllreadyExist === undefined) {
				if (!delegateFilterManagement) {
					headerValue.getColumn().getTable().addFilter(actualColumn, 'like', event['detail']);
				}
				advancedDataTable.$activeFilters.push({
					fieldTitle: fieldTitle,
					field: actualColumn,
					type: 'like',
					value: event['detail']
				});
				advancedDataTable.sendSelectedFilters(actualColumn);
			} else {
				const tooltipText =
					event['detail'] === '' ? advancedDataTable.$literals.tooltipEmptyFilter : advancedDataTable.$literals.tooltipFilterSearch;
				showTooltipForInput(tooltip, tooltipText);
			}
		});
		container.appendChild(tooltip);
		container.appendChild(textField);
	}

	if (hasSubHeader) {
		const subHeaderContainer = setSubHeader(subHeader, advancedDataTable.$literals);
		if (filter) {
			subHeaderContainer.style.setProperty('position', 'absolute');
			subHeaderContainer.style.setProperty('top', '36px');
		}
		container.appendChild(subHeaderContainer);
	}

	if (filter && hasSubHeader) {
		container.style.setProperty('height', '72px');
	}

	return filter || hasSubHeader ? container : null;
};
