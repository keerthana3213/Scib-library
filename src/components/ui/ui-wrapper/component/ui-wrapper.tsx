import { Component, h } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-wrapper',
	styleUrl: 'ui-wrapper.scss',
	shadow: false,
	scoped: false,
})
export class UIWrapper {
	render() {
		return (
			<div class="ui-wrapper">
				<div class="ui-wrapper-container">
					<slot />
				</div>
			</div>
		);
	}
}
