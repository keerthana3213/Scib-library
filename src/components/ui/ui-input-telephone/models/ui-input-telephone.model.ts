import { CountryCode } from 'libphonenumber-js';
export interface IUIInputOption {
	value: string;
	name: string;
	secondary?: string;
	[key: string]: any;
	isSelected?: boolean;
}

export interface Literals {
	format: string;
	required: string;
	requiredCountry: string;
}

export type ErrorType = 'format' | 'required' | 'requiredCountry';
export type Languages = 'es-ES' | 'en-GB';
export interface CountryData {
	id: CountryCode;
	label: string;
	value: CountryCode;
	country: string;
	prefix: string;
}
