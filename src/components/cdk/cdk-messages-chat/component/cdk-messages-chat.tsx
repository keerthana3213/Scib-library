import { Component, Event, EventEmitter, h, Host, Listen, Prop, State, Watch } from '@stencil/core';
import ResizeObserver from 'resize-observer-polyfill';
import smoothscroll from 'smoothscroll-polyfill';
import { triggerAnimations } from '../../../../utils/helpers/animations';
import {
	ECDKChatTabIds,
	ECDKMessagesUserActions,
	ICDKChatTab,
	ICDKFilesChat,
	ICDKMembersChat,
	ICDKMessagesAttachFilePayload,
	ICDKMessagesConversation,
	ICDKMessagesFile,
	ICDKMessagesLiterals,
	ICDKMessagesMsg
} from '../../cdk-messages/models/cdk-messages.model';
import { CDKMsgChatHeaderInfo } from '../fragments/cdk-messages-chat-header-info.fragment';
import { CDKMsgChatReply } from '../fragments/cdk-messages-chat-reply.fragment';
import { CDKMsgReplySkeleton } from '../fragments/cdk-messages-chat-reply.skeleton';
import { CDKMessagesChatSubheader } from '../fragments/cdk-messages-chat-subheader.fragment';
import { errorSubheaderInterface, EventActionFile, Subheader } from '../models/cdk-messages-chat.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-messages-chat',
	styleUrl: 'cdk-messages-chat.scss',
	shadow: false,
	scoped: true
})
export class CDKMessagesChat {
	$parentEl: HTMLElement;
	$chatScrollContainer!: HTMLElement;
	$headerCard!: HTMLElement;
	$host!: HTMLElement;
	$sendBar!: HTMLElement;
	$messageRef!: HTMLElement;
	$filesTableRef!: any;

	resizeObserver: any;
	_firstLoad: boolean = false;
	_loadingNewMessages: boolean = false;

