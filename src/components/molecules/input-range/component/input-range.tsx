import { MDCTextField } from '@material/textfield';
import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import AutoNumeric from 'autonumeric';
import { capitalize, compact, first, get, isEmpty, isEqual, isNil, isUndefined, last, merge } from 'lodash';
import { DateTime } from 'luxon';
import { BehaviorSubject, distinctUntilChanged, Subscription } from 'rxjs';
import { registerClickOutside, removeClickOutside } from 'stencil-click-outside';
import VMasker from 'vanilla-masker';
import { AtomsTooltipInfo } from '../../../../components';
import { RangeInputTypes, VariantTypes } from '../../../../shared/models';
import { parseProp as _parseProp, parseProp } from '../../../../utils/helpers/common';
import { TextStatus } from '../../../atoms/helper-text/models/helper-text.model';
import { LOCALE_FORMATS } from '../../../ui-v2/ui-v2-date-picker/models/ui-v2-date-picker.model';
import { DEFAULT_NUMBER_INPUT_CONFIG, DEFAULT_RANGE_INPUT_CONFIG, SHOW_ONLY_ONE_INPUT } from '../models/input-range.config';
import {
	InputMode,
	InputRangeValue,
	InputTypes,
	MetaDataInput,
	NumberRangeTypes,
	RangeInputConfig,
	RangeTypes,
	SelectOptions
} from '../models/input-range.model';

// import localeEn from 'air-datepicker/locale/en';

/**
 * Component description
 *
 * @slot content - Slot por defecto
 */
@Component({
	tag: 'scib-molecules-input-range',
	styleUrl: 'input-range.scss',
	shadow: true
})
export class MoleculesInputRange {
	private _focusEvent$: BehaviorSubject<string> = new BehaviorSubject<string>('');
	private _inputValueFrom: MetaDataInput = new MetaDataInput();
	private _inputValueTo: MetaDataInput = new MetaDataInput();
	private _focusEventSubscription: Subscription;
	private _internalUpdate: boolean = false;
	private _rangeDatePickerRef: HTMLScibUiV2DatePickerElement;
	private _datePickerRef: any;
	private _selectRef: any;
	private _validationError: boolean = false;
	/**
	 *
	 */
	@Element() _hostRef: HTMLElement;

	/**
	 *	Different variations of the visual components.
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 *	The placeholder text.
	 */
	@Prop() label: string;

	/**
	 *	Input name.
	 */
	@Prop() name: string;

	/**
	 *	Input id.
	 */
	@Prop({ attribute: 'id' }) _id: string;

	/**
	 *	The type of the input like native html input.
	 */
	@Prop({ mutable: true, reflect: true }) type: RangeInputTypes = 'amount';

	/**
	 *	The type of the input like native html input.
	 */
	@Prop({ mutable: true, reflect: true }) mode: InputMode = 'range';

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;

	/**
	 *	Mark as readOnly input.
	 */
	@Prop({ mutable: true, reflect: true }) readOnly: boolean;

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabledRangeSelector: boolean;

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabledCalendar: boolean;

	/**
	 *	Mark as invalid input.
	 */
	@Prop({ reflect: true, mutable: true }) invalid: boolean;
	@State() $invalid: boolean;
	@Watch('invalid') _invalidHandler(newValue: boolean | undefined) {
		this.$invalid = !!newValue;
	}
	/**
	 *	Mark as success input.
	 */
	@Prop({ reflect: true, mutable: true }) success: boolean;
	@State() $success: boolean;
	@Watch('success') _successHandler(newValue: boolean | undefined) {
		this.$success = !!newValue;
	}

	/**
	 *	Mark as warning helper text.
	 */
	@Prop({ reflect: true, mutable: true }) warning: boolean;
	@State() $warning: boolean;
	@Watch('warning') _warningHandler(newValue: boolean | undefined) {
		this.$warning = !!newValue;
	}

	/**
	 *	Mark as loading helper text.
	 */
	@Prop({ reflect: true, mutable: true }) loading: boolean;
	@State() $loading: boolean;
	@Watch('loading') _loadingHandler(newValue: boolean | undefined) {
		this.$loading = !!newValue;
	}

	/**
	 *	This text appear when input is invalid.
	 */
	@Prop() helperTextError: string;

	/**
	 *	This text appear when input is invalid.
	 */
	@Prop() helperText: string;
	@State() $helperText: string;
	@Watch('helperText') _helperTextHandler(newValue: string | undefined) {
		this.$helperText = newValue;
	}

