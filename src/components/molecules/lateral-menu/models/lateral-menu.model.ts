import { Types } from '../../../../shared/models';

export interface ILiterals {
	[key: string]: any;
}

export interface MenuLiterals {
	hideMenu?: string;
	showMenu?: string;
	expandMenu?: string;
	collapseMenu?: string;
}

export enum MenuItemLevel {
	LEVEL_1 = 1,
	LEVEL_2 = 2,
	LEVEL_3 = 3
}

export enum MenuItemPadding {
	LEVEL_1 = '0px',
	LEVEL_2 = '8px',
	LEVEL_3 = '16px'
}

export type Items = Item[];

export interface Item {
	id: string;
	text: string;
	icon?: string;
	iconActivate?: string;
	subtext?: string;
	level?: number;
	isTitle?: boolean;
	hasChevron?: boolean;
	isExpanded?: boolean;
	// Tag properties
	tag?: {
		text: string;
		type?: Types;
		customColor?: string;
	};
	// Notification bullet (simple red dot)
	notification?: boolean;
}
