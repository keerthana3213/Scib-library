import { MDCTextField } from '@material/textfield';
import { AirDatepickerOptions } from 'air-datepicker';
import AutoNumeric from 'autonumeric';
import { CustomDatePickerConfig, DatePickerLanguages, DisabledDatesConfig } from '../../../ui-v2/ui-v2-date-picker/models/ui-v2-date-picker.model';

export type InputMode = 'range' | 'equals' | 'from' | 'to';

export enum RangeTypes {
	RANGE = 'range',
	EQUALS = 'equals',
	FROM = 'from',
	TO = 'to'
}

export const NumberRangeTypes = ['range', 'equals', 'from', 'to'];

export enum InputTypes {
	AMOUNT = 'amount',
	DATE = 'date'
}

export interface SelectOption {
	id: string | number;
	value: string;
	label: string;
}

export type SelectOptions = SelectOption[];

export interface IValueRange {
	type: string;
	valueFrom: string;
	valueTo: string;
}

export class ValueChangeAmount implements IValueRange {
	type: string = '';
	valueFrom: string = '';
	valueTo: string = '';
}

export class MetaDataInput {
	autoNumericInstance: AutoNumeric;
	textFieldRef: MDCTextField;
	inputRef: HTMLInputElement;
}

export interface RangeInputConfig {
	prefix?: string;
	datePickerConfig?: Partial<AirDatepickerOptions> & CustomDatePickerConfig;
	amountInputConfig?: object;
	disabledDates?: Partial<DisabledDatesConfig>;
	locale?: string;
	language?: DatePickerLanguages;
	max?: string;
	min?: string;
	firstDay?: number;
	dateFormat?: string;
}

export type InputRangeValue = string | string[];
