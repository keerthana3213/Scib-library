import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-cdk-panels-communications',
	styleUrl: 'cdk-panels-communications.scss',
	shadow: false,
	scoped: true,
})
export class CDKPanelsCommunications {
	/** Define el panel activo en mobile */
	@Prop({ mutable: true, reflect: true }) active: 'main' | 'detail' = 'main';

	/** Define si las conversaciones están vacias */
	@Prop({ mutable: true, reflect: true }) showEmptyState: boolean = false;

	/** Define el panel activo en mobile */
	@Event() eventDetailClose: EventEmitter;
	@Event() eventCloseComms: EventEmitter;

	render() {
		return (
			<Host>
				<div class={{ 'c-panel-main': true, '--active': this.active === 'main' }}>
					<div class="c-panel-slot">
						<slot name="panel-main" />
					</div>
				</div>
				<div class={{ 'c-panel-detail': true, '--active': this.active === 'detail', 'c-panel-detail-main-conversations': this.showEmptyState }}>
					<div class="c-panel-slot">
						<slot name="panel-detail" />
					</div>
					{/* <scib-ui-button class="c-panel-goback" nobackground small icon="icon-chrevron-right" hide-txt onEventClick={() => this.eventDetailClose.emit()}>
						Close
					</scib-ui-button> */}
				</div>
			</Host>
		);
	}
}
