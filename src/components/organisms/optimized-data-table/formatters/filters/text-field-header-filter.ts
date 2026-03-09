export const textFieldHeaderFilter = (optimizedDataTable, filter) => (headerValue) => {
	const actualColumn = headerValue.getColumn().getField();
	const fieldTitle = headerValue.getColumn().getDefinition()?.title;
	const formatterParams = headerValue.getColumn().getDefinition()?.formatterParams;
	const filterContainer = document.createElement('div');
	const container = document.createElement('div');
	if (filter) {
		const textField = document.createElement('scib-ui-v2-text-field');
		textField.value = '';
		textField.icon = textField.value !== '' || !!formatterParams?.disableArrow ? 'arrow-right' : '';
		const tooltip = document.createElement('scib-atoms-tooltip-info');
		tooltip.arrow = 'bottom';
		textField.addEventListener('activateFocus', () => {
			optimizedDataTable.closeFiltersChips();
		});

		textField.addEventListener('valueChange', () => {
			textField.icon = textField.value !== '' || !!formatterParams?.disableArrow ? 'arrow-right' : '';
			textField.style.setProperty('--_ui-v2-text-field-icon-cursor', 'pointer');
		});

		textField.addEventListener('iconClick', (event) => {
			if (event['detail'] !== '' || !!formatterParams?.disableArrow) {
				optimizedDataTable.addFilters({
					fieldTitle: fieldTitle,
					field: actualColumn,
					type: 'like',
					label: headerValue.getColumn().getDefinition()?.label,
					value: event['detail'],
					delegated: headerValue.getColumn().getDefinition()?.delegatedFilter
				});
			}
		});
		container.appendChild(tooltip);
		container.appendChild(textField);
		filterContainer.appendChild(container);
	}

	return filter ? filterContainer : null;
};
