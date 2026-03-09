import { Types } from '../../../../components';

export interface HierarchyConfig {
	activeMenu?: boolean;
	columnOptions?: ColumnOptionConfig[];
}
export interface ColumnOptionConfig {
	idField: string;
	key_title: string;
	tagParams?: TagParams;
	width?: number;
}
interface TagParams {
	type?: Types;
}
export interface MenuPanelOptions {
	label: string;
	icon: string;
	id: string;
	key_label: string;
	data: any;
}
