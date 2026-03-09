import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Element } from '@stencil/core';
import { parseProp as _parseProp, assetUrl } from '../../../../utils/helpers/common';
import { MDCCheckbox } from '@material/checkbox';
import { MDCFormField } from '@material/form-field';
import { CheckboxValue } from '../models/ui-v2-checkbox.model';
import { get, isEmpty } from 'lodash';
@Component({
	tag: 'scib-ui-v2-checkbox',
	styleUrl: 'ui-v2-checkbox.scss',
	shadow: true
})
export class UI_V2Checkbox {
	private _checkboxRef: MDCCheckbox;
	private _formFieldRef: MDCFormField;

	@Element() _hostRef: HTMLElement;

	/**
	 *	Input name.
	 */
	@Prop({ reflect: true }) name: string;

	/**
	 *
	 */
	@Prop({ reflect: true }) invalid: boolean;
	@State() $invalid: boolean;
	@Watch('invalid') _invalidHandler(newValue: boolean) {
		this.$invalid = !!newValue;
		if (this.$invalid) {
			this.value = 'unchecked';
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: true, mutable: true }) disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean) {
		if (this._checkboxRef) {
			this._checkboxRef.disabled = !!newValue || this.readOnly;
		}
	}

	/**
	 *
	 */
	@Prop({ reflect: true }) readOnly: boolean;
	@Watch('readOnly') _readOnlyHandler(newValue: boolean) {
		if (this._checkboxRef) {
			this._checkboxRef.disabled = !!newValue;
			this._checkboxRef['read-only'] = !!newValue;
		}
	}

	/**
	 *
	 */
	@Prop({ attribute: 'id', reflect: true }) uid: string;

	/**
	 *
	 */
	@Prop({ mutable: true, reflect: true }) value: CheckboxValue = 'unchecked';
	@State() $value: CheckboxValue;
	@Watch('value') _valueHandler(newValue: CheckboxValue) {
		this.$value = newValue;
		this._setCheckboxStatus();
	}

	/**
	 *
	 */
	@Prop() label: string;

	/**
	 *
	 */
	@Prop() helper: string;

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._valueHandler(this.value);
		this._invalidHandler(this.invalid);
		this._disabledHandler(this.disabled);
		this._readOnlyHandler(this.readOnly);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		this._checkboxRef = MDCCheckbox.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-checkbox'));
		this._formFieldRef = MDCFormField.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-form-field'));
		this._formFieldRef.input = this._checkboxRef;
		this._checkboxRef.disabled = this.disabled || this.readOnly;
		this._checkboxRef['read-only'] = this.readOnly;
		this._setCheckboxStatus();
		this._checkboxRef.listen('change', (data) => {
			const checked = get(data, ['target', 'checked'], false);
			this.value = (checked && 'checked') || 'unchecked';
			this.valueChange.emit({ checkboxId: this.uid, checkboxValue: this.$value, checkboxData: data });
		});
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._checkboxRef) && this._checkboxRef.destroy) {
			try {
				this._checkboxRef?.unlisten('change', () => {});
				this._checkboxRef?.destroy();
			} catch (error) {}
		}
	}

	/**
	 * Descripción del evento
	 */
	@Event() valueChange: EventEmitter<any>;

	/**
	 *
	 */
	private _setCheckboxStatus() {
		if (this._checkboxRef) {
			switch (this.$value) {
				case 'indeterminate':
					this._checkboxRef.indeterminate = true;
					this._checkboxRef.checked = false;
					break;
				case 'checked':
					this._checkboxRef.indeterminate = false;
					this._checkboxRef.checked = true;
					break;
				default:
					this._checkboxRef.indeterminate = false;
					this._checkboxRef.checked = false;
			}
		}
	}

	render() {
		return (
			<Host>
				<div class="wrapper">
					<div class="mdc-form-field">
						<div class="mdc-checkbox mdc-checkbox--touch">
							<input type="checkbox" class="mdc-checkbox__native-control" id={'checkbox-' + this.uid} name={this.name} />
							<div
								class={{
									'mdc-checkbox__background': true,
									'mdc-checkbox__background--invalid': this.invalid,
									'mdc-checkbox__background--read-only': this.readOnly
								}}
							>
								<svg class="mdc-checkbox__checkmark" viewBox="-5 -5 35 35">
									<path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
								</svg>
								<div class="mdc-checkbox__mixedmark"></div>
							</div>
						</div>
						{this.label ? (
							<span class="mdc-checkbox__label" title={this.label}>
								{this.label}
							</span>
						) : null}
					</div>
					{this.helper ? (
						<div>
							<span
								class={{
									'mdc-checkbox__helper': true,
									'mdc-checkbox__helper--invalid': this.invalid,
									'mdc-checkbox__helper--disabled': this.disabled,
									'mdc-checkbox__helper--read-only': this.readOnly
								}}
								title={this.helper}
							>
								<img class="icon" src={this.$invalid ? assetUrl('assets/color_icons/error.svg') : ''} />
								{this.helper}
							</span>
						</div>
					) : null}
				</div>
			</Host>
		);
	}
}
