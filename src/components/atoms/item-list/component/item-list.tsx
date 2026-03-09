import { Component, Host, h } from '@stencil/core';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-item-list',
	styleUrl: 'item-list.scss',
	shadow: true
})
export class AtomsItemList {
	render() {
		return (
			<Host>
				<section part="item-list" class="item-list">
					<slot />
				</section>
			</Host>
		);
	}
}
