import { Component, h, Prop, EventEmitter, Watch, State, Event } from '@stencil/core';
import { IUISelectOption } from '../../../ui/ui-select/models/ui-select.model';
import { IECMVMetadataFilter, IECMVMetadataValues } from '../models/ecmv-metadata-filter.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-ecmv-metadata-filter',
	styleUrl: 'ecmv-metadata-filter.scss',
	shadow: false,
	scoped: false,
})
export class ECMVMetadataFilter {
	@State() open: boolean = false;
	@Prop() metadata: string;
	@State() metadataObject: IECMVMetadataFilter[];
	@Prop({ reflect: true }) buttontitle: string;
	@State() formObjects: any[];
	@State() selectedValue: string = '';
	@Prop({ reflect: true }) titlefilter: string;
	@Event() filtersValues: EventEmitter<any[]>;
	@Event() filtersResetValues: EventEmitter<boolean>;
	@State() hasFilterOptions: boolean = false;
	@State() isResetStatus: boolean = false;
	@State() filtersActive: number = 0;
	@State() previousFormObjects: any[];
	@State() dateValues: { [key: string]: { init?: string; end?: string } } = {};

	@Watch('metadata') setMetadata() {
		this.componentDidLoad();
	}

	componentDidLoad() {
		this.metadataObject = JSON.parse(this.metadata);
		const hash = {};
		this.metadataObject = this.metadataObject.filter(function (current) {
			const exists = !hash[current.id];
			hash[current.id] = true;
			return exists;
		});
		this.formObjects = [];
		this.previousFormObjects = [];
	}

	checkFormChanges(): boolean {
		this.deleteEmptyValues();
		const currentLength: number = Object.keys(this.formObjects).length;
		const prevLength: number = this.previousFormObjects && Object.keys(this.previousFormObjects).length;
		let it: number = 0;

		if (currentLength === prevLength)
			Object.values(this.previousFormObjects).forEach(i =>
				Object.values(this.formObjects).forEach(e => {
					if (e.value === i.value && e.metadata === i.metadata) it++;
				}),
			);
		if (it === prevLength && this.previousFormObjects.length > 0) return false;
		else if (this.formObjects.length <= 0 && this.previousFormObjects.length <= 0) return false;
		else return true;
	}

	checkFormValidation(): void {
		this.isResetStatus = this.checkFormChanges();
		if (this.formObjects.length > 0) this.hasFilterOptions = true;
		else this.hasFilterOptions = false;
	}

	openCloseAcordion() {
		this.open = !this.open;
	}

	handleSubmit(event) {
		event.preventDefault();
	}

	handleInputOrSelect(event, item) {
		this.fillFormDataMap(event, item);
		this.checkFormValidation();
	}

	fillFormDataMap(event, item): void {
		this.formObjects.forEach(element => {
			element.metadata === item.metadata && this.formObjects.splice(this.formObjects.indexOf(element), 1);
		});
		const metadataValue: string = item.typeItem === 'String(ValueList)' ? event.detail.id : event.detail;
		const obj: IECMVMetadataValues = {
			id: item.id,
			metadata: item.metadata,
			value: metadataValue,
		};
		this.formObjects.push(obj);
	}

	resetForm(): void {
		this.hasFilterOptions = false;
		this.formObjects = [];
		this.selectedValue = '';
		this.filtersResetValues.emit(true);
		this.checkFormValidation();
	}

	filterMetadata(): void {
		if (this.formObjects.length == 0) this.filtersResetValues.emit(true);
		this.previousFormObjects = [...this.formObjects];
		this.filtersValues.emit(this.formObjects);
		this.filtersActive = this.formObjects.length;
		this.isResetStatus = false;
		this.open = false;
	}

	deleteEmptyValues(): void {
		this.formObjects = this.formObjects.filter(element => element.value !== '' && element.value !== undefined);
	}

	handleDate(event, item, type) {
		if (event != '') {
			const obj = {
				id: item.id,
				metadata: item.metadata,
				value: event.detail,
				type: type,
			};
			this.dateValues[item.id] = { ...this.dateValues[item.id], [type]: event.detail };
			if (this.dateValues[item.id] && this.dateValues[item.id].init && this.dateValues[item.id].end) {
				const initDate = new Date(this.dateValues[item.id].init).getTime();
				const endDate = new Date(this.dateValues[item.id].end).getTime();
				if (initDate > endDate) {
					if (type === 'end') {
						this.dateValues[item.id].end = this.dateValues[item.id].init;
						obj.value = this.dateValues[item.id].init;
					} else {
						this.dateValues[item.id].init = this.dateValues[item.id].end;
						obj.value = this.dateValues[item.id].end;
					}
				}
			}
			const objItem = this.formObjects.filter(iFilter => iFilter.id == item.id && iFilter.type == type)[0];
			if (objItem !== undefined) {
				this.formObjects.splice(this.formObjects.indexOf(objItem), 1);
			}
			this.formObjects.push(obj);
		}
		this.checkFormValidation();
	}

