import { isEmpty } from 'lodash';
import { DateTime } from 'luxon';
import { RangeInputConfig, RangeInputTypes } from '../../../../../components';
import { filtersRangesTypes } from '../../models/optimized-data-table.model';

export const rangeHeaderFilter = (optimizedDataTable, type: RangeInputTypes, filter) => (headerValue) => {
	const actualColumn = headerValue.getColumn().getField();
	const formatterParams = headerValue.getColumn().getDefinition()?.formatterParams;
	const fieldTitle = headerValue.getColumn().getDefinition()?.title;
	const filterContainer = document.createElement('div');
	const container = document.createElement('div');
	if (filter) {
		const inputRange = document.createElement('scib-molecules-input-range');
		inputRange.value = '';
		let actualType: string = 'equals';
		inputRange.config = {};
		inputRange.menuOptions =
			type === 'date'
				? JSON.stringify([
						{ id: 1, value: 'equals', label: 'Equal' },
						{ id: 2, value: 'range', label: 'Between' },
						{ id: 3, value: 'from', label: 'Later than' },
						{ id: 4, value: 'to', label: 'Earlier than' }
				  ])
				: JSON.stringify([
						{ id: 1, value: 'equals', label: 'Equal' },
						{ id: 2, value: 'range', label: 'Between' },
						{ id: 3, value: 'from', label: 'Bigger than' },
						{ id: 4, value: 'to', label: 'Smaller than' }
				  ]);
		inputRange.type = type;
		inputRange.mode = 'equals';
		inputRange.icon = 'arrow-right';
		if (type === 'date') {
			inputRange.inputIcon = true;
			(inputRange.config as Partial<RangeInputConfig>).firstDay = optimizedDataTable?.$config?.firstDayOfCalendar;
			(inputRange.config as Partial<RangeInputConfig>).language = optimizedDataTable?.$globalLanguage || 'es';
		}
		if (!!formatterParams?.disableArrow && (actualType === 'equals' || inputRange.value !== '')) {
			if (type === 'amount') {
				inputRange.icon = 'arrow-right';
			} else if (type === 'date') {
				inputRange.inputIcon = true;
			}
		} else if (!!formatterParams?.disableArrow) {
			if (type === 'amount') {
				inputRange.icon = '';
			} else if (type === 'date') {
				inputRange.inputIcon = false;
			}
		}

		const decimalPlaces = headerValue.getColumn()._column.definition.decimalPlaces;
		if (type === 'amount' && !isNaN(decimalPlaces)) {
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
			if (!!formatterParams?.disableArrow && (actualType === 'equals' || inputRange.value !== '')) {
				if (type === 'amount') {
					inputRange.icon = 'arrow-right';
				} else if (type === 'date') {
					inputRange.inputIcon = true;
				}
			} else if (!!formatterParams?.disableArrow) {
				if (type === 'amount') {
					inputRange.icon = '';
				} else if (type === 'date') {
					inputRange.inputIcon = false;
				}
			}
		});

		inputRange.addEventListener('deactivateFocus', () => {
			if (!!formatterParams?.disableArrow && (actualType === 'equals' || inputRange.value !== '')) {
				if (type === 'amount') {
					inputRange.icon = 'arrow-right';
				} else if (type === 'date') {
					inputRange.inputIcon = true;
				}
			} else if (!!formatterParams?.disableArrow) {
				if (type === 'amount') {
					inputRange.icon = '';
				} else if (type === 'date') {
					inputRange.inputIcon = false;
				}
			}
		});
		inputRange.addEventListener('valueChange', (event) => {
			if (!!formatterParams?.disableArrow && (actualType === 'equals' || event['detail'] !== '')) {
				if (type === 'amount') {
					inputRange.icon = 'arrow-right';
				} else if (type === 'date') {
					inputRange.inputIcon = true;
				}
			} else if (!!formatterParams?.disableArrow) {
				if (type === 'amount') {
					inputRange.icon = '';
				} else if (type === 'date') {
					inputRange.inputIcon = false;
				}
			}
		});

		inputRange.addEventListener('activateFocus', () => {
			optimizedDataTable.closeFiltersChips();
		});
		inputRange.addEventListener('iconClick', (event) => {
			if (!!formatterParams?.disableArrow && inputRange.value === '' && actualType !== 'equals') {
			} else {
				event.preventDefault();
				event.stopImmediatePropagation();
				let inputDateFormat = 'yyyy-LL-dd';
				if (type === filtersRangesTypes.DATE) {
					const columnDefinitions = headerValue.getColumn()?.getTable()?.getColumnDefinitions();
					const currentColumn = columnDefinitions?.find((element) => element.field === actualColumn);
					inputDateFormat = currentColumn?.formatterParams?.inputFormat;
					event['detail'][0] = formatDate(event['detail'][0], inputDateFormat);
					event['detail'][1] = formatDate(event['detail'][1], inputDateFormat);
				}
				let filterToAdd;
				switch (actualType) {
					case 'range':
						filterToAdd = {
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: 'between',
							label: headerValue.getColumn().getDefinition()?.label,
							value: [event['detail'][0], event['detail'][1]],
							delegated: headerValue.getColumn().getDefinition()?.delegatedFilter
						};
						break;
					case 'equals':
						filterToAdd = {
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: '=',
							label: headerValue.getColumn().getDefinition()?.label,
							value: event['detail'][0],
							delegated: headerValue.getColumn().getDefinition()?.delegatedFilter
						};
						break;
					case 'from':
						filterToAdd = {
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: '>',
							label: headerValue.getColumn().getDefinition()?.label,
							value: event['detail'][0],
							delegated: headerValue.getColumn().getDefinition()?.delegatedFilter
						};

						break;
					case 'to':
						const value =
							event['detail'][1] !== null && event['detail'][1] !== undefined && event['detail'][1] !== ''
								? event['detail'][1]
								: event['detail'][0];
						filterToAdd = {
							fieldTitle: fieldTitle,
							field: actualColumn,
							type: '<',
							label: headerValue.getColumn().getDefinition()?.label,
							value: value,
							delegated: headerValue.getColumn().getDefinition()?.delegatedFilter
						};

						break;
					default:
						break;
				}

				if (!isEmpty(event['detail'])) {
					optimizedDataTable.addFilters(filterToAdd);
				}
			}
		});

		function formatDate(stringDate: string, inputFormat: string): string {
			let dateFrom: DateTime;
			let dateTo = '';
			if (!!stringDate) {
				dateFrom = DateTime.fromISO(stringDate);
				if (inputFormat.toLocaleLowerCase() === 'iso') {
					dateTo = dateFrom.toISO();
				} else {
					dateTo = dateFrom.toFormat(inputFormat);
				}
			}
			return dateTo;
		}
		container.appendChild(inputRange);
		filterContainer.appendChild(container);
	}

	return filter ? filterContainer : null;
};
