import { Component, Host, h, Prop, Watch, State, Event, EventEmitter } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IconsName } from '../../../../components';
import { get } from 'lodash';
import { IconsNameMap } from '../models/status-modal.model';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-molecules-status-modal',
	styleUrl: 'status-modal.scss',
	shadow: true
})
export class MoleculesStatusModal {
	image: string = '';

	@Prop({ reflect: true }) titleModal: string;
	@Prop({ reflect: true }) message: string;
	@Prop({ reflect: true }) status: 'success' | 'attention' | 'error' | 'information' | 'loading';

	/**
	 *
	 */
	@Prop() open: boolean;
	@State() $open: boolean;
	@Watch('open') _openHandler(newOpen: boolean) {
		this.$open = _parseProp<boolean>(newOpen as boolean);
	}
	/**
	 *
	 */
	@Prop() disableClose: boolean;
	@State() $disableClose: boolean;
	@Watch('disableClose') _disableCloseHandler(newDisableClose: boolean) {
		this.$disableClose = _parseProp<boolean>(newDisableClose as boolean);
	}

	/**
	 *
	 */
	componentWillLoad() {
		this._openHandler(this.open);
		this._disableCloseHandler(this.disableClose);
	}

	/**
	 *
	 */
	@Event() closeDialog: EventEmitter<void>;

	/**
	 *
	 */
	@Event() openDialog: EventEmitter<void>;

	/**
	 *
	 * @returns
	 */
	getIcon(): IconsName {
		return get(IconsNameMap, this.status, this.status) as IconsName;
	}

	/**
	 *
	 */
	handleCloseModal() {
		this.closeDialog.emit();
	}

	/**
	 *
	 */
	handleOpenModal() {
		this.openDialog.emit();
	}

	/**
	 *
	 * @returns
	 */
	render() {
		return (
			<Host>
				<scib-ui-v2-dialog
					open={this.$open}
					disable-close={this.$disableClose}
					onDialogClosed={() => this.handleCloseModal()}
					onDialogOpened={() => this.handleOpenModal()}
				>
					<div slot="content" class="content-modal">
						<div class="content-modal__image">
							<scib-atoms-color-icon name={this.getIcon()} class="content-modal__image__position"></scib-atoms-color-icon>
						</div>
						<h1 class="content-modal__title">{this.titleModal}</h1>
						<p class="content-modal__message" innerHTML={this.message}></p>
					</div>
					<div slot="actions" class="action">
						<slot name="actions" />
					</div>
				</scib-ui-v2-dialog>
			</Host>
		);
	}
}