	/**
	 *	The value of the input.
	 */
	@Prop({ mutable: true, reflect: true }) value: string;
	@State() $value: string[];
	@Watch('value') _valueHandler(newValue: string) {
		if (!this._internalUpdate && !isEqual(this.$value, newValue)) {
			this.$value = newValue.split('|');
			switch (this.mode) {
				case RangeTypes.RANGE:
					this.$valueFrom = first(this.$value);
					this.$valueTo = last(this.$value);
					break;
				case RangeTypes.EQUALS:
					this.$valueFrom = first(this.$value);
					this.$valueTo = undefined;
					break;
				case RangeTypes.FROM:
					this.$valueFrom = first(this.$value);
					this.$valueTo = undefined;
					break;
				case RangeTypes.TO:
					this.$valueFrom = undefined;
					this.$valueTo = first(this.$value);
					break;
			}
			if (this.type === InputTypes.AMOUNT || (this.type === InputTypes.DATE && this.mode === RangeTypes.RANGE)) {
				this._updateInputFieldValue();
				this._resetTextFieldLabel(this._inputValueFrom);
				this._resetTextFieldLabel(this._inputValueTo);
				this.value = '';
				this.$rangePickerValue = '';
			}
		} else {
			this._internalUpdate = false;
		}
	}

	/**
	 *
	 */
	@Prop() config: Partial<RangeInputConfig> | string;
	@State() $config: Partial<RangeInputConfig>;
	@Watch('config') _setConfig(newVal: string | Partial<RangeInputConfig>) {
		this.$config = merge({}, DEFAULT_RANGE_INPUT_CONFIG, parseProp<Partial<RangeInputConfig>>(newVal, {}));
		const formatConfig: { [key: string]: any } = merge({}, DEFAULT_NUMBER_INPUT_CONFIG, this.$config.amountInputConfig || {});
		if (this._inputValueFrom.autoNumericInstance) this._inputValueFrom.autoNumericInstance.update(formatConfig);
		if (this._inputValueTo.autoNumericInstance) this._inputValueTo.autoNumericInstance.update(formatConfig);
		this.$config['datePickerConfig'] = merge({}, this.$config.datePickerConfig || {}, { borderless: false });
	}

	/**
	 *	The fixed right icon.
	 */
	@Prop() icon: string;
	@State() $icon: string;
	@Watch('icon') _iconHandler(newValue: string) {
		this.$icon = newValue;
	}

	/**
	 *
	 */
	@Prop() menuOptions: string | SelectOptions;
	@State() $menuOptions: SelectOptions;
	@Watch('menuOptions') _menuOptionsHandler(newValue: string | SelectOptions) {
		this.$menuOptions = _parseProp(newValue);
		this.$menuOptions = this.$menuOptions.map((element) => {
			if (+element?.value >= 0) {
				element.value = NumberRangeTypes[+element.id - 1];
			}
			return element;
		});
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
	@Prop() enableTooltip: boolean = false;
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
		this.$tooltipConfig = merge({}, { arrow: 'bottom' }, parseProp(newValue, {}));
	}

	/**
	 * Enable automatic tooltip activation when text overflows. When set to true, the component
	 * will automatically check if the helper text overflows its container and show a tooltip if needed.
	 * When set to false (default), the tooltip will only be shown if explicitly enabled via enableTooltip.
	 * This is particularly useful for dynamic text that may or may not overflow.
	 * @default false
	 */
	@Prop() enableAutoTooltip: boolean = false;
	@State() $enableAutoTooltip: boolean;
	@Watch('enableAutoTooltip') _enableAutoTooltipHandler(newValue: boolean) {
		this.$enableAutoTooltip = !!newValue;
	}

	/**
	 *
	 */
	@Prop() inputIcon: boolean;

	/**
	 * Boolean to check if any input is focus
	 */
	@State() $isAnyTextFieldFocus: boolean = true;

	/**
	 * keep label floating when in range type second input is not empty a there is no focus
	 */
	@State() $addFloatLabelClass: boolean = false;

	/**
	 * Range calendar status
	 */
	@State() $rangeCalendarStatus: boolean = false;

	/**
	 * $valueFrom
	 */
	@State() $valueFrom: string = null;

	/**
	 * $valueTo
	 */
	@State() $valueTo: string = null;

	/**
	 * $valueFrom
	 */
	@State() $rangePickerValue: string = null;

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
	@Event() valueChange: EventEmitter<InputRangeValue>;

	/**
	 *
	 */
	@Event() modeChange: EventEmitter<string>;

	/**
	 *
	 */
	@Event() iconClick: EventEmitter<any[]>;

	/**
	 *
	 */
	@Method() async close() {
		this.closeSelect();
	}

	/**
	 *
	 */
	@Method() async closeRangeSelector() {
		this.disabledCalendar = false;
		this._selectRef.close();
	}

	/**
	 *
	 */
	@Method() async closeCalendar() {
		this.disabledRangeSelector = false;
		this._datePickerRef.close();
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._loadOptions();
		this._setConfig(this.config);
		this._valueHandler(this.value);
		this._helperTextHandler(this.helperText);
		this._warningHandler(this.warning);
		this._loadingHandler(this.loading);
		this._successHandler(this.success);
		this._invalidHandler(this.invalid);
		this._iconHandler(this.icon);
		this._showCleanIconHandler(this.showCleanIcon);
		this._enableAutoTooltipHandler(this.enableAutoTooltip);
		this._enableTooltipHandler(this.enableTooltip);
		this._tooltipConfigHandler(this.tooltipConfig);
	}

