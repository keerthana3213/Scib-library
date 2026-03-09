import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import {
	ICDKParameterData,
	ICDKParameterLiterals,
	ICDKParameterItem,
	CDKParameterLogicEnum,
	CDKParameterAumationTypeEnum,
	CDKParameterTypeEnum,
	CDKInputTypeEnum,
	CDKParameterMetadataNameEnum,
} from '../models/cdk-parameter-input.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-parameter-input',
	styleUrl: 'cdk-parameter-input.scss',
	shadow: false,
	scoped: true,
})
export class CDKParameterInput {
	/** Literals */
	@Prop() literals: ICDKParameterLiterals | string;
	@Watch('literals') parseLiterals(newLiterals: ICDKParameterLiterals | string) {
		this._literals = _parseProp(newLiterals);
	}
	@State() _literals: ICDKParameterLiterals;

	/** Data */
	@Prop() data: ICDKParameterData | string;
	@Watch('data') parseData(newData: ICDKParameterData | string) {
		this._data = _parseProp(newData);
		this._data.itemList.map(item => {
			switch (item.inputType) {
				case CDKInputTypeEnum.TEXT:
					item.selectedType = {
						active: true,
						id: CDKInputTypeEnum.TEXT,
						label: this._literals.text,
					};
					break;
				case CDKInputTypeEnum.NUMBER:
					item.selectedType = {
						active: true,
						id: CDKInputTypeEnum.NUMBER,
						label: this._literals.number,
					};
					break;
				case CDKInputTypeEnum.DATE:
					item.selectedType = {
						active: true,
						id: CDKInputTypeEnum.DATE,
						label: this._literals.date,
					};
					break;
				case CDKInputTypeEnum.COMBO:
					item.selectedType = {
						active: true,
						id: CDKInputTypeEnum.COMBO,
						label: this._literals.combo,
					};
					break;
				default:
					item.selectedType = {
						active: true,
						id: CDKInputTypeEnum.TEXT,
						label: this._literals.text,
					};
			}

			switch (item.paramLogic) {
				case CDKParameterLogicEnum.AUTO_AGREGADED:
					item.selectedLogic = {
						active: true,
						id: CDKParameterLogicEnum.AUTO_AGREGADED,
						label: this._literals.autovalueaggregated,
					};
					break;
				case CDKParameterLogicEnum.AUTO_UNIQUE:
					item.selectedLogic = {
						active: true,
						id: CDKParameterLogicEnum.AUTO_UNIQUE,
						label: this._literals.autovalueunique,
					};
					break;
				case CDKParameterLogicEnum.MANUAL:
					item.selectedLogic = {
						active: true,
						id: CDKParameterLogicEnum.MANUAL,
						label: this._literals.manual,
					};
					break;
				default:
					item.selectedLogic = {
						active: true,
						id: CDKParameterLogicEnum.AUTO_UNIQUE,
						label: this._literals.autovalueunique,
					};
			}

			switch (item.automation) {
				case CDKParameterAumationTypeEnum.DEFAULT:
					item.selectedAutomation = {
						active: true,
						id: CDKParameterAumationTypeEnum.DEFAULT,
						label: this._literals.default,
					};
					break;
				case CDKParameterAumationTypeEnum.CALCULATED:
					item.selectedAutomation = {
						active: true,
						id: CDKParameterAumationTypeEnum.CALCULATED,
						label: this._literals.calculated,
					};
					break;
				default:
					item.selectedAutomation = {
						active: true,
						id: CDKParameterAumationTypeEnum.DEFAULT,
						label: this._literals.default,
					};
			}

			if (item.atribute) {
				this._data.atributes.forEach(atribute => {
					if (atribute.id === item.atribute) {
						item.selectedAtribute = {
							active: true,
							id: item.atribute,
							label: atribute.name,
						};
					}
				});
			}

			if (item.paramType) {
				if (item.paramTypes && item.paramTypes.length > 0) {
					item.paramTypes.forEach(parameter => {
						if (parameter.value === item.paramType) {
							parameter.isChecked = true;
						}
					});
				}
			}

			item.blocked = true;
			if (item.paramTypes && item.paramTypes.length > 0) {
				item.paramTypes.map(item => {
					item.disabled = true;
				});
			}
		});
		this._itemList = [...this._data.itemList];
	}
	@State() _data: ICDKParameterData;

	@State() _itemList: ICDKParameterItem[];

	@State() _validValue: boolean;

	@State() _counter: number = 0;

	/** Open dropdown */
	@State() _openDropDownIndex: number;

