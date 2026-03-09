import { Component, h, Prop, EventEmitter, Event, Watch, State } from '@stencil/core';

/**
 * Component description
 */
@Component({
	tag: 'scib-ui-date-picker',
	styleUrl: 'ui-date-picker.scss',
	shadow: false,
	scoped: false,
})
export class UIDatePicker {
	#regexFormat = /^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/;
	#timeoutID: ReturnType<typeof setTimeout> = null;
	@Prop({ reflect: true }) label: string;
	@Prop({ reflect: true }) header: string;
	@Prop({ reflect: true }) disabledselector: boolean;
	@Prop({ reflect: true, mutable: true }) value: string;
	@Watch('value') valueChange(newVal: string) {
		this._value = newVal;
	}
	@State() _value: string;
	@Prop({ reflect: true }) small: boolean;
	@Prop({ reflect: true }) medium: boolean;
	/** Activate date_time selection mode */
	@Prop({ reflect: true }) datetime: boolean = false;
	@Prop() name?: string;
	/** Step Position for wizard modal form when required */
	@Prop({ reflect: true }) stepPosition?: number;
	@Prop() required?: boolean;
	/*Booleano para activar el input al 100%*/
	@Prop({ reflect: true }) full: boolean;
	@Event() selectValue: EventEmitter<any>;

	/** Evento emitido al cambiar el valor para formulario*/
	@Event() eventFormChange: EventEmitter;

	/** Añadir tooltip para el label */
	@Prop({ reflect: true }) labelInfo: string;

	/** Tooltip button */
	@Prop({ reflect: true }) tooltipTitle: string;

	/** Eliminar el min-height del input */
	@Prop({ reflect: true }) noMinHeight: boolean;

	/** Add more space to label when is too large */
	@Prop() spacelabel: boolean = false;

	@Prop() showError: boolean = false;
	@Watch('showError') showErrorChange(newVal: boolean) {
		this._showError = newVal;
	}
	@State() _showError: boolean = false;

	@Prop() errormessage?: string;
	@Watch('errormessage') errormessageChange(newVal: string) {
		this._errormessage = newVal;
	}
	@State() _errormessage: string;

	@Prop() expectedYear: string;
	@Watch('expectedYear') expectedYearChange(newVal: string) {
		this._expectedYear = newVal;
	}
	@State() _expectedYear: string;