	/** Id de la conversación activa */
	@Prop({ mutable: true, reflect: true }) activeConversationId: string;
	optionButtonsMobile: { id: number; text: string; separator: boolean; icon: string; eventId: string }[];
	@Watch('activeConversationId') listenActiveCoversationIdChanges() {
		this.scrollToBottom('smooth', 100);
		this._loadingSend = false;
	}

	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this.multiselectResponsive();
	}

	@Listen('selectedRows') selectionRowChanged($selectedRowsEvent: any) {
		this._selectedRows = $selectedRowsEvent.detail;
	}

	@Listen('panelClick') filterRows($event) {
		this.userAction.emit({
			type: 'filterRowsByNDAStatus',
			payload: $event.detail
		});
	}

	@Prop({ mutable: true, reflect: false }) errorSubheader: errorSubheaderInterface;

	multiselectResponsive() {
		if (window.innerWidth < 768) {
			this.isMobile = true;
		} else {
			this.isMobile = false;
		}
	}

	/*Boolean to hide/show buttons on mobile*/
	@Prop({ reflect: false, mutable: true }) isMobile: boolean;

	@Prop() literals: ICDKMessagesLiterals;

	/** Literal de 'nº de Replies' */
	@Prop({ mutable: true, reflect: true }) repliesTxT: string;

	/** Literal de 'Mensajes no leídos' */
	@Prop({ mutable: true, reflect: true }) unreadFlagTxt: string;

	@Prop() attachedFiles: ICDKMessagesFile[];
	@Watch('attachedFiles') listenAttachedFiles() {
		this.scrollToBottom();
	}

	/** Tab activa */
	@Prop({ mutable: true, reflect: true }) activeTab: string;

	/** Tabs mostrados en el header */
	@Prop({ mutable: true, reflect: true }) tabs: ICDKChatTab[];

	/** Datos del historial de ficheros */
	@Prop({ mutable: true, reflect: false }) files: ICDKFilesChat;

	/** Datos de los usuarios participantes */
	@Prop({ mutable: true, reflect: false }) members: ICDKMembersChat;

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

	@State() _replyOpen: boolean = true;

	@State() _loadingSend: boolean;

	@State() _showSkeletonTop: boolean;
	@State() _showSkeletonBottom: boolean;

	@State() _activeScrollToBottom: boolean = false;

	@Event() eventSendReply: EventEmitter<string>;

	@Event() eventDeleteConversation: EventEmitter<string>;

	@Event() eventAttachReply: EventEmitter<ICDKMessagesAttachFilePayload>;

	@Event() eventActionFile: EventEmitter<EventActionFile>;

	@Event() eventDiscardReply: EventEmitter;
	@Event() userAction: EventEmitter;

	/** Listado de mensajes */
	@Prop({ mutable: true, reflect: true }) messages: ICDKMessagesMsg[];
	@Watch('messages') messagesChanges() {
		const prevEmpty = (this.messages || []).length === 0;
		const isLastFromSender = (this.messages || []).slice(-1)[0]?.sender;
		if (isLastFromSender) {
			this._loadingSend = false;
		}
		this._loadingNewMessages = false;
		// En caso de que se implemente el "infinite scroll regresivo" para cargar mensajes antiguos
		// se debería contemplar que esta función solo salte cuando cambie el último mensaje
		if (!this._firstLoad) {
			this.scrollToBottom(prevEmpty ? 'auto' : 'smooth', 300);
		} else {
			if (this._showSkeletonTop) {
				this._showSkeletonTop = false;
				this.newHeightTotal = this.$chatScrollContainer.scrollHeight;
				this.$chatScrollContainer.scrollTo({
					top: this.newHeightTotal - (this.oldHeightTotal - this.oldHeightScroll)
				});
			}
			if (this._showSkeletonBottom) {
				this._showSkeletonBottom = false;
				this.$chatScrollContainer.scrollTo({
					top: this.oldHeightScroll
				});
			}
		}
	}

	/** Detalle de la conversación */
	@Prop({ mutable: true, reflect: true }) conversationDetail: string;
	@Watch('conversationDetail') parseConversationDetail(newValue: string) {
		try {
			this._conversationDetail = JSON.parse(newValue || '{}');
		} catch (e) {
			console.error(e);
		}
		triggerAnimations([this.$chatScrollContainer]);
		this.scrollToBottom();
	}

	@Watch('activeTab') changeActiveTab(newValue: string) {
		this._activeTab = newValue;
	}

	@Watch('_activeTab') changeActiveTabState(newValue: string) {
		this._activeTab = newValue;

		if (this._activeTab === ECDKChatTabIds.FIL) {
			setTimeout(() => {
				this.changeFilesTableConfig(this._filesTableConfig);
			}, 100);
		} else {
			const tableContainer = document.querySelector('.c-files-table');
			const actualTable = document.querySelector('#files_table');
			if (tableContainer && actualTable) {
				tableContainer.removeChild(actualTable);
			}
		}
	}

	@State() _conversationDetail: ICDKMessagesConversation;
	@State() _activeTab: string;
	@State() _topScroll: boolean;

	@Prop() isEmployee: boolean = false;
	@Watch('isEmployee') parseIsEmployee(newVal: boolean) {
		this._isEmployee = newVal;
	}
	@State() _isEmployee: boolean;

	@Prop() isContextualMenuMobileOpen: boolean = false;

	@Prop() emailTooltipPos: string = 'top';

	/**Subheader on message chat header*/
	@Prop({ mutable: true }) subheader?: Subheader;
	@Watch('subheader') addSubheader(newVal: Subheader) {
		this._subheader = newVal;
	}
	@State() _subheader: Subheader;

	@Prop({ mutable: true }) hasSubheader?: boolean = false;
	@Watch('hasSubheader') handleHasSubheader(newVal: boolean) {
		this._hasSubheader = newVal;
	}
	@State() _hasSubheader: boolean;
	@Event() eventClickOpenDetail: EventEmitter<string>;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		smoothscroll.polyfill();
		this.parseConversationDetail(this.conversationDetail);
		this.changeActiveTab(this.activeTab);
		this.updateMoreTopMessages(this.moreTopMessages);
		this.updateMoreBottomMessages(this.moreBottomMessages);
		this.parseIsEmployee(this.isEmployee);
		this.multiselectResponsive();
		this.addSubheader(this.subheader);
		this.handleHasSubheader(this.hasSubheader);
		this.optionButtonsMobile = [
			{ id: 1, text: this.literals.chatLabel || 'Chat', separator: false, icon: 'icon-message', eventId: 'MSG' },
			{ id: 2, text: this.literals.attachDocumentsTxt || 'Files', separator: false, icon: 'icon-attach', eventId: 'FIL' },
			{ id: 3, text: this.literals.memberLabel || 'Members', separator: false, icon: 'icon-users', eventId: 'USER' }
		];
		this.changeFilesTableConfig(this.filesTableConfig);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {
		this.scrollToBottom();
		this.resizeObserver = new ResizeObserver((_) => {
			this.scrollToBottom();
		});
		this.resizeObserver.observe(this.$sendBar);

		this.$chatScrollContainer.onscroll = () => {
			if (this.$chatScrollContainer.scrollTop === 0) {
				this._topScroll = true;
			} else {
				this._topScroll = false;
			}
		};
	}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	componentDidUpdate() {}

	sendReply(body: string) {
		this._activeScrollToBottom = true;
		this._loadingSend = true;
		this.eventSendReply.emit(body);
	}

	_scrollToTop() {
		if (this.$chatScrollContainer.scrollTop !== 0 && this._moreTopMessages) {
			this.messages = null;
			this._moreTopMessages = false;
			this.eventGoToMessage.emit(this.activeConversationId);
		}
		this.$chatScrollContainer.scrollTo({
			top: 0,
			behavior: 'smooth'
		});
	}

	scrollToBottom(behavior?: ScrollBehavior, delay?: number) {
		setTimeout(() => {
			const scrollableElement = this.$host?.querySelector('[data-cdk-messages-chat-scroll]');
			const isAtBottom =
				this.$chatScrollContainer?.scrollTop + this.$chatScrollContainer?.clientHeight === this.$chatScrollContainer?.scrollHeight;
			if (scrollableElement && !isAtBottom) {
				if (behavior === 'smooth') {
					this.$chatScrollContainer.scrollTo({
						top: scrollableElement.scrollHeight,
						left: 0,
						behavior: 'smooth'
					});
				} else {
					this.$chatScrollContainer.scrollTop = this.$chatScrollContainer.scrollHeight;
				}
			}
		}, delay || 0);
	}

	handleOpenReply() {
		this._replyOpen = true;
		this.scrollToBottom(null, 100);
	}

	handleDiscard() {
		// this._replyOpen = false;
		this.eventDiscardReply.emit();
	}

	handleTabChange(btn) {
		this._activeTab = btn?.target?.dataset?.id || btn;
		if (this.$messageRef) {
			this.$messageRef.classList.remove('c-message--sticky');
			this.$messageRef.style.top = '0px';
		}
		this.isContextualMenuMobileOpen = false;
		this.eventChatChangeTab.emit(this._activeTab);
	}

	oldHeightScroll: any;
	oldHeightTotal: any;
	newHeightTotal: any;
	_handleScrollMessages(conversationId) {
		if (this._activeScrollToBottom) this._activeScrollToBottom = false;
		const isLoading = this.messages === null || !this.activeConversationId;
		const isAtBottom = this.$chatScrollContainer?.scrollTop + this.$chatScrollContainer?.clientHeight === this.$chatScrollContainer?.scrollHeight;
		if (this.$messageRef) {
			if (this.$chatScrollContainer?.scrollTop + 50 >= this.$messageRef?.clientHeight || this._moreTopMessages) {
				this.$messageRef.classList.add('c-message--sticky');
				this.$messageRef.style.top = -this.$messageRef.clientHeight + 50 + 'px';
			} else {
				this.$messageRef.classList.remove('c-message--sticky');
				this.$messageRef.style.top = '0px';
			}
		}
		if (!isLoading && isAtBottom) {
			setTimeout(() => {
				this._firstLoad = true;
			}, 300);
		}
		if (this._firstLoad && !this._loadingNewMessages) {
			if (
				this._moreTopMessages &&
				!isLoading &&
				this.$chatScrollContainer.scrollTop < Math.round(this.$chatScrollContainer.scrollHeight * 0.2)
			) {
				this.oldHeightTotal = this.$chatScrollContainer.scrollHeight;
				this.oldHeightScroll = this.$chatScrollContainer.scrollTop;

				this._showSkeletonTop = true;
				this._loadingNewMessages = true;

				setTimeout(() => {
					this.$chatScrollContainer.scrollTo({
						top: this.$chatScrollContainer.scrollHeight - (this.oldHeightTotal - this.oldHeightScroll)
					});
				}, 10);

				this.eventLoadMoreTop.emit(conversationId);
			}
			if (
				this._moreBottomMessages &&
				!isLoading &&
				this.$chatScrollContainer.scrollTop > Math.round(this.$chatScrollContainer.scrollHeight * 0.8)
			) {
				this.oldHeightTotal = this.$chatScrollContainer.scrollHeight;
				this.oldHeightScroll = this.$chatScrollContainer.scrollTop;

				this._showSkeletonBottom = true;
				this._loadingNewMessages = true;

				setTimeout(() => {
					this.$chatScrollContainer.scrollTo({
						top: this.oldHeightScroll
					});
				}, 10);

				this.eventLoadMoreBottom.emit(conversationId);
			}
		}
	}

	handleActionsConversation(data) {
		const action = data.detail.detail.eventId;
		const eventData = {
			conversationId: this.activeConversationId,
			action: action
		};
		this.eventActionsConversation.emit(eventData);
	}

	handleOpenContextualMenu() {
		this.isContextualMenuMobileOpen = !this.isContextualMenuMobileOpen;
	}

	eventOptionsClick(data) {
		this._activeTab = data;
		this.eventChatChangeTab.emit(this._activeTab);
		this.isContextualMenuMobileOpen = !this.isContextualMenuMobileOpen;
	}

	/** Evento al descargar o enviar por email una conversación */
	@Event() eventActionsConversation: EventEmitter;

	/** Descripción del evento */
	@Event() eventChange: EventEmitter;

	/** Descripción del evento */
	@Event() eventChatChangeTab: EventEmitter<string>;

	// /** Evento cuando se llega al top de los mensajes para cargar mas */
	@Event() eventLoadMoreTop: EventEmitter;
	/** Evento cuando se llega al bottom de los mensajes para cargar mas */
	@Event() eventLoadMoreBottom: EventEmitter;

	@Event() eventGoToMessage: EventEmitter;

	@Event() eventShowReadTab: EventEmitter;

	/*Indica la posición del tooltip*/
	@Prop({ mutable: true }) tooltipPositionX: string = 'left';
	@Prop({ mutable: true }) tooltipPositionY: string = 'top';

	@State() _showTooltip: string;
	@State() _parentHeight: string;

	@Prop() isReadTooltipOpen: boolean = false;

	@State() _filesTableConfig: any;
	@Prop({ mutable: true, reflect: true }) filesTableConfig: any;
	@Watch('filesTableConfig') changeFilesTableConfig(newValue: any) {
		const tableContainer = document.querySelector('.c-files-table');
		const actualTable = document.querySelector('#files_table');
		if (tableContainer && actualTable) {
			tableContainer.removeChild(actualTable);
		}
		this._filesTableConfig = newValue;
		this.$filesTableRef = document.createElement('scib-organisms-data-table');
		this.$filesTableRef.setAttribute('id', 'files_table');
		this.$filesTableRef.setAttribute('variant', 'white');
		this.$filesTableRef.setAttribute('control-manager', 'local');
		this.$filesTableRef.setAttribute('loading', 'false');
		this.$filesTableRef.setAttribute('config', JSON.stringify(this._filesTableConfig?.config));
		this.$filesTableRef.setAttribute('columns', JSON.stringify(this._filesTableConfig?.columns));
		this.$filesTableRef.setAttribute('row-data', JSON.stringify(this._filesTableConfig?.rowData));
		if (tableContainer) tableContainer.appendChild(this.$filesTableRef);
	}
	@Prop({ mutable: true }) membersTable: any;
	@Prop({ mutable: true }) membersCounter: any;

	@State() _selectedRows = [];

	showTooltip(e) {
		this.isReadTooltipOpen = !this.isReadTooltipOpen;
		this.checkYPosition(e);
		if (this.isReadTooltipOpen) {
			this._parentHeight = this.$parentEl?.clientHeight + 'px';
			this._showTooltip = 'block';
		} else {
			this._showTooltip = 'none';
		}
	}
	checkYPosition(mouseEvent) {
		let positionY = mouseEvent.clientY;

		let windowY = window.outerHeight;

		if (positionY <= windowY / 2) {
			this.tooltipPositionY = 'top';
		} else {
			this.tooltipPositionY = 'bottom';
		}
	}

	showReadTab() {
		this.eventShowReadTab.emit();
	}

	render() {
		let alreadyHasUnreadFlag = false;
		const unreadedCount = this.messages ? this.messages.filter((message) => message && message.unread && !message.sender)?.length : null;
		const openReplyPanel = !this._conversationDetail.repliesNotAllowed && this._replyOpen;
		const showSkeleton = this.messages === null || !this.activeConversationId;
		const showSkeletonSubheader = this.subheader === null;
		return (
			<Host ref={(el) => (this.$host = el as HTMLElement)}>
				<slot name="menu-header" />
				<header class="c-messages-chat-header">
					<CDKMsgChatHeaderInfo
						loading={showSkeleton}
						refCard={(el: HTMLElement) => (this.$headerCard = el as HTMLElement)}
						authorName={(this.messages || [])[0]?.author.name}
						subject={this._conversationDetail.subject}
						date={(this.messages || [])[0]?.date}
						authorAvatarSrc={(this.messages || [])[0]?.author?.avatar?.src}
						authorAvatarAlt={(this.messages || [])[0]?.author?.avatar?.alt}
						conversationAvatars={this._conversationDetail.avatar}
						activeTab={this._activeTab}
						tabs={this.tabs}
						onClick={(btnEvent) => this.handleTabChange(btnEvent)}
						onClickOpenModal={() => this.handleOpenContextualMenu()}
						isEmployee={(this.messages || [])[0]?.author?.isEmployee}
						closed={this._conversationDetail.closed}
						closedLiteral={this.literals.closedTagTxt}
						scrollTop={this._topScroll}
						isMobile={this.isMobile}
						eventOptionsClick={(btnEvent) => this.eventOptionsClick(btnEvent)}
					/>
					{this._hasSubheader && (
						<CDKMessagesChatSubheader
							link={this._subheader ? this._subheader.link : null}
							items={this._subheader ? this._subheader.items : null}
							isMobile={this.isMobile}
							errorSubheader={this.errorSubheader}
							loading={showSkeletonSubheader}
							eventClickOpenDetail={() => {
								this.eventClickOpenDetail.emit(this._subheader.idElem);
							}}
						/>
					)}
				</header>
				{this._activeTab === ECDKChatTabIds.MSG && (
					<div
						data-cdk-messages-chat-scroll
						class={{ 'c-messages-chat-scroll': true, 'c-messages-chat-scroll--displacement': this._hasSubheader }}
						ref={(el) => (this.$chatScrollContainer = el as HTMLElement)}
						onScroll={() => this._handleScrollMessages(this._conversationDetail.id)}
					>
						{/* <CDKMsgChatMessage
							refCard={(el: HTMLElement) => (this.$messageRef = el as HTMLElement)}
							loading={showSkeleton}
							attachDocumentsTxt={this.literals?.attachDocumentsTxt}
							files={(this.messages || [])[0]?.attachedFiles}
							body={(this.messages || [])[0]?.message}
							onClick={() => this._scrollToTop()}
							hasSubheader={this._hasSubheader}
						/> */}
						<ul class="c-messages-chat-list">
							{this.messages && this.messages.length > 1 && (
								<li class="c-messages-chat-replies-counter">
									<p>
										{this.messages.length} {this.repliesTxT || '[[repliesTxT]]'}
									</p>
								</li>
							)}
							{showSkeleton &&
								Array.from({ length: 3 }).map((_, index) => (
									<div role="status" aria-busy="true" aria-live="polite">
										<figure class={{ 'c-messages-skeleton': true, 'c-messages-skeleton--sender': index % 2 === 0 }}>
											<CDKMsgReplySkeleton sender={index % 2 === 0} />
										</figure>
									</div>
								))}
							{this._showSkeletonTop &&
								this._moreTopMessages &&
								Array.from({ length: 5 }).map((_, index) => (
									<div role="status" aria-busy="true" aria-live="polite">
										<figure class={{ 'c-messages-skeleton': true, 'c-messages-skeleton--sender': index % 2 === 0 }}>
											<CDKMsgReplySkeleton sender={index % 2 === 0} />
										</figure>
									</div>
								))}
							{this.messages
								?.filter((item) => item)
								.map((reply, index) => {
									const replyRender = (
										<CDKMsgChatReply
											onEyeHover={(e) => (!this.isMobile ? this.showTooltip(e) : null)}
											onEyeClick={() => (this.isMobile ? this.showReadTab() : null)}
											showTooltip={this._showTooltip}
											parentEl={(el: HTMLElement) => (this.$parentEl = el as HTMLElement)}
											parentHeight={this._parentHeight}
											tooltipPositionX={this.tooltipPositionX}
											tooltipPositionY={this.tooltipPositionY}
											isLastMessage={reply.isLastMessage}
											avatarSrc={reply?.author?.avatar?.src}
											avatarAlt={reply?.author?.avatar?.alt}
											user={reply?.author?.name}
											date={reply?.date}
											literals={this.literals?.tooltipLiterals}
											readByMembers={reply?.readByMembers}
											body={reply?.message}
											isSender={reply?.sender}
											enableUnreadFlag={!alreadyHasUnreadFlag && reply?.unread && !reply?.sender}
											unreadFlagTxt={this.unreadFlagTxt}
											attachDocumentsTxt={this.literals?.attachDocumentsTxt}
											unreadCount={unreadedCount}
											files={reply?.attachedFiles}
											isEmployee={reply?.author?.isEmployee}
											isFromEmail={reply?.isFromEmail}
											emailTooltipPos={this.emailTooltipPos}
											emailTooltipText={this.literals.fromEmailTxt}
										/>
									);

									if (index === this.messages.length - 2 && this._activeScrollToBottom) {
										this.scrollToBottom();
									}
									alreadyHasUnreadFlag = reply?.unread;
									return replyRender;
								})}
							{this._showSkeletonBottom &&
								this._moreBottomMessages &&
								Array.from({ length: 5 }).map((_, index) => (
									<div role="status" aria-busy="true" aria-live="polite">
										<figure class={{ 'c-messages-skeleton': true, 'c-messages-skeleton--sender': index % 2 === 0 }}>
											<CDKMsgReplySkeleton sender={index % 2 === 0} />
										</figure>
									</div>
								))}
							{/* <li ref={(el) => this.$sendBar = el as HTMLElement}>
								{ openReplyPanel &&
										<scib-cdk-messages-sendbar
											class="c-messages-chat-sendbar"
											attachedFiles={this.attachedFiles}
											literals={this.literals}
											discardButtonTxt={this.literals?.discardButtonTxt}
											richEditorPlaceholderTxt={this.literals?.newMessagePlaceholderTxt}
											sendButtonTxt={this.literals?.sendButtonTxt}
											loading={this._loadingSend}
											style={{'display': openReplyPanel ? 'block' : 'none'}}
											activeConversationId={this.activeConversationId}
											onEventChange={() => this.scrollToBottom()}
											onEventDiscard={() => this.handleDiscard()}
											onEventSend={(ev: CustomEvent) => this.sendReply(ev.detail)}
											onEventAttach={(ev: CustomEvent) => this.eventAttachReply.emit({
												file: ev.detail,
												conversationId: this.activeConversationId
											})}
											onEventCancelFile={(ev: CustomEvent) => this.eventActionFile.emit({
												type: ECDKMessagesUserActions.cancelFile,
												payload: ev.detail
											})}
											onEventRetryFile={(ev: CustomEvent) => this.eventActionFile.emit({
												type: ECDKMessagesUserActions.retryFile,
												payload: ev.detail
											})}
										></scib-cdk-messages-sendbar>
									}
							</li> */}
						</ul>
					</div>
				)}
				{this._activeTab === ECDKChatTabIds.MSG && (
					<footer
						class={{
							'c-messages-chat-footer': true,
							'--open-reply-panel': openReplyPanel
						}}
					>
						<div ref={(el) => (this.$sendBar = el as HTMLElement)} style={{ display: openReplyPanel ? 'block' : 'none' }}>
							{openReplyPanel && (
								<scib-cdk-messages-sendbar
									// maxHeight={460}
									hide-discard
									isEmployee={this._isEmployee}
									class="c-messages-chat-sendbar"
									attachedFiles={this.attachedFiles}
									literals={this.literals}
									discardButtonTxt={this.literals?.discardButtonTxt}
									richEditorPlaceholderTxt={this.literals?.newMessagePlaceholderTxt}
									sendButtonTxt={this.literals?.sendButtonTxt}
									loading={this._loadingSend}
									reset={this._loadingSend}
									style={{ display: openReplyPanel ? 'block' : 'none' }}
									activeConversationId={this.activeConversationId}
									onEventChange={() => this.scrollToBottom()}
									onEventDiscard={() => this.handleDiscard()}
									onEventSend={(ev: CustomEvent) => this.sendReply(ev.detail)}
									onEventAttach={(ev: CustomEvent) =>
										this.eventAttachReply.emit({
											file: ev.detail,
											conversationId: this.activeConversationId
										})
									}
									onEventCancelFile={(ev: CustomEvent) =>
										this.eventActionFile.emit({
											type: ECDKMessagesUserActions.cancelFile,
											payload: ev.detail
										})
									}
									onEventRetryFile={(ev: CustomEvent) =>
										this.eventActionFile.emit({
											type: ECDKMessagesUserActions.retryFile,
											payload: ev.detail
										})
									}
									onEventDownloadConversation={(data) => this.handleActionsConversation(data)}
									onEventSendConversationEmail={(data) => this.handleActionsConversation(data)}
								></scib-cdk-messages-sendbar>
							)}
						</div>
					</footer>
				)}
				<div
					class={{ 'c-files-messages': true, 'c-files-messages__has-subheader': this._hasSubheader }}
					hidden={this._activeTab !== ECDKChatTabIds.FIL}
				>
					<p>{this.literals.attachDocumentsTxt}</p>
					<div class="c-files-container">
						<div class="c-files-table">
							<scib-atoms-button
								class="download-button"
								icon="download"
								size="m"
								level="tertiary"
								icon-position="leading"
								variant="basic"
								type="button"
								text={this.files?.topButtons[0]?.text}
								disabled={this._selectedRows.length === 0}
								onClick={() => {
									this.userAction.emit({
										type: 'downloadMessageFiles',
										payload: this._selectedRows
									});
									this._selectedRows = [];
									this.$filesTableRef.unSelectRows();
								}}
							></scib-atoms-button>
						</div>
					</div>
				</div>
				<div
					class={{ 'c-files-messages': true, 'c-files-messages__has-subheader': this._hasSubheader }}
					hidden={this._activeTab !== ECDKChatTabIds.USER}
				>
					<p>{this.literals.memberLabel}</p>
					<div class="c-table-container">
						<div class="c-counter-container">
							<div class="c-counter-element">{this.membersCounter}</div>
						</div>
						<div class="c-files-container">
							<div class="c-files-table c-files-table--members">{this.membersTable}</div>
						</div>
					</div>
				</div>
				{this.isContextualMenuMobileOpen && this.isMobile ? (
					<scib-ui-options-menu
						class=" ui-options"
						isMobile
						show-slot="false"
						id="1"
						active-tab={this._activeTab}
						buttons={this.optionButtonsMobile}
						onEventClickOptions={(data) => this.handleTabChange(data?.detail?.eventId)}
						onEventCloseMobile={() => this.handleOpenContextualMenu()}
					></scib-ui-options-menu>
				) : null}
			</Host>
		);
	}
}
