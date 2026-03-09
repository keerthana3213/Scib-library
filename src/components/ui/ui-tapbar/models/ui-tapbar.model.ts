export interface IUITapbarTap {
	id: string;
	icon: string;
	name: string;
	disabled?: boolean;
	haveNotifications?: boolean;
	notifications?: string;
	actionMenu?: Array<any>;
}
