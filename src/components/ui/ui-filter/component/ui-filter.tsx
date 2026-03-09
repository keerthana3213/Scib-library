import { Component, Host, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { UIFilterLiterals, UIContentForm, ExtendedFilters, UIDropdownLiterals, UIInputLiterals, UICheckboxLiterals } from '../models/ui-filter.model';
import { isEmpty } from 'lodash';

/**
 * Component description
 *
 */
@Component({
	tag: 'scib-ui-filter',
	styleUrl: 'ui-filter.scss',
	shadow: false,
	scoped: false
})
export class UIFilter {
	/** Boolean to open/close filter*/
	@Prop({ mutable: true }) open: boolean = false;

	/** Boolean full width pill*/
	@Prop({ mutable: true }) fullWidth: boolean = false;

	/** Boolean slim pill*/
	@Prop({ mutable: true }) fullSlim: boolean = false;

	/** Boolean intrusive pill*/
	@Prop({ mutable: true }) intrusive: boolean = false;

	/** Boolean to disable toggle*/
	@Prop({ mutable: true }) disableToggle: boolean = false;

	/** Boolean for fluid btns*/
	@Prop({ mutable: true }) fluidBtns: boolean = false;

	/** Disabled button submit*/
	@Prop({ mutable: true, reflect: false }) disabledSubmit: boolean = true;

	/** Disabled button reset*/
	@Prop({ mutable: true, reflect: false }) disabledReset: boolean = true;

	/** Active horizontal filter styling*/
	/* Importantly!, the div that contains the filter in the spa should have a relative position*/
	@Prop({ mutable: true, reflect: false }) horizontalFilter: boolean;

	/** Number filters active*/
	@Prop({ mutable: true, reflect: false }) filtersActive: number = 0;

	@State() selectedValue = [{ name: '', apply: true, detail: { value: '' } }];
	@State() inputValue: any;

	/** Data form filled*/
	@Prop({ mutable: true }) dataForm: any = {};
	previousDataForm: any = {};

	/**DateValue1 */
	@Prop({ mutable: true, reflect: false }) DateValue1: string;

	/**DateValue1 */
	@Prop({ mutable: true, reflect: false }) DateValue2: string;

	/**Reduce right white space of filter */
	@Prop({ reflect: false }) reduceRightSpace: boolean;

	/** Align actions buttons with form inputs */
	@Prop({ reflect: false }) alignButtons: boolean;

	/**Literals */
	@Prop({ reflect: false }) filterLiterals: UIFilterLiterals | string;
	dataEntryForm: any;
	@Watch('filterLiterals') literalsChange(newVal: UIFilterLiterals | string) {
		this._filterLiterals = _parseProp(newVal);
	}
	@State() _filterLiterals: UIFilterLiterals;

	/** String to indicate that there are no matches with the search engine */
	@Prop({ mutable: true, reflect: false }) noResult: string;

	/** Add more space to datepicker label when is too large */
	@Prop({ reflect: false }) datepickerLargeLabel: boolean = false;

	/** Break option name by word in dropdown */
	@Prop({ reflect: false }) breakNameOpt: boolean = false;

	/** Event form emitter */
	@Event() eventValuesFormEmitter: EventEmitter;
	@Event() resetInputValue: EventEmitter;

	/** Enables external modification of values */
	@Prop({ reflect: false, mutable: true }) externalChange: boolean = false;
	@Watch('externalChange') externalChangeApply(value: boolean) {
		this._externalChange = value;
	}
	@State() _externalChange: boolean;

	/** Checks if there has been a change in the filter value */
	@State() changeData: boolean = false;

	@Prop({ reflect: false, mutable: true }) filtersApply;
	@Watch('filtersApply') filtersApplyChange(value) {
		if (!value) {
			if (this._externalChange) {
				this.changeData = false;
			}
			return;
		}
		this.dataEntryForm = _parseProp(value);
		if (this._externalChange) {
			this.changeData = true;
			this.open = false;
			this._fullFat = false;
			this.filtersActive = Object.keys(this.dataEntryForm).filter((data) => data).length;
		}
	}

	/** Boolean to open/close extended filters*/
	@State() openedExtendedFields: boolean = false;
	/** Event show / hide extended filters emitter */
	@Event() eventShowHideEmitter: EventEmitter;

	@State() reset: boolean = false;
	@State() closeReset: boolean = false;
	/** Disable closeReset */
	@Prop({ reflect: false }) disableCloseReset: boolean = false;

	@State() _fullFat: boolean = false;

	/** Event on select typing emitter */
	@Event() selectTypingEmitter: EventEmitter;

	/** Event on select choice emitter */
	@Event() selectChoiceEmitter: EventEmitter;

	/**Reset filter from external event*/
	@Prop() externalReset: boolean = false;
	@Watch('externalReset') externalResetChange(value) {
		if (value) {
			this.previousDataForm = {};
			this._resetForm();
		}
	}

	/**Disable/able Apply button if datapicker value is wrong*/
	@State() errorDatePicker: boolean = false;

	/**Save status error of every datepicker */
	@State() datePickerArray: any[] = [];

	@State() inputAutocompleteValue: any;

	@Event() inputAutocompleteChange: EventEmitter;

	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.literalsChange(this.filterLiterals);
		this.externalChangeApply(this.externalChange);
		this.filtersApplyChange(this.filtersApply);
		this.externalResetChange(this.externalReset);
		if (this.dataEntryForm) {
			this.dataForm = this.dataEntryForm;
			this.filtersActive = Object.keys(this.dataForm).filter((data) => data).length;
			this.disabledReset = false;
			this.disabledSubmit = false;
		} else this.dataForm = {};
	}

	openCloseAcordion() {
		this.open = !this.open;
		this._fullFat = false;
		if (Object.keys(this.previousDataForm).length) {
			this.filtersActive = Object.keys(this.previousDataForm).length;
			if (this.open) {
				this.dataForm = JSON.parse(JSON.stringify(this.previousDataForm));
			}
		}
		this._fullFat = this.fullSlim && this.open;
		if (this.dataEntryForm && this.changeData && this._externalChange) {
			if (this.open) {
				this.dataForm = this.dataEntryForm;
				this.previousDataForm = JSON.parse(JSON.stringify(this.dataForm));
			}
			this.changeData = false;
			this.filtersActive = Object.keys(this.dataForm).filter((data) => data).length;
		}
		if (this.open === false) {
			this.openedExtendedFields = false;
			this.eventShowHideEmitter.emit(this.openedExtendedFields);
		}
		this.validationRequired();
	}

	_handleReset(e) {
		this.reset = e.detail;
	}

	_hanldeSelectEventChange(e) {
		this.selectTypingEmitter.emit(e.detail);
	}

	_handleDropdown(e: any, indexForm, id, values?: any[], multiselect?: boolean) {
		const existArea: any =
			values && values.length > 0 && ((e.detail && (e.detail.value || e.detail.id)) || (multiselect && e.detail.length))
				? values.find((item) => {
						if (Object.prototype.hasOwnProperty.call(item, 'value')) {
							if (e.detail['value'].constructor === Object) {
								return (
									item.value.toString() === e.detail.value['id'].toString() ||
									item.id.toString() === e.detail.value['id'].toString()
								);
							}
							return item.value.toString() === e.detail.value.toString();
						} else if (Object.prototype.hasOwnProperty.call(item, 'id')) {
							if (e.detail['value'] && e.detail['value'].constructor === Object) {
								return item.id.toString() === e.detail.value['id'].toString();
							}
							if (e.detail.length) {
								return !isEmpty(e.detail.find((det) => det.id === item.id));
							}
							return item.id.toString() === e.detail.id.toString();
						}
						return false;
				  })
				: null;
		const whatArea: string = existArea && existArea.whatArea ? existArea.whatArea : '';
		if (multiselect && e.detail.length) {
			let dataName: string = '';
			e.detail.forEach((item) => (dataName = isEmpty(dataName) ? `${item.name}` : `${dataName}, ${item.name}`));
			let dataId: string = '';
			e.detail.forEach((item) => (dataId = isEmpty(dataId) ? `${item.id}` : `${dataId}, ${item.id}`));
			this.selectChoiceEmitter.emit(dataId);
			this.dataForm[id] = { id: dataId, name: dataName };
		} else {
			this.selectChoiceEmitter.emit(e.detail.value);
			this.dataForm[id] = e.detail.value;
		}
		this.selectedValue[indexForm] = {
			name: this.dataForm,
			detail: { value: this.dataForm },
			apply: true
		};
		if (!this.dataForm[id]) {
			delete this.dataForm[id];
		} else {
			this.validationRequired();
		}

		if (whatArea === 'area') {
			if (this.dataForm.hasOwnProperty['department']) {
				this.dataForm.department = '';
			}
			if (this.dataForm.hasOwnProperty['direction']) {
				this.dataForm.direction = '';
			}
		}

		if (whatArea === 'direction') {
			if (this.dataForm.hasOwnProperty['direction']) {
				this.dataForm.direction = '';
			}
		}

		if (whatArea === 'status') {
			if (this.dataForm.hasOwnProperty['id_Fases']) {
				this.dataForm.id_Fases = '';
			}
		}
		this.dataForm = { ...this.dataForm };
	}

	_handleInputs(e: any, id: string) {
		this.inputValue = e.detail;
		this.dataForm[id] = this.inputValue;
		if (!this.dataForm[id]) {
			delete this.dataForm[id];
		}
		this.validationRequired();
	}

	_handleCheckbox(e: any, id: string) {
		const value = e.detail?.checkboxValue;
		this.dataForm[id] = value === 'checked' ? true : false;
		if (!this.dataForm[id]) {
			delete this.dataForm[id];
		}
		this.validationRequired();
	}

	_handelDatePicker(e: any, indexDatePicker, id: string) {
		this.setValuesDatePicker(indexDatePicker, e, id);
		this.checkValuesDatePickerAreValid(id, indexDatePicker);
		this.validationRequired();
	}

	private checkValuesDatePickerAreValid(idDate: string, indexDatePicker) {
		if (
			Date.parse(this.dataForm[idDate].startDate) > Date.parse(this.dataForm[idDate].endDate) &&
			indexDatePicker === 2 &&
			Date.parse(this.dataForm[idDate].endDate) > -2208988800000
		) {
			this.dataForm[idDate].startDate = this.dataForm[idDate].endDate;
			const aux = JSON.stringify(this.dataForm);
			this.dataForm = JSON.parse(aux);
			return;
		}
		if (
			Date.parse(this.dataForm[idDate].endDate) < Date.parse(this.dataForm[idDate].startDate) &&
			indexDatePicker === 1 &&
			Date.parse(this.dataForm[idDate].endDate) > -2208988800000
		) {
			this.dataForm[idDate].endDate = this.dataForm[idDate].startDate;
			const aux = JSON.stringify(this.dataForm);
			this.dataForm = JSON.parse(aux);
			return;
		}
	}

	private setValuesDatePicker(indexDatePicker: any, e: any, idDate: string) {
		!this.dataForm[idDate] ? (this.dataForm[idDate] = {}) : '';
		if (indexDatePicker === 1) {
			this.dataForm[idDate].startDate = e.detail;
		} else {
			this.dataForm[idDate].endDate = e.detail;
		}
	}

	_resetForm() {
		this.selectedValue = [{ name: '', apply: true, detail: { value: '' } }];
		this.inputValue = '';
		this.DateValue1 = '';
		this.DateValue2 = '';
		this.dataForm = {};
		this.inputAutocompleteValue = '';
		this.filtersActive = 0;
		this.reset = true;
		this.datePickerArray = [];
		this.errorDatePicker = false;
		this.closeReset = true;
		const resetAutocomplete = (this.filterLiterals as UIFilterLiterals)?.fieldset.some(
			(elem) => elem.hasOwnProperty('input') && elem['input'].hasOwnProperty('autocomplete')
		);

		if (resetAutocomplete) {
			this.resetInputValue.emit({ reset: true });
		}
	}

	_filterMetadata() {
		if (this.dataForm && this.dataForm.tradeDate && this.dataForm.tradeDate.startDate && this.dataForm.tradeDate.endDate) {
			if (Date.parse(this.dataForm.tradeDate.startDate) > Date.parse(this.dataForm.tradeDate.endDate)) {
				this.dataForm.tradeDate.endDate = this.dataForm.tradeDate.startDate;
			}
		}

		if (this.dataForm && this.dataForm.maturityDate && this.dataForm.maturityDate.startDate && this.dataForm.maturityDate.endDate) {
			if (Date.parse(this.dataForm.maturityDate.startDate) > Date.parse(this.dataForm.maturityDate.endDate)) {
				this.dataForm.maturityDate.endDate = this.dataForm.maturityDate.startDate;
			}
		}

		if (!this.dataForm) {
			this.previousDataForm = {};
		} else {
			this.previousDataForm = JSON.parse(JSON.stringify(this.dataForm));
		}

		let cont: number = 0;
		for (const key in this.dataForm) {
			if (Object.prototype.hasOwnProperty.call(this.dataForm, key) && this.dataForm[key] !== '') {
				cont++;
			}
		}
		this.filtersActive = cont;
		// this.filtersActive = Object.keys(this.dataForm).filter(data => data).length;
		this.eventValuesFormEmitter.emit(this.dataForm);
		this.disableToggle ? null : this.openCloseAcordion();
	}

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "next" button
	 *  of the parent is activated*/
	validationRequired() {
		if ((Object.keys(this.dataForm).length === 0 && this.filtersActive === 0) || this.errorDatePicker) {
			this.disabledSubmit = true;
			this.disabledReset = true;
		} else {
			this.disabledSubmit = false;
			this.disabledReset = false;
		}
		return;
	}

	_handleButtonChange(event) {
		if (this.dataForm && this._filterLiterals.expectedYear) {
			for (const key in this.dataForm) {
				if (this.dataForm[key]['startDate'] || this.dataForm[key]['endDate']) {
					this._filterLiterals.fieldset.filter((el) => {
						if (el['datepicker'] && el['datepicker']['idDate'] === event.detail.idDatepicker.replace('date', '')) {
							let index = this.datePickerArray.findIndex(
								(item) => item.datepickerId === event.detail.idDatepicker && item.labelDatepicker === event.detail.labelDatepicker
							);
							if (index !== -1) {
								this.datePickerArray[index]['disableButton'] = event.detail.error;
							} else {
								this.datePickerArray.push({
									datepickerId: event.detail.idDatepicker,
									disableButton: event.detail.error,
									labelDatepicker: event.detail.labelDatepicker
								});
							}
						}
					});
				}
			}

			this.errorDatePicker = this.datePickerArray.filter((el) => el.disableButton === true).length > 0 ? true : false;
			this.validationRequired();
		}
	}

	getDropdown(dropdown: UIDropdownLiterals, indexForm: number) {
		return (
			<scib-ui-dropdown
				class={{
					'sc-scib-ui-dropdown-h--long': dropdown.long,
					'sc-scib-ui-dropdown-h--double': dropdown.double
				}}
				label={dropdown.label}
				header={dropdown.placeholderSelect}
				options={JSON.stringify(dropdown.values)}
				metadatavalues={false}
				multipleselector="single"
				wordBreakOpt={this.breakNameOpt}
				noMinHeight={this.horizontalFilter}
				idselect={dropdown.idSelect ? dropdown.idSelect : `item${indexForm}`}
				selecteditem={
					this.dataForm[dropdown.idSelect]?.id && {
						id: this.dataForm[dropdown.idSelect].id,
						label: this.dataForm[dropdown.idSelect].label
					}
				}
				name={dropdown.idSelect ? dropdown.idSelect : `item${indexForm}`}
				onEventFormChange={(e) => {
					this._handleDropdown(e, indexForm, dropdown.idSelect ? dropdown.idSelect : `item${indexForm}`, dropdown.values);
				}}
				required
			></scib-ui-dropdown>
		);
	}

	getSelect(select, indexForm: number) {
		return (
			<scib-ui-select
				class={{ 'sc-scib-ui-select-h--long': select.long, 'sc-scib-ui-select-h--double': select.double }}
				label={select.label}
				noResult={this.noResult}
				placeholder-select={select.placeholderSelect}
				minHeight={!this.horizontalFilter}
				idSelect={'dropdown_list' + select.label}
				valueAutoComplete={{
					name: this.getMultiselectValues(select.multiselect, select.idSelect ? select.idSelect : `item${indexForm}`, true),
					apply: true,
					detail: {
						value: this.getMultiselectValues(select.multiselect, select.idSelect ? select.idSelect : `item${indexForm}`, false)
					}
				}}
				reset={this.reset}
				removedPosition={select.selectedValue}
				autocomplete
				value={this.getMultiselectValues(select.multiselect, select.idSelect ? select.idSelect : `item${indexForm}`, true)}
				name="dropdown-list"
				required={false}
				multiselect-v-2={select.multiselect ? select.multiselect : false}
				multiselect={false}
				debounce-time="300"
				disabled={select.disable}
				backMode={select.backMode}
				textCursor={select.textCursor}
				loading={select.loading}
				options={JSON.stringify(select.values)}
				onEventChange={(event) => this._hanldeSelectEventChange(event)}
				onResetSelectValues={(event) => this._handleReset(event)}
				onListEventChange={(event) =>
					this._handleDropdown(event, indexForm, select.idSelect ? select.idSelect : `item${indexForm}`, select.values, select.multiselect)
				}
			></scib-ui-select>
		);
	}

	getMultiselectValues(multiselect: boolean, indexForm: any, isName: boolean) {
		return multiselect && this.dataForm[indexForm]
			? isName
				? this.dataForm[indexForm].name
				: this.dataForm[indexForm].id
			: this.dataForm[indexForm];
	}

	getInput(input: UIInputLiterals, indexForm: number) {
		return input.autocomplete ? (
			<scib-ui-input
				class={{ 'sc-scib-ui-input-h--long': input.long, 'sc-scib-ui-input-h--double': input.double }}
				style={{ marginBottom: '12px' }}
				label={input.label}
				placeholder={input.placeholder}
				idInput={'input-autocomplete' + input.idInput}
				required={false}
				no-min-height={true}
				searchSimple={true}
				multiselect={false}
				autocomplete={true}
				limitInputText={true}
				debounce-time="300"
				viewBoxSkeleton={'0 0 668 150'}
				charMin={3}
				options={input.options}
				value={this.dataForm[input.idInput ? input.idInput : `item${indexForm}`]?.name || this.inputAutocompleteValue}
				loading={input.loading}
				noResult={input.noResult}
				noIconRight={false}
				iconInnerRight={'icon-fill-clear'}
				onEventChange={($event) =>
					this._handleInputAutoCompleteChange($event, input.idInput ? input.idInput : `item-autocomplete${indexForm}`)
				}
				onEventSendOptionWhenInputChange={($event) =>
					this._handleInputAutocompleteSelect($event, input.idInput ? input.idInput : `item-autocomplete${indexForm}`)
				}
			></scib-ui-input>
		) : (
			<scib-ui-input
				class={{ 'sc-scib-ui-input-h--long': input.long, 'sc-scib-ui-input-h--double': input.double }}
				label={input.label}
				idInput={'input' + input.idInput}
				noMinHeight={this.horizontalFilter}
				value={this.dataForm[input.idInput ? input.idInput : `item${indexForm}`]}
				placeholder={input.placeholder}
				disableEdit={input.disable}
				onEventChange={(event) => {
					this._handleInputs(event, input.idInput ? input.idInput : `item${indexForm}`);
				}}
				multiselect={false}
			></scib-ui-input>
		);
	}

	getCheckbox(checkbox: UICheckboxLiterals, indexForm: number) {
		return (
			<scib-ui-v2-checkbox
				value={this.dataForm[checkbox.idCheckbox ? checkbox.idCheckbox : `item${indexForm}`] === true ? 'checked' : 'unchecked'}
				uid={checkbox.idCheckbox ? checkbox.idCheckbox : checkbox.label + '-' + indexForm}
				label={checkbox.label}
				name={checkbox.idCheckbox ? checkbox.idCheckbox : checkbox.label + '-' + indexForm}
				onValueChange={(event) => {
					this._handleCheckbox(event, checkbox.idCheckbox ? checkbox.idCheckbox : checkbox.label + '-' + indexForm);
				}}
			></scib-ui-v2-checkbox>
		);
	}
	private generateFilters(fieldset?: UIContentForm[]): any {
		return fieldset?.map((items: UIContentForm, indexForm: number) => (
			<div
				class={{
					'ui-filter__row': true,
					'ui-filter__row--reduce': this.reduceRightSpace,
					'ui-filter__row--flex': items['row'] && items['row'].length > 0,
					'ui-datepicket__nolabel':
						items['datepicker'] &&
						(items['datepicker'].valueDatePickerLabel2 === '' || items['datepicker'].valueDatePickerLabel2 === undefined)
							? true
							: false
				}}
			>
				{items['dropdown'] && this.getDropdown(items['dropdown'], indexForm)}
				{items['select'] && this.getSelect(items['select'], indexForm)}
				{items['input'] && this.getInput(items['input'], indexForm)}
				{items['datepicker'] && (
					<div class="ui-filter__datepicker">
						<scib-ui-date-picker
							id={'date' + items['datepicker'].idDate}
							label={items['datepicker'].valueDatePickerLabel}
							small={!this.horizontalFilter}
							spacelabel={this.datepickerLargeLabel}
							noMinHeight={this.horizontalFilter}
							expectedYear={this._filterLiterals.expectedYear}
							errormessage={this._filterLiterals.dateErrorMessage}
							limitDate={items['datepicker'].limitDate ? items['datepicker'].limitDate : false}
							//onEventFormChange={event => this._handleReset(event)}
							value={
								this.dataForm[items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`]
									? this.dataForm[items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`].startDate
									: null
							}
							// maxDate={	this.dataForm[items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`]
							// ? this.dataForm[items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`].endDate
							// : null}
							onSelectValue={(event) =>
								this._handelDatePicker(event, 1, items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`)
							}
							onEventErrorChange={(event) => this._handleButtonChange(event)}
						></scib-ui-date-picker>
						{items['datepicker'].txt && <span class="ui-filter__txt">{items['datepicker'].txt}</span>}
						{items['datepicker'].txt && (
							<scib-ui-date-picker
								id={'date' + items['datepicker'].idDate}
								label={items['datepicker'].valueDatePickerLabel2}
								small={!this.horizontalFilter}
								noMinHeight={this.horizontalFilter}
								expectedYear={this._filterLiterals.expectedYear}
								errormessage={this._filterLiterals.dateErrorMessage}
								limitDate={items['datepicker'].limitDate ? items['datepicker'].limitDate : false}
								//onEventFormChange={event => this._handleReset(event)}
								value={
									this.dataForm[items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`]
										? this.dataForm[items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`].endDate
										: null
								}
								// minDate={this.dataForm[items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`]
								// ? this.dataForm[items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`].startDate
								// : null}
								onSelectValue={(event) =>
									this._handelDatePicker(event, 2, items['datepicker'].idDate ? items['datepicker'].idDate : `item${indexForm}`)
								}
								onEventErrorChange={(event) => this._handleButtonChange(event)}
							></scib-ui-date-picker>
						)}
					</div>
				)}
				{items['checkbox'] && this.getCheckbox(items['checkbox'], indexForm)}
				{items['row'] &&
					items['row'].length > 0 &&
					items['row'].map((item: UIDropdownLiterals | UIInputLiterals, indexInRow: number) => (
						<div
							style={{
								width: `calc((100% - ${8 * (items['row'].length - 1)}px) / ${items['row'].length})`
							}}
						>
							{'values' in item
								? this.getDropdown(item, indexForm * 10 + indexInRow)
								: this.getInput(item, indexForm * 10 + indexInRow)}
						</div>
					))}
			</div>
		));
	}

	private generateExtendedFilters(extendedFilters: ExtendedFilters[]): any {
		return extendedFilters?.map((item: any) => (
			<fieldset class="ui-filter__fieldset">
				<legend class="fieldset-legend">{item.legend}</legend>
				{this.generateFilters(item.fieldset)}
			</fieldset>
		));
	}

	private canShowExtendedFilters(): boolean {
		return this._filterLiterals.hasExtendedFilters && this._filterLiterals.extendedFilters && this._filterLiterals.extendedFilters.length > 0;
	}

	private _handleInputAutoCompleteChange(event: CustomEvent, id: string) {
		if (event.detail.length >= 3) {
			const data = {
				selectedOption: event.detail,
				idInput: id
			};
			this.inputAutocompleteChange.emit(data);
		}
		if (!event.detail) {
			delete this.dataForm[id];
			this.inputAutocompleteValue = '';
		}
	}

	private _handleInputAutocompleteSelect(event: CustomEvent, id: string) {
		this.inputAutocompleteValue = event.detail;
		this.dataForm[id] = this.inputAutocompleteValue;
		if (!this.dataForm[id]) {
			delete this.dataForm[id];
		}
		this.validationRequired();
	}

	render() {
		const validAlignButtons = this.alignButtons && !this.canShowExtendedFilters();
		return (
			<Host>
				<section
					class={{
						'ui-filter__section': true,
						'ui-filter__section--open': this.open,
						'ui-filter__section--horizontal': this.horizontalFilter,
						'ui-filter__section--full-width': this.fullWidth || this.fullSlim,
						'ui-filter__section--full-width-slim': this.fullSlim && !this._fullFat,
						'ui-filter__section--intrusive': this.intrusive,
						'ui-filter__section--disable-toggle': this.disableToggle,
						'ui-filter__section--fluid-btns': this.fluidBtns,
						'ui-filter__section--align-btns': validAlignButtons
					}}
				>
					<span
						class={{ 'ui-filter__title': true, 'ui-filter__title--active': this.filtersActive != 0 }}
						onClick={() => (this.disableToggle ? null : this.openCloseAcordion())}
						data-active={this.filtersActive}
					>
						{this._filterLiterals.filterTitle}
					</span>
					{this.open ? (
						<form class={{ 'ui-filter__form': true, 'ui-filter__form--reduce': this.reduceRightSpace }} autocomplete="off">
							<fieldset class="ui-filter__fieldset">{this.generateFilters(this._filterLiterals.fieldset)}</fieldset>
							{this.canShowExtendedFilters() &&
								this.openedExtendedFields &&
								this.generateExtendedFilters(this._filterLiterals.extendedFilters)}

							<footer class="ui-filter__footer">
								<div class="extraBtns">
									{this.canShowExtendedFilters() && (
										<div
											class="extendDataBtn"
											onClick={() => {
												this.openedExtendedFields = !this.openedExtendedFields;
												this.eventShowHideEmitter.emit(this.openedExtendedFields);
											}}
										>
											<span
												role="img"
												class={`u-icon ${!this.openedExtendedFields ? 'icon-eye-show' : 'icon-eye-hide'}`}
											></span>
											{this.horizontalFilter && (
												<span class="extendDataBtn__text">
													{this.openedExtendedFields
														? this._filterLiterals.hideIconLabel
														: this._filterLiterals.showIconLabel}
												</span>
											)}
										</div>
									)}
								</div>
								<div class={{ 'default-Btn': true, 'default-Btn--reduce': this.reduceRightSpace }}>
									<scib-ui-button
										secondary
										type="button"
										hide-txt
										small
										icon="icon-delete"
										disabled={this.disabledReset}
										onEventClick={() => this._resetForm()}
									>
										{' '}
									</scib-ui-button>

									<scib-ui-button
										primary
										small
										type="button"
										disabled={this.disabledSubmit}
										onEventClick={() => this._filterMetadata()}
									>
										{this._filterLiterals.filterbtn}
									</scib-ui-button>
								</div>
							</footer>
						</form>
					) : null}
				</section>
			</Host>
		);
	}
}
