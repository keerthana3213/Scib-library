import { SizeTypes } from './../../../../shared/models';
export interface Option {
	value: string;
	label?: string;
	icon?: string;
}

export interface InternalOption extends Option {
	id: number;
}

export type SegmentedControlSizeTypes = 'm' | 's';
