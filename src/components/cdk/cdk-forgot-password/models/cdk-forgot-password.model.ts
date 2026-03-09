export interface ICDKForgotPasswordLiterals {
	mainTitle: string;
	publicWeb: string;
	emailLabel: string;
	emailPlaceholder: string;
	login: string;
	contact: string;
	textError: string;
	cancel: string;
	paragraph: string;
	sendEmailparagraph: string;
	done: string;
}

export interface ICDKForgotPasswordProps {
	publicWebUrl: string;
	contactUrl: string;
	postUrl: string;
	errorUrl: string;
	okUrl: string;
	sendEmailOk: boolean;
}

export interface ICDKForgotPasswordError {
	textError: string;
}

export interface ICDKCaptcha {
	sitekey: string;
	displayCaptcha: boolean;
	validatedCaptcha: boolean;
}
