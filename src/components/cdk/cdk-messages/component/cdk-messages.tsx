import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import { assetUrl } from '../../../../utils/helpers/common';
import { CDKMsgReplySkeleton } from '../../cdk-messages-chat/fragments/cdk-messages-chat-reply.skeleton';
import { errorSubheaderInterface } from '../../cdk-messages-chat/models/cdk-messages-chat.model';
import { CDKSidebarCommunicationsProfileBar } from '../../cdk-sidebar-communications/fragments/cdk-sidebar-communications-profile-bar.fragment';
import { ICDKSidecommProfile } from '../../cdk-sidebar-communications/models/cdk-sidebar-communications.model';
import { CDKMessagesConversationsHeader } from '../fragments/cdk-messages-conversations-header.fragment';
import { CDKMessagesConversationsItemSkeleton } from '../fragments/cdk-messages-conversations-item-skeleton.fragment';
import { CDKMessagesConversationsItem } from '../fragments/cdk-messages-conversations-item.fragment';
import {
	ECDKMessagesUserActions,
	ICDKChatTab,
	ICDKConversationTab,
	ICDKFilesChat,
	ICDKMembersChat,
	ICDKMessagesAttachedSendList,
	ICDKMessagesConversation,
	ICDKMessagesDefault,
	ICDKMessagesLiterals,
	ICDKMessagesMailboxes,
	ICDKMessagesMsg,
	ICDKMessagesNewMsg,
	ICDKMessagesToUserList,
	ICDKMessagesUserAction
} from '../models/cdk-messages.model';
import { VaadinAccordionAppTheme } from './cdk-accordion.vaadin.override';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-messages',
	styleUrl: 'cdk-messages.scss',
	shadow: false,
	scoped: true
})
export class CDKMessages {
	$scrollContainer!: HTMLElement;

	/** Control props for infinite scroll conversations */
	_loadingNewConversations: boolean = false;
	oldHeightScroll: any;
	oldHeightTotal: any;
	newHeightTotal: any;
	oldTopScroll: any = 0;
	@State() _showSkeletonTop: boolean;
	@State() _showSkeletonBottom: boolean;
	@State() _isMobile: boolean;

	/** Control prop for empty conversations */
	enableSendMessage: boolean = false;
	conversationsSkeleton: any;

	/** Total de mensajes no leídos por el usuario del título" */
	@Prop({ mutable: true, reflect: true }) unreadMsg: string;

	/** Default value for search input */
	@Prop() searchInputDefault: string;

	/** Default tab active for apps conversations */
	@Prop() activeTabApps: string;

	/** Id de la conversación activa */
	@Prop({ mutable: true, reflect: true }) activeConversationId: string;

	@Watch('activeConversationId') activeConversationIdChanges(newId: string) {
		// if (newId) {
		// 	this.detailPanelActive = 'message';
		// }
		this.setActiveConversationDetails(newId);
		if (newId) {
			this.userAction.emit({
				type: ECDKMessagesUserActions.openConversation,
				payload: newId
			});
		}
	}

	/** Id del borrador activo */
	@Prop({ mutable: true, reflect: true }) activeDraftId: string | null = null;

	/** Literales a localizar del componente */
	@Prop({ mutable: true, reflect: true }) literals: { [key: string]: any } | string;

	@Watch('literals') parseLiterals(newLiterals: string | any) {
		try {
			this._literals = JSON.parse(newLiterals || '{}');
			this._emptyLiterals = JSON.stringify({
				title: this._literals.emptyMsgTitleTxt || 'Not any messages here!',
				imgSrc: assetUrl('/assets/images/i-laptop-coffee-messages.svg')
			});
		} catch (e) {
			console.error(e);
		}
	}

	@State() _emptyLiterals: string;

	/** Buzones para las conversaciones */
	@Prop({ mutable: true, reflect: true }) mailBoxes: string;

	@Watch('mailBoxes') parseMailBoxes(newValue: string) {
		try {
			this._mailBoxes = JSON.parse(newValue || '[]');
		} catch (e) {
			console.error(e);
		}
	}

	/** Buzón activo para las conversaciones */
	@Prop({ mutable: true, reflect: true }) activeMailBox: string;

	/** Mostrar botón de nueva conversación */
	@Prop({ mutable: true, reflect: true }) showNewButton: boolean = true;

	/** Listado de usuarios para "New" */
	@Prop({ mutable: true, reflect: true }) toUserList: { [key: string]: any } | string;

	@Watch('toUserList') parseUserList(newValue: string | any) {
		try {
			this._toUserList = JSON.parse(newValue);
		} catch (e) {
			console.error(e);
		}
	}

	/** Listado de grupos @todo */
	@Prop({ mutable: true, reflect: true }) groups: string;

	@Watch('groups') parseGroups(newGroups: string) {
		try {
			this._groups = JSON.parse(newGroups || '{}');
		} catch (e) {
			console.error(e);
		}
		this.triggerAnimations();
	}

	/** max conversation rendered */
	@Prop({ mutable: true, reflect: true }) maxConversationRendered: number = -1;

