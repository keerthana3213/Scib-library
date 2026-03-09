export interface ILiterals {
	[key: string]: any;
}

export interface ButtonIcon {
	icon: string;
	position: 'trailing' | 'leading';
}
export type ButtonLevel = 'primary' | 'secondary' | 'tertiary';

export interface ButtonObject {
	level: ButtonLevel;
	text: string;
	iconOptions?: ButtonIcon;
	event: string;
}
