export interface ILiterals {
	subtitle: string;
	title: string;
	accessibleLoading: string;
	priorityTag?: string;
	totalItems?: string;
	textLabelSearchEngineInput?: string;
}
export interface ICDKActionMenu {
	hover: boolean;
	options: {
		id: number;
		text: string;
		separator: boolean;
		icon?: string;
		eventId: string;
	}[];
}

export enum EEventType {
	eventClick = 'event_click',
	setPriority = 'set_priority',
}

export interface IEventChangeTitleFilter {
	eventId: string;
	type?: string;
	index?: number;
}

export interface IOptionDetail {
	id: string;
	isChecked?: boolean;
	label: string;
	subLabel?: string;
	value: string;
}

export interface IEventActionMenuSelect {
	eventId: EEventType;
	id: string;
	index: number;
}
