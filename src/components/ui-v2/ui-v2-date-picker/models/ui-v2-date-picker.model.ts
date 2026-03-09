import localeEs from 'air-datepicker/locale/es';
import localeEn from 'air-datepicker/locale/en';
import localeDe from 'air-datepicker/locale/de';
import localeFR from 'air-datepicker/locale/fr';
import localeIt from 'air-datepicker/locale/it';
import localePl from 'air-datepicker/locale/pl';
import localePt from 'air-datepicker/locale/pt';
import localeZh from 'air-datepicker/locale/zh';
import AirDatepicker, { AirDatepickerOptions, AirDatepickerViewsSingle } from 'air-datepicker';

export type DatePickerLanguages = 'en' | 'es' | 'de' | 'fr' | 'it' | 'pl' | 'pt' | 'zh';

export type TypeDate = string | number | Date;

export const languages = {
	es: localeEs,
	en: localeEn,
	de: localeDe,
	fr: localeFR,
	it: localeIt,
	pl: localePl,
	pt: localePt,
	zh: localeZh
};

export const defaultConfig: Partial<AirDatepickerOptions> = {
	disableNavWhenOutOfRange: true,
	autoClose: true
};

export enum Days {
	MONDAY = 1,
	TUESDAY,
	WEDNESDAY,
	THURSDAY,
	FRIDAY,
	SATURDAY,
	SUNDAY
}

export interface RangeDatePickerValue {
	dateFrom: string;
	dateTo: string;
}

export class ValueChangeDate implements RangeDatePickerValue {
	dateFrom: string = '';
	dateTo: string = '';
}

export const LOCALE_FORMATS = {
	'en-GB': 'dd/MM/yyyy',
	'en-US': 'MM/dd/yyyy',
	'es-ES': 'dd/MM/yyyy'
};

export interface DatePickerCell {
	date: Date;
	cellType: AirDatepickerViewsSingle;
	datepicker: AirDatepicker<HTMLInputElement>;
}

export interface CellConfig {
	html?: string;
	classes?: string;
	disabled?: boolean;
	attrs?: { [key: string]: number | string | undefined };
}

export interface CustomDatePickerConfig {
	borderless?: boolean;
}

export interface DisabledDatesConfig {
	weekends: boolean;
	dates: string[];
}

export type InputRangeValue = string | string[];
