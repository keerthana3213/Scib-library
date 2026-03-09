export interface IUIInputOption {
	value: string;
	name: string;
	secondary?: string;
	[key: string]: any;
	isSelected?: boolean;
}

export enum tooltipPosition {
	top = 'top',
	right = 'right',
	bottom = 'bottom',
	left = 'left',
}