	/**
	 *
	 */
	componentDidLoad() {
		this._destroy();
		this._manageFocus();
		this._handleCalculateWidthHelperText();
		registerClickOutside(this, this._hostRef, () => {
			this._focusEvent$.next('OUT');
		});
		if (this.type === InputTypes.AMOUNT || (this.type === InputTypes.DATE && this.mode === RangeTypes.RANGE)) {
			this.loadInput(this._inputValueFrom, 'from', this.$valueFrom);
			this.loadInput(this._inputValueTo, 'to', this.$valueTo);
			this._setCustomFormatters();
			this._setListeners();
		}
		if (this.type === InputTypes.DATE && this.mode === RangeTypes.RANGE) {
			this._setInputMask();
		}
	}

	componentDidUpdate() {
		this._handleCalculateWidthHelperText();
		if (this.type === InputTypes.AMOUNT || (this.type === InputTypes.DATE && this.mode === RangeTypes.RANGE)) {
			if (!this._inputValueTo.textFieldRef) {
				this.loadInput(this._inputValueTo, 'to', this.$valueTo);
			}
			if (!this._inputValueFrom.textFieldRef) {
				this.loadInput(this._inputValueFrom, 'from', this.$valueFrom);
			}
			if (!this._inputValueFrom.textFieldRef && !this._inputValueTo.textFieldRef) {
				this._setCustomFormatters();
				this._setListeners();
			}
		}
		if (this.type === InputTypes.DATE && this.mode === RangeTypes.RANGE) {
			if (!!this._inputValueFrom.textFieldRef && !!this._inputValueTo.textFieldRef) {
				this._setInputMask();
			}
		}
	}

	/**
	 *
	 */
	disconnectedCallback() {
		if (this._focusEventSubscription && this._focusEventSubscription.unsubscribe) {
			this._focusEventSubscription.unsubscribe();
		}
	}

	/**
	 * Adjusts the maximum width of the helper text for the input range component.
	 *
	 * This method calculates the available width for the helper text based on the
	 * width of the host element (`_hostRef`) and subtracts a fixed offset of 32 pixels.
	 * It then updates a CSS custom property (`--ui-v2-text-field-helper-max-width`)
	 * on the `_selectRef` element to reflect this calculated width.
	 *
	 * @private
	 */
	private _handleCalculateWidthHelperText() {
		this._selectRef && this._selectRef.style.setProperty('--ui-v2-text-field-helper-max-width', `${this._hostRef.clientWidth - 32}px`);
	}

	/**
	 *
	 */
	private _loadOptions() {
		if (this.menuOptions) {
			this._menuOptionsHandler(this.menuOptions);
		} else {
			this.$menuOptions = Object.values(RangeTypes).map((value, index) => ({
				value,
				id: index,
				label: capitalize(value)
			}));
		}
	}

	/**
	 *
	 * @param event
	 */
	private _preventEvent(event): any {
		if (event && event.defaultPrevented) {
			event?.preventDefault();
			event?.stopPropagation();
		}

		return get(event, 'detail', {});
	}

	/**
	 *
	 * @param inputToLoad
	 * @param type
	 * @param defaultValue
	 */
	private loadInput(inputToLoad: MetaDataInput, type: 'from' | 'to', defaultValue: string): void {
		inputToLoad.textFieldRef = MDCTextField.attachTo(this._hostRef.shadowRoot.querySelector(`.mdc-text-field.input-${type}`));
		inputToLoad.inputRef = this._hostRef.shadowRoot.querySelector<HTMLInputElement>(`.mdc-text-field__input.input-${type}`);
		this._updateTextFieldStatus(defaultValue || '', inputToLoad.textFieldRef);
	}

	/**
	 *	This function update the textField status.
	 */
	private _updateTextFieldStatus(valueToUpdate: string, refInputToClean: MDCTextField): void {
		if (refInputToClean) {
			refInputToClean.useNativeValidation = false;
			refInputToClean.value = valueToUpdate;
			refInputToClean.disabled = this.disabled;
			refInputToClean.valid = !this.invalid;
		}
	}

	/**
	 *
	 */
	private _destroy() {
		this._destroyInputEvent(this._inputValueFrom);
		this._destroyInputEvent(this._inputValueTo);
		removeClickOutside(this, this._hostRef, () => {});
	}

	/**
	 *
	 */
	private _destroyInputEvent(input: MetaDataInput) {
		if (!isEmpty(input.textFieldRef) && input.textFieldRef.destroy) {
			input.textFieldRef.unlisten('focusin', () => {});
			input.textFieldRef.unlisten('focusout', () => {});
			input.textFieldRef.unlisten('input', () => {});
			input.textFieldRef.destroy();
		}
	}

