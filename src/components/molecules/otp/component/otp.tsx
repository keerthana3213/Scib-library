import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { IOtpLiterals, OtpMode, OtpType, patterns } from '../models/otp.model';

/**
 * Component description
 *
 * @status stable
 *
 */
@Component({
	tag: 'scib-molecules-otp',
	styleUrl: 'otp.scss',
	shadow: true
})
export class MoleculesOtp {
	@Element() _hostRef: HTMLElement;

	public inputRefs: HTMLInputElement[] = [];
	private _internalUpdate: boolean;

	/**
	 * Propiedad que refleja sus cambios sobre un atributo en el Host del Custom Element y permite ser mutada internamente
	 */
	@Prop() label: string;

	/**
	 *
	 */
	@Prop() mode: OtpMode = 'numeric';

	/**
	 *
	 */
	@Prop() type: OtpType = 'text';

	/**
	 * The number of input fields to generate for the OTP.
	 */
	@Prop() inputCount: number = 1;

	/**
	 * Literals
	 */
	@Prop() literals: IOtpLiterals | string;
	@State() $literals: IOtpLiterals;
	@Watch('literals') _parseLiterals(newLiterals: IOtpLiterals | string) {
		this.$literals = _parseProp<IOtpLiterals>(newLiterals as string);
	}

	/**
	 *	Alerts if value is invalid.
	 */
	@Prop({ mutable: true, reflect: true }) invalid: boolean = false;
	@State() $invalid: boolean;
	@Watch('invalid') _invalidHandler(newVal: boolean) {
		this.$invalid = !!newVal;
	}

	/**
	 *	The value of the input.
	 */
	@Prop({ mutable: true, reflect: true }) value: string;
	@State() $value: string;
	@Watch('value') _valueHandler(newValue: string) {
		this.$value = newValue || '';
		if (!this._internalUpdate && this.inputRefs.length > 0) {
			this._setValueToInputs(this.value);
		}
		this._internalUpdate = false;
	}

