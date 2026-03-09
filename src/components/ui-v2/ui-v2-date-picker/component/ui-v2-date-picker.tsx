import { MDCTextField } from '@material/textfield';
import { Component, Element, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import AirDatepicker, { AirDatepickerOptions } from 'air-datepicker';
import { capitalize, compact, first, get, includes, isEmpty, isEqual, isNull, merge, size, toNumber } from 'lodash';
import { DateTime } from 'luxon';
import { BehaviorSubject } from 'rxjs';
import { registerClickOutside, removeClickOutside } from 'stencil-click-outside';
import VMasker from 'vanilla-masker';
import { VariantTypes } from '../../../../shared/models';
import { parseProp as _parseProp, parseProp } from '../../../../utils/helpers/common';
import { AtomsTooltipInfo } from '../../../atoms/tooltip-info/component/tooltip-info';
import {
	CustomDatePickerConfig,
	DatePickerCell,
	DatePickerLanguages,
	Days,
	defaultConfig,
	DisabledDatesConfig,
	InputRangeValue,
	languages,
	LOCALE_FORMATS,
	RangeDatePickerValue,
	TypeDate
} from '../models/ui-v2-date-picker.model';
import { TextStatus } from '../../../atoms/helper-text/models/helper-text.model';

@Component({
	tag: 'scib-ui-v2-date-picker',
	styleUrl: 'ui-v2-date-picker.scss',
	shadow: true
})
export class UI_V2DatePicker {
	private _calendarContainer: HTMLElement;
	private _datePickerRef: AirDatepicker;
	private _textFieldRef: MDCTextField;
	private _InputMaskRef: any;
	private _maskFormat: string;
	private _focusEvent$: BehaviorSubject<string> = new BehaviorSubject<string>('OUT');

	@Element() _hostRef: HTMLElement;

	/**
	 *	Different variations of the visual components.
	 */
	@Prop({ reflect: true }) variant: VariantTypes = 'white';

	/**
	 *	Input name.
	 */
	@Prop({ mutable: true, reflect: true }) name: string;

	/**
	 *	Enable range dates.
	 */
	@Prop() range: boolean;
	@State() $range: boolean;
	@Watch('range') _rangeHandler(newValue: boolean | undefined) {
		this.$range = !!newValue;
		!this.$range && (this.$firstRangeValueSelected = null);
		this._datePickerRef?.update({ range: this.$range });
	}

	/**
	 *	The index of the day from which the week begins.
	 */
	@Prop({ mutable: true }) firstDay: number;
	@Watch('firstDay') _firstDayHandler(newValue: number) {
		if (this._datePickerRef) {
			this._datePickerRef.update({ firstDay: newValue });
		}
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
	 *	The format that you want recive by valueChangeEvent.
	 * 	By default the datepicker use the default format by language.
	 * 	You can see more in the api document.
	 */
	@Prop() format: string = '';

	/**
	 *	The placeholder text.
	 */
	@Prop() label: string = '';
	@State() $label: string;
	@Watch('label') _labelHandler(newValue: string) {
		this.$label = newValue;
	}
	@Event() calendarOpened: EventEmitter<boolean>;
	/**
	 *	The value that datepicker emit.
	 * 	This param only accept the ISO format like 2014-08-06T13:07:04.054.
	 * 	You can see more in the api document.
	 */
	@Prop({ mutable: true, reflect: true }) value: string;
	@State() $value: string | RangeDatePickerValue;
	@Watch('value') _valueHandler(newValue: string) {
		if (this.range) {
			const _newValue = Array.isArray(newValue) ? newValue : (newValue || '').split('|');
			if (!isEqual(_newValue, this.$rangeValue)) {
				this.$rangeValue = _newValue;
				this._updateRangePicker(this.$rangeValue);
				if ((this._textFieldRef || this.onlyButton) && !isEmpty(this.$rangeValue)) {
					this._emitValue(newValue);
				}
			}
		} else {
			this.$value = newValue || '';
			if (typeof this.$value === 'string') {
				this._updateDatePicker(this.$value);
				if ((this._textFieldRef || this.onlyButton) && !isEmpty(this.$value)) {
					this._emitValue(this.$value);
				}
			}
		}
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
	 *	Mark as loading input.
	 */
	@Prop({ reflect: true, mutable: true }) loading: boolean;
	@State() $loading: boolean;
	@Watch('loading') _loadingHandler(newValue: boolean | undefined) {
		this.$loading = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as disabled input.
	 */
	@Prop({ mutable: true, reflect: true }) disabled: boolean;
	@State() $disabled: boolean;
	@Watch('disabled') _disabledHandler(newValue: boolean | undefined) {
		this.$disabled = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *	Mark as readOnly input.
	 */
	@Prop({ mutable: true, reflect: true }) readOnly: boolean = false;
	@Watch('readOnly') _readOnlyHandler() {
		this._updateTextFieldStatus();
	}

	/**
	 *	Choose the language that this component will render the dates.
	 */
	@Prop({ mutable: true }) language: DatePickerLanguages = 'en';
	@Watch('language') _languageHandler(newValue: string) {
		if (this._datePickerRef) {
			this._datePickerRef.update({ locale: languages[newValue || 'en'] || languages['en'] });
		}
	}

	/**
	 *	Choose the date format
	 */
	@Prop() locale: string;
	@Watch('locale') _localeHandler(newValue: string) {
		if (this._datePickerRef && this.locale) {
			this._datePickerRef.update({
				dateFormat: (date) => {
					return date.toLocaleString(newValue || this.language, {
						year: 'numeric',
						day: '2-digit',
						month: '2-digit'
					});
				}
			});
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
	 *	Mark as required input.
	 */
	@Prop({ mutable: true, reflect: true }) required: boolean;
	@Watch('required') _requiredHandler() {
		this._updateTextFieldStatus();
	}

	/**
	 * Set minimum date. Format valid to Date object.
	 */
	@Prop({ reflect: true }) min: string;
	@State() $min: Date | null;
	@Watch('min') _setMin(newVal: string) {
		this.$min = this._getDate(newVal);
	}

	/**
	 * Set maximum date. Format valid to Date object.
	 */
	@Prop({ reflect: true }) max: string;
	@State() $max: Date | null;
	@Watch('max') _setMax(newVal: string) {
		this.$max = this._getDate(newVal);
	}

	/**
	 *
	 */
	@Prop() config: (Partial<AirDatepickerOptions> & CustomDatePickerConfig) | string;
	@State() $config: Partial<AirDatepickerOptions> & CustomDatePickerConfig;
	@Watch('config') _setConfig(newVal: string | Partial<AirDatepickerOptions>) {
		this.$config = merge({}, defaultConfig, _parseProp<Partial<AirDatepickerOptions>>(newVal, {}));
	}

	/**
	 *
	 */
	@Prop() disableDates: Partial<DisabledDatesConfig> | string;
	@State() $disableDates: Partial<DisabledDatesConfig>;
	@Watch('disableDates') _disableDatesHandler(newValue: Partial<DisabledDatesConfig> | string) {
		this.$disableDates = _parseProp(newValue, {});
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
	 *	This text appear when input is invalid.
	 */
	@Prop() helperText: string;
	@State() $helperText: string;
	@Watch('helperText') _helperTextHandler(newValue: string | undefined) {
		this.$helperText = newValue;
		this._updateTextFieldStatus();
	}

	/**
	 *
	 */
	@Prop() onlyButton: boolean;

	/**
	 *
	 */
	@Prop() inputIcon: boolean;

	/**
	 * this prop allows to set a class, that it will not be afected by registerClickOutside method
	 */
	@Prop() excludeClickOutside: string;

	/**
	 *
	 */
	@State() isCalendarOpened: boolean = false;

	/**
	 *
	 */
	@State() $rangeHasValues: boolean = false;

	/**
	 *
	 */
	@State() $rangeValue: string[];

	/**
	 * This state store the first value selected when is range
	 */
	@State() $firstRangeValueSelected: Date;

	/**
	 * Open calendar
	 */
	@Method() async open() {
		if (this._datePickerRef) {
			this._datePickerRef.show();
		}
	}

	/**
	 * Close calendar
	 */
	@Method() async close() {
		if (this._datePickerRef) {
			this?._datePickerRef?.hide();
		}
	}

	/**
	 *	This event emit the current value in ISO format.
	 */
	@Event() valueChange: EventEmitter<InputRangeValue>;

	/**
	 *	This event emit the current value in ISO format.
	 */
	@Event() datePickerValueChange: EventEmitter<InputRangeValue>;

	/**
	 *
	 */
	@Event() iconClick: EventEmitter<any>;

	/**
	 * Mark as success input.
	 */
	@Prop({ reflect: true, mutable: true }) success: boolean;
	@State() $success: boolean;
	@Watch('success') _successHandler(newValue: boolean | undefined) {
		this.$success = !!newValue;
		this._updateTextFieldStatus();
	}

	/**
	 * Ciclo de vida ejecutado antes del primer render
	 */
	componentWillLoad() {
		this._labelHandler(this.label);
		this._helperTextHandler(this.helperText);
		this._valueHandler(this.value);
		this._rangeHandler(this.range);
		this._languageHandler(this.language);
		this._localeHandler(this.locale);
		this._showCleanIconHandler(this.showCleanIcon);
		this._disabledHandler(this.disabled);
		this._loadingHandler(this.loading);
		this._warningHandler(this.warning);
		this._setConfig(this.config);
		this._setMax(this.max);
		this._setMin(this.min);
		this._requiredHandler();
		this._invalidHandler(this.invalid);
		this._disableDatesHandler(this.disableDates);
		this._enableAutoTooltipHandler(this.enableAutoTooltip);
		this._enableTooltipHandler(this.enableTooltip);
		this._tooltipConfigHandler(this.tooltipConfig);
	}

	/**
	 *
	 */
	componentWillUpdate() {
		if (this._datePickerRef) {
			this._datePickerRef.update({
				maxDate: this.$max || '',
				minDate: this.$min || ''
			});
		}
	}

	/**
	 * Ciclo de vida ejecutado tras el primer Render después de la carga
	 */
	componentDidLoad() {
		this._destroy();
		if (!this.onlyButton) {
			this._textFieldRef = MDCTextField.attachTo(this._hostRef.shadowRoot.querySelector('.mdc-text-field'));
		} else {
			registerClickOutside(
				this,
				this._hostRef,
				() => {
					if (this._datePickerRef.visible) {
						this._datePickerRef && this._datePickerRef.hide();
						this.calendarOpened.emit(false);
					}
					this._focusEvent$.next('OUT');
				},
				{ exclude: this.excludeClickOutside }
			);
		}
		this._createCalendar();
		!this.range ? this._updateDatePicker(this.value) : this._updateRangePicker(this.$rangeValue);
		this._updateTextFieldStatus();
	}

	/**
	 *
	 */
	private _createCalendar() {
		this._calendarContainer = this._hostRef.shadowRoot.querySelector('.date-picker__container');
		const input: HTMLInputElement = this._hostRef.shadowRoot.querySelector('.mdc-text-field__input');
		const isTimepicker = get(this.$config, 'timepicker', false) && !this.$range;
		const { dateFormat, multipleDatesSeparator = '-' } = this.$config;
		this._datePickerRef = new AirDatepicker(input, {
			...this.$config,
			...(this.$min ? { minDate: this.$min } : {}),
			...(this.$max ? { maxDate: this.$max } : {}),
			timepicker: isTimepicker,
			locale: languages[this.language],
			classes: !this.onlyButton && 'air-datepicker--input',
			container: this._calendarContainer,
			range: this.$range && !isTimepicker,
			...(this.firstDay !== undefined && { firstDay: this.firstDay }),
			multipleDatesSeparator,
			...(!this.$range && {
				dateFormat: (date) => {
					return isTimepicker
						? date.toLocaleString(this.locale || this.language, {
								...(!get(this.$config, 'onlyTimepicker') && {
									year: 'numeric',
									day: '2-digit',
									month: '2-digit'
								}),
								hour: '2-digit',
								minute: '2-digit',
								hour12: false
						  })
						: date.toLocaleString(this.locale || this.language, {
								year: 'numeric',
								day: '2-digit',
								month: '2-digit'
						  });
				}
			}),
			...(this.$range && { dateFormat: LOCALE_FORMATS[this.locale] || 'dd/MM/yyyy' }),
			...(dateFormat ? { dateFormat } : {}),
			timeFormat: 'HH:mm',
			onSelect: (data) => {
				const { date, datepicker } = data;
				const timePickerSelected = get(datepicker, ['timepicker', 'displayHours']) || get(datepicker, ['timepicker', 'minutes']);

				if (date || timePickerSelected) {
					if (Array.isArray(date)) {
						if (size(date) == 2) {
							this.value = this._getIsoFromDate(date);
						} else {
							this.$firstRangeValueSelected = first(date);
						}
					} else if (timePickerSelected) {
						let selectedDate;
						if (date && !isNull(date.getTime())) {
							selectedDate = date;
						} else if (this.value) {
							selectedDate = this._getJsDate(this.value);
						} else {
							selectedDate = new Date();
						}

						const updatedDate = DateTime.fromJSDate(selectedDate)
							.set({
								hour: toNumber(get(datepicker, ['timepicker', 'displayHours'])),
								minute: toNumber(get(datepicker, ['timepicker', 'minutes']))
							})
							.toJSDate();

						this.value = this._getIsoFromDate(updatedDate);
					} else if (!isNull(date.getTime()) && this.value !== this._getIsoFromDate(date)) {
						this.value = this._getIsoFromDate(date);
					}
				} else {
					this.value = '';
				}
			},
			onHide: () => {
				this.isCalendarOpened = false;
				if (!this.value) {
					this._resetTextFieldLabel();
				}
			},
			onShow: () => (this.isCalendarOpened = true),
			onRenderCell: (data) => {
				return this._configRenderCell(data);
			}
		});
	}

	private _destroy() {
		if (!isEmpty(this._datePickerRef) && this._datePickerRef.destroy) {
			try {
				this._datePickerRef.destroy();
			} catch (error) {}
		}
		removeClickOutside(this, this._hostRef, () => {});
	}

	/**
	 * Method to build a config cell object to disable dates or including html styles to cells
	 */
	private _configRenderCell(data: DatePickerCell) {
		const { date, datepicker, cellType } = data;
		const formatToCheck = cellType === 'day' ? 'dd/MM' : cellType === 'month' ? 'MM' : 'yyyy';
		const selectedDates = datepicker.selectedDates.map((day) => DateTime.fromJSDate(day).toFormat(formatToCheck));
		const datePickerDateFormatted = DateTime.fromJSDate(date);
		const htmlSpanClass =
			includes(selectedDates, datePickerDateFormatted.toFormat(formatToCheck)) ||
			DateTime.fromJSDate(this.$firstRangeValueSelected).toFormat(formatToCheck) === datePickerDateFormatted.toFormat(formatToCheck)
				? `cell-${cellType}--selected`
				: `cell-${cellType}`;

		if (cellType === 'day') {
			const weekday = datePickerDateFormatted.weekday;
			const isWeekendsDisabled = get(this.$disableDates, ['weekends'], false);
			const disabledDates = get(this.$disableDates, ['dates'], []);
			const isDateDisabled = disabledDates.some((dayDate) => {
				const _date = DateTime.fromISO(dayDate, { zone: 'local' });
				return _date.toISO({ includeOffset: false }) === datePickerDateFormatted.toISO({ includeOffset: false });
			});

			return {
				disabled: isDateDisabled || (isWeekendsDisabled && (weekday === Days.SATURDAY || weekday === Days.SUNDAY)),
				html: `<span class="${htmlSpanClass}">${datePickerDateFormatted.day}</span>`
			};
		}

		if (cellType === 'month') {
			return {
				html: `<span class="${htmlSpanClass}">${capitalize(
					datePickerDateFormatted.setLocale(this.language || this.locale).monthShort
				)}</span>`
			};
		}

		if (cellType === 'year') {
			return {
				html: `<span class="${htmlSpanClass}">${datePickerDateFormatted.year}</span>`
			};
		}
	}

	/**
	 *
	 * @param event
	 */
	toggleCalendar(event: Event) {
		event?.preventDefault();
		event?.stopPropagation();
		if (this._datePickerRef) {
			if (!this.isCalendarOpened) {
				this._datePickerRef.show();
				this.calendarOpened.emit(true);
			} else {
				this._datePickerRef.hide();
				this.calendarOpened.emit(false);
			}
		}
	}

	/**
	 *
	 * @param value
	 */
	private _emitValue(value: string | string[]) {
		const _values = compact(Array.isArray(value) ? value : value.split('|'));
		this.valueChange.emit(_values.length < 2 ? get(_values, [0], '') : _values);
	}

	/**
	 *
	 * @param value
	 */
	private _emitDatePickerValue(value: string | string[]) {
		const _values = compact(Array.isArray(value) ? value : value.split('|'));
		this.datePickerValueChange.emit(_values.length < 2 ? get(_values, [0], '') : _values);
	}

	/**
	 *	This function update the textField status.
	 */
	private _updateTextFieldStatus() {
		setTimeout(() => {
			if (this._textFieldRef) {
				this._textFieldRef.helperTextContent = !isEmpty(this.$helperText) ? this.$helperText : undefined;
				this._textFieldRef.disabled = this.disabled;
				this._textFieldRef.required = this.required;
				this._textFieldRef.valid = !this.invalid;
				this._setInputMask();
			}
		});
	}

	private _setInputMask() {
		//TODO: ENABLE MASK FOR RANGES AND TIMEPICKER
		if (!this.readOnly && (!this.$range || !!get(this.$config, ['timepicker']))) {
			const inputElement = this._textFieldRef.root.querySelector('input');
			this._maskFormat = this._getDateMask();
			this._InputMaskRef = VMasker(inputElement).maskPattern(
				!this.range ? this._maskFormat : this._maskFormat + get(this.$config, 'multipleDatesSeparator', ' - ') + this._maskFormat
			);
		} else {
			try {
				VMasker(this._InputMaskRef).unMask();
			} catch (e) {}
		}
	}

	/**
	 *	This function return a mask from a dateFormat.
	 */
	private _getDateMask(placeholder = false): string {
		const localeDate = ((this._datePickerRef as any)?.opts as AirDatepickerOptions).locale.dateFormat;
		const localeTime = ((this._datePickerRef as any)?.opts as AirDatepickerOptions).timeFormat;
		const dateFormat = this.$config.timepicker ? `${localeDate}, ${localeTime}` : localeDate;
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
	 *	This function upda the newest values.
	 * @param date
	 */
	private _updateDatePicker(date: string): void {
		if (this._datePickerRef) {
			if (isEmpty(date)) {
				this._datePickerRef.clear();
			} else {
				const isTimepicker = get(this.$config, 'timepicker', false);
				const _date = this.format ? DateTime.fromFormat(date, this.format).toJSDate() : date;
				this._datePickerRef.selectDate(this._getJsDate(_date), { updateTime: isTimepicker, silent: true });
			}
		}
		this._resetTextFieldLabel();
	}

	/**
	 *	This function update the datepicker instance with the range values.
	 * @param date
	 */
	private _updateRangePicker(date: string[]): void {
		const [dateFrom, dateTo] = date || [];
		if (this._datePickerRef) {
			this.$rangeHasValues = !isEmpty(dateFrom) || !isEmpty(dateTo);
			if (isEmpty(dateFrom) && isEmpty(dateTo)) {
				this._datePickerRef.clear();
			} else {
				const isTimepicker = get(this.$config, 'timepicker', false);
				const dates = this.format
					? [DateTime.fromFormat(dateFrom, this.format).toJSDate(), DateTime.fromFormat(dateTo, this.format).toJSDate()]
					: [new Date(dateFrom), new Date(dateTo)];
				this._datePickerRef.selectDate(this._getJsDate(dates), { updateTime: isTimepicker, silent: true });
			}
		}
		this._resetTextFieldLabel();
	}

	/**
	 *	This function convert the datepicker date object into ISO format date string.
	 * @param date
	 */
	private _getIsoFromDate(date: Date | Date[]): string {
		const options = { zone: 'local' };
		if (Array.isArray(date)) {
			const range = date.map((d) => {
				const rangeDay = DateTime.fromJSDate(d, options);
				return isEmpty(this.format) ? rangeDay.toISO() : rangeDay.toFormat(this.format);
			});
			return range.join('|');
		}
		const _date = DateTime.fromJSDate(date, options);
		return isEmpty(this.format) ? _date.toISO() : _date.toFormat(this.format);
	}

	/**
	 *
	 * @param value
	 */
	private _getDate(value: TypeDate | null | string) {
		if (value instanceof Date) {
			return value;
		} else if (!isEmpty(value)) {
			const newDate = new Date(value);
			if (!isNaN(newDate.getTime())) {
				return newDate;
			}
		}
		return null;
	}

	/**
	 *
	 * @param event
	 */
	private _inputToDatepicker(event: Event): void {
		const value = (event.target as HTMLInputElement).value;
		if (this.readOnly) {
			return;
		}

		if (value.length === this._getDateMask().length) {
			try {
				const dateTime = DateTime.fromFormat(value, LOCALE_FORMATS[this.locale] || 'dd/MM/yyyy');

				// Comprobar si la fecha es inválida
				if (!dateTime.isValid) {
					throw new Error(`Fecha inválida: ${dateTime.invalidReason} - ${dateTime.invalidExplanation}`);
				}

				const jsDate = dateTime.toJSDate();

				// Validar contra min y max en una sola condición
				if ((this.$min && jsDate < this.$min) || (this.$max && jsDate > this.$max)) {
					throw new Error('Fecha fuera del rango permitido');
				}

				// Si la fecha está dentro del rango permitido (o no hay restricciones), actualizar el valor
				const _value = this._getIsoFromDate(jsDate);
				if (this._datePickerRef) {
					this._datePickerRef.selectDate(this._getJsDate(_value), { updateTime: true, silent: false });
				}
			} catch (error) {
				// Centralizar todo el manejo de errores aquí
				console.error('Error en datepicker:', error);
				this._updateDatePicker(this.value);
			}
		}
	}

	/**
	 * Verifica si una fecha está dentro del rango permitido por min y max
	 * @param date Fecha a validar
	 * @returns true si la fecha está dentro del rango o no hay restricciones
	 */
	private _isDateWithinAllowedRange(date: Date): boolean {
		if (this.$min && date < this.$min) {
			return false;
		}

		if (this.$max && date > this.$max) {
			return false;
		}

		return true;
	}

	/**
	 *
	 * @param date
	 * @returns
	 */
	private _getJsDate(date: any | any[]) {
		if (Array.isArray(date)) {
			return (date || []).map((_date: any) => {
				try {
					if (_date instanceof Date) {
						return _date;
					}
					return new Date(_date);
				} catch (error) {
					return _date;
				}
			});
		} else {
			try {
				if (date instanceof Date) {
					return date;
				}
				return new Date(date);
			} catch (error) {
				return date;
			}
		}
	}

	/**
	 *	This function reset the values of the component.
	 * @param event
	 */
	private _cleanField(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (this._datePickerRef) {
			this._datePickerRef.clear();
			this.value = '';
			this._emitValue(this.value);
			this._resetTextFieldLabel();
		}
	}

	/**
	 *
	 */
	private _resetTextFieldLabel() {
		setTimeout(() => {
			if (this._textFieldRef) {
				this._textFieldRef.getDefaultFoundation().deactivateFocus();
				this._textFieldRef.getDefaultFoundation().notchOutline(true);
			}
		});
	}

	/**
	 *
	 * @param event
	 */
	private _preventIconClick(event: Event) {
		if (this._calendarContainer.hasChildNodes()) {
			event.preventDefault();
			event.stopPropagation();
		}
	}

	/**
	 *
	 * @param event
	 */
	private _emitDataFromDatePicker(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (!this.disabled) {
			this._emitDatePickerValue(this.value);
			this.iconClick.emit(this.value);
		}
	}

	/**
	 *
	 * @param event
	 */
	manageFocus(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (!this.value && this._textFieldRef) {
			this._textFieldRef.getDefaultFoundation().activateFocus();
			this._textFieldRef.getDefaultFoundation().notchOutline(false);
		}
	}

	/**
	 * Returns the appropriate status icon URL based on component state
	 */
	private _getStatusHelperText(): TextStatus {
		const STATUS_HELPERTEXT: { [key: string]: TextStatus } = {
			LOADING: 'loading',
			SUCCESS: 'success',
			ERROR: 'error',
			WARNING: 'warning',
			INFO: 'info'
		};

		// Usar early returns en orden de prioridad
		if (this.$loading) return STATUS_HELPERTEXT.LOADING;
		if (this.$success) return STATUS_HELPERTEXT.SUCCESS;
		if (this.$invalid) return STATUS_HELPERTEXT.ERROR;
		if (this.$warning) return STATUS_HELPERTEXT.WARNING;

		return 'default';
	}

	render() {
		return (
			<Host>
				<div class="date-picker">
					{this.onlyButton ? (
						<div onFocusout={(event) => this.manageFocus(event)}>
							<input
								style={{ display: 'none' }}
								class="mdc-text-field__input"
								type="text"
								name={this.name}
								aria-hidden="true"
								readonly
							/>
							<button class="date-picker__btn" type="button" tabindex="0" onClick={(event) => this.toggleCalendar(event)}>
								<i class="icon u-icon" />
							</button>
						</div>
					) : (
						<label
							part="input"
							class={{
								'mdc-text-field': true,
								'mdc-text-field--filled': true,
								'mdc-text-field--empty-label': isEmpty(this.$label),
								borderless: this.$config.borderless
							}}
							aria-hidden="true"
							onFocusout={(event) => this.manageFocus(event)}
						>
							<span class="mdc-text-field__ripple" />
							<span class="mdc-floating-label" aria-hidden="true">
								{this.$label}
							</span>
							<input
								class="mdc-text-field__input"
								type="text"
								readOnly={this.readOnly}
								aria-hidden="true"
								name={this.name}
								onFocus={() => this.calendarOpened.emit(true)}
								onFocusout={() => this.calendarOpened.emit(false)}
								readonly={this.readOnly || this.range || get(this.config, ['timepicker'])}
								onInput={(event) => this._inputToDatepicker(event)}
							/>
							{(!isEmpty(this.$value) || this.$rangeHasValues) && !this.$disabled && this.$showCleanIcon && (
								<span class="icon-container clean-icon">
									<i class="icon mdc-text-field__icon mdc-text-field__icon--hover" onClick={(event) => this._cleanField(event)} />
								</span>
							)}
							<span class="icon-container calendar-icon" onClick={(event) => this._preventIconClick(event)}>
								<i class="icon mdc-text-field__icon mdc-text-field__icon--fixed" />
							</span>
							{this.inputIcon && !this.disabled && (
								<span class="icon-container arrow-right-icon" onClick={(event) => this._emitDataFromDatePicker(event)}>
									<i class="icon mdc-text-field__icon mdc-text-field__icon--fixed" />
								</span>
							)}
							<span class="mdc-line-ripple" />
						</label>
					)}
					<div
						class={{
							'mdc-text-field-helper-line': true,
							'mdc-text-field-helper-line--invalid': this.$invalid,
							'mdc-text-field-helper-line--success': this.$success
						}}
					>
						{this.$helperText && (
							<scib-atoms-helper-text
								text={this.$helperText}
								status={this._getStatusHelperText()}
								enableTooltip={this.$enableTooltip}
								enableAutoTooltip={this.$enableAutoTooltip}
								tooltipConfig={this.$tooltipConfig}
							></scib-atoms-helper-text>
						)}
					</div>
					<div
						part="container"
						class={{
							'date-picker__container': true,
							'date-picker__container--only-button': this.onlyButton
						}}
					></div>
				</div>
			</Host>
		);
	}
}
