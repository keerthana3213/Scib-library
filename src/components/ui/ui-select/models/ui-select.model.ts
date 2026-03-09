export interface IUISelectOption {
	id?: string;
	value: string;
	secondary?: string;
	name: string;
	isSelected?: boolean;
	[key: string]: any;
}
