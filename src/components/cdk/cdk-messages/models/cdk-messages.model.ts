import { IUIAvatarImage } from '../../../ui/ui-avatar/models/ui-avatar.model';
import { IUITableLiterals } from '../../../ui/ui-table/models/ui-table.model';
import { ICDKListMembersTooltip } from '../../cdk-members-tooltip/models/cdk-members-tooltip.model';

/** Acciones devueltas en el bus de eventos */
export enum ECDKMessagesUserActions {
	/** nueva conversación abierta por el usuario @payload id de la conversación (string) */
	'openConversation' = 'openConversation',
	/** creación de conversación @payload ICDKMessagesNewMsg */
	'newConversation' = 'newConversation',
	/** Notifica de que el usuario ha abierto la vista de nuevo mensaje */
	'openNewConversation' = 'openNewConversation',
	/** Evento disparado cuando el usuario termina de escribir sobre el campo de búsqueda de mensajes @payload string introducida por el usuario */
	'searchByMessages' = 'searchByMessages',
	/** Evento disparado cuando el usuario termina de escribir sobre el campo de "Para" de nuevo mensaje @payload string introducida por el usuario */
	'searchByUsers' = 'searchByUsers',
	/** Evento disparado al responder a un mensaje @payload ICDKMessagesReply */
	'replyConversation' = 'replyConversation',
	/** Evento disparado al cerrar el panel de mensajes en mobile @payload undefined */
	'closeCommunicationsPanel' = 'closeCommunicationsPanel',
	/** Evento disparado al marcar como no leída una conversación @payload ICDKMessagesToggleUnreadPayload */
	'markAsUnread' = 'markAsUnread',
	/** Evento disparado al eliminar la conversación en curso @payload id de de la conversación (string) */
	'deleteConversation' = 'deleteConversation',
	/** Evento disparado al adjuntar un documento a una reply o un mensaje @payload ICDKMessagesAttachFilePayload */
	'attachFile' = 'attachFile',
	/** Evento disparado reintentar un documento que ha fallado previamente (tiene error) @payload ICDKMessagesFile */
	'retryFile' = 'retryFile',
	/** Evento disparado cancelar un documento en su subida @payload ICDKMessagesFile */
	'cancelFile' = 'cancelFile',
	/** Evento disparado al descartar una reply o un new message @payload id de de la conversación (string) o "newConversation" provisionalmente */
	'discardSend' = 'discardSend',
	/** Evento disparado cambiar el buzón @payload id del buzón  */
	'mailBoxChange' = 'mailBoxChange',
	/** Descargar conversación abierta por el usuario @payload id de la conversación (string) */
	'downloadConversation' = 'downloadConversation',
	/** Enviar por email conversación abierta por el usuario @payload id de la conversación (string) */
	'sendConversationEmail' = 'sendConversationEmail',
	/** Failed to download attachment file */
	'failedDownloadAttachmentFile' = 'failedDownloadAttachmentFile'
}

export interface ICDKMessagesMsg {
	/** Autor */
	author: {
		name: string;
		avatar: IUIAvatarImage;
		isEmployee?: boolean;
	};
	/** Fecha de envío del mensaje */
	date: string;
	/** Si el mensaje corresponde al usuario */
	sender: boolean;
	/** Marcador como no leído. Sólo cuando el mensaje NO es del usuario */
	unread?: boolean;
	/** Cuerpo de mensaje (En HTML string) */
	message: string;
	/** Ficheros adjuntos en el mensaje, en caso de existir */
	attachedFiles?: ICDKMessagesFile[];

	isLastMessage?: boolean;

	readByMembers?: ICDKListMembersTooltip[];

	isFromEmail?: boolean;
}

/** Modelo de una conversación */
export interface ICDKMessagesConversation {
	/** Id de la conversación */
	id: string;
	/** Grupo de la conversación */
	group: string;
	/** Notificaciónes a mostrar en el globo del avatar */
	notifications?: any;
	/** Marcar en color rojo (no leído) */
	unread?: boolean;
	/** Marcar como "importante" */
	important?: boolean;
	/** Deshabilita las respuestas para la conversación */
	repliesNotAllowed?: true;
	/** Fecha de la conversación */
	date: string;
	/** Listado de avatares a mostrar */
	avatar: IUIAvatarImage[];
	/** Asunto */
	subject: string;
	/** Subtítulo */
	subtitle: string;
	/** Previsualización */
	preview: string;
	closed?: boolean;
}