	/**
	 *
	 */
	private _updateInputFieldValue(): void {
		if (this.type === InputTypes.AMOUNT) {
			if (this.mode === RangeTypes.TO) {
				this._inputValueFrom.autoNumericInstance?.set(this.$valueTo);
				this._inputValueTo.autoNumericInstance?.set(this.$valueTo);
			} else {
				this._inputValueFrom.autoNumericInstance?.set(this.$valueFrom);
				this._inputValueTo.autoNumericInstance?.set(this.$valueFrom);
			}
		} else if (this.type === InputTypes.DATE) {
			if (this._inputValueFrom.inputRef && this._inputValueTo.inputRef) {
				if (this.mode === RangeTypes.TO) {
					this._inputValueFrom.inputRef.value = this._formatRangeDate(this.$valueTo);
				} else {
					this._inputValueFrom.inputRef.value = this._formatRangeDate(this.$valueFrom);
				}
				this._inputValueTo.inputRef.value = this._formatRangeDate(this.$valueTo);
			}
		}
	}

	/**
	 *
	 */
	private _resetTextFieldLabel(inputField: MetaDataInput) {
		setTimeout(() => {
			if (inputField.textFieldRef) {
				if (isEmpty(this.value)) {
					inputField.textFieldRef.getDefaultFoundation().notchOutline(false);
					inputField.textFieldRef.getDefaultFoundation().deactivateFocus();
				} else {
					inputField.textFieldRef.getDefaultFoundation().notchOutline(true);
					inputField.textFieldRef.getDefaultFoundation().activateFocus();
				}
			}
		});
	}

	/**
	 *
	 */
	private _setListeners() {
		this._setListenerInputValueFrom();
		this._setListenerInputValueTo();
	}

	/**
	 *
	 */
	private _setListenerInputValueFrom(): void {
		if (this._inputValueFrom.textFieldRef) {
			this._selectRef && this._selectRef.close();
			this._inputValueFrom.textFieldRef.listen('focusin', () => {
				this._focusIn();
				this._selectRef && this._selectRef.close();
				this._rangeDatePickerRef && this._rangeDatePickerRef.open();
				this._datePickerRef && this._datePickerRef.open();
				if (!SHOW_ONLY_ONE_INPUT.includes(this.mode)) {
					this._inputValueTo.textFieldRef.getDefaultFoundation().notchOutline(true);
					this._inputValueTo.textFieldRef.getDefaultFoundation().activateFocus();
				}
			});
			this._inputValueFrom.textFieldRef.listen('focusout', () => {
				this._focusOut();
				if (!SHOW_ONLY_ONE_INPUT.includes(this.mode) && this._inputValueTo.textFieldRef) {
					this._inputValueTo.textFieldRef.getDefaultFoundation().notchOutline(false);
					this._inputValueTo.textFieldRef.getDefaultFoundation().deactivateFocus();
				}
			});
			this._inputValueFrom.textFieldRef.listen('input', (event) => {
				this._preventEvent(event);

				if (this.mode === RangeTypes.TO) {
					this.$valueTo = this._inputValueFrom.autoNumericInstance.getNumericString();
					if (isUndefined(this.$valueFrom)) {
						this.$valueFrom = '';
					}
				} else if (this.type === InputTypes.DATE) {
					// Add validation format input
					this.$valueFrom = this._getIsoDateFromFormat(this._inputValueFrom.inputRef.value);
				} else {
					this.$valueFrom = this._inputValueFrom.autoNumericInstance.getNumericString();
				}
				this._emitChangeValueComponent();
			});
		}
	}

	/**
	 *
	 */
	private _setListenerInputValueTo(): void {
		if (this._inputValueTo.textFieldRef) {
			this._inputValueTo.textFieldRef.listen('focusin', () => {
				this._focusIn();
				this._selectRef && this._selectRef.close();
				this._rangeDatePickerRef && this._rangeDatePickerRef.open();
				this._datePickerRef && this._datePickerRef.open();
				if (this._inputValueFrom.textFieldRef) {
					this._inputValueFrom.textFieldRef.getDefaultFoundation().notchOutline(true);
					this._inputValueFrom.textFieldRef.getDefaultFoundation().activateFocus();
				}
			});
			this._inputValueTo.textFieldRef.listen('focusout', () => {
				this._focusOut();
				if (this._inputValueFrom.textFieldRef) {
					this._inputValueFrom.textFieldRef.getDefaultFoundation().notchOutline(false);
					this._inputValueFrom.textFieldRef.getDefaultFoundation().deactivateFocus();
				}
			});
			this._inputValueTo.textFieldRef.listen('input', () => {
				if (this.type === InputTypes.DATE) {
					// Add validation format input
					this.$valueTo = this._getIsoDateFromFormat(this._inputValueTo.inputRef.value);
				} else {
					this.$valueTo = this._inputValueTo.autoNumericInstance.getNumericString();
				}
				this._emitChangeValueComponent();
			});
		}
	}

