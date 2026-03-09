import { Component, Host, h, Prop } from '@stencil/core';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-background-veil',
	styleUrl: 'background-veil.scss',
	shadow: true
})
export class AtomsBackgroundVeil {
	/**
	 * Add Background
	 */
	@Prop() imgBackground: string = '';

	render() {
		return (
			<Host>
				<div class="store">
					<div class="store__container" style={{ background: 'url(' + this.imgBackground + ')' }}>
						<div class="store__img-overlay"></div>
						<slot />
					</div>
				</div>
			</Host>
		);
	}
}
