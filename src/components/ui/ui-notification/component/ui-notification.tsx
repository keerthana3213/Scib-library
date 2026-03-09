import { Component, Host, h, Prop } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-notification',
	styleUrl: 'ui-notification.scss',
	shadow: false,
	scoped: true,
})
export class UINotification {
	/* SUBTEXT */
	@Prop() text: string = '';

	@Prop() icon: string = '';

	render() {
		return (
			<Host>
				<div class="ui-notification">
					<div class="ui-notification--subinput">
						{this.icon && <i class={`icon ${this.icon}`} />}
						<span class="ui-notification-text" innerHTML={this.text}></span>
					</div>
				</div>
			</Host>
		);
	}
}