/** Modelo para los buzones de filtrado */
export interface ICDKMessagesMailboxes {
	/** Id del buzón, debe ser único */
	id: string;
	/** Icono del buzón, debe ser único */
	icon: string;
	/** Nombre (copy) del buzón */
	name: string;
}

/** Modelo de los mensajes de una conversación */
export interface ICDKMessagesNewMsg {
	/** Asunto del mensaje  */
	subject: string;
	/** Email del destinatario */
	to: string;
	userData: ICDKMessagesToUserList[];
	/** Cuerpo del mensaje */
	body: string;
	/** El usuario ha deshabilitado respuestas para esta conversación */
	disableReplies: boolean;
	/** Marcar como "importante" la conversación */
	markAsImportant: boolean;
}

/** Modelo de details del userAction */
export interface ICDKMessagesUserAction {
	type?: ECDKMessagesUserActions;
	/** Carga del evento */
	payload?: any;
}

/** Modelo para los literales del componente */
export interface ICDKMessagesLiterals {
	titleTxt: string;
	subtitleTxt: string;
	filterPlaceholderTxt: string;
	tab1Label: string;
	tab2Label: string;
	tab3Label: string;
	repliesTxt: string;
	bodyPlaceholderTxt: string;
	unreadFlagTxt: string;
	sendButtonTxt: string;
	discardButtonTxt: string;
	replyButtonTxt: string;
	deleteButtonTxt: string;
	newMessageTxt: string;
	toLabelTxT: string;
	subjectLabelTxt: string;
	newMessagePlaceholderTxt: string;
	disableRepliesLabelTxt: string;
	markImportantRepliesLabelTxt: string;
	contactsLabelTxt: string;
	emptyMsgTitleTxt: string;
	emptyMsgSubtitleTxt: string;
	attachDocumentsTxt: string;
	attachFileTxt: string;
	maxLimitMsgTxt: string;
	theFileTxt: string;
	didntUploadTxt: string;
	closedTagTxt?: string;
	downloadConversation?: string;
	sendConversation?: string;
	chatLabel?: string;
	memberLabel?: string;
	myInbox?: string;
	appInbox?: string;
	tooltipLiterals: {
		unreadTxt?: string;
		titleTxt?: string;
		membersTxt?: string;
	};
	fromEmailTxt?: string;
	emptyConversationText?: string;
	conversationNoSelectedText?: string;
	conversationNoSelectedSubText?: string;
	closeBtnTxt?: string;
	warnDialogTxt?: string;
	warnDialogSubTxt?: string;
}

/** Modelo para el payload del evento de respuesta a un mensaje */
export interface ICDKMessagesReply {
	/** Id de la conversación activa en la que el usuario responde */
	conversationId: string;
	/** Cuerpo de mensaje en HTML string */
	body: string;
}

/** Listado a mostrar en el autocompletar del "To" en la creación de un nuevo mensaje */
export interface ICDKMessagesToUserList {
	/** Identificador del usuario @unique */
	id: string;
	/** Email completo del usuario */
	email?: string;
	/** Nombre completo del usuario */
	name: string;
	/** Avatar a mostrar */
	avatar: IUIAvatarImage;
	/** Indica si el usuario es empleado */
	isEmployee?: boolean;
}

export interface ICDKMessagesToggleUnreadPayload {
	id: string;
	unread: boolean;
}

/**
 * Documentos adjuntos
 */

/** Interfaz que establece los documentos que actualmente se muestra en la edición de reply/send
 * @link https://invis.io/XNXEIK1C9D7#/418769843_Platform_VDR_1400_Messages12_Copy_3
 */
export interface ICDKMessagesAttachedSendList {
	/** Por cada conversación, se establece un listado de documentos que el usuario tiene almacenados en la reply para mantenerlos en caso de que cambie de conversación */
	[conversationId: string]: ICDKMessagesFile[];

	/** Conversación en la que ha sido subido, en caso de ser una reply
	 * @provisional Hasta la implementación de los draft, enviará 'newConversation' en caso de hacerse el attach en un "new message", posteriormente enviará el identificador del draft
	 */
	newConversation?: ICDKMessagesFile[];
}

/** Modelo para un fichero */
export interface ICDKMessagesFile {
	/** Nombre del fichero (extensión incluída) */
	name: string;
	/** Extensión */
	extension: ECDKMessagesFileAvailableExtensions;
	/** Tamaño del archivo */
	size: string;
	/** Ruta del fichero */
	path?: string;
	/** Establece el fichero en estado "uploading" si no se ha subido */
	uploading?: boolean;
	/** Mensaje de error tipo "try again" para intentar relanzar el fichero al backend */
	error?: string;
	/** Id de la conversación donde está insertado el fichero (para propósitos ) */
	conversationId?: string;

