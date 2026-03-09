import { Component, Host, h, Prop } from '@stencil/core';
import { VariantTypes } from '../../../../shared/models';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-atoms-badge',
	styleUrl: 'badge.scss',
	shadow: true
})
export class AtomsBadge {
	/**
	 * Oculta el contenido del slot
	 */
	@Prop() hide: boolean;

	/**
	 * Text that we will show inside the badge
	 */
	@Prop() text: string;

	/**
	 *
	 */
	@Prop({ reflect: true }) type: 'sm' | 'md';

	/**
	 *
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'red';

	render() {
		return (
			<Host>
				<span class={{ 'badge-container': !this.hide, 'badge-container--hide': this.hide }}>{this.text}</span>
			</Host>
		);
	}
}
