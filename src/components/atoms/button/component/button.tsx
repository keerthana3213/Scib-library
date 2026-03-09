import { Component, Host, h, Prop, Watch, Element, Listen } from '@stencil/core';
import { ButtonSizeTypes, HelperLevel } from '../../../../shared/models';
import { ButtonVariants } from '../models/button.model';
import { MDCRipple } from '@material/ripple';

@Component({
	tag: 'scib-atoms-button',
	styleUrl: 'button.scss',
	shadow: true
})
export class AtomsButton {
	_buttonRef: MDCRipple;

	@Element() _hostRef: HTMLElement;

	/**
	 *
	 */
	@Prop({ reflect: true }) size: ButtonSizeTypes = 'm';

	/**
	 *
	 */
	@Prop({ reflect: true }) level: HelperLevel = 'primary';

	/**
	 *
	 */
	@Prop({ reflect: true }) variant: ButtonVariants = 'basic';

	/**
	 *	The text.
	 */
	@Prop() text: string;

	/**
	 *	Set the icon before the text
	 */
	@Prop() iconPosition: 'trailing' | 'leading';

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean) {
		this.manageDisabled(newValue);
	}

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: true, attribute: 'type' }) type: 'button' | 'submit' = 'button';

	/**
	 *	Shows a loading inside the button
	 */
	@Prop({ reflect: true }) loading: boolean;

	/**
	 *	The fixed right icon.
	 */
	@Prop() icon: string;

	/**
	 *
	 * @param event
	 */
	@Listen('click', { capture: true }) _clickHandler(event) {
		if (this.disabled || this.loading) {
			event.stopPropagation();
			event.preventDefault();
		} else if (this.type === 'submit') {
			this._dispatchSubmitEvent(event);
		}
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._buttonRef = MDCRipple.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-button'));
		this.manageDisabled(this.disabled);
	}

	/**
	 *
	 */
	manageDisabled(value: boolean) {
		if (this._buttonRef) {
			this._buttonRef.disabled = !!value;
			if (!value) {
				this._hostRef.removeAttribute('disabled');
			}
		}
	}

	/**
	 *
	 * @param event
	 */
	private _dispatchSubmitEvent(event: Event) {
		event.stopPropagation();
		event.preventDefault();
		const parentForm = this._hostRef.closest('form');
		if (parentForm) {
			const fakeSubmit = document.createElement('button');
			fakeSubmit.type = 'submit';
			fakeSubmit.style.display = 'none';
			parentForm.appendChild(fakeSubmit);
			fakeSubmit.click();
			fakeSubmit.remove();
		}
	}

	render() {
		return (
			<Host>
				<div class="mdc-touch-target-wrapper">
					<button
						type={this.type}
						class={{
							'mdc-button': true,
							'mdc-button--basic': true,
							'mdc-button--fab-icon':
								this.variant === 'icon' || (this.variant as any) === 'icon-flat' || (this.variant as any) === 'icon-outlined',
							[`mdc-button--icon-${this.iconPosition}`]: this.iconPosition === 'trailing' || this.iconPosition === 'leading'
						}}
						disabled={this.disabled}
					>
						{this.icon && !this.loading && (
							<span class="mdc-button__icon" style={{ '--icon-content': `var(--theme-scib-icon-${this.icon})` }}>
								<i class="icon" />
							</span>
						)}
						{this.loading && <scib-atoms-loading></scib-atoms-loading>}
						{(this.text || '').length > 0 && !this.variant.includes('icon') && !this.loading && (
							<span class="mdc-button__label">{this.text}</span>
						)}
						{!this.loading && <span class="mdc-button__ripple"></span>}
					</button>
				</div>
			</Host>
		);
	}
}
