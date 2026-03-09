export interface MenuPanelMultiselectItem {
	label: string;
	checked: boolean;
	submenuIcon?: string;
	submenuItems?: SubmenuItem[];
	id?: string | number;
}

export interface SubmenuItem {
	label: string;
	checked: boolean;
	id?: string | number;
	submenuIcon?: string;
	groupLabel?: string;
	submenuItems?: SubmenuItem[];
}

/*
 * PrivateMenuPanelMultiselectItem Only for privated methods
 */
export interface PrivateMenuPanelMultiselectItem extends MenuPanelMultiselectItem {
	_id?: number;
	_parentId?: number;
	_level?: number;
	submenuItems?: PrivateSubmenuItem[];
}

/*
 * PrivateSubmenuItem Only for privated methods
 */
export interface PrivateSubmenuItem extends SubmenuItem {
	_id?: number;
	_parentId?: number;
	_level?: number;
}

export interface SelectedOptionsDTO {
	updatedItemList: MenuPanelMultiselectItem[];
	lastSelectedItem: MenuPanelMultiselectItem;
}

export interface DataOnClickDTO {
	element: string;
	accessKey: string;
}

export type MenuPanelMultiselectItems = MenuPanelMultiselectItem[];
/*
 * PrivateMenuPanelMultiselectItems Only for privated methods
 */
export type PrivateMenuPanelMultiselectItems = PrivateMenuPanelMultiselectItem[];
export type OpenSubmenuOnType = 'click' | 'hover';
