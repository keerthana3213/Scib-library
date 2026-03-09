export interface NotificationToaster extends NotificationsToasterItem {
	type: ToasterTypeEnum;
}

export interface NotificationsToasterItem {
	id: number;
	title: string;
	content: string;
	unread?: number;
	app?: AppEnum | string;
	users?: {
		from: { name: string };
		avatar?: {
			src: string;
			alt: string;
			text: string;
		};
	};
	isImportant?: boolean;
}

export enum AppEnum {
	VDR = 'vdr',
	SSI = 'ssi',
	IBOR = 'ibor',
	FRCOMMS = 'fr-comms',
	OTHER = 'other',
	GRAPHIO = 'graphio'
}

export enum ToasterTypeEnum {
	NOTIFICATION = 'Notification',
	MESSAGE = 'Message'
}

export interface User {
	id: number;
	created_at: Date;
	updated_at: Date;
	ldapUid: string;
	avatar: any;
	addressee: string;
	email: string;
	name: string;
	surname: string;
	is_employee: boolean;
	is_owner: boolean;
	is_offline: boolean;
	global_portal_email_notification: boolean;
	email_notifications_apps_blocked: null;
	deleted_at: null;
}