	/** Conversaciones */
	@Prop({ mutable: true, reflect: true }) conversations: { [key: string]: any } | string;

	@Watch('conversations') parseConversations(newConversations: string | any) {
		try {
			this._conversations = JSON.parse(newConversations || '[]');
			this.conversationsSkeleton = JSON.parse(newConversations || null);
		} catch (e) {
			console.error(e);
		}

		this._loadingNewConversations = false;
		this._showSkeletonBottom = false;
		this._showSkeletonTop = false;

		// if (this._showSkeletonTop) {
		// 	this._showSkeletonTop = false;
		// 	this.newHeightTotal = this.$scrollContainer.scrollHeight;
		// 	this.$scrollContainer.scrollTo({
		// 		top: this.newHeightTotal - (this.oldHeightTotal - this.oldHeightScroll),
		// 	});
		// }
		// this._loadingNewConversations = false;

		// if (this._showSkeletonBottom) {
		// 	this._showSkeletonBottom = false;
		// 	this.$scrollContainer.scrollTo({
		// 		top: this.oldHeightScroll
		// 		// top: this.oldHeightScroll - this.$scrollContainer.clientHeight
		// 	});
		// }

		// Si está "new message" en loading, cierra la ventana y termina el loading
		if (this._loadingSendMessage) {
			this.handleCloseNewMessage();
			this.resetForm = true;
			this._loadingSendMessage = false;
		}
	}

	/** Documentos adjuntos @type ICDKMessagesAttachedSendList stringied */
	@Prop({ mutable: true, reflect: true }) attachedFilesSendList: string;

	@Watch('attachedFilesSendList') parseAttachedFilesSendList(newVal: string) {
		try {
			this._attachedSendList = JSON.parse(newVal || '{}');
		} catch (e) {
			console.error(e);
		}
	}

	/** Mensajes */
	@Prop({ mutable: true, reflect: true }) messages: { [key: string]: any } | string;

	@Watch('messages') parseMessages(newMessages: string | null | any) {
		try {
			this._messages = newMessages === null ? null : JSON.parse(newMessages || '[]');
			if (this._messages) {
				this._lastMessage = this._messages.find((msg) => msg.isLastMessage);
			}
		} catch (e) {
			console.error(e);
		}
	}
	@State() _lastMessage: ICDKMessagesMsg;

	/** Panel activo */
	@Prop({ mutable: true, reflect: true }) detailPanelActive: 'apps' | 'message' | 'new' | 'readByTooltip' = 'message';

	@Watch('detailPanelActive') detailPanelActiveChange(newVal: 'apps' | 'message' | 'new' | 'readByTooltip') {
		if (newVal === 'new') {
			this.activeConversationId = null;
		}
		// if (newVal === 'message' && this._conversations) {
		// 	this.activeConversationId = this._conversations[0]?.id;
		// }
	}

	/** Establece qué panel debe estar activo en mobile */
	@Prop({ mutable: true, reflect: true }) mobilePanelActive: 'main' | 'detail' = 'main';

	@Watch('mobilePanelActive') toggleBottomBarMobile(newVal: 'main' | 'detail') {
		const sidebar = (document.querySelector('scib-cdk-sidebar-communications') as HTMLElement) || document.createElement('div');
		if (sidebar) {
			newVal === 'detail' ? sidebar.setAttribute('hide-bar-on-mobile', 'true') : sidebar.removeAttribute('hide-bar-on-mobile');
		} else {
			console.error('scib-cdk-sidebar-communications is not accesible from "document", Maybe is ShadowDOM active?');
		}
	}

	/** Tabs a mostrar en el encabezado de los mensajes */
	@Prop({ mutable: true, reflect: true }) tabs: { [key: string]: any } | string;

	@Watch('tabs') parseTabs(newTabs: string | any) {
		if (newTabs) {
			try {
				this._tabs = JSON.parse(newTabs);
			} catch (e) {
				console.error(e);
			}
		}
	}

	/** Establece la tab indicada como la activa y abierta */
	@Prop({ mutable: true, reflect: true }) activeTab: string;

	@Watch('activeTab') listenTabChange(newTab: string) {
		this.tabChatChange.emit(newTab);
	}

	@Prop({ mutable: true, reflect: true }) profile: string;
	@Watch('profile') parseProfile(newProfile: string) {
		try {
			if (newProfile) {
				this._profile = JSON.parse(newProfile || '{}');
			}
		} catch (e) {
			console.error(e);
		}
	}
	@State() _profile: ICDKSidecommProfile;
	/** Tabs a mostrar en el encabezado de los mensajes */
	@Prop({ mutable: true, reflect: true }) files: { [key: string]: any } | string;

	@Watch('files') parseFiles(newTabs: string | any) {
		if (newTabs) {
			try {
				this._files = JSON.parse(newTabs);
			} catch (e) {
				console.error(e);
			}
		}
	}

	/** Miembros de la conversación activa */
	@Prop({ mutable: true, reflect: true }) activeConversationMembers: string;

