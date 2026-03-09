export interface ILiterals {
	[key: string]: any;
}

export type Arrow = 'left' | 'right' | 'top' | 'bottom' | 'top-right';
export type Visibility = 'visible' | 'hidden';
export type Size = 's' | 'm' | 'l';
export type DisableReposition = { horizontal?: boolean; vertical?: boolean };
