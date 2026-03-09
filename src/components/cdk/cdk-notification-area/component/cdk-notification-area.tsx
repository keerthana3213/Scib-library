import { CDKNotificationAreaNotification } from '../fragments/cdk-notification-area-notification.fragment';
import { Component, Host, h, Prop, Element, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { CDKNotificationAreaLoading } from '../fragments/cdk-notification-area-loading.fragment';
import { CDKNotificationAreaBubble } from '../fragments/cdk-notification-area-bubble.fragment';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import ResizeObserver from 'resize-observer-polyfill';
import Draggable from '@shopify/draggable';
import {
	ICDKNotificationAreaItem,
	ICDKNotificationAreaLiterals,
	ICDKNotificationAreaProfile,
	ICDKNotificationAreaUserAction,
	ECDKNotificationAreaUserActions,
	_ICDKNotificationAreaDroppablePositions,
} from '../models/cdk-notification-area.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-notification-area',
	styleUrl: 'cdk-notification-area.scss',
	shadow: false,
	scoped: true,
})
export class CDKNotificationArea {
	/** Establece el area de notificaciones como "abierta" */
	@Prop({ mutable: true, reflect: true }) open: boolean = false;

	/** Establece el z-index del componente (por defecto, 400)" */
	@Prop({ reflect: true }) zIndex: string = '400';

	/** Posiciona el componente como "fixed" */
	@Prop({ reflect: true }) fixed: boolean = false;

	/** Listado de notificaciones a ser mostradas */
	@Prop() notifications: string | ICDKNotificationAreaItem[];

	/** Número total de notificaciones (todas las páginas del backend) */
	@Prop() notificationsCount: number;

	/** Información del usuario para la cabecera de bienvenida */
	@Prop() profile: string | ICDKNotificationAreaProfile;

	/** Listado de notificaciones a ser mostradas */
	@Prop() literals: string | ICDKNotificationAreaLiterals;

	/** Emite el bus de eventos */
	@Event() userAction: EventEmitter<ICDKNotificationAreaUserAction>;

	// Refs
	@Element() $host: HTMLElement;

	// Component States
	@State() _notifications: ICDKNotificationAreaItem[];
	@State() _profile: ICDKNotificationAreaProfile;
	@State() _literals: ICDKNotificationAreaLiterals;
	@State() _droppableArea: _ICDKNotificationAreaDroppablePositions = { x: 'right', y: 'bottom' };
	@State() _draggablePositionTransf: string;
	@State() _dragging: boolean;
	@State() _headerSize: number = 0;
	@State() _loadingScroll: boolean = false;
	@State() _maxNotificationsReached: boolean;
	@State() _deleting: boolean;

	$notificationContent: HTMLElement;
	_dragInstance: Draggable.Draggable<Draggable.DraggableEventNames | Draggable.MirrorEventNames>;
	_bubblePositionCache: { x: number; y: number };
	_localstoragePositionKey = 'scib-cdk-notification-area__areadrop';
	_headerResizeObserver: ResizeObserver;

	@Watch('notifications') notificationsChange(newVal: string | ICDKNotificationAreaItem[]) {
		this._notifications = _parseProp(newVal);
		this._loadingScroll = false;

		// this._clearNotsAnimations();

		// Chequea si el nº de notificaciones coincide con el máximo
		if (this.notifications) {
			let notificationsLength = 0;
			this._notifications.forEach(notification => {
				if (notification.notificationNumber === null) {
					notificationsLength++;
				} else {
					notificationsLength = notificationsLength + notification.notificationNumber;
				}
			});
			this._maxNotificationsReached = notificationsLength >= this.notificationsCount;
		}
	}

	@Watch('profile') profileChange(newVal: string | ICDKNotificationAreaProfile) {
		this._profile = _parseProp(newVal);
	}

	@Watch('literals') literalsChange(newVal: string | ICDKNotificationAreaLiterals) {
		this._literals = _parseProp(newVal);
	}

