import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';
import { ICDKSsisCreateLiterals, ICDKSsisCreateSelect, ICDKSsisErrorsLiterals, IInstructionAccordeon, IInstruction, Instruction } from '../models/cdk-ssis-create.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-ssis-create',
	styleUrl: 'cdk-ssis-create.scss',
	shadow: false,
	scoped: true,
})
export class CDKSsisCreate {
	_swiftValidate: boolean = true;

	/** Disabled button submit*/
	@Prop({ mutable: true, reflect: true }) disabledSubmit: boolean = true;

	/** Disabled add instruction button*/
	@Prop({ mutable: true, reflect: true }) disabledAddInstruction: boolean = false;

	/*Boolean accordeon active styles*/
	@Prop() accordeonActive: boolean = false;

	/*Boolean accordeon active styles*/
	@Prop() indice: number = 0;

	/*Boolean changeCurrencyProducts active primaryInstruction*/
	@Prop() changeCurrencyProducts = true;

	/*Boolean to activate multiselect listing in mobile query*/
	@Prop({ reflect: false }) isMobile: boolean;
	/** Items selected to multislect*/
	@Prop({ mutable: true, reflect: false }) selectedItems: string;

	/** Remove items selected to multislect*/
	@Prop({ mutable: true, reflect: true }) removedItem;

	/*Open Object accordeon*/
	@State() openAccordeon = [{ index: 0, open: true }];

	/*Change state in accordeon*/
	@State() changeAccordeon = true;

	@State() selectedValueCurrency = [{ name: '', apply: true, detail: { value: '' } }];
	@State() selectedValueProduct = [{ name: '', apply: true, detail: { value: '' } }];
	/** Data form filled*/
	@State() dataForm: IInstruction[] = [];

	@State() _literals: ICDKSsisCreateLiterals;
	@State() _errors: ICDKSsisErrorsLiterals;
	@State() _products: [ICDKSsisCreateSelect] | any;
	@State() _productsOriginal: [ICDKSsisCreateSelect] | any;
	@State() _currency: ICDKSsisCreateSelect[];
	@State() _valuesDate: ICDKSsisCreateSelect[];
	@State() _instructionNumber: number = 1;
	@State() _selectedItems;
	@State() _itemsIsNew: boolean;
	@State() _newItems = [];

	/** Literales de la modal de creación */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKSsisCreateLiterals;

	@Watch('literals') parseLiterals(newVal: string | ICDKSsisCreateLiterals) {
		this._literals = _parseProp(newVal);
	}
	/** Literales de errores de la modal de creación */
	@Prop({ mutable: true, reflect: true }) errors: string | ICDKSsisErrorsLiterals;
	@Watch('errors') parseErrors(newVal: string | ICDKSsisErrorsLiterals) {
		this._errors = _parseProp(newVal);
	}
	/**  */
	@Prop({ mutable: true, reflect: true }) products: string | ICDKSsisCreateSelect[] | any;
	@Watch('products') parseProducts(newVal: string | ICDKSsisCreateSelect[]) {
		this._products[0] = _parseProp(newVal);
		this._products[0].map(product => {
			product.id_doc_type = product.id_doc_type;
			product.t_name = product.t_name;
			product.value = product.value;
			product.name = product.name;
			product.key = product.value;
		});
		this._productsOriginal = JSON.stringify(this._products[0]);
		this._productsOriginal = JSON.parse(this._productsOriginal);
	}
	private getProductsDeleted(indexForm) {
		if (this._selectedItems[indexForm] && this._selectedItems[indexForm].length > 0) {
			let productsDeleted = [];
			this._products[indexForm].map(product => {
				const exist = this._selectedItems[indexForm].some(select => select === product.value);
				if (!exist) {
					productsDeleted.push(product);
				}
			});
			this._products[indexForm] = productsDeleted;
		}
	}
	/**  */
	@Prop({ mutable: true, reflect: true }) currency: string | ICDKSsisCreateSelect[];
	@Watch('currency') parseCurrency(newVal: string | ICDKSsisCreateSelect[]) {
		this._currency = _parseProp(newVal);

		this._currency.map(currency => {
			currency.id_doc_type = currency.value;
			currency.t_name = currency.name;
			currency.id_doc_type = currency.id_doc_type;
			currency.t_name = currency.t_name;
			currency.value = currency.value;
			currency.name = currency.name;
			currency.key = currency.value;
		});
	}
	/**  */
	@Prop({ mutable: true, reflect: true }) valuesDate: string | ICDKSsisCreateSelect[];
	@Watch('valuesDate') parseValuesDate(newVal: string | ICDKSsisCreateSelect[]) {
		this._valuesDate = _parseProp(newVal);
	}

