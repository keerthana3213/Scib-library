import { isEmpty } from 'lodash';
import { RangeInputTypes } from '../../../../../components';
import { filtersRangesTypes } from '../../models/advanced-data-table.model';
import { setSubHeader } from '../common-utils';

export const rangeHeaderFilter = (advancedDataTable, type: RangeInputTypes, filter, hasSubHeader, subHeader?) => (headerValue) => {
	const actualColumn = headerValue.getColumn().getField();
	const fieldTitle = headerValue.getColumn()._column.definition.title;
	const container = document.createElement('div');
	if (filter) {
		const inputRange = document.createElement('scib-molecules-input-range');
		inputRange.value = '';
		let actualType: string = 'equals';
		inputRange.menuOptions =
			type === 'date'
				? JSON.stringify([
						{ id: 2, value: 'equals', label: 'Equal' },
						{ id: 3, value: 'from', label: 'Later than' },
						{ id: 4, value: 'to', label: 'Earlier than' }
				  ])
				: JSON.stringify([
						{ id: 2, value: 'equals', label: 'Equal' },
						{ id: 3, value: 'from', label: 'Bigger than' },
						{ id: 4, value: 'to', label: 'Smaller than' }
				  ]);
		inputRange.type = type;
		inputRange.mode = 'equals';
		inputRange.icon = 'arrow-right';
		if (type === 'date') {
			inputRange.inputIcon = true;
		}

		const decimalPlaces = headerValue.getColumn()._column.definition.decimalPlaces;
		if (type === 'amount' && decimalPlaces) {
			inputRange.config = {
				amountInputConfig: {
					decimalPlacesRawValue: decimalPlaces,
					decimalPlacesShownOnBlur: decimalPlaces,
					decimalPlacesShownOnFocus: decimalPlaces
				}
			};
		}

		inputRange.addEventListener('modeChange', (event) => {
			actualType = event['detail'];
		});

		inputRange.addEventListener('activateFocus', () => {
			advancedDataTable.closeFiltersChips();
		});

		inputRange.addEventListener('iconClick', (event) => {
			event.preventDefault();
			event.stopImmediatePropagation();
			const delegateFilterManagement = advancedDataTable.$delegateFilterManagement;
			const activeFilters = delegateFilterManagement ? advancedDataTable.$activeFilters : advancedDataTable._tableInstance.getFilters();

			const filterEqualAllreadyExist = activeFilters.find(
				(filter) => filter.value === event['detail'][0] && filter.field === actualColumn && activeFilters.type === '='
			);

			const filterFromAllreadyExist = activeFilters.find(
				(filter) => filter.value === event['detail'][0] && filter.field === actualColumn && activeFilters.type === '<'
			);

			const filterToAllreadyExist = activeFilters.find(
				(filter) => filter.value === event['detail'][1] && filter.field === actualColumn && activeFilters.type === '<'
			);

			let dateFormat = 'dd/LL/yyyy';

			if (type === filtersRangesTypes.DATE) {
				const columnDefinitions = headerValue.getColumn()?.getTable()?.getColumnDefinitions();
				const currentColumn = columnDefinitions?.find((element) => element.field === actualColumn);
				dateFormat = currentColumn?.formatterParams?.inputFormat;
				event['detail'][0] = formatDate(event['detail'][0], dateFormat);
				event['detail'][1] = formatDate(event['detail'][1], dateFormat);
			}

			switch (actualType) {
				case 'range':
					if (!filterFromAllreadyExist) {
						if (!delegateFilterManagement) {
							headerValue.getColumn().getTable().addFilter(actualColumn, '>', event['detail'][0]);
						}
						advancedDataTable.$activeFilters.push({
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: '>',
							value: event['detail'][0]
						});
					}
					if (!filterToAllreadyExist) {
						if (!delegateFilterManagement) {
							headerValue.getColumn().getTable().addFilter(actualColumn, '<', event['detail'][1]);
						}
						advancedDataTable.$activeFilters.push({
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: '<',
							value: event['detail'][1]
						});
					}
					break;
				case 'equals':
					if (!filterEqualAllreadyExist) {
						if (!delegateFilterManagement) {
							headerValue.getColumn().getTable().addFilter(actualColumn, '=', event['detail'][0]);
						}
						advancedDataTable.$activeFilters.push({
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: 'equal',
							value: event['detail'][0]
						});
					}
					break;
				case 'from':
					if (!filterFromAllreadyExist) {
						if (!delegateFilterManagement) {
							headerValue.getColumn().getTable().addFilter(actualColumn, '>', event['detail'][0]);
						}
						advancedDataTable.$activeFilters.push({
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: '>',
							value: event['detail'][0]
						});
					}
					break;
				case 'to':
					if (!filterToAllreadyExist) {
						if (!delegateFilterManagement) {
							headerValue.getColumn().getTable().addFilter(actualColumn, '<', event['detail'][1]);
						}
						advancedDataTable.$activeFilters.push({
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: '<',
							value: event['detail'][1]
						});
					}
					break;
				default:
					break;
			}

			if (!isEmpty(event['detail'])) {
				advancedDataTable.sendSelectedFilters(actualColumn);
			}
		});

		function formatDate(stringDate, dateFormat): string {
			let date = new Date(stringDate);

			if (!!stringDate) {
				switch (dateFormat) {
					case 'yyyy-LL-dd':
						return date.getFullYear() + '-' + addzero(date.getMonth() + 1) + '-' + addzero(date.getDate());
					case 'dd/LL/yyyy':
					default:
						return addzero(date.getDate()) + '/' + addzero(date.getMonth() + 1) + '/' + date.getFullYear();
				}
			} else {
				return '';
			}
		}
		container.appendChild(inputRange);
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

function addzero(datefunc) {
	return datefunc > 9 ? datefunc : '0' + datefunc;
}
