import { Component, h, Host, Method, Prop, Watch, Event, EventEmitter, Listen } from '@stencil/core';
import { VaadinDialogOverflowTheme } from './ui-dialog-overflow.vaadin.override';
import { DialogElement } from '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '@vaadin/vaadin-dialog/theme/lumo/vaadin-dialog-styles.js';
import { VaadinDialogTheme } from './ui-dialog.vaadin.override';
import '@vaadin/vaadin-dialog/vaadin-dialog.js';
import '@polymer/polymer/polymer-element.js';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-ui-dialog',
	styleUrl: 'ui-dialog.scss',
	shadow: false,
	scoped: false,
})
export class UIDialog {
	$slotElement: HTMLElement;
	$styleElement: HTMLElement;
	$headerElement: HTMLElement;
	$dialogElement!: DialogElement;
	/** Sets the dialog box to "open" */
	@Prop({ mutable: true, reflect: true }) open: boolean;
	@Watch('open') listenOpenChanges(newVal: boolean) {
		if (newVal) {
			if (this.$slotElement) this.$slotElement.style.display = 'block';
			if (this.$headerElement) this.$headerElement.style.display = 'flex';
		} else {
			if (this.$slotElement) this.$slotElement.style.display = 'none';
			if (this.$headerElement) this.$headerElement.style.display = 'none';
			document.body.style.overflow = 'auto';
		}
	}

	/** Switches between an emitter and the lock function **/
	@Prop({ mutable: true, reflect: true }) isEmitter: boolean;

	/** Hide the close button **/
	@Prop({ mutable: true, reflect: true }) disableClose: boolean;

	/** Hide the header */
	@Prop({ mutable: true, reflect: true }) hideHeader: boolean;

	/** Set full width */
	@Prop({ mutable: true, reflect: false }) fullWidth: boolean;

	/** Sets whether to close the modal when clicking out (default, false) */
	@Prop({ reflect: true }) closeOutsideClick: boolean = false;

	/** Sets the dialog position to fixed or absolute */
	@Prop({ mutable: true, reflect: true }) absolute: boolean;
	@Prop({ mutable: true, reflect: true }) overflow: boolean = false;

	@Prop({}) sendEmailModal?: boolean = false;

	@Method()
	async openDialog() {
		this.open = true;
	}

	@Method()
	async closeDialog() {
		this.open = false;
	}

	componentDidLoad() {
		if (this.open) {
			if (this.$slotElement) this.$slotElement.style.display = 'block';
			if (this.$headerElement) this.$headerElement.style.display = this.hideHeader ? 'none' : 'flex';
		}
		if (this.absolute) {
			this.$dialogElement.$.overlay.classList.add('c-scib-ui-dialog--absolute');
		} else if (this.overflow) {
			this.$dialogElement.$.overlay.classList.add('c-scib-ui-dialog--overflow');
			const $modalContainer = document.getElementById('overlay');
			const dialogHeight = $modalContainer.offsetHeight;
			$modalContainer.style.maxHeight = dialogHeight + 'px';
			document.body.style.overflow = 'hidden';
		} else {
			this.$dialogElement.$.overlay.classList.add('c-scib-ui-dialog--fixed');
		}

		if (this.fullWidth) {
			this.$dialogElement.$.overlay.classList.add('c-scib-ui-dialog--full-width');
		}

		this.$dialogElement.renderer = (root: HTMLElement) => {
			if (!this.hideHeader) {
				root.appendChild(this.$headerElement);
			}
			const container = document.createElement('div');
			container.classList.add('c-scib-ui-dialog__container');
			container.appendChild(this.$slotElement);
			root.appendChild(container);
		};

		this.$dialogElement.addEventListener('opened-changed', (ev: CustomEvent) => {
			this.open = ev.detail.value;
		});
		this.calculateTopPosition();
	}

	/** Life cycle executed before first render */
	componentWillLoad() {
		if (this.overflow) {
			new VaadinDialogOverflowTheme();
		} else {
			new VaadinDialogTheme();
		}
	}

	/** Event when process is cancelled */
	@Event() eventCancelProcess: EventEmitter;

	@Listen('resize', { target: 'window' }) watchInnerHeight() {
		this.calculateTopPosition();
	}

	/** Process cancellation emitter function */
	_handleCancel() {
		this.eventCancelProcess.emit();
	}

	private calculateTopPosition() {
		let totalHeight = window.innerHeight;
		let clientHeight = this.$slotElement && this.$slotElement.clientHeight;
		let topHeight = (totalHeight - clientHeight) / 2 + 'px';
		let AllOverlay = document.querySelectorAll('vaadin-dialog-overlay');
		let lastElement = AllOverlay[AllOverlay.length - 1];
		const overlay = lastElement ? lastElement.shadowRoot.querySelector('[part="overlay"]') : false;

		if (overlay && window.innerWidth >= 1400) {
			if (overlay && totalHeight <= clientHeight) {
				overlay.setAttribute('style', 'top: ' + 100 + 'px');
			} else {
				overlay.setAttribute('style', 'top: ' + topHeight);
			}
		} else if (overlay && window.innerWidth >= 1024 && window.innerWidth <= 1399) {
			if (overlay && totalHeight <= clientHeight) {
				overlay.setAttribute('style', 'top: ' + 100 + 'px');
			} else {
				overlay.setAttribute('style', 'top: ' + topHeight);
			}
		} else if (overlay && window.innerWidth >= 320 && window.innerWidth <= 1023) {
			if (overlay && totalHeight <= clientHeight) {
				overlay.setAttribute('style', 'top: ' + 40 + 'px');
			} else {
				if (!this.sendEmailModal) {
					overlay.setAttribute('style', 'top: ' + topHeight);
				} else {
					overlay.setAttribute('style', 'top: ' + 0);
				}
			}
		}
	}

	render() {
		var disableCloseDisplay = this.disableClose === true ? 'none' : 'block';
		return (
			<Host class="c-scib-ui-dialog">
				<div style={{ display: 'none' }} ref={el => (this.$slotElement = el as HTMLElement)}>
					<slot />
				</div>
				{this.isEmitter ? (
					<header
						style={{ display: 'none' }}
						class="c-scib-ui-dialog__header"
						ref={el => (this.$headerElement = el as HTMLElement)}
					>
						<button
							class="c-scib-ui-dialog__button"
							style={{ display: disableCloseDisplay }}
							onClick={() => this._handleCancel()}
							aria-label="close"
						>
							<span class="u-icon icon-close"></span>
						</button>
					</header>
				) : (
					<header
						style={{ display: 'none' }}
						class="c-scib-ui-dialog__header"
						ref={el => (this.$headerElement = el as HTMLElement)}
					>
						<button
							class="c-scib-ui-dialog__button"
							style={{ display: disableCloseDisplay }}
							onClick={() => (this.open = false)}
							aria-label="close"
						>
							<span class="u-icon icon-close"></span>
						</button>
					</header>
				)}
				<vaadin-dialog
					theme="scib-ui-dialog"
					opened={this.open}
					ref={(el: DialogElement) => (this.$dialogElement = el)}
					no-close-on-outside-click={!this.closeOutsideClick}
				></vaadin-dialog>
			</Host>
		);
	}
}