	/** Event cancel edit */
	@Event() eventCancelEdit: EventEmitter;

	/** Event form emitter */
	@Event() eventValuesFormEmitter: EventEmitter;

	/** Event items remove */
	@Event() eventItemRemove: EventEmitter;

	/** Bind of the scope of this.*/
	constructor() {
		this._selectedItems = [[]];
		this._products = [];
	}
	@Listen('resize', { target: 'window' }) watchInnerWidth() {
		this.multiselectResponsive();
	}
	/** Ciclo de vida ejecutado antes del primer render */
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseErrors(this.errors);
		this.parseProducts(this.products);
		this.parseCurrency(this.currency);
		this.parseValuesDate(this.valuesDate);
		this.dataForm[0] = new Instruction();
		// this._handleExistingOption("maintain")
		this.validationRequired();
		this.multiselectResponsive();
	}

	/** Collapse accordeon */
	_handleAccordeon(index: number) {
		this.openAccordeon[index].open === true ? (this.openAccordeon[index].open = false) : (this.openAccordeon[index].open = true);
		this.changeAccordeon = !this.changeAccordeon;
	}

	/** Open first instruction */
	_OpenFirstInstruction() {
		this.openAccordeon.map((instruction: IInstructionAccordeon) => {
			instruction.open = false;
		});
		this.openAccordeon.push({ index: this.indice, open: true });
	}

	/**Remove instruction in accoderon and Order accordeon*/
	_removeAccordeon(index: number) {
		this.openAccordeon.splice(index, 1);
		this.openAccordeon.map((instruction: IInstructionAccordeon, indexInstruction) => {
			instruction.index = indexInstruction;
		});
		this.changeAccordeon = !this.changeAccordeon;
	}

	/** Create another instruction */
	_handleInstruction() {
		if (this.dataForm.length <= 15) {
			this.selectedValueCurrency.push({ name: '', apply: true, detail: { value: '' } });
			this.selectedValueProduct.push({ name: '', apply: true, detail: { value: '' } });
			this._selectedItems.push([]);
			this.dataForm.push(new Instruction());
			this.indice++;
			this._productsOriginal = JSON.stringify(this._productsOriginal);
			this._products[this.indice] = JSON.parse(this._productsOriginal);

			this._productsOriginal = JSON.parse(this._productsOriginal);

			this._OpenFirstInstruction();
			this.validationRequired();
		}
		this.dataForm.length === 1 ? (this.accordeonActive = false) : (this.accordeonActive = true);
	}

	/** Remove Instruction */
	_handleInstructionRemove(index: number) {
		this.dataForm.splice(index, 1);
		this._selectedItems.splice(index, 1);
		this.selectedValueProduct.splice(index, 1);
		this.selectedValueCurrency.splice(index, 1);
		this._products.splice(index, 1);
		this._removeAccordeon(index);
		this.indice--;
		this.validationRequired();
	}

	_handleTextarea(e: any, index: number) {
		this.dataForm[index].textarea = e.detail;
		this.validationRequired();
	}

	_handleMultiselect(e: any, index: number) {
		if (!e) {
			return;
		}
		this.dataForm[index].product = e[index];
		this.selectedValueProduct[index] = {
			name: this.dataForm[index].product,
			detail: { value: this.dataForm[index].product[index] },
			apply: true,
		};
		this.changeCurrencyOrProducts();
		this.validationRequired();
	}

	_handleCurrency(e: any, index: number) {
		if (!e.detail.value) return;
		this.dataForm[index].currency = e.detail.value;
		this.selectedValueCurrency[index] = {
			name: this.dataForm[index].currency,
			detail: { value: this.dataForm[index].currency },
			apply: true,
		};
		this.changeCurrencyOrProducts();
		this.validationRequired();
	}

	private changeCurrencyOrProducts(): void {
		this.changeCurrencyProducts = !this.changeCurrencyProducts;
	}

	_handleDate(e: any, index: number) {
		this.dataForm[index].date = e.detail;
	}

	_handleCheckInstruction(e: any, index: number) {
		this.dataForm[index].primaryInstruction = e.detail;
		this.changeCurrencyProducts = !this.changeCurrencyProducts;
		this.validationRequired();
	}

	_handleInput(e: any, type: any, index: number) {
		this._checkInput(e, type, index);
		this.validationRequired();
	}

	_checkInput(e, type, index: number) {
		switch (type) {
			case 'swiftCode':
				this.dataForm[index].swiftCode = e.detail;
				this._validateSwiftCode(e);
				break;
			case 'account':
				this.dataForm[index].cuentaCorresponsal = e.detail;
				break;
			case 'swiftIntermediary':
				this.dataForm[index].swiftIntermediary = e.detail;
				this._validateSwiftCode(e);
				break;
			case 'accountIntermediary':
				this.dataForm[index].accountIntermediary = e.detail;
				break;
			case 'swiftIntermediary2':
				this.dataForm[index].swiftIntermediary2 = e.detail;
				this._validateSwiftCode(e);
				break;
			case 'accountIntermediary2':
				this.dataForm[index].accountIntermediary2 = e.detail;
				break;
			default:
				break;
		}
	}

	listEventChangeHandler(event, indexForm) {
		setTimeout(() => {
			this._selectedItems[indexForm].push(event.detail.pop().name);
			this.deleteItemSelectInProducts(indexForm);
			this.copyOfSelectedItems();
			this._handleMultiselect(this._selectedItems, indexForm);
		}, 200);
	}

	private deleteItemSelectInProducts(indexForm: number) {
		this._products[indexForm].map((product, index) => {
			if (this._selectedItems[indexForm].some(select => select === product.value)) {
				this._products[indexForm].splice(index, 1);
			}
		});
		this.getProductsDeleted(indexForm);
	}

	/**
	 *
	 * @param removedItem item want be removed
	 * @param indexForm index of formulation interact
	 */
	removeProductItem(removedItem, indexForm) {
		this.removedItem = removedItem.detail;
		let index = this._selectedItems[indexForm].indexOf(this.removedItem);
		if (index > -1) {
			this._selectedItems[indexForm].splice(index, 1);
			this.resetProducts(indexForm);
			this.copyOfSelectedItems();
			this._selectedItems.forEach(_ => {
				this.deleteItemSelectInProducts(indexForm);
			});
			this.updateProducts();
		}
		this.validationRequired();
	}

	private resetProducts(indexForm: number) {
		this._products[indexForm] = this._productsOriginal;
		this.updateProducts();
	}

	private updateProducts() {
		this._products = JSON.stringify(this._products);
		this._products = JSON.parse(this._products);
	}

	private copyOfSelectedItems() {
		this._selectedItems = JSON.stringify(this._selectedItems);
		this._selectedItems = JSON.parse(this._selectedItems);
	}

	/** Emitter to cancel edit */
	_handleCancel() {
		this.eventCancelEdit.emit();
	}

	/** Emitter data form filled */
	_handleFinish() {
		this.eventValuesFormEmitter.emit(this.dataForm);
	}

	_validateSwiftCode(e) {
		const swiftValidatorExpression = /^[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}[XXX0-9]{0,3}/s;
		if ((swiftValidatorExpression.test(e.detail) && (e.detail.length === 11 || e.detail.length === 8)) || e.detail.length === 0 || e.detail === null) {
			e.target.classList.remove('no-validate');
			e.target.error = '';
			this._swiftValidate = true;
		} else {
			e.target.classList.add('no-validate');
			e.target.error = this._errors.exactlyCharacters;
			this._swiftValidate = false;
		}
	}

	isDisabledPrimary(instruction: IInstruction, indexForm: number) {
		if (instruction.product && instruction.currency) {
			const auxDataForm = this.dataForm.find(
				(form, index) => form.primaryInstruction && form.currency === instruction.currency && form.product === instruction.product && index !== indexForm,
			);
			if (auxDataForm) {
				this.dataForm[indexForm].primaryInstruction = false;
				return true;
			} else {
				return false;
			}
		} else {
			this.dataForm[indexForm].primaryInstruction = false;
			return true;
		}
	}

	private multiselectResponsive() {
		if (window.innerWidth >= 320 && window.innerWidth <= 767) {
			this.isMobile = true;
		} else {
			this.isMobile = false;
		}
	}

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "next" button
	 *  of the parent is activated*/
	validationRequired() {
		if (
			!this.dataForm[this.indice].product ||
			this.dataForm[this.indice].product === '' ||
			!this.dataForm[this.indice].currency ||
			this.dataForm[this.indice].currency === '' ||
			!this.dataForm[this.indice].swiftCode ||
			this.dataForm[this.indice].swiftCode === '' ||
			!this.dataForm[this.indice].cuentaCorresponsal ||
			this.dataForm[this.indice].cuentaCorresponsal === '' ||
			!this._swiftValidate
		) {
			this.disabledSubmit = true;
			this.disabledAddInstruction = true;
		} else {
			this.disabledSubmit = false;
			this.disabledAddInstruction = false;
		}
		return;
	}

	render() {
		return (
			<Host>
				<section class="cdk-cssis">
					<h3 class="cdk-cssis__title">{this._literals.mainTitle}</h3>
					<form class="cdk-cssis__form" name="vdr-edit-form" action="post">
						{this.dataForm.map((element, indexForm) => (
							<fieldset class="cdk-cssis__fieldset">
								<legend
									class={{
										'cdk-cssis__legend': true,
										'cdk-cssis__legend--open': this.openAccordeon[indexForm].index === indexForm && this.openAccordeon[indexForm].open !== true,
										'cdk-cssis__legend--deactivate': this.dataForm.length === 1,
									}}
									onClick={() => this._handleAccordeon(indexForm)}
									innerHTML={this._literals.instructionTitle + ' ' + (indexForm + 1)}
								></legend>
								{(this.openAccordeon[indexForm].index === indexForm && this.openAccordeon[indexForm].open === true) || this.dataForm.length < 2 ? (
									<div class="cdk-cssis__container">
										<div class="cdk-cssis__group">
											<scib-ui-select
												class="c-header-form-field"
												noResult={this._literals.noResult}
												label={this._literals.productLabel}
												placeholder-select={this._literals.productPlaceholder}
												idSelect={'products_list' + indexForm}
												autocomplete
												value={this.selectedValueProduct[indexForm].name}
												name="owner-list"
												required={true}
												minHeight={true}
												debounce-time="300"
												options={JSON.stringify(this._products[indexForm])}
												onListEventChange={() => this.listEventChangeHandler(event, indexForm)}
											></scib-ui-select>

											{this._selectedItems[indexForm].length > 0 && this.isMobile ? (
												<div class="cdk-cssis__group">
													<scib-ui-list
														label={this._literals.productsListLabel}
														tooltip={this._literals.tooltip}
														hiddenLabel={true}
														items={this._selectedItems[indexForm]}
														onUpdateItems={this.removeProductItem.bind(this)(event, indexForm)}
													></scib-ui-list>
												</div>
											) : (
												''
											)}

											<scib-ui-select
												noResult={this._literals.noResult}
												label={this._literals.currrencyLabel}
												placeholder-select={this._literals.currencyPlaceholder}
												idSelect={'currency_list' + indexForm}
												removedPosition={this.selectedValueCurrency[indexForm]}
												valueAutoComplete={this.selectedValueCurrency[indexForm]}
												autocomplete
												value={this.selectedValueCurrency[indexForm].name}
												multiselect={false}
												//optionsTitleTxt={this.contactsLabelTxt}
												class="c-header-form-field"
												name="owner-list"
												required={true}
												minHeight={true}
												debounce-time="300"
												options={JSON.stringify(this._currency)}
												onListEventChange={() => this._handleCurrency(event, indexForm)}
											></scib-ui-select>

											<scib-ui-checkbox
												label={this._literals.primaryInstructionLabel}
												name={this._literals.primaryInstructionLabel}
												id={this._literals.primaryInstructionLabel}
												labelInfo={this._literals.labelInfoCheckbox}
												isDisabled={this.isDisabledPrimary(element, indexForm)}
												onCheckboxChange={() => this._handleCheckInstruction(event, indexForm)}
												checked={this.isDisabledPrimary(element, indexForm) ? false : this.dataForm[indexForm].primaryInstruction}
											></scib-ui-checkbox>
										</div>
										{this._selectedItems[indexForm].length > 0 && !this.isMobile ? (
											<div class="cdk-cssis__group">
												<scib-ui-list
													label={this._literals.productsListLabel}
													tooltip={this._literals.tooltip}
													hiddenLabel={true}
													items={this._selectedItems[indexForm]}
													onUpdateItems={() => this.removeProductItem.bind(this)(event, indexForm)}
												></scib-ui-list>
											</div>
										) : (
											''
										)}
										<div class="cdk-cssis__group">
											<scib-ui-input
												label={this._literals.swiftCodeLabel}
												placeholder={this._literals.swiftCodePlaceholder}
												value={element.swiftCode ? element.swiftCode : null}
												required={true}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'swiftCode', indexForm)}
											></scib-ui-input>
											<scib-ui-input
												label={this._literals.accountLabel}
												placeholder={this._literals.accountPlaceholder}
												value={element.cuentaCorresponsal ? element.cuentaCorresponsal : null}
												required={true}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'account', indexForm)}
											></scib-ui-input>
											<scib-ui-input
												label={this._literals.swiftIntermediaryLabel}
												placeholder={this._literals.swiftIntermediaryPlaceholder}
												value={element.swiftIntermediary ? element.swiftIntermediary : null}
												required={false}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'swiftIntermediary', indexForm)}
											></scib-ui-input>
										</div>
										<div class="cdk-cssis__group">
											<scib-ui-input
												label={this._literals.accountIntermediaryLabel}
												placeholder={this._literals.accountIntermediaryPlaceholder}
												value={element.accountIntermediary ? element.accountIntermediary : null}
												required={false}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'accountIntermediary', indexForm)}
											></scib-ui-input>
											<scib-ui-input
												label={this._literals.swiftIntermediary2Label}
												placeholder={this._literals.swiftIntermediary2Placeholder}
												value={element.swiftIntermediary2 ? element.swiftIntermediary2 : null}
												required={false}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'swiftIntermediary2', indexForm)}
											></scib-ui-input>
											<scib-ui-input
												label={this._literals.accountIntermediary2Label}
												placeholder={this._literals.accountIntermediary2Placeholder}
												value={element.accountIntermediary2 ? element.accountIntermediary2 : null}
												required={false}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'accountIntermediary2', indexForm)}
											></scib-ui-input>
										</div>
										<div class="cdk-cssis__group">
											<scib-ui-date-picker
												id="date-value"
												full
												onSelectValue={() => this._handleDate(event, indexForm)}
												label={this._literals.valueDateLabel}
												header={this._literals.valueDatePlaceholder}
												disabledselector={false}
												value={element.date}
											></scib-ui-date-picker>
										</div>
										<scib-ui-textarea
											label-txtarea={this._literals.textAreaLabel}
											id-txtarea="textArea"
											name-txtarea="textArea"
											placeholder-txtarea={this._literals.textAreaPlaceholder}
											onEventChange={() => this._handleTextarea(event, indexForm)}
											required={false}
											valueTxtarea={element.textarea}
										></scib-ui-textarea>
										{this.dataForm.length > 1 ? (
											<div class="cdk-cssis__remove-instruction">
												<scib-ui-button type="button" link disableMinWidth nobackground onEventClick={() => this._handleInstructionRemove(indexForm)}>
													{this._literals.deleteInstructionBtn}
												</scib-ui-button>
											</div>
										) : (
											''
										)}
									</div>
								) : (
									''
								)}
							</fieldset>
						))}
						{this.dataForm.length < 15 ? (
							<div class="cdk-cssis__add-instruction">
								<scib-ui-button
									type="button"
									icon="icon-add"
									disabled={this.disabledAddInstruction}
									icon-left
									link
									disableMinWidth
									nobackground
									onEventClick={() => this._handleInstruction()}
								>
									{this._literals.addInstructionBtn}
								</scib-ui-button>
							</div>
						) : (
							''
						)}
					</form>
					<footer class="cdk-cssis__footer">
						<span class="cdk-cssis__notice">{this._literals.notice}</span>
						<div class="cdk-cssis__buttons">
							<scib-ui-button secondary type="submit" onEventClick={() => this._handleCancel()}>
								{this._literals.cancelBtn}
							</scib-ui-button>
							<scib-ui-button primary type="submit" disabled={this.disabledSubmit} onEventClick={() => this._handleFinish()}>
								{this._literals.submitBtn}
							</scib-ui-button>
						</div>
					</footer>
				</section>
			</Host>
		);
	}
}