	addNewItem = () => {
		const newItem = {
			id: `${this._data.name}${this._counter}`,
			inputType: null,
			name: null,
			value: null,
			paramType: CDKParameterTypeEnum.OPERATIONAL,
			paramLogic: null,
			atribute: null,
			automation: null,
			concatenated: ';',
			paramTypes: this._data.parameterType,
		};
		this._counter++;
		this._itemList = [...this._itemList, newItem];
	};

	deleteItem = deleteIndex => {
		let newItemList = this._itemList;
		newItemList.splice(deleteIndex, 1);
		this._itemList = [...newItemList];
		this.validateValues();
		this.eventMultiFormChange.emit({
			name: this._data.name,
			value: this._itemList,
			validValue: this._validValue,
		});
		this._openDropDownIndex = this._itemList.length - 1;
	};

	validateValues = () => {
		let validItems = {};
		this._itemList.map((item, index) => {
			if (item.paramType && item.paramLogic && item.name) {
				if (item.paramLogic === CDKParameterLogicEnum.MANUAL && item.inputType) validItems[index] = true;
				else if (item.paramLogic === CDKParameterLogicEnum.AUTO_AGREGADED && item.atribute && item.concatenated) validItems[index] = true;
				else if (
					item.paramLogic === CDKParameterLogicEnum.AUTO_UNIQUE &&
					(item.automation === CDKParameterAumationTypeEnum.CALCULATED || (item.automation === CDKParameterAumationTypeEnum.DEFAULT && item.inputType && item.value))
				)
					validItems[index] = true;
				else validItems[index] = false;
			} else validItems[index] = false;
		});
		this._validValue = !Object.values(validItems).includes(false);
	};

	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseData(this.data);
		this.validateValues();
		if (this._data.itemList.length === 0) {
			this.addNewItem();
		}
		this._openDropDownIndex = this._itemList.length - 1;
	}

	handleOpenDropDown(selectedIndex) {
		this._openDropDownIndex = selectedIndex;
	}

	handleCloseDropDown() {
		this._openDropDownIndex = undefined;
	}
	/** Evento emitido al cambiar el valor para formulario*/
	@Event() eventMultiFormChange: EventEmitter;

	@Listen('eventFormChange')
	eventFormChangeHandler(event: CustomEvent) {
		this._itemList = [...this._itemList];
		this.validateValues();
		event.stopPropagation();
		this.eventMultiFormChange.emit({
			name: this._data.name,
			value: this._itemList,
			validValue: this._validValue,
		});
	}

	render() {
		return (
			<Host>
				<div class="cdk-parameter">
					<div class="cdk-parameter__container">
						{this._itemList.map((item, index) => (
							<section class="cdk-parameter__item">
								<div class="cdk-parameter__header">
									<h3>
										{`${this._literals.itemTitle} ${index + 1} `}
										{!item.blocked && <strong class="cdk-parameter__header--new">{this._literals.newLable}</strong>}
									</h3>
									<scib-ui-button
										icon="icon-chevron-down"
										disable-min-width
										hide-txt
										nobackground
										onClick={() => {
											if (index === this._openDropDownIndex) {
												this.handleCloseDropDown();
											} else {
												this.handleOpenDropDown(index);
											}
										}}
										class={{
											'cdk-parameter__btn': true,
											'cdk-parameter__btn--open': this._openDropDownIndex === index,
										}}
									></scib-ui-button>
								</div>
								{this._openDropDownIndex !== index ? (
									(item.paramType && item.paramLogic && item.paramLogic === CDKParameterLogicEnum.MANUAL && item.inputType && item.name) ||
									(item.paramLogic === CDKParameterLogicEnum.AUTO_AGREGADED && item.atribute && item.concatenated) ||
									(item.paramLogic === CDKParameterLogicEnum.AUTO_UNIQUE &&
										(item.automation === CDKParameterAumationTypeEnum.CALCULATED ||
											(item.automation === CDKParameterAumationTypeEnum.DEFAULT && item.inputType && item.name && item.value))) ? (
										<span class="cdk-parameter__content">
											{item.paramTypes && item.paramTypes.length
												? JSON.stringify(item.paramTypes.filter(_ => _.id === item.paramType).map(_ => ({ label: _.label })))
														.substring(11)
														.replace('"}]', '')
												: null}
											{item.name ? ' - ' + item.name : null}
											{item.isMandatory ? ' - ' + this._literals.checkLabel : null}
											{' - ' + this._literals[item.paramLogic]}
											{item.automation ? ' - ' + this._literals[item.automation] : null}
											{item.atribute ? ' - ' + this._data.atributes.find(a => a.id === item.atribute).name : null}
											{item.inputType ? ' - ' + this._literals[item.inputType] : null}
											{item.value && item.value != '' && item.value != undefined
												? item.inputType == CDKInputTypeEnum.DATE && typeof item.value == CDKInputTypeEnum.STRING
													? new Intl.DateTimeFormat('es-ES').format(Date.parse(item.value))
													: Array.isArray(item.value)
													? ' - ' + item.value.join(', ')
													: !item.value.label
													? ' - ' + item.value
													: null
												: null}
											{item.concatenated ? ' - ' + this._literals['concatenation'] + ": '" + item.concatenated + "'" : null}
										</span>
									) : (
										<span class="cdk-parameter__content cdk-parameter__content--error">{this._literals.pendingError}</span>
									)
								) : (
									<div class="cdk-parameter__content">
										<scib-ui-row key={item.id}>
											{item.paramTypes && item.paramTypes.length ? (
												<scib-ui-column col-Lg="4" col-Xs="6">
													<scib-ui-label-data label={`${this._literals.parameterType}*`} text=""></scib-ui-label-data>
													<scib-ui-radio-button
														group-name="parameterType"
														options={JSON.stringify(item.paramTypes)}
														onEventRadioButtonChange={e => {
															this._itemList[index] = {
																...this._itemList[index],
																paramType: e.detail.value,
															};
														}}
														activeButtonIndex={
															item.paramTypes.findIndex(paramType => paramType.id === item.paramType) === -1
																? 0
																: item.paramTypes.findIndex(paramType => paramType.id === item.paramType)
														}
													></scib-ui-radio-button>
												</scib-ui-column>
											) : null}
											{this._data.couldBeMandatory ? (
												<scib-ui-column col-Lg="2" col-Xs="6" class="cdk-parameter__checkboxCol">
													<scib-ui-checkbox
														label={this._literals.checkLabel}
														name={`${item.id}_checkName`}
														idCheck={`${item.id}_checkName`}
														checked={!!item.isMandatory}
														isDisabled={item.blocked}
														regularSize={true}
														onEventFormChange={e => {
															this._itemList[index] = {
																...this._itemList[index],
																isMandatory: !!e.detail.value,
															};
														}}
													></scib-ui-checkbox>
												</scib-ui-column>
											) : null}
											{item.paramType === 'Filenet' ? (
												<scib-ui-column col-Lg="2" col-Xs="6">
													<scib-ui-dropdown
														label={`${this._literals.itemName}*`}
														header={this._literals.placeholderItemType}
														options={JSON.stringify(
															Object.keys(CDKParameterMetadataNameEnum)
																.map(key => ({ active: false, id: key, name: CDKParameterMetadataNameEnum[key] }))
																.sort(function (a, b) {
																	if (a.name > b.name) {
																		return 1;
																	} else {
																		return -1;
																	}
																}),
														)}
														metadatavalues={false}
														multipleselector="single"
														disabledselector={item.blocked}
														idselect={`${item.id}_filenetMetadataName`}
														selecteditem={item.selectedMetadataName}
														name={`${item.id}_filenetMetadataName`}
														onEventFormChange={e => {
															this._itemList[index] = {
																...this._itemList[index],
																selectedMetadataName: e.detail.value,
																metadataName: e.detail.value?.id,
																name: e.detail.value?.label,
																value: e.detail.value,
															};
														}}
														required
													></scib-ui-dropdown>
												</scib-ui-column>
											) : item.paramType !== 'Filenet' ? (
												<scib-ui-column col-Lg="2" col-Xs="6">
													<scib-ui-input
														label={`${this._literals.itemName}*`}
														name={`${item.id}_name`}
														value={item.name}
														placeholder={this._literals.placeholderItemName}
														multiselect={false}
														disableEdit={item.blocked}
														onEventFormChange={e => {
															this._itemList[index] = {
																...this._itemList[index],
																name: e.detail.value,
															};
														}}
														required
													></scib-ui-input>
												</scib-ui-column>
											) : null}
											{item.paramType != '' && item.paramType != undefined ? (
												<scib-ui-column col-Lg="2" col-Xs="6">
													<scib-ui-dropdown
														label={`${this._literals.parameterLogic}*`}
														header={this._literals.placeholderItemType}
														options={JSON.stringify(this._data.parameterLogic)}
														metadatavalues={false}
														multipleselector="single"
														disabledselector={item.blocked}
														idselect={`${item.id}_paramLogic`}
														selecteditem={item.selectedLogic}
														name={`${item.id}_paramLogic`}
														onEventFormChange={e => {
															this._itemList[index] = {
																...this._itemList[index],
																selectedLogic: e.detail.value,
															};
															this._itemList[index] = {
																...this._itemList[index],
																paramLogic: e.detail.value?.id,
															};
														}}
														required
													></scib-ui-dropdown>
												</scib-ui-column>
											) : null}
											{item.paramLogic != '' && item.paramLogic != undefined && item.paramLogic == CDKParameterLogicEnum.AUTO_UNIQUE ? (
												<scib-ui-column col-Lg="2" col-Xs="6">
													<scib-ui-dropdown
														label={`${this._literals.automationType}*`}
														header={this._literals.placeholderItemType}
														options={JSON.stringify(this._data.automationType)}
														metadatavalues={false}
														multipleselector="single"
														disabledselector={item.blocked}
														idselect={`${item.id}_automation`}
														selecteditem={item.selectedAutomation}
														name={`${item.id}_automation`}
														onEventFormChange={e => {
															this._itemList[index] = {
																...this._itemList[index],
																selectedAutomation: e.detail.value,
															};
															this._itemList[index] = {
																...this._itemList[index],
																automation: e.detail.value?.id,
															};
														}}
														required
													></scib-ui-dropdown>
												</scib-ui-column>
											) : null}
											{(item.paramLogic != '' && item.paramLogic != undefined && item.paramLogic == CDKParameterLogicEnum.MANUAL) ||
											(item.paramLogic != '' &&
												item.paramLogic != undefined &&
												item.paramLogic == CDKParameterLogicEnum.AUTO_UNIQUE &&
												item.automation != '' &&
												item.automation != undefined &&
												item.automation == CDKParameterAumationTypeEnum.DEFAULT) ? (
												<scib-ui-column col-Lg="2" col-Xs="6">
													<scib-ui-dropdown
														label={`${this._literals.itemType}*`}
														header={this._literals.placeholderItemType}
														options={JSON.stringify(this._data.itemType)}
														metadatavalues={false}
														multipleselector="single"
														disabledselector={item.blocked}
														idselect={`${item.id}_inputType`}
														selecteditem={item.selectedType}
														name={`${item.id}_inputType`}
														onEventFormChange={e => {
															item.value = undefined;
															if (e.detail.value?.id === CDKInputTypeEnum.COMBO) {
																item.value = ['', ''];
															}
															this._itemList[index] = {
																...this._itemList[index],
																selectedType: e.detail.value,
															};
															this._itemList[index] = {
																...this._itemList[index],
																inputType: e.detail.value?.id,
															};
														}}
														required
													></scib-ui-dropdown>
												</scib-ui-column>
											) : null}
											{(item.paramLogic != '' &&
												item.paramLogic != undefined &&
												item.paramLogic == CDKParameterLogicEnum.AUTO_UNIQUE &&
												item.automation != '' &&
												item.automation != undefined &&
												item.automation == CDKParameterAumationTypeEnum.CALCULATED) ||
											(item.paramLogic != '' && item.paramLogic != undefined && item.paramLogic == CDKParameterLogicEnum.AUTO_AGREGADED) ? (
												<scib-ui-column col-Lg="2" col-Xs="6">
													<scib-ui-dropdown
														label={`${this._literals.atribute}*`}
														header={this._literals.placeholderItemType}
														options={JSON.stringify(this._data.atributes)}
														metadatavalues={false}
														multipleselector="single"
														disabledselector={item.blocked}
														idselect={`${item.id}_atribute`}
														selecteditem={item.selectedAtribute}
														name={`${item.id}_atribute`}
														onEventFormChange={e => {
															this._itemList[index] = {
																...this._itemList[index],
																selectedAtribute: e.detail.value,
															};
															this._itemList[index] = {
																...this._itemList[index],
																atribute: e.detail.value?.id,
															};
														}}
														required
													></scib-ui-dropdown>
												</scib-ui-column>
											) : null}
											{item.paramLogic != '' && item.paramLogic != undefined && item.paramLogic == CDKParameterLogicEnum.AUTO_AGREGADED ? (
												<scib-ui-column col-Lg="2" col-Xs="6">
													<scib-ui-input
														label={`${this._literals.concatenation}*`}
														name={`${item.id}_concatenated`}
														value={item.concatenated}
														placeholder={this._literals.placeholderItemName}
														multiselect={false}
														disableEdit={item.blocked}
														onEventFormChange={e => {
															this._itemList[index] = {
																...this._itemList[index],
																concatenated: e.detail.value,
															};
														}}
														required
													></scib-ui-input>
												</scib-ui-column>
											) : null}
											{item.paramLogic === CDKParameterLogicEnum.AUTO_UNIQUE && item.automation === CDKParameterAumationTypeEnum.DEFAULT ? (
												item.inputType === CDKInputTypeEnum.DATE ? (
													<scib-ui-column col-Lg="2" col-Xs="6">
														<scib-ui-date-picker
															label={`${this._literals.itemDefaultValue}*`}
															header={this._literals.placeholderItemDefaultValue}
															name={`${item.id}_value`}
															value={item.value?.toString()}
															full
															onEventFormChange={e => {
																this._itemList[index] = {
																	...this._itemList[index],
																	value: e.detail.value,
																};
															}}
														></scib-ui-date-picker>
													</scib-ui-column>
												) : item.inputType !== CDKInputTypeEnum.COMBO ? (
													<scib-ui-column col-Lg="2" col-Xs="6">
														<scib-ui-input
															label={`${this._literals.itemDefaultValue}*`}
															name={`${item.id}_value`}
															value={typeof item.value === 'object' ? null : item.value}
															type={item.inputType === CDKInputTypeEnum.NUMBER ? CDKInputTypeEnum.NUMBER : CDKInputTypeEnum.TEXT}
															placeholder={this._literals.placeholderItemDefaultValue}
															multiselect={false}
															disableEdit={item.blocked}
															onEventFormChange={e => {
																this._itemList[index] = {
																	...this._itemList[index],
																	value: e.detail.value,
																};
															}}
														></scib-ui-input>
													</scib-ui-column>
												) : null
											) : null}
										</scib-ui-row>
										{item.inputType == CDKInputTypeEnum.COMBO && (
											<div class="cdk-parameter__combo">
												<h4>{this._literals.itemComboListOptions}</h4>
												<scib-ui-row>
													{Array.isArray(item.value) &&
														item.value.map((option, optionIndex) => (
															<scib-ui-column col-Lg="2" col-Xs="6">
																<div class="cdk-parameter__listed">
																	<scib-ui-input
																		label={`${this._literals.itemValueListed} ${optionIndex + 1}*`}
																		name={`${item.id}_name`}
																		value={option?.toString()}
																		placeholder={`${this._literals.placeholderItemValueListed} ${optionIndex + 1}*`}
																		multiselect={false}
																		required
																		onEventFormChange={e => {
																			if (this._itemList[index].value.length > 0) {
																				this._itemList[index].value[optionIndex] = e.detail?.value;
																			}
																		}}
																		disableEdit={item.blocked}
																	></scib-ui-input>
																	<scib-ui-button
																		icon="icon-delete"
																		hideTxt
																		link
																		class="ui-table-button"
																		type="button"
																		icon-left
																		small
																		disabled={item.blocked || (Array.isArray(item.value) && item.value.length < 3)}
																		disableMinWidth
																		nobackground
																		onEventClick={event => {
																			if (Array.isArray(item.value)) {
																				let newItemList = item.value;
																				newItemList.splice(optionIndex, 1);
																				this._itemList[index].value = [...newItemList];
																				this._itemList = [...this._itemList];
																				this.validateValues();
																				this.eventMultiFormChange.emit({
																					name: this._data.name,
																					value: this._itemList,
																					validValue: this._validValue,
																				});
																				event.stopPropagation();
																			}
																		}}
																	></scib-ui-button>
																</div>
															</scib-ui-column>
														))}
													<scib-ui-column col-Lg="2" col-Xs="6">
														<scib-ui-button
															icon="icon-add"
															hideTxt
															link
															class="ui-table-button"
															type="button"
															icon-left
															small
															disableMinWidth
															nobackground
															disabled={item.blocked}
															onEventClick={event => {
																if (Array.isArray(item.value)) {
																	this._itemList[index].value = [...item.value, ''];
																}
																this._itemList = [...this._itemList];
																this.validateValues();
																event.stopPropagation();
															}}
														></scib-ui-button>
													</scib-ui-column>
												</scib-ui-row>
											</div>
										)}
										<scib-ui-button
											disable-min-width
											link
											disabled={item.blocked || this._itemList.length == 1}
											onClick={() => {
												!item.blocked && this._itemList.length != 1 && this.deleteItem(index);
											}}
										>
											{this._literals.deleteItem}
										</scib-ui-button>
									</div>
								)}
							</section>
						))}
						<scib-ui-button
							disable-min-width
							link
							onClick={() => {
								this.addNewItem();
								this._openDropDownIndex = this._itemList.length - 1;
							}}
						>
							{this._literals.addNewItem}
						</scib-ui-button>
					</div>
				</div>
			</Host>
		);
	}
}
