import { Component, h, Prop, Watch, State, Method, Listen, Event, EventEmitter, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

@Component({
	tag: 'scib-atoms-tooltip-card',
	styleUrl: 'tooltip-card.scss',
	shadow: false,
	scoped: true
})
export class AtomsTooltipCard {
	@Element() _hostRef: HTMLElement;

	@Prop({ mutable: true, reflect: true }) widthCard: number = 350;

	/**
	 * Propiedad privada zIndex
	 */
	@Prop({ mutable: true, reflect: true }) zIndex: string = '500';
	@State() $zIndex: string;
	@Watch('zIndex') _zIndexHandler(newValue: string) {
		// Siempre le agregamos 50 puntos
		this.$zIndex = String(Number(newValue) + 50);
	}

	/**
	 *  Tooltip card content
	 */
	@Prop({ reflect: true }) content: string;

	/**
	 *  Tooltip idBullet
	 */
	@Prop({ reflect: true }) idBullet: string;

	/**
	 *  Tooltip open
	 */
	@Prop({ reflect: true, mutable: true }) open: boolean;

	/**
	 * Cambia el valor de prev por un nuevo valor
	 */
	@Prop({ reflect: true, mutable: true }) prev: string;
	@State() $prev: string;
	@Watch('prev') _prevHandler(newValue: string) {
		if (newValue) {
			this.$prev = newValue;
		}
	}

	/**
	 *  Tooltip next
	 */
	@Prop({ reflect: true, mutable: true }) next: string;

	/**
	 * Change arrow position
	 */
	@Prop() arrowPosition: 'header' | 'right' | 'left' | 'top' | 'bottom' = 'left';
	@State() $arrowPosition: string;
	@Watch('arrowPosition') _arrowPositionHandler(newValue: string) {
		this.$arrowPosition = newValue;
	}

	/**
	 * Show and hide link
	 */
	@Prop({ reflect: true }) disableLink: boolean = false;
	@State() $disableLink: boolean;
	@Watch('disableLink') _disableLinkHandler(newValue: boolean) {
		this.$disableLink = newValue;
	}

	/**
	 * Change disable close
	 */
	@Prop() disableClose: boolean = false;
	@State() $disableClose: boolean;
	@Watch('disableClose') _disableCloseHandler(newValue: boolean) {
		this.$disableClose = newValue;
	}

	/**
	 * Change tooltip card title
	 */
	@Prop() tooltipCardTitle: string;
	@State() $tooltipCardTitle: string;
	@Watch('tooltipCardTitle') _tooltipCardTitleHandler(newValue: string) {
		this.$tooltipCardTitle = newValue;
	}

	/**
	 * Change link title
	 */
	@Prop() linkTitle: string;
	@State() $linkTitle: string;
	@Watch('linkTitle') _linkTitleHandler(newValue: string) {
		this.$linkTitle = newValue;
	}

	/**
	 * Change button title
	 */
	@Prop() btnTitle: string;
	@State() $btnTitle: string;
	@Watch('btnTitle') _btnTitleHandler(newValue: string) {
		this.$btnTitle = newValue;
	}

	/**
	 *  ELemento, y su posicion en x e Y
	 */
	@State() element: HTMLElement;

	/**
	 *  Posicion en x
	 */
	@State() $posX: string;
	@Watch('$posX') _handlerChangePositionX(newValueX: string) {
		this.$posX = newValueX;
	}

	/**
	 *  Posicion en y
	 */
	@State() $posY: string;
	@Watch('$posY') _handlerChangePositionY(newValueY: string) {
		this.$posY = newValueY;
	}

	/**
	 * Listen bullet Click
	 */
	@Listen('bulletClick', { target: 'body' })
	todoCompletedHandler(event: CustomEvent<any>) {
		if (event.detail === this.idBullet) {
			this.open = true;
		} else if (event.detail !== this.idBullet) {
			this.open = false;
		}
	}
	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._arrowPositionHandler(this.arrowPosition);
		this._disableLinkHandler(this.disableLink);
		this._prevHandler(this.prev);
		this._disableCloseHandler(this.disableClose);
		this._tooltipCardTitleHandler(this.tooltipCardTitle);
		this._linkTitleHandler(this.linkTitle);
		this._btnTitleHandler(this.btnTitle);
		this._zIndexHandler(this.zIndex);
		this.element = document.getElementById(`${this.idBullet}`);
		this.responsive();
	}

	/**
	 * Metodo para cerrar la  modal
	 */
	@Method() async closeModal() {
		this._closeModal();
	}

	/**
	 *  Evento que se lanza cuando se cierra la modal/cardTooltip
	 */
	@Event() closeCardTooltip: EventEmitter<{ id: string; close: boolean }>;

	/**
	 *  Evento que se lanza cuando se abre la modal/cardTooltip
	 */
	@Event() openInfo: EventEmitter<string>;
	/**
	 *  Evento que se lanza cuando se cierra la modal/cardTooltip final
	 */
	@Event() closeTutorial: EventEmitter;

	/**
	 * Cierra la modal
	 */
	private _closeModal() {
		this.open = false;
		this.closeCardTooltip.emit({ id: this.idBullet, close: true });
	}

	/**
	 * metodo para pasar a la siguiente card
	 */
	private _handleNext(idNext: string) {
		if (idNext) {
			this.openInfo.emit(idNext);
			this.open = false;
		} else {
			this.closeTutorial.emit();
		}
	}

	private responsive() {
		const margenPadding = 7;
		const marginArrow = 25;
		const marginTop = 10;
		const margenRight = 380;
		const margenTop = 270;

		new ResizeObserver((entries) => {
			entries.forEach(() => {
				const { width, height, x, y } = this.element.getBoundingClientRect();
				switch (this.arrowPosition) {
					case 'left':
						this.$posX = `${width + x + margenPadding + marginArrow}px`;
						this.$posY = `${y - margenPadding - marginTop}px`;
						break;
					case 'right':
						this.$posX = `${x - margenPadding - marginArrow - margenRight}px`;
						this.$posY = `${y - margenPadding - marginTop}px`;
						break;
					case 'top':
						this.$posX = `${width / 2 + x + margenPadding - this.widthCard / 2}px`;
						this.$posY = `${y - margenTop + marginArrow}px`;
						break;
					case 'bottom':
						this.$posX = `${width / 2 + x + margenPadding - this.widthCard / 2}px`;
						this.$posY = `${height + y + marginArrow}px`;
						break;
					case 'header':
						this.$posX = `${x - this.widthCard / 2}px`;
						this.$posY = `${height + y * 2 + marginArrow}px`;
						break;
				}
			});
		}).observe(document.querySelector('html'));
	}

	private positionArrow(arrowPosition) {
		switch (arrowPosition) {
			case 'left':
				return {
					borderLeft: '15px solid transparent',
					borderRight: '15px solid #fff',
					left: '-29px',
					top: 'calc(7%)'
				};
			case 'right':
				return {
					borderLeft: '15px solid #fff',
					borderRight: '15px solid transparent',
					left: 'calc(100% - 1px)',
					top: 'calc(7%)'
				};
			case 'top':
				return {
					borderLeft: '15px solid #fff',
					borderRight: '15px solid transparent',
					bottom: 'calc(-13%)',
					left: 'calc(45%)',
					transform: 'rotate(90deg)'
				};
			case 'bottom':
			case 'header':
				return {
					borderLeft: '15px solid #fff',
					borderRight: '15px solid transparent',
					bottom: 'calc(100% - 1px)',
					left: 'calc(45%)',
					transform: 'rotate(270deg)'
				};
		}
	}

	render() {
		return (
			<div
				class={{
					'mdc-tooltip-card__container': true,
					'--right': this.arrowPosition === 'right',
					'--left': this.arrowPosition === 'left',
					'--top': this.arrowPosition === 'top',
					'--bottom': this.arrowPosition === 'bottom',
					'--header': this.arrowPosition === 'bottom'
				}}
				style={{
					display: this.open ? 'flex' : 'none',
					left: this.$posX,
					top: this.$posY,
					zIndex: this.$zIndex,
					position: 'relative',
					flexDirection: 'column',
					backgroundColor: '#fff',
					padding: '18px',
					borderRadius: '10px',
					boxShadow: '1px 1px 20px rgba(0, 0, 0, 0.2)',
					maxWidth: `${this.widthCard}px`
				}}
			>
				<div
					style={{
						content: '',
						display: 'inline-block',
						borderTop: '15px solid transparent',
						borderBottom: '15px solid transparent',
						position: 'absolute',
						...this.positionArrow(this.arrowPosition)
					}}
				></div>
				<div
					class="mdc-tooltip-card__header"
					style={{
						display: 'flex',
						justifyContent: 'space-between'
					}}
				>
					<strong
						class="mdc-tooltip-card__title"
						style={{
							fontSize: '19px'
						}}
					>
						{this.tooltipCardTitle}
					</strong>
					{!this.$disableClose && (
						<div
							class="mdc-toolti
							p-card__header__close"
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'flex-start',
								cursor: 'pointer',
								'--icon-content': 'var(--theme-scib-icon-close-thin)'
							}}
						>
							<i class="icon" onClick={() => this._closeModal()} />
						</div>
					)}
				</div>
				<div
					class="mdc-tooltip-card__content"
					slot="content"
					style={{
						padding: '5px 10% 25px 0',
						lineHeight: '1.4',
						whiteSpace: 'pre-wrap'
					}}
				>
					<span innerHTML={this.content}></span>
				</div>
				{!this.$disableLink && (
					<div
						class="mdc-tooltip-card__content-link"
						style={{
							display: 'flex',
							fontSize: '18px',
							fontWeight: '400',
							color: 'red',
							paddingBottom: '20px',
							cursor: 'pointer'
						}}
					>
						<div class="mdc-tooltip-card__link">{this.linkTitle}</div>
						<div class="mdc-tooltip-card__link">
							<span style={{ '--icon-content': `var(--theme-scib-icon-chevron)` }}>
								<i class="icon" />
							</span>
						</div>
					</div>
				)}
				<div slot="actions">
					<footer
						class="mdc-tooltip-card__footer"
						style={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'flex-end'
						}}
					>
						{this.$prev && (
							<div class="mdc-tooltip-card__btnBack">
								<scib-atoms-button
									text="Button"
									icon="chevron-left"
									level="secondary"
									variant="icon"
									type="button"
									onClick={() => this._handleNext(this.prev)}
								></scib-atoms-button>
							</div>
						)}
						<div
							class="mdc-tooltip-card__btnNext"
							style={{
								marginLeft: '10px'
							}}
						>
							<scib-ui-button primary onEventClick={() => this._handleNext(this.next)}>
								{this.btnTitle}
							</scib-ui-button>
						</div>
					</footer>
				</div>
			</div>
		);
	}
}