	@Watch('open') openChange(newVal: boolean) {
		newVal
			? this.userAction.emit({ type: ECDKNotificationAreaUserActions.areaOpened })
			: this.userAction.emit({ type: ECDKNotificationAreaUserActions.areaClosed });
		this._loadingScroll = false;
		this.$notificationContent.scrollTop = 0;
		this._recalcAreaPosition();
	}

	@Listen('resize', { target: 'window' }) handleWindowSizeChanges() {
		this._recalcAreaPosition();
	}

	/** Escucha los eventos de tecla */
	@Listen('keydown', { target: 'document' }) handleKeyDown(ev: KeyboardEvent) {
		if (ev.key === 'Escape') {
			this.open = false;
		}
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.profileChange(this.profile);
		this.literalsChange(this.literals);
		this.notificationsChange(this.notifications);
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {
		this._initDragInstance();
		this._listenHeaderSizeChanges();
	}

	// /** Ciclo de vida al eliminar la instancia del componente */
	// componentDidUnload() {
	// 	this._headerResizeObserver.disconnect();
	// 	this._dragInstance.destroy();
	// }

	/** Escucha los cambios en el tamaño del header para evitar que la burbuja se pise con el header */
	_listenHeaderSizeChanges() {
		// Este selector no es ShadowDOM Friendly.
		// De activar el ShadowDOM, debería o bien estar en el contexto de todo el header
		// O bien debería recibir este elemento desde una prop.
		const $header = document.querySelector('sgcb-c-header') as HTMLElement;

		// // Calcula el alto del header
		if ($header) {
			this._headerResizeObserver = new ResizeObserver(_ => {
				const newHeaderSize = $header?.clientHeight || 48;
				if (this._headerSize !== newHeaderSize) {
					this._headerSize = newHeaderSize;
					this._recalcAreaPosition();
				}
			});

			// Inicializa el observador
			this._headerResizeObserver.observe($header);
		}
	}

	/**  Limpia la animación para evitar que salte innecesariamente */
	_clearNotsAnimations() {
		setTimeout(() => {
			const $cards = this.$host.querySelectorAll('.c-areahub-not') as unknown as HTMLElement[];
			$cards.forEach(el => {
				el.style.animation = 'none';
				(el.firstElementChild as HTMLElement).style.animation = 'none';
			});
		}, 0);
	}

	/** Inicializa la instance del drag/drop */
	_initDragInstance() {
		// Inicializa la instancia de Draggable
		this._dragInstance = new Draggable.Draggable(this.$host, {
			draggable: '[data-draggable]',
			distance: 100,
			delay: 200,
		});

		// Recupera la posición guardada en el LocalStorage
		const savedPosition = window.localStorage.getItem(this._localstoragePositionKey);
		if (savedPosition) {
			this._droppableArea = JSON.parse(savedPosition);
			this._recalcAreaPosition();
		} else {
			this._droppableArea = { x: 'right', y: 'bottom' };
		}

		// Listener "on start"
		this._dragInstance.on('drag:start', (event: any) => {
			const currentTarget = event.originalEvent.target;

			// Función que comprueba desde el lugar donde se empieza el drag, y si coincide con la clase pasada en
			// el array se cancela el drag para poder realizar acciones dentro del elemento drag
			if (this._isPrevented(currentTarget, ['c-areahub-nots-content'])) {
				event.cancel();
			}
		});

		// Listener "on move"
		this._dragInstance.on('drag:move', () => {
			// Habilita la animación del elemento draggable
			this._dragging = true;
			this._clearNotsAnimations();

			const $mirror = this.$host.querySelector('.draggable-mirror') as HTMLElement;
			const position = $mirror?.getClientRects()[0];
			if (position) {
				this._bubblePositionCache = { x: position.x, y: position.y };
			}
		});

		// Listener "on drop"
		this._dragInstance.on('drag:stop', () => {
			this._droppableArea = this._getArea(this._bubblePositionCache);
			window.localStorage.setItem('scib-cdk-notification-area__areadrop', JSON.stringify(this._droppableArea));
			this._recalcAreaPosition();

			// Deshabilita la animación del elemento cuando termina
			setTimeout(() => (this._dragging = false), 350);
		});
	}

	_isPrevented(element, classesToPrevent) {
		let currentElem = element;
		let isParent = false;

		while (currentElem) {
			const hasClass = Array.from(currentElem.classList).some(cls => classesToPrevent.includes(cls));
			if (hasClass) {
				isParent = true;
				currentElem = undefined;
			} else {
				currentElem = currentElem.parentElement;
			}
		}

		return isParent;
	}

	/** Obtiene el area de drop disponible en función de la posición donde se encuentre el elemento */
	_getArea(position: { x: number; y: number }): _ICDKNotificationAreaDroppablePositions {
		return {
			x: position.x < window.innerWidth / 2 ? 'left' : 'right',
			y: position.y < window.innerHeight / 2 ? 'top' : 'bottom',
		};
	}

	/** Recalcula la transformación del elemento draggable */
	_recalcAreaPosition() {
		setTimeout(() => {
			const $areahub = this.$host.querySelector('.c-areahub') as HTMLElement;
			const $bubble = this.$host.querySelector('.c-bubble') as HTMLElement;
			const $draggableContainer = this.$host.querySelector('[data-draggable]') as HTMLElement;

			// Calcula en el contenedor draggable el tamaño del hijo que corresponda
			const elementSize = {
				width: this.open ? $areahub?.clientWidth : $bubble?.clientWidth,
				heigth: this.open ? $areahub?.clientHeight : $bubble?.clientHeight,
			};
			$draggableContainer.style.width = elementSize.width + 'px';
			$draggableContainer.style.height = elementSize.heigth + 'px';

			// Calcula la posición en el viewport en función del tamaño de la ventana
			const padding = window.innerWidth >= 768 ? 16 : 8;

			const headerSize = window.innerWidth >= 768 ? this._headerSize : 0;

			const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

			const position = {
				x:
					this._droppableArea.x === 'left'
						? padding
						: window.innerWidth - padding - $draggableContainer?.clientWidth - scrollbarWidth,
				y: this._droppableArea.y === 'top' ? padding + headerSize : window.innerHeight - padding - $draggableContainer?.clientHeight,
			};

			// Setea el transform que debe aplicar
			this._draggablePositionTransf = `translate3d(${position.x + 'px'}, ${position.y + 'px'}, 0px)`;

			$areahub.style.height =
				($areahub.clientHeight + headerSize > window.innerHeight
					? this._droppableArea.y === 'top'
						? $areahub.clientHeight - position.y
						: $areahub.clientHeight - headerSize - padding
					: $areahub.clientHeight) + 'px';
		});
	}

	/** Solicita más notificaciones cuando se alcanza el scroll */
	_requestMoreNotifications() {
		const $scrollContainer = this.$host.querySelector('[data-scroll]') as HTMLElement;
		const scroll = {
			position: $scrollContainer.scrollTop + $scrollContainer.clientHeight,
			height: $scrollContainer.scrollHeight,
		};
		const threshold = 100; // Tolerancia antes de alcanzar el bottom completamente
		const isBottomReached = scroll.height - scroll.position < threshold;
		if (isBottomReached && !this._loadingScroll && !this._maxNotificationsReached) {
			this._loadingScroll = true;
			this.userAction.emit({ type: ECDKNotificationAreaUserActions.requestMoreNotifications });
		}
	}

	/** Maneja el estado de la papelera */
	_handleThrashClick() {
		this._deleting = false;
		this.userAction.emit({ type: ECDKNotificationAreaUserActions.clearNotifications });
	}

	/** Maneja el click en la notificación */
	_handleNotificationClick(notification: ICDKNotificationAreaItem) {
		this.userAction.emit({ type: ECDKNotificationAreaUserActions.clickNotification, payload: notification });
	}

	/** agrupa las notificaciones para que se muestren en grupos según su fecha */
	_agroupNotifications(
		notifications: ICDKNotificationAreaItem[],
	): Array<ICDKNotificationAreaItem | { elementType: 'header'; group: string }> {
		// Acumula las notificaciones con las cabeceras
		let groupsArray = [];

		// Acumula los grupos por los que ya ha pasado;
		let groupsRead = {};

		if (notifications) {
			// Itera sobre las notificaciones,
			notifications.forEach(not => {
				if (groupsRead[not.dateGroupTxt]) {
					groupsArray.push(not);
				} else {
					// si es la primera del grupo, mete la cabecera + la notificación en el acumulador
					if (not.dateGroupTxt) groupsArray.push({ elementType: 'header', group: not.dateGroupTxt });
					groupsArray.push(not);
					// y marca en el acumulador de grupos como ya pasado por ella.
					groupsRead[not.dateGroupTxt] = true;
				}
			});
		}

		return groupsArray;
	}

	render() {
		const notificationsGroup = this._agroupNotifications(this._notifications);
		const showInfiniteScrollLoading = this._loadingScroll && !this._maxNotificationsReached;
		const emptyNotifications = this.notificationsCount === 0 || this._notifications?.length === 0;

		return (
			<Host style={{ 'z-index': this.zIndex }}>
				<div
					class="c-notarea"
					data-draggable
					style={{
						transform: this._draggablePositionTransf,
						transition: this._dragging ? null : 'none',
					}}
				>
					{/* Burbuja (open = false) */}
					<CDKNotificationAreaBubble
						profile={this._profile}
						position={this._droppableArea}
						isCollapsed={this.open}
						labelTxt={this._literals?.notificationsLabel || '[[notificationsLabel]]'}
						notificationsCount={this.notificationsCount}
						onBubbleClick={() => (this.open = !this.open)}
					/>

					{/* Notification area hub (open = true) */}
					<div
						class={{ 'c-areahub': true, '--expanded': this.open }}
						style={{
							[this._droppableArea.y]: this.open && '0',
							[this._droppableArea.x]: this.open && '0',
							'width': window.innerWidth < 768 ? window.innerWidth - 16 + 'px' : null,
							'height': window.innerHeight < 768 ? window.innerHeight - 16 + 'px' : null,
							'transform-origin': `${this._droppableArea.x} ${this._droppableArea.y}`,
						}}
					>
						<div class="c-areahub-content">
							{/* Header */}
							<header class="c-areahub-header">
								<div class="c-areahub-avatar-container">
									<div
										class="c-areahub-avatar --medium"
										style={{
											'background-image': this._profile?.avatarPhotoSrc
												? `url(${this._profile.avatarPhotoSrc}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' x='0px' y='0px' viewBox='0 0 350 350' class='sc-scib-ui-avatar' style=' height: 100%25; width: 100%25; fill: %23b5b5b5;%0A'%3E%3Cg class='sc-scib-ui-avatar'%3E%3Cpath d='M175,171.173c38.914,0,70.463-38.318,70.463-85.586C245.463,38.318,235.105,0,175,0s-70.465,38.318-70.465,85.587 C104.535,132.855,136.084,171.173,175,171.173z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M41.909,301.853C41.897,298.971,41.885,301.041,41.909,301.853L41.909,301.853z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M308.085,304.104C308.123,303.315,308.098,298.63,308.085,304.104L308.085,304.104z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3Cpath d='M307.935,298.397c-1.305-82.342-12.059-105.805-94.352-120.657c0,0-11.584,14.761-38.584,14.761 s-38.586-14.761-38.586-14.761c-81.395,14.69-92.803,37.805-94.303,117.982c-0.123,6.547-0.18,6.891-0.202,6.131 c0.005,1.424,0.011,4.058,0.011,8.651c0,0,19.592,39.496,133.08,39.496c113.486,0,133.08-39.496,133.08-39.496 c0-2.951,0.002-5.003,0.005-6.399C308.062,304.575,308.018,303.664,307.935,298.397z' class='sc-scib-ui-avatar'%3E%3C/path%3E%3C/g%3E%3C/svg%3E")`
												: null,
										}}
									>
										{!this._profile?.avatarPhotoSrc && (
											<span>
												{this._profile?.name?.slice(0, 1)}
												{this._profile?.surname?.slice(0, 1)}
											</span>
										)}
									</div>
								</div>
								<div class="c-areahub-header-txt">
									<p class="c-areahub-avatar-greeting">
										{this._profile?.greetingTxt} {this._profile?.name}
									</p>
									<p class="c-areahub-avatar-welcome">{this._profile?.welcomeTxt}</p>
								</div>
								<button class="c-areahub-close" onClick={() => (this.open = false)}>
									<span class="u-icon icon-close"></span>
								</button>
							</header>

							{/* Content */}
							<section class="c-areahub-nots-container">
								<div
									class="c-areahub-nots-content"
									style={{ 'background-image': emptyNotifications ? null : 'none' }}
									role="list"
									data-scroll
									onScroll={() => this._requestMoreNotifications()}
									ref={el => (this.$notificationContent = el as HTMLElement)}
								>
									<div class="c-areahub-nots-scrollcontent">
										<header class="c-areahub-nots-header">
											{this._deleting ? (
												<p class="c-areahub-nots-header-title">{this._literals.clearAllTxt || '[[clearAllTxt]]'}</p>
											) : (
												<p class="c-areahub-nots-header-title">
													{this._literals.notificationsLabel || '[[notificationsLabel]]'}{' '}
													{!emptyNotifications && this.notificationsCount}
												</p>
											)}
											{!emptyNotifications && (
												<div class="c-areahub-nots-actions">
													{!this._deleting && (
														<scib-ui-button
															class="c-areahub-button"
															secondary
															ultra-small
															hide-txt
															icon="icon-delete"
															onEventClick={() => (this._deleting = true)}
														>
															{this._literals.deleteTxt || '[[deleteTxt]]'}
														</scib-ui-button>
													)}
													{this._deleting && [
														<scib-ui-button
															class="c-areahub-button"
															secondary
															ultra-small
															disableMinWidth
															onEventClick={() => (this._deleting = false)}
														>
															{this._literals.cancelTxt || '[[cancelTxt]]'}
														</scib-ui-button>,
														<scib-ui-button
															class="c-areahub-button"
															primary
															ultra-small
															disableMinWidth
															noPaddingLeft
															icon="icon-delete"
															onEventClick={() => this._handleThrashClick()}
														>
															{this._literals.clearTxt || '[[clearTxt]]'}
														</scib-ui-button>,
													]}
												</div>
											)}
										</header>
										{notificationsGroup.map((element, index) =>
											element.elementType === 'header' ? (
												<p key={element.group} class="c-areahub-nots-date">
													{element.group}
												</p>
											) : (
												<CDKNotificationAreaNotification
													index={index}
													key={(element as ICDKNotificationAreaItem).id}
													notification={element as ICDKNotificationAreaItem}
													moreText={this._literals.moreText}
													onNotificationClick={() =>
														this._handleNotificationClick(element as ICDKNotificationAreaItem)
													}
												/>
											),
										)}
										<CDKNotificationAreaLoading show={showInfiniteScrollLoading} />
									</div>
									{emptyNotifications && (
										<span class="c-areahub-nots-content__empty-notifications">{this._literals.emptyTxt}</span>
									)}
								</div>
							</section>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
