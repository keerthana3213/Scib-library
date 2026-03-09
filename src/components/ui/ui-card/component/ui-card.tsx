import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-card',
	styleUrl: 'ui-card.scss',
	shadow: false,
	scoped: false,
})
export class UICard {
	/** Id unique for the card */
	@Prop({ reflect: true }) cardId: string;

	/** Opción de inhabilitar hover */
	@Prop({ reflect: true }) disableHover?: boolean;

	/** Tooltip del anchor*/
	@Prop({ reflect: true }) tooltip: string;
	/** Arrow */
	@Prop({ reflect: false, mutable: true }) iconArrow: boolean;

	@Watch('tooltip') tooltipChange(newVal: string) {
		this._tooltip = newVal;
	}
	@State() _tooltip: string;

	/** Apply specific class for ism card */
	@Prop({ reflect: false, mutable: true }) ismcard: boolean;

	@Watch('ismcard') ismCardChange(newVal: boolean) {
		this._ismcard = newVal;
	}
	@State() _ismcard: boolean;
	/** Check if card is hover */
	@State() _isHover: boolean;
	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.tooltipChange(this.tooltip);
		this.ismCardChange(this.ismcard);
	}

	/** Emite un evento con el id de la conversación que se abrirá */
	@Event() eventOnCardClick: EventEmitter<string>;

	render() {
		return (
			<Host>
				<a
					class={{
						'ui-card-container': true,
						'ui-card-container__disabled': this.disableHover,
						'ui-card-container--arrow': this.iconArrow,
						'ui-card-container__ism-card-arrow': this._ismcard,
						'hover': this._isHover,
					}}
					href="javascript:void(0)"
					title={this._tooltip}
					onClick={() => {
						this.eventOnCardClick.emit(this.cardId);
						event.stopPropagation();
					}}
					onMouseEnter={() => {
						if (!this.disableHover) this._isHover = true;
					}}
					onMouseLeave={() => {
						if (!this.disableHover) this._isHover = false;
					}}
				>
					<article class={{ 'ui-card-article': true, 'ui-card-article__ism-card': this._ismcard }}>
						<slot />
					</article>
				</a>
			</Host>
		);
	}
}
