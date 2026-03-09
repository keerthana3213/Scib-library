export interface MenuPanelItem {
	label: string;
	icon?: string;
	id?: string;
	disabled?: boolean;
	data: any;
}

export type MenuPanelItems = MenuPanelItem[];
