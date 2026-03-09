/** Modelo de una notificación */
export interface ICDKNotificationAreaProfile {
	/** Nombre del usuario */
	name: string;
	/** Apellido del usuario */
	surname: string;
	/** Mensaje de saludo (Ej: '') */
	greetingTxt: string;
	/** Mensaje de bienvenida (Ej: 'What´s new today?') */
	welcomeTxt: string;
	/** Url del avatar (sea bien la foto del user o la ilustración) */
	avatarPhotoSrc: string;
	/** Url del avatar (sea bien la foto del user o la ilustración) */
	avatarPictureSrc: string;
}

/** Modelo de una notificación */
export interface ICDKNotificationAreaLiterals {
	/** Admite cualquier clave/valor. El nombre de la clave se reflejará con un fallback en la maqueta entre corchetes [[]] */
	[key: string]: string;
	notificationsLabel: string;
	closeTxt: string;
	deleteTxt: string;
	cancelTxt: string;
	emptyTxt: string;
	clearAllTxt: string;
	clearTxt: string;
	moreText: string;
}

/** Modelo de una notificación */
export interface ICDKNotificationAreaItem {
	[key: string]: any;
	/** Id único para la notifcación */
	id: string;
	/** Tipo de la notificación, define el icono con el que se mostrará en el front (Ej: 'app') */
	type: ECDKNotificationAreaItemType;
	/** Literal asociado al tipo de notificación (Ej: 'SSIs') */
	typeTxt: string;
	/** Asunto (título) de la tarjeta de notificación (Ej: 'Correos Contract Agreement') */
	subject: string;
	/** Texto de previsualización de la notificación (Ej: 'New contract to sign off in your Document Area') */
	preview: string;
	/** Fecha, hora o momento temporal a mostrar en la tarjeta (Ej: '59 min ago', '09:23', 'Sunday, 06 June 2020' ) */
	date: string;
	/** Texto de cabecera del grupo de fecha a mostrar (Ej: 'Yesterday', 'Last week', 'Last month'....) */
	dateGroupTxt: string;
	/** Número de notificaciones a mostrar en el caso de que hay más que una */
	notificationNumber?: number;
}

/** Tipos de notificación (afecta al icono con el que se mostrará) */
export enum ECDKNotificationAreaItemType {
	'message' = 'message',
	'files' = 'files',
	'app' = 'app',
	'alert' = 'alert',
}

/** Modelo devuelto en el detail del CustomEvent del bus de eventos del componente */
export interface ICDKNotificationAreaUserAction {
	/** Tipo de evento */
	type?: ECDKNotificationAreaUserActions;
	/** Carga del evento. El tipado depende del type (ver ECDKNotificationAreaUserActions) */
	payload?: any;
}

/** Acciones devueltas en el bus de eventos del "scib-cdk-notification-area" */
export enum ECDKNotificationAreaUserActions {
	/** Se lanza cuando el usuario abre el area de notificaciones @payload null */
	'areaOpened' = 'areaOpened',
	/** Se lanza cuando el usuario cierra el area de notificaciones @payload null */
	'areaClosed' = 'areaClosed',
	/** Se lanza cuando el usuario alcanza el scroll completo (infinite scroll) para solicitar la siguiente tanda de la paginación @payload null */
	'requestMoreNotifications' = 'requestMoreNotifications',
	/** Se lanza cuando el usuario confirma el borrado de notificaciones @payload null */
	'clearNotifications' = 'clearNotifications',
	/** Se lanza cuando el usuario hace click en una notificación @payload id */
	'clickNotification' = 'clickNotification',
	/** Se lanza cuando el usuario cambia una nueva imagen de avatar @payload ICDKNotificationAreaItem */
	'changeAvatar' = 'changeAvatar',
	// /** Se lanza cuando el usuario solicita las notificaciones hijas de una notificación @payload id */
	// 'requestChildren' = 'requestChildren',
}

// Modelos privados
export type _ICDKNotificationAreaDroppablePositions = { x: 'left' | 'right'; y: 'top' | 'bottom' };
