export interface ILiterals {
	[key: string]: any;
}

export interface HeaderIcon {
	/** Displays an icon at the end of the header */
	active: boolean;
	/** Icon displayed at the end of the header */
	icon: string;
	/** Color for icon displayed at the end of the header */
	color?: string;
}
