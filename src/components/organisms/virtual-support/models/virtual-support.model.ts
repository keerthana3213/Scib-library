export interface ILiterals {
	title: 'Virtual Support';
}

export interface MessageI {
	id: string;
	message: string | any[];
	actionType?: string | string[] | '';
}
export interface ButtonsI {
	id: string;
	text: string;
	actionType?: string;
}

export interface BreadcrumbsI {
	id: string;
	text: string;
	actionType?: string;
}

export interface CardInfoI {
	id: string;
	title?: string;
	info?: string;
	icon?: string;
	contact?: string;
	button?: string;
	actionType?: string;
}
