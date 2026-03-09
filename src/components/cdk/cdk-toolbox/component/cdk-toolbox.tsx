import { Component, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ILiterals, IToolboxCoordinate, IToolboxUserInfo } from '../models/cdk-toolbox.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-toolbox',
	styleUrl: 'cdk-toolbox.scss',
	shadow: false,
	scoped: false,
})
export class CDKToolbox {
	$dragButton: HTMLElement;

	initDrag: any;
	finishDrag: any;

	///// Variables for draggable component position ///
	pos1;
	pos2;
	pos3;
	pos4;
	/////

	/** Literals for component */
	@Prop({ reflect: true }) literals: ILiterals | string;
	@State() _literals: ILiterals;
	@Watch('literals') parseLiterals(newLiterals: ILiterals | string) {
		this._literals = _parseProp<ILiterals>(newLiterals as string);
	}

	/** User info */
	@Prop({ reflect: true }) userInfo: IToolboxUserInfo | string;
	@State() _userInfo: IToolboxUserInfo;
	@Watch('userInfo') parseUserInfo(newData: IToolboxUserInfo | string) {
		this._userInfo = _parseProp<IToolboxUserInfo>(newData as string);
	}

	/** Coordinates for position of toolbox */
	@Prop({ reflect: true }) coordinate: IToolboxCoordinate | string;
	@State() _coordinate: IToolboxCoordinate;
	@Watch('coordinate') parseCoordinate(newData: IToolboxCoordinate | string) {
		this._coordinate = _parseProp<IToolboxCoordinate>(newData as string);
	}

	/** Set notifications info */
	@Prop({ reflect: true }) notifications: string;
	@State() _notifications: string;
	@Watch('notifications') parseNotifications(newData: string) {
		this._notifications = newData;

		if (this._notifications?.length > 2) {
			this._tooMuchNotifications = true;
		} else {
			this._tooMuchNotifications = false;
		}
	}

	// /** Set z-index value */
	// @Prop({ reflect: true }) zIndex: number | string = "400";
	// @State() _zIndex: string;
	// @Watch('zIndex') parseZIndex(newData: number | string) {
	// 	this._zIndex = _parseProp<string>(newData.toString() as string);
	// }

	@State() _tooMuchNotifications: boolean = false;

	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this._positionToolboxDefault(true);
	}

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseUserInfo(this.userInfo);
		this.parseCoordinate(this.coordinate);
		this.parseNotifications(this.notifications);

		this._positionToolboxDefault();
	}

	/** Ciclo de vida ejecutado tras el primer Render después de la carga */
	componentDidLoad() {
		this.$dragButton.addEventListener('mousedown', this._dragMouseDown.bind(this));
	}

	/** Ciclo de vida al eliminar la instancia del componente */
	disconnectedCallback() {}

	_positionToolboxDefault(fromResize?) {
		if (!this._coordinate || fromResize) {
			this._coordinate = {
				x: window.innerWidth - 260,
				y: window.innerHeight - 240,
			};
		}
	}

	_dragMouseDown(e) {
		e = e || window.event;
		e.preventDefault();
		this.pos3 = e.clientX;
		this.pos4 = e.clientY;
		this.initDrag = this._elementDrag.bind(this);
		this.finishDrag = this._closeDragElement.bind(this);
		document.addEventListener('mousemove', this.initDrag);
		document.addEventListener('mouseup', this.finishDrag);
		this.eventUserAction.emit({
			type: 'toolboxStartMoving',
		});
	}

	_elementDrag(e?) {
		const toolbox = document.getElementById('cdk-toolbox-id');
		e = e || window.event;
		e.preventDefault();
		this.pos1 = this.pos3 - e.clientX;
		this.pos2 = this.pos4 - e.clientY;
		this.pos3 = e.clientX;
		this.pos4 = e.clientY;
		toolbox.style.top = toolbox.offsetTop - this.pos2 + 'px';
		toolbox.style.left = toolbox.offsetLeft - this.pos1 + 'px';
	}

	_closeDragElement() {
		document.removeEventListener('mouseup', this.finishDrag);
		document.removeEventListener('mousemove', this.initDrag);
		this.eventUserAction.emit({
			type: 'toolboxFinishMoving',
		});
	}

	/** User actions events for toolbox */
	@Event() eventUserAction: EventEmitter;

	render() {
		return (
			<div id="cdk-toolbox-id" class="cdk-toolbox" style={{ top: this._coordinate.y + 'px', left: this._coordinate.x + 'px' }}>
				<div class="cdk-toolbox__menu">
					<scib-ui-avatar
						class="cdk-toolbox__avatar"
						images={[
							{
								src: this._userInfo.avatar.src,
								alt: this._userInfo.avatar.alt,
							},
						]}
						is-employee={this._userInfo.isEmployee}
						tooltip-title={this._literals?.avatarBtn}
						onClick={() => {
							this.eventUserAction.emit({
								type: 'openMyProfile',
							});
							event.stopPropagation();
						}}
					></scib-ui-avatar>
					<scib-ui-button
						class="cdk-toolbox__menu-btn cdk-toolbox__menu-btn--drag"
						nobackground
						icon="icon-tools"
						hide-txt
						small
						tooltip={this._literals?.moveBtn}
						ref={el => (this.$dragButton = el as HTMLElement)}
					></scib-ui-button>
					<scib-ui-button
						class={{
							'cdk-toolbox__menu-btn': true,
							'cdk-toolbox__menu-btn--messages': this._notifications && this._notifications !== '',
							'cdk-toolbox__menu-btn--more': this._tooMuchNotifications,
						}}
						data-title={this._notifications}
						nobackground
						icon="icon-comm"
						hide-txt
						small
						tooltip={this._literals?.commBtn}
						onEventClick={() => {
							this.eventUserAction.emit({
								type: 'openCommunicationFr',
							});
							event.stopPropagation();
						}}
					></scib-ui-button>
					<scib-ui-button
						class="cdk-toolbox__menu-btn"
						nobackground
						icon="icon-go-to-web"
						hide-txt
						small
						tooltip={this._literals?.newTabBtn}
						onEventClick={() => {
							this.eventUserAction.emit({
								type: 'openNewTab',
							});
							event.stopPropagation();
						}}
					></scib-ui-button>
				</div>
				<scib-ui-button
					class="cdk-toolbox__close-btn"
					nobackground
					icon="icon-close"
					hide-txt
					small
					tooltip={this._literals?.closeBtn}
					onEventClick={() => {
						this.eventUserAction.emit({
							type: 'closeToolbox',
						});
						event.stopPropagation();
					}}
				></scib-ui-button>
			</div>
		);
	}
}