	/**
	 *
	 * @param inputValue
	 * @returns
	 */
	private _getIsoDateFromFormat(inputValue: string) {
		if (isEmpty(inputValue)) {
			return '';
		}
		const format = get(this.$config, ['datePickerConfig', 'dateFormat'], 'dd/MM/yyyy');
		const _date = DateTime.fromFormat(inputValue, format as string, { zone: 'local' });
		return _date.toISO();
	}

	/**
	 *
	 * @param date
	 */
	private _formatRangeDate(date: string) {
		if (isEmpty(date)) {
			return '';
		}
		const format = get(this.$config, ['datePickerConfig', 'dateFormat'], 'dd/MM/yyyy');
		const _date = DateTime.fromISO(date, { zone: 'local' });
		return _date.toFormat(format as string);
	}

	/**
	 *
	 */
	private _emitChangeValueComponent(): void {
		this._internalUpdate = true;
		this.prepareFieldsToUpdateDOM();
		const _value = [];
		switch (this.mode) {
			case RangeTypes.RANGE:
				_value.push(this.$valueFrom, this.$valueTo);
				break;
			case RangeTypes.EQUALS:
			case RangeTypes.FROM:
				this._internalUpdate = this.type !== InputTypes.DATE;
				_value.push(this.$valueFrom);
				break;
			case RangeTypes.TO:
				this._internalUpdate = this.type !== InputTypes.DATE;
				_value.push(this.$valueTo);
				break;
		}
		this.value = compact(_value).join('|');
		this._handleValueRangePicker();
		if (this.type === InputTypes.AMOUNT) {
			const _values = compact(_value);
			this.valueChange.emit(_values.length < 2 ? get(_values, [0], '') : _values);
		}
	}

	private _handleValueRangePicker() {
		if (this.type === InputTypes.AMOUNT && !isEmpty(this.$valueFrom) && !isEmpty(this.$valueTo)) {
			const fromVal = parseFloat(this.$valueFrom);
			const toVal = parseFloat(this.$valueTo);

			if (toVal < fromVal) {
				// Second value is less than first value, set error state
				this._validationError = true;
				this.$invalid = true;
				this.$helperText = this.helperTextError || 'The second value must be greater than or equal to the first value.';
			} else {
				// Values are valid
				if (this._validationError) {
					this._validationError = false;
					this.$invalid = false;
					this.$helperText = '';
				}
			}
		}
	}

	/**
	 * Method private to prepare extarnal libs binded with diffetents filed existing on DOM
	 */
	private prepareFieldsToUpdateDOM() {
		if (this.type === InputTypes.AMOUNT && (this.mode === RangeTypes.TO || this.mode === RangeTypes.FROM || this.mode === RangeTypes.EQUALS)) {
			this._inputValueTo.autoNumericInstance.set('');
		}
	}

	/**
	 *
	 */
	private _setCustomFormatters() {
		if (this.type === InputTypes.AMOUNT) {
			this._setNumericInstance(this._inputValueFrom, this.$valueFrom);
			this._setNumericInstance(this._inputValueTo, this.$valueTo);
		}
	}

	/**
	 *
	 */
	private _setNumericInstance(input: MetaDataInput, valueToSet: string) {
		const userConfig = parseProp<{ [key: string]: any }>(this.$config.amountInputConfig, {});
		const formatConfig: { [key: string]: any } = merge({}, DEFAULT_NUMBER_INPUT_CONFIG, userConfig);
		input.autoNumericInstance = new AutoNumeric(input.inputRef, valueToSet, { ...formatConfig });
	}

	/**
	 *
	 */
	cleanField(inputType: 'to' | 'from', inputField: MetaDataInput, changeMode?: boolean): void {
		if (!!inputField) {
			if (inputType === 'from') {
				this.$valueFrom = '';
			} else {
				this.$valueTo = '';
			}
			this._updateTextFieldStatus('', inputField.textFieldRef);
			if (this.type === InputTypes.AMOUNT) {
				this._emitChangeValueComponent();
				inputField.autoNumericInstance.set('');
			} else {
				this.value = '';
				this.$valueTo = '';
				this.$valueFrom = '';
				this.$rangePickerValue = '';
				this._emitChangeValueComponent();
				this.$isAnyTextFieldFocus = true;
				this._focusEvent$.next('OUT');
				if (!changeMode) {
					requestAnimationFrame(() => {
						this._selectRef && this._selectRef.close();
						this._rangeDatePickerRef && this._rangeDatePickerRef.open();
						this._datePickerRef && this._datePickerRef.open();
					});
				}
			}
		}
	}

	/**
	 * Action when input change value
	 * @param event
	 */
	private selectValueChange(event: CustomEvent<string>): void {
		const detail = this._preventEvent(event);
		this.mode = detail;
		this.modeChange.emit(detail);
		this.cleanField('from', this._inputValueFrom, true);
		this.cleanField('to', this._inputValueTo, true);
		this._updateInputFieldValue();
		if (this.mode === RangeTypes.RANGE) {
			this.$addFloatLabelClass = !isEmpty(this.$valueTo) || !isEmpty(this.$valueFrom);
		}
	}

