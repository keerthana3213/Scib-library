export interface ICDKLoginFormLiterals {
	mainTitle: string;
	publicWeb: string;
	emailLabel: string;
	emailPlaceholder: string;
	passLabel: string;
	passPlaceholder: string;
	login: string;
	forgotpass: string;
	contact: string;
	textError: string;
}

export interface ICDKLoginFormLinks {
	publicWebUrl: string;
	forgotPassUrl: string;
	contactUrl: string;
}

export interface ICDKCaptcha {
	sitekey: string;
	displayCaptcha: boolean;
	validateCaptcha: boolean;
}

export interface IDataEmailEvent {
	name: string;
	required: boolean;
	stepPosition: string;
	value: string;
}

export interface IDataPasswordEvent {
	name: string;
	required: boolean;
	stepPosition: string;
	value: string;
}