	// Valid format: yyyy-MM-dd. Only by dates
	@Prop() minDate: string;
	@Watch('minDate') setMinDate(newVal: string) {
		if (newVal && newVal.match(this.#regexFormat)) {
			this._minDate = newVal;
		} else {
			this._minDate = this.datetime ? '00:00' : `${new Date().getFullYear() - 100}-01-01`;
		}
	}
	@State() _minDate: string;

	// Valid format: yyyy-MM-dd. Only by dates
	@Prop() maxDate: string;
	@Watch('maxDate') setMaxDateProp(newVal: string) {
		if (newVal && newVal.match(this.#regexFormat)) {
			this._maxDate = newVal;
		} else {
			/** Setea en el atributo max la fecha máxima para que el año se corte en 4 cifras */
			this._maxDate = this.datetime ? '23:59' : `${new Date().getFullYear() + 100}-12-31`;
		}
	}
	@State() _maxDate: string;

	@Prop() limitDate?: boolean;

	@Event() eventErrorChange: EventEmitter<any>;

	handleSelect(e) {
		if (this.#timeoutID !== null) {
			clearTimeout(this.#timeoutID);
			this.#timeoutID = null;
		}
		this._value = e.target.value;
		this.selectValue.emit(e.target.value);
		this.eventFormChange.emit({
			name: this.name,
			value: e.target.value,
			required: this.required,
			stepPosition: this.stepPosition,
		});
		if (this.limitDate && this.expectedYear) {
			if (e.target.value?.split('-')[0].toString() !== this.expectedYear) {
				this._showError = true;
				this.eventErrorChange.emit({
					error: true,
					idDatepicker: e.target.offsetParent.parentElement.id,
					labelDatepicker: e.target.offsetParent.parentElement.label,
				});
			} else {
				this._showError = false;
				this.eventErrorChange.emit({
					error: false,
					idDatepicker: e.target.offsetParent.parentElement.id,
					labelDatepicker: e.target.offsetParent.parentElement.label,
				});
			}
		}
		this.#timeoutID = setTimeout(() => {
			this.checkDate();
		}, 600);
	}

	checkDate() {
		if (!this.datetime) {
			const selectedDate = new Date(this._value).getTime();
			const initDate = new Date(this._minDate).getTime();
			const endDate = new Date(this._maxDate).getTime();
			if (selectedDate < initDate) {
				if (this._minDate === `${new Date().getFullYear() - 100}-01-01`) {
					// For better usability only changes the year
					const min = `${new Date().getFullYear() - 100}${this._value.substring(this._value.indexOf('-'))}`;
					this._value = min;
					this.selectValue.emit(min);
				} else {
					this._value = this._minDate;
					this.selectValue.emit(this._minDate);
				}
			} else if (endDate < selectedDate) {
				if (this._maxDate === `${new Date().getFullYear() + 100}-12-31`) {
					// For better usability only changes the year
					const max = `${new Date().getFullYear() + 100}${this._value.substring(this._value.indexOf('-'))}`;
					this._value = max;
					this.selectValue.emit(max);
				} else {
					this._value = this._maxDate;
					this.selectValue.emit(this._maxDate);
				}
			}
		}
	}

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.valueChange(this.value);
		this.expectedYearChange(this.expectedYear);
		this.errormessageChange(this.errormessage);
		this.setMinDate(this.minDate);
		this.setMaxDateProp(this.maxDate);
	}

	componentDidLoad() {
		this.eventFormChange.emit({
			name: this.name,
			value: this._value,
			required: this.required,
			stepPosition: this.stepPosition,
		});
	}

	render() {
		return (
			<div
				class={{
					'ui-datepicker': true,
					'ui-datepicker--small': this.small,
					'ui-datepicker--medium': this.medium,
					'ui-datepicker--full': this.full,
					'ui-datepicker--noMinHeight': this.noMinHeight,
				}}
			>
				{this.label !== undefined && this.label != '' ? (
					<div class={{ 'c-label': true, 'c-label__large': this.spacelabel }}>
						<span>{this.label}</span>
						{this.label !== undefined && this.label != '' && this.labelInfo !== undefined && this.labelInfo != '' ? (
							<scib-ui-info-tooltip text={this.labelInfo} title={this.tooltipTitle}></scib-ui-info-tooltip>
						) : null}
					</div>
				) : null}

				{this.disabledselector ? (
					<input
						onChange={$event => this.handleSelect($event)}
						type={this.datetime ? 'time' : 'date'}
						class={{ 'custom-picker': true, 'disabled-picker': this.disabledselector }}
						value={this._value}
						disabled
						data-type="filter"
						id="cstartdate"
						name="startDate"
						placeholder={this.header}
						onKeyPress={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								e.stopImmediatePropagation();
								e.stopPropagation();
							}
						}}
					/>
				) : (
					<input
						onChange={$event => this.handleSelect($event)}
						type={this.datetime ? 'time' : 'date'}
						class={{ 'custom-picker': true }}
						data-type="filter"
						id="cstartdate"
						name="startDate"
						placeholder={this.header}
						max={this._maxDate}
						min={this._minDate}
						value={this._value}
						onKeyPress={e => {
							if (e.key === 'Enter') {
								e.preventDefault();
								e.stopImmediatePropagation();
								e.stopPropagation();
							}
						}}
					/>
				)}
				{this._showError && <span class="ui-datepicker__errormessage">{this._errormessage}</span>}
			</div>
		);
	}
}
