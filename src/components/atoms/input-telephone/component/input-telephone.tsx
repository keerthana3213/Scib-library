import { getCountryCallingCode, getCountries, AsYouType, CountryCode, isSupportedCountry, PhoneNumber, parsePhoneNumber } from 'libphonenumber-js';
import { Component, Host, h, Prop, Event, EventEmitter, State, Watch, Element, Method } from '@stencil/core';
import { CountryData, ErrorType, FullPhoneData, Languages, Literals } from '../models/input-telephone.model';
import { parseProp } from '../../../../utils/helpers/common';
import { VariantTypes } from '../../../../shared/models';
import { MDCTextField } from '@material/textfield';
import { isEmpty } from 'lodash';

/**
 * Component description
 * Necesarias las librerías i18n-iso-countries y libphonenumber-js
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-atoms-input-telephone',
	styleUrl: 'input-telephone.scss',
	shadow: true
})
export class AtomsInputTelephone {
	private _textFieldRef: MDCTextField;
	_selectRef: HTMLScibUiV2SelectElement;
	phone: string = '';
	defaultCountryCode: CountryCode = 'ES';
	asYouType = new AsYouType(this.defaultCountryCode);
	icon: 'chevron-down-small' = 'chevron-down-small';
	_selectArrow;
	_dirty = false;

	@Element() _hostRef: HTMLElement;
	/**
	 *	Different variations of the visual components.
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	@Prop({ reflect: true }) label: string;
	@Prop({ reflect: true }) placeholder: string;
	@Prop({ reflect: true }) name: string;
	@Prop({ reflect: true }) idInput: string;
	@Prop({ reflect: true }) literals: string | Literals;
	@State() _literals: Literals;
	@Watch('literals') setLiterals(newValue: string | Literals) {
		this._literals = parseProp(newValue) as Literals;
	}

	@Prop({ reflect: true }) tlf: string;
	@State() _tlf: string;

	handledNumber: boolean = false;

	@Watch('tlf') setTlf(newValue: string) {
		this._tlf = newValue;
		if (this._tlf) {
			const phoneNumber = parsePhoneNumber(newValue);
			this.asYouType.reset();
			if (phoneNumber.isValid()) {
				this.asYouType.input(this._tlf);
			}
			const sigleContry = this.asYouType.getCountry();
			if (sigleContry) {
				this.defaultCountryCode = sigleContry;
				if (!this.handledNumber) {
					this.value$ = this.asYouType.getNumber().formatNational();
					this._updateTextFieldStatus();
				}
			}
		}
	}

	@Prop({ reflect: true }) language: Languages = 'es-ES';
	@Watch('language') setLanguage(newVal: Languages) {
		this.getCountryCode(newVal);
	}
	@State() countries: Array<CountryData> = [];

	/**
	 *	Mark as required input.
	 */
	@Prop({ mutable: true, reflect: true }) required: boolean;
	@Watch('required') _requiredHandler() {
		this._updateTextFieldStatus();
	}

	/**
	 *	Show clean icon.
	 */
	@Prop() showCleanIcon: boolean = true;
	@State() $showCleanIcon: boolean;
	@Watch('showCleanIcon') _showCleanIconHandler(newValue: boolean | undefined) {
		this.$showCleanIcon = !!newValue;
	}

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean = false;
	@State() $disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean) {
		this.$disabled = !!newValue;
	}

	/**
	 *
	 */
	@Prop() value: string;
	@Watch('value') _valueHandler(newValue: string) {
		if (!isEmpty(newValue)) {
			try {
				const _number = newValue.startsWith('+') ? newValue : `+${newValue}`;
				const phoneNumber = parsePhoneNumber(_number);
				if (phoneNumber.isValid()) {
					const { number } = phoneNumber;
					this.handledNumber = false;
					this.setTlf(number);
					this.handledNumber = true;
				}
			} catch (error) {}
		}
	}

	// TODO: en un futuro igual es recomendable que el número de teléfono se pueda pasar como un prop.
	@State() value$: string = '';
	@State() error: ErrorType = null;
	@State() _countrySelected: CountryData;
	@State() showSelect: boolean = false;

	/**
	 *	Phone number without prefix
	 */
	@Event() phoneNumber: EventEmitter<string>;

	/**
	 *	phone number with prefix and spaces between numbers
	 */
	@Event() internationalPhone: EventEmitter<string>;

	/**
	 *	Object with info about country selected
	 */
	@Event() countrySelected: EventEmitter<CountryData>;

	/**
	 * Event (unified countrySelected + phoneNumber)
	 */
	@Event() fullPhoneData: EventEmitter<FullPhoneData>;

	/**
	 * Event (countrySelected,phoneNumber)
	 */
	@Event() valueChange: EventEmitter<string>;

	/**
	 *	Different variations of the visual components.
	 */
	@Event() dirty: EventEmitter;

	/**
	 *	Default value.
	 */
	@Event() defaultValue: EventEmitter;

	@Method() async getInputRef() {
		return this._textFieldRef;
	}

	componentWillLoad() {
		this.setTlf(this.tlf);
		this.setLanguage(this.language);
		this.setLiterals(this.literals);
		this._requiredHandler();
		this._disabledHandler(this.disabled);
		this._valueHandler(this.value);
		this._showCleanIconHandler(this.showCleanIcon);
	}

	componentDidLoad() {
		this.defaultValue.emit(this._countrySelected?.prefix);

		this._textFieldRef = MDCTextField.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-text-field'));
		this._updateTextFieldStatus();
	}

	disconectCallback() {
		this._selectArrow.removeEventListener('click', this.setSameCountry);
	}

	async getCountryCode(language: Languages = 'es-ES'): Promise<void> {
		let i18nCountries;
		if (language === 'es-ES') {
			i18nCountries = await import('i18n-iso-countries/langs/es.json');
		} else {
			i18nCountries = await import('i18n-iso-countries/langs/en.json');
		}
		i18nCountries = i18nCountries.default;
		// Countries add in libphonenumber-js
		if (language === 'en-GB') {
			i18nCountries.countries['AC'] = 'Ascension Island';
			i18nCountries.countries['TA'] = 'Tristan da Cunha';
		} else {
			i18nCountries.countries['AC'] = 'Isla Ascensión';
			i18nCountries.countries['TA'] = 'Tristán de Acuña';
		}
		if (i18nCountries) {
			const countryCodes = getCountries();
			if (countryCodes.length > 0) {
				this.countries = countryCodes
					.map((code) => {
						return {
							id: code,
							label: `+${getCountryCallingCode(code)} ${this.getNameCountry(i18nCountries.countries[code])}`,
							value: code,
							country: this.getNameCountry(i18nCountries.countries[code]),
							prefix: getCountryCallingCode(code)
						};
					})
					.sort(this.sortAlphabeticly);
				const idCountrySelected = this._countrySelected ? this._countrySelected.id : this.defaultCountryCode;
				this._countrySelected = this.countries.find((c) => c.id === idCountrySelected);
			}
		}
	}

	getNameCountry(name: string | Array<string>): string {
		return Array.isArray(name) ? name[0] : name;
	}

	sortAlphabeticly(a, b): 1 | -1 | 0 {
		if (a.country > b.country) {
			return 1;
		} else if (a.country < b.country) {
			return -1;
		} else {
			return 0;
		}
	}

	setCountryCode(id: CountryCode): void {
		const isSameCountry = id === this._countrySelected?.id;
		if (isSupportedCountry(id)) {
			if (this.error === 'requiredCountry') {
				this.error = null;
			}
			this.showSelect = false;
			this.asYouType = new AsYouType(id);
			if (this.countries && this.countries.length > 0) {
				this._countrySelected = this.countries.find((c) => c.id === id);
				this.countrySelected.emit(this._countrySelected);
				this.emitFullPhoneData();
			}
			if (!isSameCountry) {
				this.value$ = null;
				this.setChangeInput(null);
			}
			this._updateTextFieldStatus();
		}
	}

	setChangeInput(val: string): void {
		const passRegExp = /^[0-9() ]+$/;

		if (!this._dirty) {
			this.dirty.emit();
		}
		this._dirty = true;
		if (val && !passRegExp.test(val)) {
			this.phone = val.substring(0, val.length - 1);
			this.value$ = val.substring(0, val.length - 1);
		} else {
			this.phone = val;
			this.value$ = val;
		}
		this.phoneNumber.emit(this.phone);
		this.emitFullPhoneData();
		this.asYouType.reset();

		if (this.phone && this.phone.length > 0) {
			this.setValue();
		} else {
			this.value$ = null;
			this._updateTextFieldStatus();
			this.error = 'required';
			this.internationalPhone.emit(null);
		}
	}

	setValue(): void {
		this.asYouType.input(this.phone);
		const phoneNumber: PhoneNumber = this.asYouType.getNumber();
		this.handledNumber = true;
		if (phoneNumber && phoneNumber.isValid()) {
			this.value$ = phoneNumber.formatNational();
			this.error = null;
			this.internationalPhone.emit(phoneNumber.formatInternational().toString());
		} else {
			this.error = 'format';
			this.internationalPhone.emit(null);
		}
		this.emitFullPhoneData();
		this._updateTextFieldStatus();
	}

	/**
	 * Return a string from emitFullPhoneData with prefix plus phoneNumber
	 */
	private emitFullPhoneData() {
		const eventData = {
			phoneNumber: this.phone,
			prefix: this._countrySelected?.prefix
		};
		this.fullPhoneData.emit(eventData as FullPhoneData);
		const number = `+${this._countrySelected?.prefix}${this.phone}`;
		const pasedNumber = parsePhoneNumber(number);
		if (pasedNumber.isValid()) {
			this.valueChange.emit(pasedNumber.number);
		}
	}

	getError(type: ErrorType): string {
		return type === null
			? null
			: type === 'required'
			? this._literals?.required
			: type === 'requiredCountry'
			? this._literals?.requiredCountry
			: this._literals?.format;
	}

	setSameCountry = () => {
		this.setCountryCode(this._countrySelected.id);
	};

	setClickButton(): void {
		this.error = 'requiredCountry';
		if (!this._dirty) {
			this.dirty.emit();
		}
		this._dirty = true;
		setTimeout(() => {
			this.showSelect = true;
			if (this._selectRef?.shadowRoot?.childNodes.length > 0) {
				let index = 0;
				let shadowSelectNode = false;
				while (index < this._selectRef.shadowRoot.childNodes.length && !shadowSelectNode) {
					const item = this._selectRef.shadowRoot.childNodes.item(index) as HTMLElement;
					if (item.tagName === 'SCIB-UI-V2-TEXT-FIELD') {
						const textField = item;
						if (textField?.shadowRoot?.childNodes.length > 0) {
							let labelInput: HTMLElement;
							for (let ii = 0; ii < textField.shadowRoot.childNodes.length; ii++) {
								const itemTextField = textField.shadowRoot.childNodes.item(ii) as HTMLElement;
								if (itemTextField.tagName === 'LABEL') {
									labelInput = itemTextField;
									break;
								}
							}
							if (labelInput?.childNodes?.length > 0) {
								for (let ii = 0; ii < labelInput.childNodes.length; ii++) {
									const itemLabel = labelInput.childNodes.item(ii) as HTMLElement;
									if (itemLabel.tagName === 'INPUT') {
										itemLabel.style.setProperty('margin-top', '0');
									}
									if (
										!this._selectArrow &&
										itemLabel.tagName === 'SPAN' &&
										itemLabel.classList?.value?.includes('icon-container--handler')
									) {
										this._selectArrow = itemLabel;
									}
								}
							}
						}
						item.click();
						shadowSelectNode = true;
					}
					index++;
				}
			}
		});
	}

	/**
	 *	This function update the textField status.
	 */
	private _updateTextFieldStatus() {
		if (this._textFieldRef) {
			this._textFieldRef.useNativeValidation = false;
			this._textFieldRef.value = this.value$ || '';
			this._textFieldRef.valid = this.error ? false : true;
			this._textFieldRef.required = this.required;
		}
	}

	render() {
		return (
			<Host>
				<div class={`input-telephone ${this.$disabled ? 'input-telephone--disabled' : ''}`}>
					<label class="mdc-text-field mdc-text-field--filled">
						<button
							class="c-button"
							onClick={() => {
								this.setClickButton();
							}}
							disabled={this.$disabled}
						>
							<span>{this._countrySelected ? `+ ${this._countrySelected?.prefix}` : ''}</span>
							<span class="icon-container icon-container--handler" style={{ '--icon-content': `var(--theme-scib-icon-${this.icon})` }}>
								<i class={`icon mdc-text-field__icon mdc-text-field__icon--fixed`} />
							</span>
						</button>

						<span class="mdc-text-field__ripple"></span>
						<span class="mdc-floating-label" id="my-label-id">
							{this.label}
						</span>
						<input
							class={{
								'mdc-text-field__input': true,
								'mdc-text-field__disabled': this.$disabled
							}}
							onInput={(e: any) => this.setChangeInput(e.target.value)} //
							value={this.value$}
							type="text"
							aria-labelledby="my-label-id"
							name={this.name}
							id={this.idInput}
							aria-label={this.label}
							disabled={this.$disabled}
						></input>
						<span class="mdc-line-ripple"></span>
					</label>
					{this.error && <span class="c-error">{this.getError(this.error)}</span>}
					<scib-ui-v2-select
						class={{ 'c-select': true, 'show-select': this.showSelect, 'no-validate': true }}
						ref={(element) => (this._selectRef = element)}
						variant={this.variant}
						value={this._countrySelected?.label}
						menuOptions={JSON.stringify(this.countries)}
						showCleanIcon={this.$showCleanIcon}
						onValueChange={(event) => {
							event.preventDefault();
							event.stopImmediatePropagation();
							this.setCountryCode(event.detail as CountryCode);
						}}
					></scib-ui-v2-select>
				</div>
			</Host>
		);
	}
}