	/**
	 *
	 * @param event
	 */
	enterSubmit(event: Event, inputField: MetaDataInput) {
		const key = get(event, 'key');
		if (key === 'Enter') {
			this.iconClickHandler(event);
			inputField.inputRef.blur();
			this._resetTextFieldLabel(inputField);
		}
	}

	/**
	 *
	 */
	private _emptyValueContent(): boolean {
		switch (this.mode) {
			case RangeTypes.TO:
				return isEmpty(this.$valueTo);
			case RangeTypes.FROM:
				return isEmpty(this.$valueFrom);
			default:
				return isEmpty(this.$valueFrom) && isEmpty(this.$valueTo);
		}
	}

	/**
	 *
	 */
	private _parseValueToDatepicker(): string {
		if (this.mode === RangeTypes.TO && !isEmpty(this.$valueTo)) return this.$valueTo;
		return isEmpty(this.$valueFrom) ? this.$valueTo : this.$valueFrom;
	}

	/**
	 *
	 * @param eventValue
	 */
	private _datepickerChange(event: any) {
		this._internalUpdate = true;
		this.value = this._preventEvent(event);
		if (this.type === InputTypes.DATE && this.mode === RangeTypes.RANGE) {
			this.$rangePickerValue = this.value;
			const [from, to] = this.$rangePickerValue;
			this.$valueFrom = from;
			this.$valueTo = to;
			this._inputValueFrom.textFieldRef.value = this._formatRangeDate(this.$valueFrom);
			this._inputValueTo.textFieldRef.value = this._formatRangeDate(this.$valueTo);
			this._rangeDatePickerRef && this._rangeDatePickerRef.close();
			this._datePickerRef && this._datePickerRef.close();
			this._focusOut(true);
		}

		if (this.type === InputTypes.DATE && (this.mode === RangeTypes.EQUALS || this.mode === RangeTypes.FROM)) {
			this.$valueFrom = this.value;
		}

		if (this.type === InputTypes.DATE && this.mode === RangeTypes.TO) {
			this.$valueTo = this.value;
		}

		this._emitChangeValueComponent();
	}

	/**
	 *
	 */
	private _manageFocus() {
		this._focusEventSubscription = this._focusEvent$.pipe(distinctUntilChanged((prev, next) => isEqual(prev, next))).subscribe((data) => {
			const rangeDatePicker = this.type === InputTypes.DATE && this.mode === RangeTypes.RANGE;
			const activateFocus = data === 'IN';
			const deactivateFocus = data === 'OUT';
			if (activateFocus) {
				this._focusIn();
				this._selectRef && this._selectRef.close();
				rangeDatePicker && this._rangeDatePickerRef && this._rangeDatePickerRef.open();
				rangeDatePicker && this._datePickerRef && this._datePickerRef.open();
			} else if (deactivateFocus) {
				this._focusOut();
				rangeDatePicker && this._rangeDatePickerRef && this._rangeDatePickerRef.close();
				rangeDatePicker && this._datePickerRef && this._datePickerRef.close();
			}
		});
	}

	/**
	 *
	 */
	private _focusIn() {
		this.activateFocus.emit();
		requestAnimationFrame(() => {
			this.$isAnyTextFieldFocus = true;
		});
	}

	/**
	 *
	 */
	private _focusOut(keepFocus?: boolean) {
		this.deactivateFocus.emit();
		requestAnimationFrame(() => {
			this.$addFloatLabelClass = false;
			if (this.mode === RangeTypes.RANGE) {
				this.$isAnyTextFieldFocus = !!keepFocus;
			} else {
				this.$isAnyTextFieldFocus = false;
			}
		});
	}

	/**
	 *
	 * @param event
	 */
	private iconClickHandler(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (!this.disabled) {
			this.iconClick.emit([this.$valueFrom, this.$valueTo]);
		}
	}

	/**
	 *
	 */
	private async closeSelect() {
		if (this.type === InputTypes.AMOUNT) {
			this._selectRef.close();
		}

		if (this.type === InputTypes.DATE) {
			this._datePickerRef.close();
		}
	}

	/**
	 * Sets the input mask for the input fields.
	 */
	private _setInputMask() {
		const maskFormat = this._getDateMask();
		VMasker(this._inputValueFrom.textFieldRef.root.querySelector('input')).maskPattern(maskFormat);
		VMasker(this._inputValueTo.textFieldRef.root.querySelector('input')).maskPattern(maskFormat);
	}

	/**
	 *	This function return a mask from a dateFormat.
	 */
	private _getDateMask(placeholder = false): string {
		const dateFormat = this.$config.locale === 'es-ES' ? 'dd/MM/yyyy' : 'MM/dd/yyyy';

		let mask = '';
		if (placeholder) {
			return dateFormat;
		}
		if (dateFormat) {
			let i = 0;
			while (dateFormat.charAt(i)) {
				mask += dateFormat.charAt(i).match(/[a-z]/i) ? '9' : dateFormat.charAt(i);
				i++;
			}
			return mask;
		}
		return '99/99/9999';
	}

