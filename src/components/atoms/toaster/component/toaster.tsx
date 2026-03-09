import { Component, Host, h, Prop, Watch, Element, Event, EventEmitter, Method } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ToasterVariant } from '../../../../shared/models';
import { MDCSnackbar } from '@material/snackbar';
import { isEmpty } from 'lodash';
import { ToasterStatus } from '../models/toaster.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-atoms-toaster',
	styleUrl: 'toaster.scss',
	shadow: true
})
export class AtomsToaster {
	private _snackbarRef: MDCSnackbar;

	@Element() _hostRef: HTMLElement;

	/**
	 * La variante altera el valor de las custom properties
	 * para cambiar la apariencia del componente en base al tema
	 */
	@Prop({ reflect: true }) variant: ToasterVariant = 'normal';

	/**
	 * Disable the entrance animation
	 */
	@Prop({ reflect: true }) disableAnimation: boolean = false;

	/**
	 * Opción de estado del toast
	 */
	@Prop({ reflect: true }) status: 'success' | 'warning' | 'error' | 'info';

	/**
	 * Mensaje a mostrar en el toast
	 */
	@Prop({ mutable: true }) message: string;

	/**
	 * Mensaje a mostrar mensaje secundario
	 */
	@Prop() description: string;

	/**
	 * Mensaje a mostrar action
	 */
	@Prop() action: string;

	/**
	 * Propiedad para indicar el tiempo que debe estar abierto el toast
	 * En caso de ser -1, se mantendrá abierto constantemente
	 */
	@Prop() time: number = 10000;

	/**
	 * Propiedad para abrir y cerrar el toast
	 */
	@Prop({ mutable: true }) open: boolean;
	@Watch('open') _openHandler(newValue: boolean) {
		if (newValue) {
			this.openToaster();
		} else {
			this.closeToaster();
		}
	}

	/**
	 * Propiedad para quitar la x del toaster
	 */
	@Prop() disableClose: boolean;

	/**
	 * Open method
	 */
	@Method() async openToaster() {
		if (this._snackbarRef) {
			this._snackbarRef.open();
			this._openToaster();
		}
	}

	/**
	 * Close method
	 */
	@Method() async closeToaster() {
		if (this._snackbarRef) {
			this._snackbarRef.close();
		}
	}

	/**
	 *
	 */
	@Event() closed: EventEmitter<void>;

	/**
	 *  Evento que se lanza cuando se lanza la acción
	 */
	@Event() actionLink: EventEmitter;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._openHandler(this.open);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidRender() {
		this._destroy();
		if (this.open) {
			const element = this._hostRef.shadowRoot.querySelector('.mdc-snackbar');
			this._snackbarRef = MDCSnackbar?.attachTo(element);
			this.openToaster();
			this._snackbarRef.listen('MDCSnackbar:closed', () => {
				this.open = false;
				this.closed.emit();
			});
		}
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._snackbarRef) && this._snackbarRef.destroy) {
			try {
				this._snackbarRef?.unlisten('MDCSnackbar:closed', () => {});
				this._snackbarRef?.destroy();
			} catch (error) {}
		}
	}

	/**
	 *
	 */
	private _openToaster() {
		if (this.open) {
			this._snackbarRef.timeoutMs = this.time;
		}
	}

	private getIcon() {
		switch (this.status) {
			case ToasterStatus.INFO:
				return 'information';
			case ToasterStatus.SUCCESS:
				return 'checkmark';
			case ToasterStatus.WARNING:
				return 'warning';
			case ToasterStatus.ERROR:
				return 'error';
			default:
				return;
		}
	}

	/**
	 * Cerrar toast
	 */
	private _closeToast() {
		this.open = false;
		this.closed.emit();
	}

	private _actionLink() {
		this.actionLink.emit();
	}

	render() {
		return (
			<Host>
				{this.open && (
					<main class="main mdc-snackbar">
						<aside>
							<div class="mdc-snackbar__surface mdc-snackbar--open" role="status" aria-relevant="additions">
								<div class="mdc-snackbar__container">
									<scib-atoms-color-icon class="icons" name={this.getIcon()}></scib-atoms-color-icon>
									<div class="column">
										<div class="mdc-snackbar__label" aria-atomic="false">
											{!!this.message && <span>{this.message}</span>}
										</div>
										{!!this.description && (
											<div class="mdc-snackbar__label--description" aria-atomic="false" innerHTML={this.description}></div>
										)}
										{!!this.action && (
											<div class="mdc-snackbar__label--action">
												<span onClick={() => this._actionLink()}>{this.action}</span>
											</div>
										)}
									</div>
									{!this.disableClose && (
										<div class="mdc-snackbar__action">
											<i class="icon state__icon" onClick={() => this._closeToast()} />
										</div>
									)}
								</div>

								<div class="mdc-snackbar__actions">
									<slot name="actions" />
								</div>
							</div>
						</aside>
					</main>
				)}
			</Host>
		);
	}
}