	@Watch('activeConversationMembers') parseMembers(newMembers: string) {
		if (newMembers) {
			try {
				this._activeConversationMembers = JSON.parse(newMembers);
			} catch (e) {
				console.error(e);
			}
		}
	}

	/** Emite un evento con la tab activa */
	@Event() tabChatChange: EventEmitter<string>;

	@State() _tabs: ICDKChatTab[];
	@State() _messages: ICDKMessagesMsg[];
	/** Establece parametros por defecto para nuevos mensajes */
	@Prop({ mutable: true, reflect: true }) openNewData: string;

	@Watch('openNewData') newDataChange(newVal: string) {
		this._newData = JSON.parse(newVal || '{}');
	}

	/** Props for infinite scrolling messages */

	@Prop({ mutable: true, reflect: false }) moreTopMessages: boolean = true;

	@Watch('moreTopMessages') updateMoreTopMessages(newData: boolean) {
		this._moreTopMessages = newData;
	}

	@State() _moreTopMessages: boolean;

	@Prop({ mutable: true, reflect: false }) moreBottomMessages: boolean = false;

	@Watch('moreBottomMessages') updateMoreBottomMessages(newData: boolean) {
		this._moreBottomMessages = newData;
	}

	@State() _moreBottomMessages: boolean;

	/** Props for infinite scrolling conversations */

	@Prop({ mutable: true, reflect: false }) moreTopConversations: boolean = false;

	@Watch('moreTopConversations') updateMoreTopConversations(newData: boolean) {
		this._moreTopConversations = newData;
	}

	@State() _moreTopConversations: boolean;

	@Prop({ mutable: true, reflect: false }) moreBottomConversations: boolean = false;

	@Watch('moreBottomConversations') updateMoreBottomConversations(newData: boolean) {
		this._moreBottomConversations = newData;
	}

	@State() _moreBottomConversations: boolean;

	/** Change status of loading on input */
	@Prop() loadingUsers: boolean = false;

	@Watch('loadingUsers') changeLoading(newVal: boolean) {
		this._loadingUsers = newVal;
	}

	@State() _loadingUsers: boolean;

	@Prop() loadingSendMessage: boolean = false;
	@Watch('loadingSendMessage') changeLoadingSendMessage(newVal: boolean) {
		this._loadingSendMessage = newVal;
	}
	@State() _loadingSendMessage: boolean;

	@Prop() resetForm: boolean = false;
	@Watch('resetForm') parseResetForm(newVal: boolean) {
		this._resetForm = newVal;
	}
	@State() _resetForm: boolean;

	@Prop() isEmployee: boolean = false;
	@Watch('isEmployee') parseIsEmployee(newVal: boolean) {
		this._isEmployee = newVal;
	}
	@State() _isEmployee: boolean;

	/** Conversation tabs for archived and actives conversations */
	@Prop({ mutable: true, reflect: true }) tabsConversation: string | any;

	@Watch('tabsConversation') parseTabsConversation(newTabs: string | any) {
		if (newTabs) {
			try {
				this._tabsConversation = JSON.parse(newTabs);
			} catch (e) {
				console.error(e);
			}
		}
	}

	@State() _tabsConversation: ICDKConversationTab[];

	@State() _conversations: ICDKMessagesConversation[];
	@State() _attachedSendList: ICDKMessagesAttachedSendList;
	@State() _activeConversation: string;
	/** @Type ICDKMessagesConversation */
	@State() _literals: ICDKMessagesLiterals;
	@State() _mailBoxes: ICDKMessagesMailboxes[];
	@State() _toUserList: ICDKMessagesToUserList[] = [];
	@State() _files: ICDKFilesChat;
	@State() _activeConversationMembers: ICDKMembersChat;
	@State() _newData: ICDKMessagesDefault;
	@State() _groups: any;
	@State() _selectedMailBox: string;
	@State() _mobileHeaderCollapsed: boolean;
	@State() _filesTableConfig: any;
	@Prop({ mutable: true, reflect: true }) filesTableConfig: any;
	@Watch('filesTableConfig') changeFilesTableConfig(newValue: any) {
		this._filesTableConfig = newValue;
	}

	@Prop({ mutable: true }) bodyMessage: string = '';
	@Watch('bodyMessage') addBodyContent(newVal: string) {
		this._bodyMessage = newVal;
	}
	@State() _bodyMessage: string;

	/**Subheader on message chat header*/
	@Prop({ mutable: true, reflect: false }) subheader?: string;
	@Watch('subheader') addSubheader(newVal: string) {
		try {
			if (newVal) {
				this._subheader = JSON.parse(newVal || '{}');
			}
		} catch (error) {
			console.log(error);
		}
	}
	@State() _subheader: any;

	@Prop({ mutable: true }) hasSubheader?: boolean = false;
	@Watch('hasSubheader') handleHasSubheader(newVal: boolean) {
		this._hasSubheader = newVal;
	}
	@State() _hasSubheader: boolean;

