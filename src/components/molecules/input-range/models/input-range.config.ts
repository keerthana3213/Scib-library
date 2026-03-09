import { RangeInputConfig, RangeTypes } from './input-range.model';
import { toString } from 'lodash';

export const MENU_RANGE_AMOUNTS_OPTIONS_CONFIG = [
	{ id: 2, value: toString(RangeTypes.EQUALS), label: 'Equals' },
	{ id: 1, value: toString(RangeTypes.RANGE), label: 'Range' },
	{ id: 3, value: toString(RangeTypes.FROM), label: 'From' },
	{ id: 4, value: toString(RangeTypes.TO), label: 'To' }
];

export const DEFAULT_NUMBER_INPUT_CONFIG = {
	alwaysAllowDecimalCharacter: true,
	failOnUnknownOption: false,
	digitGroupSeparator: ',',
	formatOnPageLoad: true,
	decimalCharacter: '.',
	showWarnings: false
};

export const SHOW_ONLY_ONE_INPUT: string[] = [RangeTypes.EQUALS, RangeTypes.FROM, RangeTypes.TO];

export const DEFAULT_RANGE_INPUT_CONFIG: RangeInputConfig = {
	prefix: 'to',
	language: 'es',
	locale: 'es-ES',
	amountInputConfig: DEFAULT_NUMBER_INPUT_CONFIG,
	disabledDates: {},
	datePickerConfig: {
		autoClose: true
	}
};
