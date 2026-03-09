export interface ILiterals {
	[key: string]: any;
}

export interface Panel {
	title?: string;
	color?: string;
	backgroundColor?: string;
	status?: PanelStatus | string;
	icon?: string;
	description?: string;
	id?: string | number;
	step?: number;
	showClose?: boolean;
	action?: string;
}

export enum PanelStatus {
	INFO = 'info',
	WARNING = 'warning',
	ERROR = 'error',
	SUCCESS = 'success'
}
