export const booleanHeaderFilter = (optimizedDataTable, filter) => (headerValue) => {
	const actualColumn = headerValue.getColumn().getField();
	const fieldTitle = headerValue.getColumn().getDefinition()?.title;
	const filterContainer = document.createElement('div');
	const container = document.createElement('div');
	if (filter) {
		const _options = [
			{ id: 1, value: 'true', label: 'True' },
			{ id: 2, value: 'false', label: 'False' }
		];
		const select = document.createElement('scib-ui-v2-select');
		select.menuOptions = JSON.stringify(_options);
		select.value = '';
		select.onlySelect = true;
		select.addEventListener('activateFocus', () => {
			optimizedDataTable.closeFiltersChips();
		});

		select.addEventListener('valueChange', (event) => {
			let filter = {
				fieldTitle: fieldTitle,
				field: actualColumn,
				type: 'like',
				label: headerValue.getColumn().getDefinition()?.label,
				value: event['detail'],
				delegated: headerValue.getColumn().getDefinition()?.delegatedFilter
			};
			optimizedDataTable.addFilters(filter);
		});
		container.appendChild(select);
		filterContainer.appendChild(container);
	}

	return filter ? filterContainer : null;
};