	/**
	 * Handle the input event for converting the input value to a date picker selection.
	 * @param event The input event.
	 */
	private _inputToDatepicker(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		if (value.length === this._getDateMask().length) {
			if (this._rangeDatePickerRef) {
				// Convert input values to ISO date format
				let minDate = DateTime.fromFormat(
					this._inputValueFrom.inputRef.value,
					LOCALE_FORMATS[this.$config.locale] || 'dd/MM/yyyy'
				).toISODate();
				let maxDate = DateTime.fromFormat(this._inputValueTo.inputRef.value, LOCALE_FORMATS[this.$config.locale] || 'dd/MM/yyyy').toISODate();

				// Validate and set minDate and maxDate
				minDate = DateTime.fromISO(minDate).isValid ? minDate : null;
				maxDate = DateTime.fromISO(maxDate).isValid ? maxDate : null;

				// Set the value of the range date picker
				if (!isNil(minDate) && !isNil(maxDate)) {
					this._rangeDatePickerRef.value = `${minDate}|${maxDate}`;
				}
			}
		}
	}

	/**
	 * Returns the appropriate status for the helper text based on component state
	 */
	private _getHelperTextStatus(): TextStatus {
		if (this.$invalid) return 'error';
		if (this.$warning) return 'warning';
		if (this.$loading) return 'loading';
		if (this.$success) return 'success';
		return 'default';
	}

