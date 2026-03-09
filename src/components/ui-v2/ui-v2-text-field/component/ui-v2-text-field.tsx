import { Component, Host, h, Prop, State, Watch, Element, Event, EventEmitter, Method } from '@stencil/core';
import { defaultNumberFormatConfig } from '../models/ui-v2-text-field.model';
import { TextFieldTypes, VariantTypes } from '../../../../shared/models';
import { parseProp } from '../../../../utils/helpers/common';
import { MDCTextField } from '@material/textfield';
import { get, isEmpty, merge } from 'lodash';
import AutoNumeric from 'autonumeric';
import { AtomsTooltipInfo } from '../../../atoms/tooltip-info/component/tooltip-info';
import { TextStatus } from '../../../atoms/helper-text/models/helper-text.model';

@Component({
	tag: 'scib-ui-v2-text-field',
	styleUrl: 'ui-v2-text-field.scss',
	shadow: true
})
export class UI_V2TextField {
	private _autoNumericInstance: AutoNumeric;
	private _textFieldRef: MDCTextField;
	private _inputRef: HTMLInputElement;
	private _internalUpdate: boolean;
	private _hiddenInput: HTMLInputElement;
	private _resizeObserver: ResizeObserver;
	@Element() _hostRef: HTMLElement;

	/**
	 * Flag to control if overflow has been detected in the helper text
	 */
	@State() $statusHelperText: TextStatus = 'default';

	/**
	 *	Different variations of the visual components.
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 *	Input name.
	 */
	@Prop({ mutable: true, reflect: true }) name: string;

	/**
	 *	Disable the label of the input.
	 */
	@Prop() withoutLabel: boolean = false;

	/**
	 *	The type of the input like native html input.
	 */
	@Prop({ attribute: 'type', reflect: true }) type: TextFieldTypes = 'text';
	@State() $type: string;
	@Watch('type') _typeHandler(newValue: string) {
		this.$type = newValue;
	}

	/**
	 *	The value of the input.
	 */
	@Prop({ mutable: true }) value: string;
	@State() $value: string;
	@Watch('value') _valueHandler(newValue: string) {
		this.$value = newValue || '';
		if (!this._internalUpdate) {
			this._updateExternalValue();
			this._resetTextFieldLabel();
			if (this._textFieldRef) {
				if (this._debouncer) clearTimeout(this._debouncer);
				this._debouncer = setTimeout(() => {
					this.valueChange.emit(this.value);
				}, this.debounceTime);
			}
		} else if (this._hiddenInput) {
			this._hiddenInput.value = this.$value;
		}
		this._internalUpdate = false;
	}

	/**
	 *	The value only to show.
	 */
	@Prop({ mutable: true }) alternativeValue: string;
	@Watch('alternativeValue') _alternativeValueHandler(newValue: string) {
		if (newValue !== null && this._textFieldRef) {
			this._textFieldRef.value = newValue;
		}
	}

	/**
	 *	The label text.
	 */
	@Prop() label: string;
	@State() $label: string;
	@Watch('label') _labelHandler(newValue: string) {
		this.$label = newValue;
	}

	/**
	 *	The placeholder text.
	 */
	@Prop() placeholder: string;
	@State() $placeholder: string;
	@Watch('placeholder') _placeholderHandler(newValue: string) {
		this.$placeholder = newValue;
	}

	/**
	 *	Mark as readOnly input.
	 */
	@Prop({ mutable: true, reflect: true }) valueAlign: 'left' | 'right' = 'left';

	/**
	 *	The fixed right icon.
	 */
	@Prop() icon: string;
	@State() $icon: string;
	@Watch('icon') _iconHandler(newValue: string) {
		this.$icon = newValue;
	}

