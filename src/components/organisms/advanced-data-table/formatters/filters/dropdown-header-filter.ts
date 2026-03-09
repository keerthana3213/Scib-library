import { remove } from 'lodash';
import { setSubHeader } from '../common-utils';

export const dropdownHeaderFilter = (advancedDataTable, rowData, filter, hasSubHeader, subHeader?) => (headerValue) => {
	const actualColumn = headerValue.getColumn().getField();
	const fieldTitle = headerValue.getColumn()._column.definition.title;
	const singleValue = headerValue.getColumn().getDefinition()?.filterSingleValue;
	const columnArrayFilter = headerValue.getColumn().getDefinition()?.filterSelectOptions;
	const container = document.createElement('div');
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
			advancedDataTable.closeFiltersChips();
		});

		select.addEventListener('valueChange', (event) => {
			const delegateFilterManagement = advancedDataTable.$delegateFilterManagement;
			const activeFilters = delegateFilterManagement ? advancedDataTable.$activeFilters : advancedDataTable._tableInstance.getFilters();
			const filterAllreadyExist = activeFilters.filter((filter) => filter.field === actualColumn);
			let values: string[] = [];
			if (event['detail'] !== '' && filterAllreadyExist.length > 0) {
				// TODO: review duplicated filters
				values = [...filterAllreadyExist[0].value];
				if (!delegateFilterManagement) {
					advancedDataTable._tableInstance.removeFilter(actualColumn, 'in', filterAllreadyExist[0].value);
				} else {
					remove(advancedDataTable.$activeFilters, ({ field, type, value }: any) => {
						return field === actualColumn && type === 'in' && value === filterAllreadyExist[0].value;
					});
				}
			}

			if (singleValue) {
				values = [event['detail']];
			} else {
				values.push(event['detail']);
			}

			if (!delegateFilterManagement) {
				headerValue.getColumn().getTable().addFilter(actualColumn, 'in', values);
			}
			advancedDataTable.$activeFilters.push({
				fieldTitle: fieldTitle,
				field: actualColumn,
				type: 'in',
				value: values
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
