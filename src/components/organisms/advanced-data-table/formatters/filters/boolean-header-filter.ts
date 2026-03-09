import { remove } from 'lodash';
import { setSubHeader } from '../common-utils';

export const booleanHeaderFilter = (advancedDataTable, filter, hasSubHeader, subHeader?) => (headerValue) => {
	const actualColumn = headerValue.getColumn().getField();
	const fieldTitle = headerValue.getColumn()._column.definition.title;
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
			advancedDataTable.closeFiltersChips();
		});

		select.addEventListener('valueChange', (event) => {
			const delegateFilterManagement = advancedDataTable.$delegateFilterManagement;
			const activeFilters = delegateFilterManagement ? advancedDataTable.$activeFilters : advancedDataTable._tableInstance.getFilters();
			const filterAllreadyExist = activeFilters.filter((filter) => filter.field === actualColumn);
			if (event['detail'] !== '' && filterAllreadyExist.length > 0) {
				if (!delegateFilterManagement) {
					advancedDataTable._tableInstance.removeFilter(actualColumn, 'like', filterAllreadyExist[0].value);
				} else {
					remove(advancedDataTable.$activeFilters, ({ field, type, value }: any) => {
						return field === actualColumn && type === 'like' && value === filterAllreadyExist[0].value;
					});
				}
			}
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
		});
		container.appendChild(select);
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