	/**
	 *	Enable focus when is read only (used for select)
	 */
	@Prop() focusReadOnly: boolean;
	@State() $focusReadOnly: boolean;
	@Watch('focusReadOnly') _focusReadOnlyHandler(newValue: boolean | undefined) {
		this.$focusReadOnly = !!newValue;
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
	 *	Enable or disable the tooltip for helperText
	 */
	@Prop() enableTooltip: boolean;
	@State() $enableTooltip: boolean;
	@Watch('enableTooltip') _enableTooltipHandler(newValue: boolean | undefined) {
		this.$enableTooltip = !!newValue;
	}
	/**
	 *	Tooltip configuration options
	 */
	@Prop() tooltipConfig: string | Partial<AtomsTooltipInfo>;
	@State() $tooltipConfig: Partial<AtomsTooltipInfo> = {
		arrow: 'bottom'
	};
	@Watch('tooltipConfig') _tooltipConfigHandler(newValue: string | Partial<AtomsTooltipInfo>) {
		this.$tooltipConfig = {
			arrow: 'bottom',
			...parseProp(newValue) // Parse the string or merge with default values
		};
	}

	/**
	 * Enable automatic tooltip activation when text overflows. When set to true, the component
	 * will automatically check if the helper text overflows its container and show a tooltip if needed.
	 * When set to false (default), the tooltip will only be shown if explicitly enabled via enableTooltip.
	 * This is particularly useful for dynamic text that may or may not overflow.
	 * @default false
	 */
	@Prop() enableAutoTooltip: boolean;
	@State() $enableAutoTooltip: boolean;
	@Watch('enableAutoTooltip') _enableAutoTooltipHandler(newValue: boolean) {
		this.$enableAutoTooltip = !!newValue;
	}

	/**
	 *	This text appear when input is invalid.
	 */
	@Prop() helperText: string;
	@State() $helperText: string;
	@Watch('helperText') _helperTextHandler(newValue: string | undefined) {
		this.$helperText = newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	The maximum number of characters that the user will be able to write.
	 */
	@Prop() limit: number;
	@State() $limit: number;
	@Watch('limit') _limitHandler(newValue: number | undefined) {
		if (typeof newValue === 'number' && newValue > 0) {
			this.$limit = newValue;
		}
	}

	/**
	 *	The maximum number of rows that the user will be able to see in the text area type.
	 */
	@Prop() rows: number;
	@State() $rows: number;
	@Watch('rows') _rowsHandler(newValue: number | undefined) {
		if (typeof newValue === 'number' && newValue > 0) {
			this.$rows = newValue;
		}
	}

	/**
	 *	Mark as invalid input.
	 */
	@Prop({ reflect: true, mutable: true }) invalid: boolean;
	@State() $invalid: boolean;
	@Watch('invalid') _invalidHandler(newValue: boolean | undefined) {
		this.$invalid = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as warning input.
	 */
	@Prop({ reflect: true, mutable: true }) warning: boolean;
	@State() $warning: boolean;
	@Watch('warning') _warningHandler(newValue: boolean | undefined) {
		this.$warning = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as warning input.
	 */
	@Prop({ reflect: true, mutable: true }) loading: boolean;
	@State() $loading: boolean;
	@Watch('loading') _loadingHandler(newValue: boolean | undefined) {
		this.$loading = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as readOnly input.
	 */
	@Prop({ mutable: true, reflect: true }) readOnly: boolean;
	@State() $readOnly: boolean;
	@Watch('readOnly') _readOnlyHandler(newValue: boolean | undefined) {
		this.$readOnly = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as success input.
	 */
	@Prop({ reflect: true, mutable: true }) success: boolean;
	@State() $success: boolean;
	@Watch('success') _successHandler(newValue: boolean | undefined) {
		this.$success = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as required input.
	 */
	@Prop({ mutable: true, reflect: true }) required: boolean;
	@Watch('required') _requiredHandler() {
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean = false;
	@State() $disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean | undefined) {
		this.$disabled = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as reset input.
	 */
	@Prop({ mutable: true, reflect: true }) resetValue: boolean;
	@State() $resetValue: boolean;
	@Watch('resetValue') _resetHandler(newValue: boolean | undefined) {
		this.$resetValue = newValue;
		if (this.$resetValue) {
			this.cleanField();
		}
	}

	/**
	 *	The config that you want to apply to this input if you ar using it as number.
	 * 	You can see mor in the api document.
	 */
	@Prop() numberFormatConfig: string | { [key: string]: any };
	@Watch('numberFormatConfig') _numberFormatConfigHandler(newValue: string | { [key: string]: any }) {
		if (this._autoNumericInstance) {
			const formatConfig: { [key: string]: any } = merge({}, defaultNumberFormatConfig, parseProp(newValue, {}));
			this._autoNumericInstance.update(formatConfig);
		}
	}

	@State() _isHelperTextOverflow: boolean = false;

	/**
	 *
	 */
	@Event() valueChange: EventEmitter<string>;

	/**
	 *
	 */
	@Event() private internalValueChange: EventEmitter<string>;

	/**
	 *
	 */
	@Event() activateFocus: EventEmitter<void>;

	/**
	 *
	 */
	@Event() deactivateFocus: EventEmitter<void>;

	/**
	 *
	 */
	@Event() iconClick: EventEmitter<string>;

	_debouncer: any;

	/**
	 * Tiempo hasta que el evento de Change es emitido
	 */
	@Prop({ reflect: true }) debounceTime: number = 0;

	/**
	 *
	 */
	@Method() async getInputRef() {
		return this._textFieldRef;
	}

	/**
	 *
	 */
	@Method() async setFocus() {
		setTimeout(() => {
			this._textFieldRef.getDefaultFoundation().notchOutline(true);
			this._textFieldRef.getDefaultFoundation().activateFocus();
		});
	}

	/**
	 *
	 */
	@Method() async focusDeactivate() {
		setTimeout(() => {
			this._textFieldRef.getDefaultFoundation().notchOutline(false);
			this._textFieldRef.getDefaultFoundation().deactivateFocus();
		});
	}

	/**
	 *
	 */
	componentWillLoad() {
		this._valueHandler(this.value);
		this._placeholderHandler(this.placeholder);
		this._focusReadOnlyHandler(this.focusReadOnly);
		this._showCleanIconHandler(this.showCleanIcon);
		this._labelHandler(this.label);
		this._iconHandler(this.icon);
		this._helperTextHandler(this.helperText);
		this._limitHandler(this.limit);
		this._rowsHandler(this.rows);
		this._readOnlyHandler(this.readOnly);
		this._invalidHandler(this.invalid);
		this._warningHandler(this.warning);
		this._loadingHandler(this.loading);
		this._successHandler(this.success);
		this._disabledHandler(this.disabled);
		this._typeHandler(this.type);
		this._requiredHandler();
		this._focusReadOnlyHandler(this.focusReadOnly);
		this._alternativeValueHandler(this.alternativeValue);
		this._numberFormatConfigHandler(this.tooltipConfig);
		this._enableTooltipHandler(this.enableTooltip);
		this._enableAutoTooltipHandler(this.enableAutoTooltip);
		this._tooltipConfigHandler(this.tooltipConfig);
	}

	/**
	 *
	 */
	componentDidLoad() {
		this._destroy();
		this._textFieldRef = MDCTextField.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-text-field'));
		this._inputRef = this._hostRef.shadowRoot.querySelector('.mdc-text-field__input');
		this._updateTextFieldStatus();
		this._setSlotInputListener();
		this._setCustomFormatters();
		this._setListeners();

		// Start observing the helper text container if it exists
		const helperTextContainer = this._hostRef.shadowRoot.querySelector('.mdc-text-field-helper-wrapper');
		if (helperTextContainer) {
			this._resizeObserver.observe(helperTextContainer);
		}
	}

	/**
	 *
	 */
	private _destroy() {
		if (!isEmpty(this._textFieldRef) && this._textFieldRef.destroy) {
			try {
				this._textFieldRef.unlisten('focusin', () => {});
				this._textFieldRef.unlisten('focusout', () => {});
				this._textFieldRef.unlisten('input', () => {});
				this._textFieldRef.destroy();
			} catch (error) {}
		}

		// Disconnect the ResizeObserver when the component is destroyed
		if (this._resizeObserver) {
			this._resizeObserver.disconnect();
		}
	}

	/**
	 *
	 */
	private _setSlotInputListener() {
		let slot = this._hostRef.shadowRoot.querySelector('slot');
		const inputs = slot?.assignedNodes();
		this._hiddenInput = (inputs || []).find((item) => item instanceof HTMLInputElement) as HTMLInputElement;
		if (this._hiddenInput) {
			this._hiddenInput?.setAttribute('value', '');
			this._hiddenInput?.addEventListener('input', (event: any) => {
				const { srcElement } = event;
				const { value } = srcElement;
				this.value = value;
			});
		}
	}

	/**
	 *
	 */
	private _setListeners() {
		if (this._textFieldRef) {
			this._textFieldRef.listen('focusin', () => {
				if (this.$readOnly && this._textFieldRef && !this.focusReadOnly) {
					this._textFieldRef.getDefaultFoundation().notchOutline(false);
					this._textFieldRef.getDefaultFoundation().deactivateFocus();
				}
				this.activateFocus.emit();
			});
			this._textFieldRef.listen('focusout', () => this.deactivateFocus.emit());
			this._textFieldRef.listen('input', () => {
				this._internalUpdate = true;
				const { value = '' } = this._textFieldRef;
				this.value = this._getRawValue(value);
				if (this._debouncer) clearTimeout(this._debouncer);
				this._debouncer = setTimeout(() => {
					this.valueChange.emit(this.value);
					this.internalValueChange.emit(this.value);
				}, this.debounceTime);
			});
		}
	}

	/**
	 *
	 */
	private _setCustomFormatters() {
		switch (this.$type) {
			case 'number':
				const userConfig = parseProp<{ [key: string]: any }>(this.numberFormatConfig, {});
				const formatConfig: { [key: string]: any } = merge({}, defaultNumberFormatConfig, userConfig);
				this._autoNumericInstance = new AutoNumeric(this._inputRef, this.value, { ...formatConfig });
				break;
			default:
		}
	}

	/**
	 *	This function update the textField status.
	 */
	private _updateTextFieldStatus() {
		if (this._textFieldRef) {
			this._textFieldRef.helperTextContent = !isEmpty(this.$helperText) ? this.$helperText : undefined;
			this._textFieldRef.useNativeValidation = false;
			this._textFieldRef.value = this.$value || '';
			this._textFieldRef.disabled = this.$disabled;
			this._textFieldRef.required = this.required;
			this._textFieldRef.valid = !this.invalid && this.success;
		}
		this._getStatusHelperText();
	}

	/**
	 *
	 */
	private _updateExternalValue() {
		switch (this.$type) {
			case 'number':
				this._autoNumericInstance && this._autoNumericInstance.set(this.value);
				break;
			default:
				this._updateTextFieldStatus();
		}
	}

	/**
	 *
	 */
	cleanField() {
		this._internalUpdate = true;
		this.value = '';
		this.alternativeValue = '';
		if (!this.$resetValue) this.valueChange.emit(this.value);
		this.internalValueChange.emit(this.value);
		this._updateTextFieldStatus();
		if (this._autoNumericInstance) {
			this._autoNumericInstance.set('');
		}
	}

	/**
	 *
	 */
	private _getRawValue(value: any): any {
		if (this._autoNumericInstance) {
			return this._autoNumericInstance.getNumericString();
		}
		return value;
	}

	/**
	 *
	 */
	private _resetTextFieldLabel() {
		setTimeout(() => {
			if (this._textFieldRef) {
				this._textFieldRef.getDefaultFoundation().notchOutline(false);
				this._textFieldRef.getDefaultFoundation().deactivateFocus();
			}
		});
	}

	/**
	 *
	 * @param event
	 */
	iconClickHandler(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (!this.disabled && (!this.$readOnly || this.focusReadOnly)) {
			this.iconClick.emit(this.$value || '');
		}
	}

	/**
	 *
	 * @param event
	 */
	enterSubmit(event: Event) {
		const key = get(event, 'key');
		if (key === 'Enter') {
			this.iconClickHandler(event);
			this._inputRef.blur();
			this._resetTextFieldLabel();
		}
	}

	/**
	 * Blocks non-numeric characters for number type inputs
	 * @param event KeyboardEvent
	 */
	handleKeyPress(event: KeyboardEvent) {
		// If type is number, only allow numeric input
		if (this.$type === 'number') {
			// Allow: backspace, delete, tab, escape, enter, decimal point, minus sign
			const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Enter', 'Escape', '.', ',', '-'];

			// Check if the key is not a number and not in the allowedKeys list
			if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
				event.preventDefault();
			}

			// Prevent multiple decimal points
			if ((event.key === '.' || event.key === ',') && (this._inputRef.value.includes('.') || this._inputRef.value.includes(','))) {
				event.preventDefault();
			}
		}
	}

	private _onHandleActiveTextOverflow(event: CustomEvent<boolean>) {
		const { detail } = event;
		this._isHelperTextOverflow = detail;
	}

	/**
	 * Returns the appropriate status icon URL based on component state
	 */
	private _getStatusHelperText() {
		const STATUS_HELPERTEXT: { [key: string]: TextStatus } = {
			LOADING: 'loading',
			SUCCESS: 'success',
			ERROR: 'error',
			WARNING: 'warning',
			INFO: 'info',
			DEFAULT: 'default'
		};

		// Usar early returns en orden de prioridad
		if (this.$loading) this.$statusHelperText = STATUS_HELPERTEXT.LOADING;
		if (this.$success) this.$statusHelperText = STATUS_HELPERTEXT.SUCCESS;
		if (this.$invalid) this.$statusHelperText = STATUS_HELPERTEXT.ERROR;
		if (this.$warning) this.$statusHelperText = STATUS_HELPERTEXT.WARNING;

		if (!this.$loading && !this.$success && !this.$invalid && !this.$warning) {
			this.$statusHelperText = STATUS_HELPERTEXT.DEFAULT;
		}
	}

	render() {
		return (
			<Host>
				<label
					class={{
						'mdc-text-field mdc-text-field--filled': true,
						'mdc-text-field--textarea': this.$type === 'textarea',
						'mdc-text-field--empty-label mdc-text-field--no-label': isEmpty(this.$label),
						'mdc-text-field--without-label': isEmpty(this.$label) && this.withoutLabel,
						'mdc-text-field__invalid': this.$invalid,
						'mdc-text-field__warning': this.$warning,
						'mdc-text-field__loading': this.$loading
					}}
					aria-hidden="true"
				>
					<span class="mdc-text-field__ripple" />
					{(this.$label || '').length > 0 && (
						<span
							aria-hidden="true"
							class={{
								'mdc-floating-label': true,
								'mdc-floating-label--icon': !!this.$icon
							}}
						>
							{this.$label}
						</span>
					)}
					{this.$type === 'textarea' ? (
						<span class="mdc-text-field__resizer">
							<textarea
								class="mdc-text-field__input mdc-text-field__input--textarea"
								aria-hidden="true"
								aria-labelledby={this.$label}
								placeholder={this.$placeholder}
								maxlength={this.$limit}
								name={this.name}
								rows={this.$rows}
							></textarea>
						</span>
					) : (
						<input
							class="mdc-text-field__input"
							type={this.$type === 'number' ? 'text' : this.$type}
							aria-hidden="true"
							aria-labelledby={this.$label}
							placeholder={this.$placeholder}
							max={this.$limit}
							name={this.name}
							maxlength={this.$limit}
							readonly={this.$readOnly}
							onKeyDown={() => {}}
							onKeyPress={(event) => {
								this.enterSubmit(event);
								this.handleKeyPress(event);
							}}
							autocomplete="off"
						/>
					)}
					{((this.$value || '').length > 0 || (this.alternativeValue || '').length > 0) &&
						!this.$disabled &&
						!this.$readOnly &&
						this.$showCleanIcon && (
							<span class="icon-container clean-icon">
								<i class="icon mdc-text-field__icon mdc-text-field__icon--hover" onClick={() => this.cleanField()} />
							</span>
						)}
					{this.$icon && (
						<span
							class="icon-container icon-container--handler"
							style={{ '--icon-content': `var(--theme-scib-icon-${this.$icon})` }}
							onClick={(event) => this.iconClickHandler(event)}
						>
							<i class="icon mdc-text-field__icon mdc-text-field__icon--fixed" />
						</span>
					)}

					<span class="mdc-line-ripple" />
				</label>
				<div
					class={{
						'mdc-text-field-helper-line': true,
						'mdc-text-field-helper-line--with-counter': this._isHelperTextOverflow && this.$limit > 0,
						'mdc-text-field-helper-line--invalid': this.$invalid,
						'mdc-text-field-helper-line--success': this.$success
					}}
				>
					{this.$helperText && (
						<scib-atoms-helper-text
							text={this.$helperText}
							status={this.$statusHelperText}
							enableAutoTooltip={this.$enableAutoTooltip}
							enableTooltip={this.$enableTooltip}
							tooltipConfig={this.$tooltipConfig}
							onActiveTextOverflow={(event: CustomEvent<boolean>) => this._onHandleActiveTextOverflow(event)}
						></scib-atoms-helper-text>
					)}
					{!!this.$limit && <div class="mdc-text-field-character-counter" />}
				</div>
				<slot />
			</Host>
		);
	}
}