	@Prop({ mutable: true }) newMessage?: boolean = false;
	@Watch('newMessage') handleNewMessage(newVal: boolean) {
		if (newVal === true) {
			this.handleCloseNewMessage();
		}
	}

	/**Send id subheader info*/
	@Event() openDetail: EventEmitter<any>;

	/** Emite un evento con la tab activa */
	@Event() userAction: EventEmitter<ICDKMessagesUserAction>;

	@Event() eventLoadConversation: EventEmitter<any>;

	@Event() discardMessage: EventEmitter<any>;

	@Listen('eventSend')
	handleConversationSendMsg() {
		this.checkActiveConversation(this.activeConversationId);
	}

	@Listen('eventResetUserList')
	handleResetUserList() {
		this._toUserList = [];
	}

	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this.multiselectResponsive();
	}

	@Prop({ mutable: true, reflect: false }) errorSubheader: errorSubheaderInterface;

	multiselectResponsive() {
		if (window.innerWidth >= 768 && this.detailPanelActive == 'readByTooltip') {
			this.detailPanelActive = 'message';
		}
		window.innerWidth < 768 ? (this._isMobile = true) : (this._isMobile = false);
	}

	private _membersTableElement: any;
	private _membersCounterElement: any;

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {
		setTimeout(() => {
			this.triggerAnimations();
		}, 500);
		document.querySelector('vaadin-accordion-panel');
		this._membersTableElement = document.querySelector('#members_table');
		this._membersCounterElement = document.querySelector('#members_counter');
	}

	getTableVNode(tableElement: any) {
		if (tableElement) {
			const attrs = tableElement.getAttributeNames().reduce((acc, name) => {
				return { ...acc, [name]: tableElement.getAttribute(name) };
			}, {});
			return h(tableElement.tagName.toLowerCase(), attrs);
		}
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.toggleBottomBarMobile(this.mobilePanelActive);
		this.parseLiterals(this.literals);
		this.parseMailBoxes(this.mailBoxes);
		this.parseConversations(this.conversations);
		this.parseMessages(this.messages);
		this.parseUserList(this.toUserList);
		this.parseAttachedFilesSendList(this.attachedFilesSendList);
		this.parseTabs(this.tabs);
		this.parseFiles(this.files);
		this.parseTabsConversation(this.tabsConversation);
		this.newDataChange(this.openNewData);
		this.parseGroups(this.groups);
		this.parseMembers(this.activeConversationMembers);
		this.changeLoading(this.loadingUsers);
		this.updateMoreTopMessages(this.moreTopMessages);
		this.updateMoreBottomMessages(this.moreBottomMessages);
		this.updateMoreTopConversations(this.moreTopConversations);
		this.updateMoreBottomConversations(this.moreBottomConversations);
		this.addBodyContent(this.bodyMessage);
		this.parseResetForm(this.resetForm);
		this.changeLoadingSendMessage(this.loadingSendMessage);
		this.parseIsEmployee(this.isEmployee);
		this.parseProfile(this.profile);
		this.multiselectResponsive();
		this.addSubheader(this.subheader);
		this.handleHasSubheader(this.hasSubheader);
		this.handleNewMessage(this.newMessage);
		this.changeFilesTableConfig(this.filesTableConfig);
		new VaadinAccordionAppTheme();
	}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	triggerAnimations() {
		const listElements = document.querySelectorAll('[data-conversation-item]');
		listElements?.forEach((element) => {
			(element.children[0] as HTMLElement).style.animation = 'none';
			(element.children[0] as HTMLElement).style.animation = null;
		});
	}

	handleNewMessageSubmit(data: ICDKMessagesNewMsg) {
		this.loadingSendMessage = true;
		this.userAction.emit({
			type: ECDKMessagesUserActions.newConversation,
			payload: data
		});
		// this.handleCloseNewMessage();
	}

	handleScrollList(el: HTMLElement) {
		this.checkScrollDirection(el);
		this._handleCheckScrollMoreConversations(el);
	}

	checkScrollDirection(el: HTMLElement) {
		if (this._isMobile) {
			this._mobileHeaderCollapsed = this.oldTopScroll < el?.scrollTop;
			this.oldTopScroll = el?.scrollTop;
		}
	}

	_handleCheckScrollMoreConversations(scrollEl) {
		const isLoading = this._conversations === null;
		if (!this._loadingNewConversations) {
			const el = document.getElementsByClassName('c-conversations-item') as any;
			if (this._moreTopConversations && !isLoading && scrollEl.scrollTop < Math.round(scrollEl.scrollHeight * 0.2)) {
				this.oldHeightTotal = scrollEl.scrollHeight;
				this.oldHeightScroll = scrollEl.scrollTop;

				this._showSkeletonTop = true;
				this._loadingNewConversations = true;

				if (el.length > this.maxConversationRendered - 1) {
					setTimeout(() => {
						scrollEl.scrollTo({
							top: scrollEl.scrollHeight - (this.oldHeightTotal - this.oldHeightScroll)
						});
					}, 10);
				}

				this.eventLoadConversation.emit({ type: 'top' });
			}
			if (
				this._moreBottomConversations &&
				!isLoading &&
				scrollEl.scrollTop > Math.round((scrollEl.scrollHeight - scrollEl.clientHeight) * 0.8)
			) {
				this.oldHeightTotal = scrollEl.scrollHeight;
				this.oldHeightScroll = scrollEl.scrollTop;

				// console.log(el.length)
				this._showSkeletonBottom = true;
				this._loadingNewConversations = true;

				// top: this.oldHeightScroll - this.$scrollContainer.clientHeight
				// top: this.oldHeightScroll / 2 + scrollEl.clientHeight / 2,
				if (el.length > this.maxConversationRendered - 1) {
					setTimeout(() => {
						el[el.length / (this.maxConversationRendered / 10)].offsetParent.scrollIntoView();
						// scrollEl.scrollTo({
						// 	top: this.oldHeightScroll / 2
						// });
					}, 10);
				}

				this.eventLoadConversation.emit({ type: 'bottom' });
			}
		}
	}

	checkActiveConversation(id) {
		if (id) {
			setTimeout(() => {
				const el = document.getElementsByClassName('c-conversations-item --active')[0] as HTMLElement;
				el.offsetParent.scrollIntoView();
			}, 800);
		}
	}

	setActiveConversationDetails(id: string) {
		const activeConversation = this._conversations?.find((conversation) => conversation?.id === id);
		if (activeConversation) {
			this.checkActiveConversation(id);
			this._activeConversation = JSON.stringify(activeConversation);
		}
	}

	handleConversationItemClick(id: string, event?: MouseEvent) {
		this.activeConversationId = null;
		event?.stopPropagation();
		setTimeout(() => {
			this.activeConversationId = id;
		}, 0);
		// Cambia a la vista de detalle sólo para móvil
		this.detailPanelActive = 'message';
		this.mobilePanelActive = 'detail';
	}

	/** Cierra el detalle en mobile */
	handleCloseDetail() {
		this._mobileHeaderCollapsed = false;
		this.mobilePanelActive = 'main';
	}

	handleCloseComms() {
		this._mobileHeaderCollapsed = false;
		this.activeMailBox = this._selectedMailBox = 'apps';
		this.activeDraftId = null;
		this.detailPanelActive = 'message';
		this.mobilePanelActive = 'main';
		this.userAction.emit({ type: ECDKMessagesUserActions.closeCommunicationsPanel });
	}

	/** Cambia el estado de una conversación como "leída/no leída" */
	handleToggleUnread(id: string, currentState: boolean, group?) {
		this._conversations = this._conversations.map((conversation) =>
			conversation?.id === id ? { ...conversation, unread: !currentState, notifications: 0 } : conversation
		);
		this.userAction.emit({
			type: ECDKMessagesUserActions.markAsUnread,
			payload: {
				id: id,
				unread: !currentState,
				group
			}
		});
	}

	/** Abre la ventana de "Nuevo mensaje" y setea un Id al "draft" */
	handleOpenNewMessage() {
		if (!this.activeDraftId) {
			this.activeDraftId = 'draft-' + Date.now();
		}
		this.detailPanelActive = 'new';
		this.mobilePanelActive = 'detail';
		this.enableSendMessage = true;
	}

	/** Cierra la ventana de "Nuevo mensaje" */
	handleCloseNewMessage() {
		this.activeDraftId = null;
		this.detailPanelActive = 'message';
		this.mobilePanelActive = 'main';
		this.userAction.emit({
			type: ECDKMessagesUserActions.discardSend,
			payload: 'newConversation'
		});
		this.bodyMessage = '';
		this._toUserList = [];
		this.enableSendMessage = false;
		this.discardMessage.emit();
	}

	handleActionConversation(data) {
		const dataObject = data.detail;
		switch (dataObject.action) {
			case 'downloadConversation':
				this.userAction.emit({
					type: ECDKMessagesUserActions.downloadConversation,
					payload: dataObject
				});
				break;
			case 'sendConversationEmail':
				this.userAction.emit({
					type: ECDKMessagesUserActions.sendConversationEmail,
					payload: dataObject
				});
				break;
			default:
				console.error('Conversation action not valid');
				break;
		}
	}

	render() {
		const showSkeleton = this.conversationsSkeleton === null;
		const showEmptyState = this._conversations?.length === 0 && this.detailPanelActive !== 'new';
		const showNoSelectedConversation =
			this._conversations.length > 0 &&
			(this.activeConversationId === undefined || this.activeConversationId === null) &&
			this.detailPanelActive !== 'new';
		let finalShowEmptyState = (showEmptyState || showNoSelectedConversation) && !this.enableSendMessage;
		const showEmptyStateCommunications: boolean = this.detailPanelActive === 'new' ? false : showEmptyState || showNoSelectedConversation;
		return (
			<Host>
				<scib-cdk-panels-communications
					active={this.mobilePanelActive}
					showEmptyState={showEmptyStateCommunications}
					onEventDetailClose={this.handleCloseDetail.bind(this)}
					onEventCloseComms={this.handleCloseComms.bind(this)}
				>
					<section slot="panel-main" class="c-conversations">
						<header>
							<scib-cdk-header-mobile hasSlot={true}>
								<section slot="left-content">
									<header class="c-profile-wrapper">
										<CDKSidebarCommunicationsProfileBar
											name={this._profile?.name}
											avatarSrc={this._profile?.avatar?.src}
											avatarAlt={this._profile?.avatar?.alt}
											isMobile={true}
											hasEmptyData={false}
											onClose={this.handleCloseComms.bind(this)}
										/>
									</header>
								</section>
							</scib-cdk-header-mobile>
							<div class={{ 'no-clickable': showSkeleton }}>
								<CDKMessagesConversationsHeader
									onNewClick={() => this.handleOpenNewMessage()}
									onCloseClick={() => this.userAction.emit({ type: ECDKMessagesUserActions.closeCommunicationsPanel })}
									onSearchBy={(customEvent: CustomEvent) =>
										this.userAction.emit({ type: ECDKMessagesUserActions.searchByMessages, payload: customEvent.detail })
									}
									title={this._literals?.titleTxt}
									subtitle={this._literals?.subtitleTxt}
									notifications={this.unreadMsg}
									searchPlaceholderTxt={this._literals?.filterPlaceholderTxt}
									addButton={this.showNewButton}
									searchInputDefault={this.searchInputDefault}
									mailBoxes={this._mailBoxes}
									activeMailBox={this.activeMailBox}
									selectedMailBox={this._selectedMailBox ? this._selectedMailBox : this.activeMailBox}
									activeTab={this.activeTabApps}
									onTapChange={(ev: CustomEvent) => {
										this._selectedMailBox = ev.detail;
										this.userAction.emit({
											type: ECDKMessagesUserActions.mailBoxChange,
											payload: ev.detail
										});
									}}
									tabs={JSON.stringify(this._tabsConversation)}
									collapsed={this._mobileHeaderCollapsed}
								/>
							</div>
						</header>
						{showSkeleton && (
							<div
								class={{
									'skeleton-wrapper': true,
									'--mobile': this._isMobile,
									'--all-inbox': this._selectedMailBox == 'all'
								}}
							>
								{Array.from({ length: 9 }).map(() => (
									<div class="c-conversations-list__skeleton-container" role="status" aria-busy="true" aria-live="polite">
										<figure class="c-conversations-list__skeleton">
											<CDKMessagesConversationsItemSkeleton literalSkeleton="Loading..." />
										</figure>
									</div>
								))}
							</div>
						)}
						{showEmptyState && (
							<div class="c-empty-conversations-list">
								<img class="c-empty-image-conversations-list" src={assetUrl('/assets/images/banco.svg')}></img>
								<div class="c-empty-text-conversations-list">{this._literals.emptyConversationText}</div>
							</div>
						)}
						{!showEmptyState && (
							<ul
								class={{
									'c-conversations-list': true,
									'--collapsed': this._mobileHeaderCollapsed,
									'--all-inbox': this._selectedMailBox == 'all'
								}}
								ref={(el) => (this.$scrollContainer = el as HTMLElement)}
								onScroll={(e) => {
									this.handleScrollList(e.target as HTMLElement);
									e.preventDefault();
									e.stopPropagation();
									e.stopImmediatePropagation();
								}}
							>
								{showSkeleton &&
									Array.from({ length: 6 }).map(() => (
										<div class="c-conversations-list__skeleton-container" role="status" aria-busy="true" aria-live="polite">
											<figure class="c-conversations-list__skeleton">
												<CDKMessagesConversationsItemSkeleton literalSkeleton="Loading..." />
											</figure>
										</div>
									))}
								{!this.groups &&
									this._showSkeletonTop &&
									this._moreTopConversations &&
									Array.from({ length: 10 }).map(() => (
										<div class="c-conversations-list__skeleton-container" role="status" aria-busy="true" aria-live="polite">
											<figure class="c-conversations-list__skeleton">
												<CDKMessagesConversationsItemSkeleton literalSkeleton="Loading..." />
											</figure>
										</div>
									))}
								{!this.groups &&
									this._conversations
										?.filter((item) => item)
										.map((conversation, index) => (
											<li key={conversation.id} data-conversation-item>
												<CDKMessagesConversationsItem
													important={conversation.important}
													active={conversation.id === this.activeConversationId}
													onSetActive={(e: MouseEvent) => this.handleConversationItemClick(conversation.id, e)}
													notifications={conversation.notifications}
													conversation={conversation}
													index={index}
													unread={conversation.unread}
													closedLiteral={this._literals.closedTagTxt}
													onToggleUnread={() => this.handleToggleUnread(conversation.id, conversation.unread)}
												/>
											</li>
										))}
								{this.groups &&
									this._groups.map((groups) => (
										<vaadin-accordion opened="0">
											<vaadin-accordion-panel>
												<div
													class={{
														'sc-scib-cdk-messages__app': true,
														'sc-scib-cdk-messages--unread': this.unreadMsg !== '0'
													}}
													slot="summary"
													data-unread={this.unreadMsg}
												>
													{groups.label}
												</div>
												<vaadin-vertical-layout>
													{this._showSkeletonTop &&
														this._moreTopConversations &&
														Array.from({ length: 10 }).map(() => (
															<div
																class="c-conversations-list__skeleton-container"
																role="status"
																aria-busy="true"
																aria-live="polite"
															>
																<figure class="c-conversations-list__skeleton">
																	<CDKMessagesConversationsItemSkeleton literalSkeleton="Loading..." />
																</figure>
															</div>
														))}
													{this._conversations
														?.filter((item) => item)
														.map((conversation, index) => (
															<li key={conversation.id} data-conversation-item>
																<CDKMessagesConversationsItem
																	important={conversation.important}
																	active={conversation.id === this.activeConversationId}
																	onSetActive={(e: MouseEvent) =>
																		this.handleConversationItemClick(conversation.id, e)
																	}
																	notifications={conversation.notifications}
																	conversation={conversation}
																	index={index}
																	unread={conversation.unread}
																	closedLiteral={this._literals.closedTagTxt}
																	onToggleUnread={() =>
																		this.handleToggleUnread(conversation.id, conversation.unread, groups)
																	}
																/>
															</li>
														))}
												</vaadin-vertical-layout>
											</vaadin-accordion-panel>
										</vaadin-accordion>
									))}
								{this._showSkeletonBottom &&
									this._moreBottomConversations &&
									Array.from({ length: 10 }).map(() => (
										<div class="c-conversations-list__skeleton-container" role="status" aria-busy="true" aria-live="polite">
											<figure class="c-conversations-list__skeleton">
												<CDKMessagesConversationsItemSkeleton literalSkeleton="Loading..." />
											</figure>
										</div>
									))}
							</ul>
						)}
					</section>
					{this.detailPanelActive === 'message' && (
						<section slot="panel-detail" class={{ 'c-panel-detail': true, '--active': this.detailPanelActive === 'message' }}>
							{showSkeleton && (
								<ul class="c-messages-chat-list">
									{Array.from({ length: 6 }).map((_, index) => (
										<div role="status" aria-busy="true" aria-live="polite">
											<figure class={{ 'c-messages-skeleton': true, 'c-messages-skeleton--sender': index % 2 === 0 }}>
												<CDKMsgReplySkeleton sender={index % 2 === 0} />
											</figure>
										</div>
									))}
								</ul>
							)}
							{showEmptyState && !showSkeleton && (
								<section slot="panel-detail" class="c-panel-detail-empty-main-right">
									<div class="c-empty-conversations-list-desktop">
										<img class="c-empty-image-conversations-list" src={assetUrl('/assets/images/banco.svg')}></img>
										<div class="c-empty-text-conversations-list">{this._literals.emptyConversationText}</div>
									</div>
								</section>
							)}

							{showNoSelectedConversation && !this.enableSendMessage && (
								<section slot="panel-detail" class="c-panel-detail-empty-main-right">
									<div class="c-empty-conversations-list-desktop">
										<img
											class="c-empty-image-conversations-list"
											src={assetUrl('/assets/images/i-laptop-coffee-messages.svg')}
										></img>
										<div class="c-empty-text-conversations-list">{this._literals.conversationNoSelectedText}</div>
										<div class="c-empty-sub-text-conversations-list">{this._literals.conversationNoSelectedSubText}</div>
									</div>
								</section>
							)}
							{!showEmptyState && this.activeConversationId && (
								<scib-cdk-messages-chat
									onEventShowReadTab={() => (this.detailPanelActive = 'readByTooltip')}
									literals={this._literals}
									messages={this._messages}
									isEmployee={this._isEmployee}
									attachedFiles={(this._attachedSendList || {})[this.activeConversationId]}
									repliesTxT={this._literals.repliesTxt}
									unreadFlagTxt={this._literals.unreadFlagTxt}
									conversation-detail={this._activeConversation}
									activeConversationId={this.activeConversationId}
									activeTab={this.activeTab}
									tabs={this._tabs}
									files={this._files}
									members={this._activeConversationMembers}
									moreTopMessages={this._moreTopMessages}
									moreBottomMessages={this._moreBottomMessages}
									subheader={this._subheader}
									hasSubheader={this._hasSubheader}
									errorSubheader={this.errorSubheader}
									filesTableConfig={this._filesTableConfig}
									membersTable={this.getTableVNode(this._membersTableElement)}
									membersCounter={this.getTableVNode(this._membersCounterElement)}
									onEventSendReply={(customEvent: CustomEvent) =>
										this.userAction.emit({
											type: ECDKMessagesUserActions.replyConversation,
											payload: {
												body: customEvent.detail,
												conversationId: this.activeConversationId
											}
										})
									}
									onEventDeleteConversation={() =>
										this.userAction.emit({
											type: ECDKMessagesUserActions.deleteConversation,
											payload: this.activeConversationId
										})
									}
									onEventAttachReply={(ev: CustomEvent) =>
										this.userAction.emit({
											type: ECDKMessagesUserActions.attachFile,
											payload: ev.detail
										})
									}
									onEventActionFile={(ev: CustomEvent) =>
										this.userAction.emit({
											type: ev.detail.type,
											payload: { ...ev.detail.payload, conversationId: this.activeConversationId }
										})
									}
									onEventDiscardReply={() =>
										this.userAction.emit({
											type: ECDKMessagesUserActions.discardSend,
											payload: this.activeConversationId
										})
									}
									onEventChatChangeTab={(ev: CustomEvent) => this.tabChatChange.emit(ev.detail)}
									onEventActionsConversation={(data) => this.handleActionConversation(data)}
									onEventClickOpenDetail={(ev: CustomEvent) => this.openDetail.emit(ev.detail)}
								>
									<scib-cdk-header-mobile
										slot="menu-header"
										literal={this._selectedMailBox !== 'all' ? this._literals.appInbox : this._literals.myInbox}
										onEventDetailClose={() => this.handleCloseDetail.bind(this)}
										onEventCloseComms={() => {
											this._mobileHeaderCollapsed = false;
											this.userAction.emit({ type: ECDKMessagesUserActions.closeCommunicationsPanel });
										}}
									></scib-cdk-header-mobile>
								</scib-cdk-messages-chat>
							)}
						</section>
					)}
					{showSkeleton && (
						<ul class="c-messages-chat-list">
							{Array.from({ length: 6 }).map((_, index) => (
								<div role="status" aria-busy="true" aria-live="polite">
									<figure class={{ 'c-messages-skeleton': true, 'c-messages-skeleton--sender': index % 2 === 0 }}>
										<CDKMsgReplySkeleton sender={index % 2 === 0} />
									</figure>
								</div>
							))}
						</ul>
					)}
					{showEmptyState && !showSkeleton && !this.enableSendMessage && (
						<section slot="panel-detail" class="c-panel-detail-empty-main-right">
							<div class="c-empty-conversations-list-desktop">
								<img class="c-empty-image-conversations-list" src={assetUrl('/assets/images/banco.svg')}></img>
								<div class="c-empty-text-conversations-list">{this._literals.emptyConversationText}</div>
							</div>
						</section>
					)}
					{this.detailPanelActive === 'new' && (
						<section
							slot="panel-detail"
							class={{
								'c-panel-detail': true,
								'--active': this.detailPanelActive === 'new',
								'hide-in-desktop': finalShowEmptyState
							}}
						>
							<scib-cdk-messages-new
								attachedFiles={(this._attachedSendList || {})['newConversation']}
								loadingSend={this._loadingSendMessage}
								activeDraftId={this.activeDraftId}
								literals={this._literals}
								userList={this._toUserList}
								resetForm={this._resetForm}
								defaultData={this._newData}
								bodyMessage={this._bodyMessage}
								loadingUsers={this._loadingUsers}
								onEventDiscardNew={() => this.handleCloseNewMessage()}
								onEventSubmit={(ev: CustomEvent) => this.handleNewMessageSubmit(ev.detail)}
								onEventSearchByUsers={(ev: CustomEvent) =>
									this.userAction.emit({
										type: ECDKMessagesUserActions.searchByUsers,
										payload: ev.detail
									})
								}
								onEventActionFile={(ev: CustomEvent) =>
									this.userAction.emit({
										type: ev.detail.type,
										payload: { ...ev.detail.payload, conversationId: 'newConversation' }
									})
								}
								onEventAttachNew={(ev: CustomEvent) =>
									this.userAction.emit({
										type: ECDKMessagesUserActions.attachFile,
										payload: ev.detail
									})
								}
							>
								<scib-cdk-header-mobile
									class={{ 'hide-in-desktop': finalShowEmptyState }}
									slot="menu-header"
									literal={this._selectedMailBox !== 'all' ? this._literals.appInbox : this._literals.myInbox}
									onEventDetailClose={() => this.handleCloseDetail.bind(this)}
									onEventCloseComms={() => {
										this._mobileHeaderCollapsed = false;
										this.userAction.emit({ type: ECDKMessagesUserActions.closeCommunicationsPanel });
									}}
								></scib-cdk-header-mobile>
							</scib-cdk-messages-new>
						</section>
					)}
					{this.detailPanelActive === 'readByTooltip' && (
						<section slot="panel-detail" class={{ 'c-panel-detail': true, '--active': this.detailPanelActive === 'readByTooltip' }}>
							<div class="read-by-tooltip-wrapper">
								<scib-cdk-members-tooltip
									positionX="left"
									positionY="top"
									members={this._lastMessage.readByMembers}
									parentHeight="0"
									show="block"
									linkData=""
									literals={this._literals.tooltipLiterals}
									readByTooltip
									isMobile
									onEventTooltipClose={() => (this.detailPanelActive = 'message')}
								></scib-cdk-members-tooltip>
							</div>
						</section>
					)}
				</scib-cdk-panels-communications>
			</Host>
		);
	}
}
