import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-modal',
	styleUrl: 'ui-modal.scss',
	shadow: false,
	scoped: true,
})
export class UIModal {
	@Prop() open: boolean = false;

	/*Variable to set the modal in absolute positioning*/
	@Prop() absolute: boolean = false;

	@Event() closeEvent: EventEmitter<boolean>;

	render() {
		return (
			<Host>
				<div class={{ 'c-ui-modal-bg': true, 'c-ui-modal-bg --show': this.open, 'c-ui-modal-bg--absolute': this.absolute }}>
					<div class="c-ui-modal">
						<button
							class="c-ui-modal__button"
							aria-label="close"
							onClick={() => {
								this.closeEvent.emit(true);
							}}
						>
							<span class="u-icon icon-close"></span>
						</button>
						<slot />
					</div>
				</div>
			</Host>
		);
	}
}
