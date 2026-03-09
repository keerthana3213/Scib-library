export const dropdownHeaderFilter = (optimizedDataTable, rowData, filter) => (headerValue) => {
	const actualColumn = headerValue.getColumn().getField();
	const fieldTitle = headerValue.getColumn().getDefinition()?.title;
	const singleValue = headerValue.getColumn().getDefinition()?.filterSingleValue;
	const columnArrayFilter = headerValue.getColumn().getDefinition()?.filterSelectOptions;
	const filterContainer = document.createElement('div');
	const container = document.createElement('div');
	const formatterParams = headerValue.getColumn().getDefinition()?.formatterParams;
	if (filter) {
		const menuOptions: { id: number; label: string; value: string }[] = [];
		rowData.forEach((row, index) => {
			if (menuOptions.filter((option) => option.value === row[actualColumn]).length === 0) {
				menuOptions.push({ id: index + 1, label: row[actualColumn], value: row[actualColumn] });
			}
		});
		const select = document.createElement('scib-ui-v2-select');
		select.value = '';
		select.onlySelect = false;
		select.menuOptions = columnArrayFilter ?? JSON.stringify(menuOptions);

		select.addEventListener('activateFocus', () => {
			optimizedDataTable.closeFiltersChips();
		});

		select.addEventListener('valueChange', (event) => {
			let values: string[] = [];
			if (event['detail'] !== '' || formatterParams?.disableArrow) {
				if (singleValue) {
					values = [event['detail']];
				} else {
					values = optimizedDataTable.$activeFilters.find((filter) => filter.field === actualColumn)?.value || [];
					if (!values.includes(event['detail'])) {
						values.push(event['detail']);
					}
				}

				let filterToAdd = {
					fieldTitle: fieldTitle,
					field: actualColumn,
					type: 'in',
					label: headerValue.getColumn().getDefinition()?.label,
					value: values,
					delegated: headerValue.getColumn().getDefinition()?.delegatedFilter
				};

				optimizedDataTable.addFilters(filterToAdd);
			}
		});
		container.appendChild(select);
		filterContainer.appendChild(container);
	}

	return filter ? filterContainer : null;
};
