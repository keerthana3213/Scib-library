export interface ILiterals {
	[key: string]: any;
}

export interface ICDKPhishingSource {
	publicWebUrl: string;
	contactUrl: string;
	login: string;
}

export interface ICDKCaptcha {
	sitekey: string;
	displayCaptcha: boolean;
	validateCaptcha: boolean;
}