	/** Datos adicionales para poder manejar identificadores o lo que se plazca */
	[key: string]: any;
}

/** Payload del evento de hacer un "attach" de un fichero a un mensaje o reply */
export interface ICDKMessagesAttachFilePayload {
	/** Fichero subido por el usuario en "File" */
	file: File;
	/** Conversación en la que ha sido subido, en caso de ser una reply
	 * @provisional Hasta la implementación de los draft, enviará 'newConversation' en caso de hacerse el attach en un "new message", posteriormente enviará el identificador del draft
	 */
	conversationId: string | 'newConversation';
}

/** Extensiones permitidas en la subida de documentos */
export enum ECDKMessagesFileAvailableExtensions {
	'pdf' = 'pdf',
	'xls' = 'xls',
	'jpg' = 'jpg'
	//...
}

/** Tabs del encabezado de los mensajes */
export interface ICDKChatTab {
	/** identificador único para la tab */
	id: ECDKChatTabIds;
	/** Literal a mostrar */
	label: string;
}

/** Tabs for archived and active conversations */
export interface ICDKConversationTab {
	/** identificador único para la tab */
	id: string;
	/** Literal a mostrar */
	label: string;
}

export enum ECDKChatTabIds {
	'MSG' = 'MSG',
	'FIL' = 'FIL',
	'USER' = 'USER'
}

export interface ICDKFilesChat {
	/** ID de la tabla */
	tableId: string;
	/** Indica si los datos de la tabla de archivos son descargables */
	isDownloadable?: boolean;
	/** Indica si los campos de la tabla son editables */
	isEditable?: boolean;
	/** Indica si las filas de la tabla son seleccionables */
	isSelectable?: boolean;
	/** Indica si las columnas de la tabla son dragables */
	isDraggable?: boolean;
	/** Indica el número de elemetos necesarios para la paginación de la tabla */
	paginationPageSize?: number;
	/** Datos de los ficheros */
	data: Array<object>;
	/** Datos de las columnas de la tabla */
	columns: Array<object>;
	/** Literales de la tabla */
	literals: IUITableLiterals;
	/** Indica si se quiere mostrar en la primera columna los iconos de los ficheros */
	hasRenderedIcons?: boolean;
	/** Muestra los botones superiores de la tabla */
	topButtons: any;
	/** Indica si se activa el scroll horizontal */
	activateHorizontalScroll?: number;
	/** Indica si se oculta el botón de mostrar 10, 20 o 30 resultados */
	hideCustomPagination?: boolean;
}

export interface ICDKMessagesDefault {
	/** Datos del usuario por defecto */
	toUser: {
		id: string;
		name: string;
		email?: string;
		isSelected: boolean;
		avatar: {
			src: string;
			alt: string;
		};
	};
	/** Mensaje para el titulo del mensaje por defecto */
	subject: string;
	/** Indica si se quiere deshabilitar la opción de que el usuario modifique los campos por defecto */
	disableEdit: boolean;
}
export interface ICDKMembersChat {
	/** ID de la tabla */
	tableId: string;
	/** Indica si los datos de la tabla de archivos son descargables */
	isDownloadable?: boolean;
	/** Indica si los campos de la tabla son editables */
	isEditable?: boolean;
	/** Indica si las filas de la tabla son seleccionables */
	isSelectable?: boolean;
	/** Indica si las columnas de la tabla son dragables */
	isDraggable?: boolean;
	/** Indica el número de elemetos necesarios para la paginación de la tabla */
	paginationPageSize?: number;
	/** Datos de los ficheros */
	data: Array<object>;
	/** Datos de las columnas de la tabla */
	columns: Array<object>;
	/** Literales de la tabla */
	literals: IUITableLiterals;
	/** Indica si se quiere mostrar en la primera columna los iconos de los ficheros */
	hasRenderedIcons?: boolean;
	/** Muestra los botones superiores de la tabla */
	topButtons: any;
	/** Avatares de miembros */
	avatars?: Array<object>;
	/** Indica si se activa el scroll horizontal */
	activateHorizontalScroll?: number;
	/** Indica si se oculta el botón de mostrar 10, 20 o 30 resultados */
	hideCustomPagination?: boolean;
}
