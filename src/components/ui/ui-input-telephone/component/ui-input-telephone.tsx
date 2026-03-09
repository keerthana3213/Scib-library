import { Component, Host, h, Prop, Event, EventEmitter, State, Watch } from '@stencil/core';
import { getCountryCallingCode, getCountries, AsYouType, CountryCode, isSupportedCountry, PhoneNumber } from 'libphonenumber-js';
import { parseProp } from '../../../../utils/helpers/common';
import { CountryData, ErrorType, Languages, Literals } from '../models/ui-input-telephone.model';

/**
 * Component description
 * Necesarias las librerías i18n-iso-countries y libphonenumber-js
 *
 */
@Component({
	tag: 'scib-ui-input-telephone',
	styleUrl: 'ui-input-telephone.scss',
	shadow: false,
	scoped: true
})
export class UIInputTelephone {
	_selectRef: HTMLScibUiV2SelectElement;
	phone: string = '';
	defaultCountryCode: CountryCode = 'ES';
	asYouType = new AsYouType(this.defaultCountryCode);
	icon: 'chevron-down-small' = 'chevron-down-small';
	_selectArrow;
	_dirty = false;

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
			this.asYouType.reset();
			this.asYouType.input(this._tlf);

			const sigleContry = this.asYouType.getCountry();

			if (sigleContry) {
				this.defaultCountryCode = sigleContry;
				if (!this.handledNumber) {
					this.value = this.asYouType.getNumber().formatNational();
				}
			}
		}
	}

	@Prop({ reflect: true }) language: Languages = 'es-ES';
	@Watch('language') setLanguage(newVal: Languages) {
		this.getCountryCode(newVal);
	}
	@State() countries: Array<CountryData> = [];

	// TODO: en un futuro igual es recomendable que el número de telefóno se pueda pasar como un prop.
	@State() value: string = '';
	@State() error: ErrorType = null;
	@State() _countrySelected: CountryData;
	@State() showSelect: boolean = false;

	@Event() internationalPhone: EventEmitter<string>;
	@Event() phoneNumber: EventEmitter<string>;
	@Event() countrySelected: EventEmitter<CountryData>;
	// Emit when the input is changed
	@Event() dirty: EventEmitter;
	@Event() defaultValue: EventEmitter;
	componentWillLoad() {
		this.setTlf(this.tlf);
		this.setLanguage(this.language);
		this.setLiterals(this.literals);
	}

	componentDidLoad() {
		this.defaultValue.emit(this._countrySelected?.prefix);
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
			}
			if (!isSameCountry) {
				this.value = null;
				this.setChangeInput(null);
			}
		}
	}

	setChangeInput(val: string): void {
		const passRegExp = /^[0-9() ]+$/;

		if (!this._dirty) {
			this.dirty.emit();
		}
		this._dirty = true;
		if (!passRegExp.test(val)) {
			this.phone = val.substring(0, val.length - 1);
			this.value = val.substring(0, val.length - 1);
		} else {
			this.phone = val;
			this.value = val;
		}
		this.phoneNumber.emit(this.phone);
		this.asYouType.reset();

		if (this.phone && this.phone.length > 0) {
			this.setValue();
		} else {
			this.value = null;
			(document.getElementById(this.idInput) as HTMLInputElement).value = this.value;
			this.error = 'required';
			this.internationalPhone.emit(null);
		}
	}

	setValue(): void {
		this.asYouType.input(this.phone);
		const phoneNumber: PhoneNumber = this.asYouType.getNumber();
		this.handledNumber = true;
		if (phoneNumber && phoneNumber.isValid()) {
			this.value = phoneNumber.formatNational();
			this.error = null;
			this.internationalPhone.emit(phoneNumber.formatInternational().toString());
		} else {
			this.error = 'format';
			this.internationalPhone.emit(null);
		}
		(document.getElementById(this.idInput) as HTMLInputElement).value = this.value;
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
										itemLabel.classList.value.includes('icon-container--handler')
									) {
										this._selectArrow = itemLabel;
										if (this._selectArrow) {
											this._selectArrow.addEventListener('click', () => {
												this.setSameCountry();
											});
										}
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

	render() {
		return (
			<Host>
				<div class={{ 'c-input-telephone': true, 'c-input-telephone--no-validate': this.error != null }}>
					<div class="c-input-block" style={{ height: this.showSelect ? '46px' : undefined }}>
						<ui-button
							class="c-button"
							onClick={() => {
								this.setClickButton();
							}}
						>
							{this._countrySelected ? `+ ${this._countrySelected?.prefix}` : ''}
							<span class="icon-container icon-container--handler" style={{ '--icon-content': `var(--theme-scib-icon-${this.icon})` }}>
								<i class={`icon mdc-text-field__icon mdc-text-field__icon--fixed`} />
							</span>
						</ui-button>
						<span
							class={{
								'c-input-telephone__placeholder': true,
								'c-input-telephone__placeholder--not-empty': this.value !== null && this.value !== ''
							}}
						>
							{this.placeholder}
						</span>
						<input
							class={{ 'c-input': true }}
							onInput={(e: any) => this.setChangeInput(e.target.value)} //
							value={this.value}
							name={this.name}
							id={this.idInput}
							aria-label={this.placeholder}
							required={true}
						></input>
					</div>
					{this.error && <span class="c-error">{this.getError(this.error)}</span>}
					<scib-ui-v2-select
						class={{ 'c-select': true, 'show-select': this.showSelect, 'no-validate': true }}
						ref={(element) => (this._selectRef = element)}
						value={this._countrySelected?.label}
						menuOptions={JSON.stringify(this.countries)}
						onValueChange={(e) => this.setCountryCode(e.detail as CountryCode)}
					></scib-ui-v2-select>
				</div>
			</Host>
		);
	}
}
