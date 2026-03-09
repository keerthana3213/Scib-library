export interface IContent {
	[key: string]: any;
}

export type Items = Item[];

export interface Item {
	id: string;
	img: string;
	name: string;
}
