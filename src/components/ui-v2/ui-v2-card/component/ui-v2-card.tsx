import { Component, Host, h, Prop, Element, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { MDCRipple } from '@material/ripple';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-v2-card',
	styleUrl: 'ui-v2-card.scss',
	shadow: true
})
export class UI_V2Card {
	@Element() _hostRef: HTMLElement;

	/** Id unique for the card */
	@Prop() cardId: string;

	/** Opción de tipo de card */
	@Prop({ reflect: true }) type: 'elevated' | 'outlined' | 'link' | 'alternative' | 'linkWithoutBorder' | 'default' = 'default';

	/** Tooltip del anchor*/
	@Prop() tooltip: string;

	@State() $tooltip: string;
	@Watch('tooltip') tooltipChange(newVal: string) {
		this.$tooltip = newVal;
	}

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.tooltipChange(this.tooltip);
	}

	/**
	 *
	 */
	componentDidLoad() {
		MDCRipple.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-card'));
	}

	/** Emite un evento con el id de la card que se abrirá */
	@Event() eventOnCardClick: EventEmitter<string>;

	render() {
		return (
			<Host>
				<div
					class={{
						'mdc-card mdc-card--filled': true,
						'mdc-card--outlined': this.type === 'outlined' || this.type === 'link',
						'mdc-card--elevated': this.type === 'elevated',
						'mdc-card--link': this.type === 'link' || this.type === 'linkWithoutBorder'
					}}
					onClick={() => {
						if (this.type === 'link' || this.type === 'linkWithoutBorder') this.eventOnCardClick.emit(this.cardId);
					}}
					{...(this.type === 'link' || this.type === 'linkWithoutBorder' ? { title: this.$tooltip } : {})}
				>
					<div class="mdc-card__container">
						<slot />
					</div>
				</div>
			</Host>
		);
	}
}
