import { Component, Host, h, Prop, EventEmitter, Event } from '@stencil/core';
import { assetUrl } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-ecmv-modal-status',
	styleUrl: 'ecmv-modal-status.scss',
	shadow: false,
	scoped: true
})
export class ECMVModalStatus {
	@Prop() open: boolean;
	@Prop() titleItem: string;
	@Prop() message: string;
	@Prop() submessage: string;
	@Prop() buttonTextContinue: string;
	@Prop() buttonTextCancel: string;
	/**
	 * Possible values are the following: "cancel", "success", "alert"
	 */
	@Prop() type: string;
	@Event() clickEvent: EventEmitter<String>;
	@Event() cancelEvent: EventEmitter;

	handleAttachButtonClick(type) {
		if (type == 'cancel') {
			this.open = false;
			this.clickEvent.emit(type);
		} else {
			this.clickEvent.emit(type);
		}
	}

	render() {
		return (
			<Host>
				<div id="myModal" class={this.open ? 'modal' : 'modal-hide'}>
					<div class="modal-content">
						{this.type == 'success' ? (
							<div class="checkItem">
								<img src={assetUrl('/assets/images/check.svg')} class="image-position"></img>
							</div>
						) : (
							<div class="checkItemAttention">
								<img src={assetUrl('/assets/images/exclamation.svg')} class="image-position-alert"></img>
							</div>
						)}

						<div class="text-modal">
							<h1> {this.titleItem} </h1>
							<p class="color-text">{this.message}</p>
							{this.type == 'alert' ? <p class="color-text">{this.submessage}</p> : null}

							<div class="button-group">
								{this.type == 'alert' ? (
									<div class="button-style">
										<scib-ui-button secondary onEventClick={() => this.handleAttachButtonClick('cancel')}>
											{this.buttonTextCancel}
										</scib-ui-button>
									</div>
								) : null}

								<div class="button-style">
									<scib-ui-button primary onEventClick={() => this.handleAttachButtonClick('continue')}>
										{this.buttonTextContinue}
									</scib-ui-button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Host>
		);
	}
}
