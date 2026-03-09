import { Component, Host, h, Prop, EventEmitter, Event, Element } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { VariantTypes } from '../../../../shared/models';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-strip',
	styleUrl: 'strip.scss',
	shadow: true
})
export class AtomsStrip {
	@Element() _hostRef: HTMLElement;

	/**
	 * La variante altera el valor de las custom properties
	 * para cambiar la apariencia del componente en base al tema
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 * Close button text
	 */
	@Prop() closeButtonText: string;

	/**
	 *
	 */
	@Event() eventClose: EventEmitter;

	render() {
		return (
			<Host>
				<div class="strip">
					<div class="strip__container">
						<slot name="content" />
					</div>
					<div class="strip__close">
						<button class="strip__close--btn" onClick={() => this.eventClose.emit()}>
							{this.closeButtonText}
							<i class="icon u-icon"></i>
						</button>
					</div>
				</div>
			</Host>
		);
	}
}