	/**
	 *
	 */
	render() {
		return (
			<Host>
				<div class="input-range">
					<div class={{ 'input-range__select': true, 'input-range__select--empty-label': isEmpty(this.label) }}>
						<scib-ui-v2-select
							ref={(element) => (this._selectRef = element)}
							variant={this.variant}
							menuOptions={this.$menuOptions}
							disabled={this.disabled || this.disabledRangeSelector}
							onlySelect={!this.disabled && !this.disabledRangeSelector}
							showCleanIcon={false}
							withoutLabel={!isEmpty(this.label)}
							invalid={this.$invalid}
							success={this.$success}
							warning={this.$warning}
							loading={this.$loading}
							value={this.mode}
							onValueChange={(event) => {
								event.stopPropagation();
								this.selectValueChange(event);
							}}
						></scib-ui-v2-select>
					</div>
					<div
						class="input-container"
						onFocusin={(event) => {
							this._preventEvent(event);
							this._focusEvent$.next('IN');
						}}
					>
						{this.type === InputTypes.DATE && this.mode !== RangeTypes.RANGE && (
							<scib-ui-v2-date-picker
								class="mdc-text-field_input datepicker_field range"
								ref={(element) => (this._datePickerRef = element)}
								name={this.name}
								variant={this.variant}
								format={get(this.$config, ['dateFormat'], '')}
								locale={get(this.$config, ['locale'], 'es-ES')}
								language={get(this.$config, ['language'], 'es')}
								config={get(this.$config, ['datePickerConfig'], {})}
								aria-labelledby={this.label}
								disableDates={get(this.$config, ['disabledDates'])}
								label={this.label}
								disabled={this.disabled || this.disabledCalendar}
								readOnly={this.readOnly}
								max={get(this.$config, ['max'], '')}
								min={get(this.$config, ['min'], '')}
								showCleanIcon={this.$showCleanIcon}
								range={false}
								firstDay={get(this.$config, ['firstDay'], undefined)}
								value={this._parseValueToDatepicker()}
								onValueChange={(event) => this._datepickerChange(event)}
								onIconClick={(event) => this.iconClickHandler(event)}
								onKeyPress={(event) => this.enterSubmit(event, this._inputValueTo)}
								inputIcon={this.inputIcon}
							></scib-ui-v2-date-picker>
						)}
						{this.type === InputTypes.DATE && this.mode == RangeTypes.RANGE && (
							<div class="date-picker__container">
								<scib-ui-v2-date-picker
									class="mdc-text-field_input datepicker_field range"
									ref={(element) => (this._rangeDatePickerRef = element)}
									name={this.name}
									variant={this.variant}
									format={get(this.$config, ['dateFormat'], '')}
									locale={get(this.$config, ['locale'], 'es-ES')}
									language={get(this.$config, ['language'], 'es')}
									config={get(this.$config, ['datePickerConfig'], {})}
									aria-labelledby={this.label}
									disableDates={get(this.$config, ['disabledDates'])}
									label={this.label}
									disabled={this.disabled}
									readOnly={this.readOnly}
									max={get(this.$config, ['max'], '')}
									min={get(this.$config, ['min'], '')}
									showCleanIcon={this.$showCleanIcon}
									range={true}
									firstDay={get(this.$config, ['firstDay'], undefined)}
									value={this.$rangePickerValue}
									onIconClick={(event) => this.iconClickHandler(event)}
									onValueChange={(event) => this._datepickerChange(event)}
									onKeyPress={(event) => this.enterSubmit(event, this._inputValueTo)}
								></scib-ui-v2-date-picker>
							</div>
						)}
						<div
							class={{
								'input-range__text-field': true,
								'input-range--hidden': this.type === InputTypes.DATE && this.mode !== RangeTypes.RANGE,
								'input-range__text-field--with-secondary-input': !SHOW_ONLY_ONE_INPUT.includes(this.mode),
								'input-range__text-field--empty-value': this._emptyValueContent()
							}}
						>
							<label
								class={{
									'mdc-text-field mdc-text-field--filled input-from': true,
									'mdc-text-field--empty-label': isEmpty(this.label),
									'mdc-text-field__invalid': this.invalid
								}}
								aria-hidden="true"
							>
								<span
									class={{
										'mdc-text-field__ripple ': true,
										'mdc-text-field__ripple--only': this.mode === RangeTypes.RANGE && !this.$isAnyTextFieldFocus,
										'mdc-floating-label--icon': !!this.$icon
									}}
								/>
								<span
									aria-hidden="true"
									class={{
										'mdc-floating-label': true,
										'label-floating': this.$addFloatLabelClass
									}}
								>
									{this.label}
								</span>
								<input
									class="mdc-text-field__input input-from"
									type="text"
									aria-labelledby={this.label}
									name={this.name}
									onKeyDown={() => {}}
									onKeyPress={(event) =>
										this.enterSubmit(event, this.mode === RangeTypes.TO ? this._inputValueTo : this._inputValueFrom)
									}
									onInput={(event) => this._inputToDatepicker(event)}
									autocomplete="off"
									readonly={this.readOnly}
								/>
								<span class="mdc-line-ripple" />
								{!this._emptyValueContent() && !this.disabled && this.$showCleanIcon && (
									<span class="icon-container clean-icon">
										<i
											class="icon mdc-text-field__icon mdc-text-field__icon--hover"
											onClick={() =>
												this.cleanField(
													this.mode === RangeTypes.TO ? 'to' : 'from',
													this.mode === RangeTypes.TO ? this._inputValueTo : this._inputValueFrom
												)
											}
										/>
									</span>
								)}
								{this.mode !== 'range' && this.$icon && (
									<span
										class="icon-container icon-container--handler"
										style={{ '--icon-content': `var(--theme-scib-icon-${this.$icon})` }}
										onClick={(event) => this.iconClickHandler(event)}
									>
										<i class="icon mdc-text-field__icon mdc-text-field__icon--fixed" />
									</span>
								)}
							</label>
							<div
								class={{
									'input-range__second-text-field': true,
									'input-range__second-text-field--hidden': SHOW_ONLY_ONE_INPUT.includes(this.mode) || this._emptyValueContent()
								}}
							>
								<label
									class={{
										'mdc-text-field mdc-text-field--filled input-to': true,
										'mdc-text-field--empty-label': isEmpty(this.label),
										'mdc-text-field__invalid': this.invalid
									}}
									aria-hidden="true"
								>
									<span class="mdc-text-field__ripple mdc-text-field__ripple--right" />
									<span aria-hidden="true" class={'mdc-floating-label'}></span>
									<span class="mdc-text-field__affix--prefix">{this.$config?.prefix || ''}</span>
									<input
										class="mdc-text-field__input input-to input-to-right-align"
										type="text"
										aria-hidden="true"
										aria-labelledby={this.label}
										name={this.name}
										onKeyDown={() => {}}
										onInput={(event) => this._inputToDatepicker(event)}
										onKeyPress={(event) => this.enterSubmit(event, this._inputValueTo)}
										autocomplete="off"
										readonly={this.readOnly}
									/>
									<span class="mdc-line-ripple" />
									{(this.$valueTo || '').length > 0 && !this.disabled && this.$showCleanIcon && (
										<span class="icon-container clean-icon">
											<i
												class="icon mdc-text-field__icon mdc-text-field__icon--hover"
												onClick={() => this.cleanField('to', this._inputValueTo)}
											/>
										</span>
									)}
									{this.mode === RangeTypes.RANGE && this.$icon && (
										<span
											class="icon-container icon-container--handler"
											style={{ '--icon-content': `var(--theme-scib-icon-${this.$icon})` }}
											onClick={(event) => this.iconClickHandler(event)}
											tabIndex={0}
										>
											<i class="icon mdc-text-field__icon mdc-text-field__icon--fixed" />
										</span>
									)}
								</label>
							</div>
						</div>
					</div>
				</div>
				{this.$helperText && (
					<scib-atoms-helper-text
						text={this.$helperText}
						status={this._getHelperTextStatus()}
						enableTooltip={this.$enableTooltip}
						tooltipConfig={this.$tooltipConfig}
						enableAutoTooltip={this.$enableAutoTooltip}
					></scib-atoms-helper-text>
				)}
			</Host>
		);
	}
}