	/**
	 *	Show skeleton while loading list.
	 */
	@Prop() loading: boolean = false;
	@State() $loading: boolean;
	@Watch('loading') _loadingHandler(newVal: boolean) {
		this.$loading = newVal;
	}

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;
	@State() $disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean) {
		this.$disabled = !!newValue;
		if (this.$disabled) {
			this._reset();
		}
	}

	/**
	 * State to control when should component emit. Only when input is valid or when there is a change to valid to not valid
	 */
	@State() isValidChange: boolean = false;

	/**
	 * Method to handler delete input value and move to previous input
	 */
	private _handleInput(index: number, event: Event) {
		const input = event.target as HTMLInputElement;
		if (input.value.length >= 1 && this.inputRefs[index + 1]) {
			this.inputRefs[index + 1].focus();
		} else if (input.value.length === 0 && this.inputRefs[index + 1]) {
			this.inputRefs[index + 1].blur();
		}

		this._handleInputChange();
	}

	/**
	 * Method to handler input changes
	 */
	private _handleInputChange() {
		this._internalUpdate = true;
		const values = this.inputRefs.map((input) => input.value);
		this._checkAndEmitValues(values);
	}

	/**
	 * Method to handler value changes and emit
	 */
	private _checkAndEmitValues(values: string[]) {
		const allInputsFilled = values.every((value) => value.length >= 1);
		if (allInputsFilled) {
			this.isValidChange = true;
			this.value = values.join('');
			this.valueChange.emit(this.value);
			this.inputRefs[this.inputRefs.length - 1].blur();
		} else {
			if (this.isValidChange) {
				this.valueChange.emit('');
			}
			this.isValidChange = false;
		}
	}

	/**
	 * Method to set value to inputs from outside
	 */
	private _setValueToInputs(value: string) {
		const values = value.split('');
		this.inputRefs.forEach((inputRef, i) => {
			inputRef.value = values[i] || '';
		});
		this._checkAndEmitValues(values);
	}

	/**
	 * Method to handler key downs events
	 */
	private _handleKeyDown(index: number, event: KeyboardEvent) {
		const input = event.target as HTMLInputElement;
		if (event.key === 'Backspace' && input.value === '' && this.inputRefs[index - 1]) {
			this.inputRefs[index - 1].focus();
		}
		if (event.key === 'ArrowLeft') {
			event.preventDefault();
		}
	}

	/**
	 * Method to handler click events
	 */
	private _handleClick(_index: number, event: Event) {
		const lastFilledInputIndex = this.inputRefs.findIndex((input) => input.value === '');
		if (lastFilledInputIndex !== -1 && this.inputRefs[lastFilledInputIndex]) {
			event.preventDefault();
			this.inputRefs[lastFilledInputIndex].focus();
		}
		// Set the caret to the end of the input value
		const input = event.target as HTMLInputElement;
		const valueLength = input.value.length;
		input.setSelectionRange(valueLength, valueLength);
	}

	/**
	 * Method to handler key board events
	 */
	private _handleKeyPress(event: KeyboardEvent) {
		const regex = new RegExp(patterns[this.mode]);
		const key = event.key;
		if (!regex.test(key)) {
			event.preventDefault();
			return false;
		}
	}

	/**
	 * Method to set listeners
	 */
	private _setListeners() {
		this.inputRefs.forEach((inputRef, index) => {
			inputRef.addEventListener('input', (event) => this._handleInput(index, event));
			inputRef.addEventListener('keydown', (event) => this._handleKeyDown(index, event));
			inputRef.addEventListener('click', (event) => this._handleClick(index, event));
			inputRef.addEventListener('keypress', (event) => this._handleKeyPress(event));
		});
	}

	/**
	 * Method to reset input value
	 */
	private _reset() {
		if (this.inputRefs) {
			this.inputRefs.forEach((inputRef) => (inputRef.value = ''));
			this.value = '';
			this.valueChange.emit('');
		}
	}

	/**
	 * Method to return literal string
	 */
	private _getLiteral() {
		if (this.$loading) {
			return this.$literals?.loading || '';
		} else if (this.$disabled) {
			return this.$literals?.disabled || '';
		} else if (this.$invalid) {
			return this.$literals?.error || '';
		} else {
			return this.$literals?.defaultText || '';
		}
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._valueHandler(this.value);
		this._loadingHandler(this.loading);
		this._invalidHandler(this.invalid);
		this._parseLiterals(this.literals);
		this._disabledHandler(this.disabled);
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._setListeners();
	}

	/**
	 * Ciclo de vida al eliminar la instancia del componente
	 */
	disconnectedCallback() {}

	/**
	 *
	 */
	@Event() valueChange: EventEmitter<any>;

	/**
	 * Reset Inputs
	 */
	@Method() async reset() {
		this._reset();
	}

	render() {
		return (
			<Host>
				<div class="otp__wrapper">
					<div>
						<span id="otpLabel" class={this.$disabled ? 'otp__label--disabled' : 'otp__label'}>
							{this.label}
						</span>
						<div class="otp__container">
							{Array.from({ length: this.inputCount }).map((_, i) => (
								<input
									class={
										this.$disabled
											? 'otp__input--disabled'
											: this.$invalid && !this.$loading
											? 'otp__input--invalid'
											: 'otp__input'
									}
									key={i}
									type={this.type}
									autocomplete="one-time-code"
									maxlength="1"
									disabled={this.$disabled}
									inputmode={this.mode}
									ref={(el) => (this.inputRefs[i] = el as HTMLInputElement)}
									aria-labelledby="otpLabel"
									aria-invalid={this.$invalid ? 'true' : 'false'}
									aria-describedby={this.$invalid ? 'errorDesc' : ''}
									required
								/>
							))}
						</div>
					</div>
					{(this.$invalid || this.$loading || this.$disabled || this.$literals?.defaultText) && (
						<div class="otp__helper">
							{this.$loading && (
								<div class="otp__helper__loading">
									<scib-atoms-loading level="primary" size="s" variant="circular"></scib-atoms-loading>
								</div>
							)}
							{(this.$invalid || this.$disabled) && !this.$loading && (
								<scib-atoms-color-icon class="otp__helper__icons" name="error"></scib-atoms-color-icon>
							)}
							<span
								id="errorDesc"
								class={(this.$invalid || this.$disabled) && !this.$loading ? 'otp__helper__text--invalid' : 'otp__helper__text'}
							>
								{this._getLiteral()}
							</span>
						</div>
					)}
				</div>
			</Host>
		);
	}
}