	parseMetadataValuesAuto(text): IUISelectOption[] | string {
		if (!text) return;
		let dropdownOptionsListArray = [];
		if (text && text !== undefined) {
			const textSplitted = text.split('||');
			if (textSplitted.length >= 1) {
				textSplitted.forEach(elem => {
					const category2 = {
						label: elem.split('#')[0],
						id: elem.split('#')[1],
						active: false,
						icon: elem.icon,
						image: elem.image,
						name: elem.split('#')[0],
						value: elem.split('#')[0],
					};
					return (dropdownOptionsListArray = [...dropdownOptionsListArray, category2].sort());
				});
			}
		}
		return JSON.stringify(dropdownOptionsListArray);
	}

	render() {
		return (
			<section class="ecmv-filter">
				<span
					class={{
						'ecmv-filter__title': true,
						'ecmv-filter__title--ifilter': true,
						'ecmv-filter__title--active': this.filtersActive > 0,
						'ecmv-filter__title--open': this.open,
					}}
					onClick={() => this.openCloseAcordion()}
					data-active={this.filtersActive}
				>
					{this.titlefilter}
					<span class={{ 'ecmv-filter__title--acordion': true }}></span>
				</span>
				<form id="metadata-form" autocomplete="off" onSubmit={e => this.handleSubmit(e)}>
					<fieldset class={{ 'ecmv-filter__fieldset': true, 'not-visible': !this.open }}>
						{this.metadataObject?.map(item =>
							item.typeItem == 'String(ValueList)' ? (
								<div class="select-group-styleItem" scib-ui-select-filter-box>
									<scib-ui-select
										label={item.metadata}
										noResult={'No results'}
										placeholder-select={item.metadata}
										minHeight={false}
										idSelect={item.id}
										valueAutoComplete={{
											name: this.selectedValue,
											apply: true,
											detail: {
												value: this.selectedValue,
											},
										}}
										value={this.selectedValue}
										autocomplete
										name="dropdown-list"
										required={false}
										multiselect={false}
										debounce-time="300"
										options={this.parseMetadataValuesAuto(item.totalValues)}
										onEventChange={$event => this.handleInputOrSelect($event, item)}
										onListEventChange={$event => this.handleInputOrSelect($event, item)}
									></scib-ui-select>
								</div>
							) : // <scib-ui-dropdown
							// 	class="selectot-div"
							// 	label={item.metadata}
							// 	onSelectValue={$event => this.handleOnSelect($event, item)}
							// 	multipleselector="single"
							// 	metadatavalues={true}
							// 	options={item.totalValues}
							// 	header={item.metadata}
							// 	disabledselector={false}
							// 	small
							// 	idselect={item.id}
							// 	selecteditem={this.selectedValue}
							// ></scib-ui-dropdown>
							item.typeItem == 'String' ? (
								<div class="select-group-styleItem">
									<scib-ui-input
										id="textInput"
										label={item.metadata}
										placeholder={item.metadata}
										value={
											this.formObjects.find(element => item.id == element.id)
												? this.formObjects.find(element => item.id == element.id).value
												: ''
										}
										required={false}
										onEventChange={$event => this.handleInputOrSelect($event, item)}
										disableEdit={false}
										small={true}
										data-cy="ecm-metadata-filter-input"
									></scib-ui-input>
								</div>
							) : item.typeItem == 'Date' ? (
								<div class="dateRange">
									<div class="select-group-styleItem">
										<scib-ui-date-picker
											id="prueba"
											label={item.metadata}
											onSelectValue={$event => this.handleDate($event, item, 'init')}
											maxDate={this.dateValues?.[item.id]?.end}
											header={'Inicio'}
											disabledselector={false}
											medium={true}
										></scib-ui-date-picker>
									</div>
									<span class="spanTo">to</span>
									<div class="select-group-styleItem">
										<scib-ui-date-picker
											id="prueba"
											onSelectValue={$event => this.handleDate($event, item, 'end')}
											header={'Fin'}
											minDate={this.dateValues?.[item.id]?.init}
											disabledselector={false}
											medium={true}
										></scib-ui-date-picker>
									</div>
								</div>
							) : null,
						)}

						<footer class="ecmv-filter__footer">
							{this.hasFilterOptions ? (
								<scib-ui-button
									secondary
									hide-txt
									small
									icon="icon-delete"
									type="reset"
									onEventClick={() => this.resetForm()}
									disabled={false}
									data-cy="ecm-metadata-filter-buttonDelete"
								>
									{' '}
								</scib-ui-button>
							) : (
								<scib-ui-button
									secondary
									hide-txt
									small
									icon="icon-delete"
									onEventClick={() => this.resetForm()}
									disabled={true}
									data-cy="ecm-metadata-filter-buttonDelete"
								>
									{' '}
								</scib-ui-button>
							)}
							{this.isResetStatus ? (
								<scib-ui-button
									primary
									small
									type="submit"
									disabled={false}
									onEventClick={() => this.filterMetadata()}
									data-cy="ecm-metadata-filter-buttonApply"
								>
									{this.buttontitle}
								</scib-ui-button>
							) : (
								<scib-ui-button
									primary
									small
									type="submit"
									disabled={true}
									onEventClick={() => this.filterMetadata()}
									data-cy="ecm-metadata-filter-buttonApply"
								>
									{this.buttontitle}
								</scib-ui-button>
							)}
						</footer>
					</fieldset>
				</form>
			</section>
		);
	}
}
