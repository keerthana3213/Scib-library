import { parseProp as _parseProp, preventEvents, removePreventEvents } from '../../../../utils/helpers/common';
import { Component, Host, h, Element, Prop, Watch, Event, EventEmitter, Method } from '@stencil/core';
import { MDCDialog } from '@material/dialog';
import { isEmpty } from 'lodash';

/**
 * Component description
 *
 * @slot header - Content on the top without scroll panel
 * @slot content - Content inside scroll panel
 * @slot actions - Slot where you can place your action buttons
 */
@Component({
	tag: 'scib-ui-v2-dialog',
	styleUrl: 'ui-v2-dialog.scss',
	shadow: true
})
export class UI_V2Dialog {
	private _dialogRef: MDCDialog;
	private _moveEvents: string[] = ['wheel', 'touchmove'];

	@Element() _hostRef: HTMLElement;

	/**
	 *	Option for preventing ato close
	 */
	@Prop() preventClose: boolean = false;

	/**
	 *
	 */
	@Prop() dialogTitle: string;

	/**
	 *
	 */
	@Prop() dialogSubtitle: string;

	/**
	 *
	 */
	@Prop({ mutable: true }) open: boolean;
	@Watch('open') _openHandler(newValue: boolean) {
		if (this._dialogRef) {
			if (!!newValue && !this._dialogRef.isOpen) {
				this._openModal();
			} else if (this._dialogRef.isOpen) {
				this._closeModal();
			}
		}
	}

	/**
	 *
	 */
	@Prop() disableClose: boolean = false;

	/**
	 *
	 */
	@Method() async openModal() {
		this._openModal();
	}

	/**
	 *
	 */
	@Method() async closeModal() {
		this._closeModal();
	}

	/**
	 *
	 */
	@Event() dialogClosed: EventEmitter<void>;

	/**
	 *
	 */
	@Event() dialogClosing: EventEmitter<void>;

	/**
	 *
	 */
	@Event() dialogOpened: EventEmitter<void>;

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		const element = this._hostRef.shadowRoot.querySelector('.mdc-dialog');
		this._dialogRef = MDCDialog.attachTo(element);
		this._dialogRef.listen('MDCDialog:closed', () => {
			removePreventEvents(this._hostRef.shadowRoot, this._moveEvents);
			this._hostRef.removeAttribute('open');
			this.dialogClosed.emit();
		});
		if (this.disableClose || this.preventClose) {
			this._dialogRef.scrimClickAction = '';
			this._dialogRef.escapeKeyAction = '';
		}
		if (this.open) {
			this._openModal();
		}
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._dialogRef) && this._dialogRef.destroy) {
			try {
				removePreventEvents(this._hostRef.shadowRoot, this._moveEvents);
				this._dialogRef?.unlisten('MDCDialog:closed', () => {});
				this._dialogRef?.destroy();
			} catch (error) {}
		}
	}

	/**
	 *
	 */
	private _openModal() {
		if (this._dialogRef) {
			preventEvents(this._hostRef.shadowRoot, this._moveEvents);
			this._dialogRef.open();
			this.dialogOpened.emit();
		}
	}

	/**
	 *
	 */
	private _closeModal() {
		this.dialogClosing.emit();
		if (this._dialogRef) {
			this._dialogRef.close();
		}
	}

	render() {
		return (
			<Host>
				<div class="mdc-dialog">
					<div class="mdc-dialog__container">
						<div
							class="mdc-dialog__surface"
							role="alertdialog"
							aria-modal="true"
							aria-labelledby={this.dialogTitle}
							aria-describedby={this.dialogTitle}
						>
							<div class="mdc-dialog__header" tabindex="0">
								<div class="mdc-dialog__header__info">
									<slot name="info" />
									<span class="mdc-dialog__header__info--title">{this.dialogTitle}</span>
									<span class="mdc-dialog__header__info--subtitle">{this.dialogSubtitle}</span>
								</div>
								{!this.disableClose && (
									<div class="mdc-dialog__header__close">
										<i class="icon" onClick={() => this._closeModal()} />
									</div>
								)}
							</div>
							<div class="mdc-dialog__fixed-content">
								<slot name="header" />
							</div>
							<div class="mdc-dialog__content">
								<scib-ui-v2-scroll-container>
									<slot name="content" />
								</scib-ui-v2-scroll-container>
							</div>
							<div class="mdc-dialog__actions">
								<slot name="actions" />
							</div>
						</div>
					</div>
					<div class="mdc-dialog__scrim"></div>
				</div>
			</Host>
		);
	}
}
