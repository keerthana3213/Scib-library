export interface ICDKStatusContextLiterals {
	title: string;
	text: string;
	items: ICDKStatusContextData[];
}

export interface ICDKStatusContextData {
	title: string;
	text: string;
	status: CDKStatusTypeEnum;
}

export enum CDKStatusTypeEnum {
	PENDING = 'pending',
	PROGRESS = 'progress',
	REQUESTED = 'requested',
	DONE = 'done',
}
