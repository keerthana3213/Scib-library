import { ICDKSsisEditLiterals, ICDKSsisEditSelect, ICDKSsisErrorsLiterals } from '../models/cdk-ssis-edit.model';
import { Component, Host, h, Prop, EventEmitter, Watch, State, Event, Listen } from '@stencil/core';
import { parseProp as _parseProp } from '../../../../utils/helpers/common';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-ssis-edit',
	styleUrl: 'cdk-ssis-edit.scss',
	shadow: false,
	scoped: true,
})
export class CDKSsisEdit {
	public _swiftValidate: boolean = true;
	public disabledAddInstruction: boolean = true;
	/** Disabled button submit*/
	@Prop({ mutable: true, reflect: true }) disabledSubmit: boolean = true;

	/** Boolean to show edit mode or only view mode request detail*/
	@Prop({ mutable: true, reflect: true }) editDetail: boolean;

	/** Boolean to show edit button on request detail*/
	@Prop({ mutable: true, reflect: true }) canEditDetail: boolean;

	/** Boolean to show or hide modal detail*/
	@Prop({ mutable: true, reflect: true }) openModal: boolean = false;

	/** Indicates if the user who is viewing the requests is an employee or a client */
	@Prop({ reflect: false }) isEmployee: boolean;

	/*Boolean to activate multiselect listing in mobile query*/
	@Prop({ reflect: false }) isMobile: boolean;

	/** Disabled add instruction button*/
	@Prop({ mutable: true, reflect: true })
	@State()
	haveChangesInForm: boolean = false;
	/** Data form filled*/
	@Prop() dataForm: ICDKSsisEditSelect[] = [];

	/** Literales de la modal de creación */
	@Prop({ mutable: true, reflect: true }) literals: string | ICDKSsisEditLiterals;
	@Prop({ mutable: true, reflect: true }) removedItem;
	@Prop({ mutable: true, reflect: true }) errors: string | ICDKSsisErrorsLiterals;

	@State() selectedValueCurrency = { name: '', apply: true, detail: { value: '' } };
	@State() selectedValueProduct = { name: '', apply: true, detail: { value: '' } };
	@State() _newItems = [];
	@State() _selectedItems;
	@State() _literals: ICDKSsisEditLiterals;
	@State() _errors: ICDKSsisErrorsLiterals;
	@State() _products: ICDKSsisEditSelect[] | any;
	@State() _product: ICDKSsisEditSelect;
	@State() _currency: ICDKSsisEditSelect[];
	@State() _valuesDate: ICDKSsisEditSelect[];

	@Event() eventCancelEdit: EventEmitter;
	@Event() eventValuesFormEmitter: EventEmitter;
	initialProducts: any;
	initialProductsLabel: any;

	@Watch('literals') parseLiterals(newVal: string | ICDKSsisEditLiterals) {
		if (!newVal) return;
		this._literals = _parseProp(newVal);
	}

	/** Literales de errores de la modal de creación */
	@Watch('literals') parseErrors(newVal: string | ICDKSsisErrorsLiterals) {
		if (!newVal) return;
		this._errors = _parseProp(newVal);
	}

	@Prop({ mutable: true, reflect: true }) products: string | ICDKSsisEditSelect[] | any;
	@Watch('products') parseProducts(newVal: string | ICDKSsisEditSelect[]) {
		if (!newVal) return;
		this._products = _parseProp(newVal);
		this._products.map(product => {
			product.id_doc_type = product.id_doc_type;
			product.t_name = product.t_name;
			product.value = product.value;
			product.name = product.name;
			product.key = product.value;
		});
		if (!this.initialProductsLabel) {
			this.initialProductsLabel = JSON.stringify(this._products);
			this.initialProductsLabel = JSON.parse(this.initialProductsLabel);
		}
		this.getProductsDeleted();
	}
	private getProductsDeleted() {
		if (this._selectedItems && this._selectedItems.length > 0) {
			let productsDeleted = [];
			this._products.map(product => {
				const exist = this._selectedItems.some(select => select === product.value);
				if (!exist) {
					productsDeleted.push(product);
				}
			});
			this._products = productsDeleted;
		}
	}
	@Prop({ mutable: true, reflect: true }) currency: string | ICDKSsisEditSelect[];
	@Watch('currency') parseCurrency(newVal: string | ICDKSsisEditSelect[]) {
		if (!newVal) return;
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

	@Prop({ mutable: true, reflect: true }) valuesDate: string | ICDKSsisEditSelect[];

	@Watch('valuesDate') parseValuesDate(newVal: string | ICDKSsisEditSelect[]) {
		if (!newVal) return;
		this._valuesDate = _parseProp(newVal);
		const mapValuesDate = this._valuesDate.map(valueDate => ({
			id_doc_type: valueDate.value,
			t_name: valueDate.name,
		}));
		this._valuesDate = mapValuesDate;
	}
	@Prop({ mutable: true, reflect: false }) selectedItems: string;
	@Watch('selectedItems') parseselectedItems() {
		if (!this.selectedItems) return;
		const parsedItems = JSON.parse(this.selectedItems);
		this._selectedItems = [...parsedItems, ...this._newItems];
	}

	@Listen('viewDetailInstruction', { target: 'window' })
	_handViewDetailInstruction(e) {
		e.preventDefault();
		this._product = e.detail;
		this.selectedValueCurrency = {
			name: this._product.currency,
			detail: { value: this._product.currency },
			apply: true,
		};
		this.getProductsSelected();

		this.singProductToForm();
		this.validationRequired();
		this.openModal = true;
		this.haveChangesInForm = false;
		this._handleCanEdit(e);
	}
	private getProductsSelected() {
		if (!this._product.product) {
			return;
		}
		if (typeof this._product.product === 'string') {
			this.initialProducts = JSON.stringify(this._product.product);
			this.initialProducts = JSON.parse(this.initialProducts);
			this._selectedItems.push(this.initialProducts);
			this._newItems.push(this.initialProducts);
		}

		if (Array.isArray(this._product.product)) {
			this.initialProducts = JSON.stringify(this._product.product);
			this.initialProducts = JSON.parse(this.initialProducts);
			this._selectedItems = this.initialProducts;
			this._newItems = this.initialProducts;

			this.initialProducts = this.initialProducts.join(', ');
		}

		this.selectedValueProduct = {
			name: '',
			detail: { value: this._product.product },
			apply: true,
		};
		this.getProductsSelector();
	}

	@Listen('eventCancelProcess')
	_handleCancelModal() {
		this._selectedItems = [];
		this._newItems = [];
		this._products = this.initialProductsLabel;
		this._products = JSON.stringify(this._products);
		this.products = JSON.parse(this._products);
		this.initialProducts = this._product.product;
		this.setProducts();
		this.openModal = false;
		this.editDetail = false;
		this.disabledSubmit = true;
		this.haveChangesInForm = false;
	}
	constructor() {
		this._selectedItems = [];
	}
	componentWillLoad() {
		this.parseLiterals(this.literals);
		this.parseErrors(this.errors);
		this.parseProducts(this.products);
		this.parseCurrency(this.currency);
		this.parseValuesDate(this.valuesDate);
		this.dataForm[0] = {};
		this.haveChangesInForm = false;
		this.editDetail = false;
		this.openModal = false;
		this.multiselectResponsive();
	}
	private _handleCanEdit(e) {
		let status = e.detail.status;
		if (status === 'Pending' && !this.isEmployee) {
			this.canEditDetail = true;
		} else {
			this.canEditDetail = false;
		}
	}

	private singProductToForm() {
		this.dataForm[0] = { product: '', currency: '', bicIntermediario1: '', cuentaCorresponsal: '', comment: '' };
		this.dataForm[0].product = this._product.product;
		this.dataForm[0].currency = this._product.currency;
		this.dataForm[0].bicCorresponsal = this._product.bicCorresponsal;
		this.dataForm[0].cuentaCorresponsal = this._product.cuentaCorresponsal;
		this._swiftValidate = false;
	}

	_handleTextarea(e: any) {
		this.haveChangesInForm = true;
		this.dataForm[0].comment = e.detail;
		this.validationRequired();
	}

	_handleProducts(event: any) {
		setTimeout(() => {
			this._newItems.push(event.detail.value);
			this._selectedItems = this._newItems;
			this.setProducts();
			this.getProductsSelector();
			this._handleMultiselect(this._selectedItems, 0);
		}, 200);
	}

	private getProductsSelector() {
		this._products.map((product, index) => {
			if (this._selectedItems.some(select => select === product.value)) {
				this._products.splice(index, 1);
				this._products = JSON.parse(JSON.stringify(this._products));
			}
		});
	}

	private setProducts(): void {
		this._selectedItems = JSON.stringify(this._selectedItems);
		this._selectedItems = JSON.parse(this._selectedItems);
		if (this._selectedItems.length === 0) {
			this.disabledSubmit = true;
		} else {
			this.disabledSubmit = false;
		}
	}

	_handleMultiselect(product: any, index: number) {
		if (!product) {
			return;
		}
		this.dataForm[index].product = product;
		this.selectedValueProduct[index] = {
			name: this.dataForm[index].product,
			detail: { value: this.dataForm[index].product },
			apply: true,
		};
		this.validationRequired();
	}

	_handleCurrency(e: any) {
		this.haveChangesInForm = true;
		this.dataForm[0].currency = e.detail.value;
		this.validationRequired();
	}

	_handleDate(e: any) {
		this.haveChangesInForm = true;
		this.dataForm[0].fechaEfectiva = e.detail;
		this.validationRequired();
	}

	_handleCheckInstruction(e: any) {
		this.haveChangesInForm = true;
		this.dataForm[0].primary = e.detail;
		this.validationRequired();
	}

	_handleInput(e: any, type: any) {
		this.haveChangesInForm = true;
		this._checkInput(e, type);
		this.validationRequired();
	}

	_checkInput(e, type) {
		this.haveChangesInForm = true;
		switch (type) {
			case 'swiftCodeCorresponsal':
				this.dataForm[0].bicCorresponsal = e.detail;
				this._validateSwiftCode(e);
				break;
			case 'accountCorresponsal':
				this.dataForm[0].cuentaCorresponsal = e.detail;
				break;
			case 'swiftIntermediary':
				this.dataForm[0].bicIntermediario1 = e.detail;
				this._validateSwiftCode(e);
				break;
			case 'accountIntermediary':
				this.dataForm[0].cuentaIntermediario1 = e.detail;
				break;
			case 'swiftIntermediary2':
				this.dataForm[0].bicIntermediario2 = e.detail;
				this._validateSwiftCode(e);
				break;
			case 'accountIntermediary2':
				this.dataForm[0].cuentaIntermediario2 = e.detail;
				break;
			default:
				break;
		}
	}

	/** Emitter data form filled */
	_handleSave() {
		this.openModal = false;
		const instructionsValues: ICDKSsisEditSelect = this.getInstructionsValues();
		this.disabledSubmit = true;
		this._product.product = this._selectedItems;
		this._selectedItems = [];
		this._products = this.initialProductsLabel;
		this._products = JSON.stringify(this._products);
		this.products = JSON.parse(this._products);
		this.setProducts();
		this.haveChangesInForm = false;
		this.eventValuesFormEmitter.emit(instructionsValues);
		window.setTimeout(() => (this.editDetail = false), 100);
	}

	private getInstructionsValues(): ICDKSsisEditSelect {
		return {
			producto: this.dataForm[0].product ? this.dataForm[0].product : this._product.product,
			status: this.dataForm[0].status ? this.dataForm[0].status : this._product.status,
			id: this._product.id,
			idRequest: this._product.idRequest,
			currency: this.dataForm[0].currency ? this.dataForm[0].currency : this._product.currency,
			cuentaCorresponsal: this.dataForm[0].cuentaCorresponsal ? this.dataForm[0].cuentaCorresponsal : this._product.cuentaCorresponsal,
			bicCorresponsal: this.dataForm[0].bicCorresponsal ? this.dataForm[0].bicCorresponsal : this._product.bicCorresponsal,
			bicIntermediario1: this.dataForm[0].bicIntermediario1 ? this.dataForm[0].bicIntermediario1 : this._product.bicIntermediario1,
			cuentaIntermediario1: this.dataForm[0].cuentaIntermediario1 ? this.dataForm[0].cuentaIntermediario1 : this._product.cuentaIntermediario1,
			bicIntermediario2: this.dataForm[0].bicIntermediario2 ? this.dataForm[0].bicIntermediario2 : this._product.bicIntermediario2,
			cuentaIntermediario2: this.dataForm[0].cuentaIntermediario2 ? this.dataForm[0].cuentaIntermediario2 : this._product.cuentaIntermediario2,
			fechaEfectiva: this.dataForm[0].fechaEfectiva ? this.dataForm[0].fechaEfectiva : this._product.fechaEfectiva,
			comment: this.dataForm[0].comment ? this.dataForm[0].comment : this._product.comment,
			primary: this.dataForm[0].primary ? this.dataForm[0].primary : this._product.primary,
		};
	}

	/** Function to change to detail edit mode */
	_handleEditForm() {
		this.editDetail = true;
		this._products = JSON.stringify(this.initialProductsLabel);
		this._products = JSON.parse(this._products);
		this.getProductsDeleted();
	}
	_handleItemsRemove(item) {
		this.updateItemsHandler(item);
	}
	updateItemsHandler(removedItem) {
		this.removedItem = removedItem.detail;
		let index = this._selectedItems.indexOf(this.removedItem);
		if (index > -1) {
			//this._newItems.splice(index, 1);
			this._selectedItems.splice(index, 1);
			this._newItems = this._selectedItems;

			this.setProducts();
			this.getProductsSelector();
			if (Array.isArray(this.products)) {
				this.products = JSON.stringify(this.products);
			}
			this.products = JSON.parse(this.products);
			this.products = JSON.stringify(this.products);
		}
		this.validationRequired();
	}
	public _validateSwiftCode(e): void {
		const swiftValidatorExpression = /^[a-zA-Z]{4}[a-zA-Z]{2}[a-zA-Z0-9]{2}[XXX0-9]{0,3}/s;
		if (this.checkSwiftCode(swiftValidatorExpression, e)) {
			e.target.classList.remove('no-validate');
			e.target.error = '';
			this._swiftValidate = true;
			return;
		}
		e.target.classList.add('no-validate');
		e.target.error = this._errors.exactlyCharacters;
		this._swiftValidate = false;
	}

	private checkSwiftCode(swiftValidatorExpression: RegExp, e: any) {
		return (swiftValidatorExpression.test(e.detail) && (e.detail.length === 11 || e.detail.length === 8)) || e.detail.length === 0 || e.detail === null;
	}

	/** Compares the change of the element's value with an empty string
	 * and depending on the result it emits true or false so that the disabled of the "next" button
	 *  of the parent is activated*/
	validationRequired() {
		if (!this.haveChangesInForm) {
			return;
		}
		if (this.checkValuesInForm()) {
			this.disabledSubmit = true;
			this.disabledAddInstruction = true;
			return;
		}
		const elementsDisabled = document.getElementsByClassName('no-validate');
		this.disabledSubmit = elementsDisabled.length === 0 ? false : true;
		this.disabledAddInstruction = false;
	}

	private checkValuesInForm() {
		return (
			!this.dataForm[0].product ||
			this.dataForm[0].product === '' ||
			!this.dataForm[0].currency ||
			this.dataForm[0].currency === '' ||
			!this.dataForm[0].bicCorresponsal ||
			this.dataForm[0].bicCorresponsal === '' ||
			!this.dataForm[0].cuentaCorresponsal ||
			this.dataForm[0].cuentaCorresponsal === ''
		);
	}

	formatDate(date) {
		const dateFormat = date ? new Date(date) : new Date();
		return `${dateFormat.getDate()}/${dateFormat.getMonth() + 1}/${dateFormat.getFullYear()}`;
	}

	formatDateValue(date) {
		const dateSplit = date.split('/');
		const dateFormat = date ? new Date(`${dateSplit[1]}/${dateSplit[0]}/${dateSplit[2]}`) : null;
		const month = dateFormat.getMonth() + 1 < 10 ? `0${dateFormat.getMonth() + 1}` : `${dateFormat.getMonth() + 1}`;
		const day = dateFormat.getDate() < 10 ? `0${dateFormat.getDate()}` : `${dateFormat.getDate()}`;
		return `${dateFormat.getFullYear()}-${month}-${day}`;
	}

	private multiselectResponsive() {
		if (window.innerWidth >= 320 && window.innerWidth <= 767) {
			this.isMobile = true;
		} else {
			this.isMobile = false;
		}
	}

	render() {
		return (
			<Host>
				<scib-ui-dialog open={this.openModal} is-emitter absolute>
					{this.editDetail ? (
						<section class="cdk-ssis">
							<h3 class="cdk-ssis__title">{this._literals?.mainTitle}</h3>
							<form class="cdk-ssis__form" name="vdr-edit-form" action="post">
								<fieldset class="cdk-ssis__fieldset">
									<div class="cdk-ssis__index">
										<legend class="cdk-ssis__legend">
											{this._literals?.instructionID + this._product.id}
											<span class="cdk-ssis__legend--status">{this._literals?.instructionStatus + this._product.status}</span>
										</legend>
									</div>
									<div class="cdk-ssis__container">
										<div class="cdk-ssis__group">
											<scib-ui-select
												noResult={this._literals.noResult}
												label={this._literals.productLabel}
												placeholder-select={this._literals.productPlaceholder}
												idSelect={'products_list' + this.selectedValueProduct.name}
												removedPosition={this.selectedValueProduct}
												valueAutoComplete={{
													name: '',
													apply: true,
													detail: {
														value: '',
													},
												}}
												value={''}
												autocomplete
												//optionsTitleTxt={this.contactsLabelTxt}
												class="c-header-form-field"
												name="owner-list"
												required={true}
												minHeight={true}
												multiselect={false}
												debounce-time="300"
												options={JSON.stringify(this._products)}
												onListEventChange={() => this._handleProducts(event)}
											></scib-ui-select>
											{this._selectedItems.length > 0 && this.isMobile ? (
												<div class="cdk-ssis__group">
													<scib-ui-list
														label={this._literals.productsListLabel}
														tooltip={this._literals.tooltip}
														hiddenLabel={true}
														items={this._selectedItems}
														onUpdateItems={this._handleItemsRemove.bind(this)}
													></scib-ui-list>
												</div>
											) : (
												''
											)}
											<scib-ui-select
												noResult={this._literals.noResult}
												label={this._literals.currrencyLabel}
												placeholder-select={this._literals.currencyPlaceholder}
												idSelect={'products_list' + this.selectedValueCurrency.name}
												removedPosition={this.selectedValueCurrency}
												valueAutoComplete={this.selectedValueCurrency}
												value={this.selectedValueCurrency.name}
												autocomplete
												//optionsTitleTxt={this.contactsLabelTxt}
												class="c-header-form-field"
												name="owner-list"
												required={true}
												minHeight={true}
												debounce-time="300"
												multiselect={false}
												options={JSON.stringify(this._currency)}
												onListEventChange={() => this._handleCurrency(event)}
											></scib-ui-select>

											<scib-ui-checkbox
												label={this._literals.primaryInstructionLabel}
												name={this._literals.primaryInstructionLabel}
												id={this._literals.primaryInstructionLabel}
												// labelInfo={
												// 	this._literals.labelInfoCheckbox
												// }
												onCheckboxChange={() => this._handleCheckInstruction(event)}
											></scib-ui-checkbox>
										</div>
										{this._selectedItems.length > 0 && !this.isMobile ? (
											<div class="cdk-ssis__group">
												<scib-ui-list
													label={this._literals.productsListLabel}
													tooltip={this._literals.tooltip}
													hiddenLabel={true}
													items={this._selectedItems}
													onUpdateItems={() => this._handleItemsRemove.bind(this)(event)}
												></scib-ui-list>
											</div>
										) : (
											''
										)}
										<div class="cdk-ssis__group">
											<scib-ui-input
												label={this._literals.swiftCodeLabel}
												placeholder={this._literals.swiftCodePlaceholder}
												required={true}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'swiftCodeCorresponsal')}
												value={this._product.bicCorresponsal}
											></scib-ui-input>
											<scib-ui-input
												label={this._literals.accountLabel}
												placeholder={this._literals.accountPlaceholder}
												required={true}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'accountCorresponsal')}
												value={this._product.cuentaCorresponsal}
											></scib-ui-input>
											<scib-ui-input
												label={this._literals.swiftIntermediaryLabel}
												placeholder={this._literals.swiftIntermediaryPlaceholder}
												required={false}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'swiftIntermediary')}
												value={this._product.bicIntermediario1}
											></scib-ui-input>
										</div>
										<div class="cdk-ssis__group">
											<scib-ui-input
												label={this._literals.accountIntermediaryLabel}
												placeholder={this._literals.accountIntermediaryPlaceholder}
												required={false}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'accountIntermediary')}
												value={this._product.cuentaIntermediario1}
											></scib-ui-input>
											<scib-ui-input
												label={this._literals.swiftIntermediary2Label}
												placeholder={this._literals.swiftIntermediary2Placeholder}
												required={false}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'swiftIntermediary2')}
												value={this._product.bicIntermediario2}
											></scib-ui-input>
											<scib-ui-input
												label={this._literals.accountIntermediary2Label}
												placeholder={this._literals.accountIntermediary2Placeholder}
												required={false}
												multiselect={false}
												onEventChange={() => this._handleInput(event, 'accountIntermediary2')}
												value={this._product.cuentaIntermediario2}
											></scib-ui-input>
										</div>
										<div class="cdk-ssis__group">
											<scib-ui-date-picker
												id="date-value"
												full
												onSelectValue={() => this._handleDate(event)}
												label={this._literals.valueDateLabel}
												// labelInfo={this._literals.labelInfoDate}
												header={this._literals.valueDatePlaceholder}
												disabledselector={false}
												value={this._product.fechaEfectiva ? this.formatDateValue(this._product.fechaEfectiva) : null}
											></scib-ui-date-picker>
											{/* Radio button comentado al no hacer nada */}
											{/* <div class="cdk-ssis__radio">
											<span class="cdk-ssis__radio-label">{this._literals.existingLabel}</span>
											<div class="cdk-ssis__radio-elements">
												<label class="cdk-ssis__radio-container">
													{this._literals.existingOpt1Label}
													<input
														class="cdk-ssis__radio-input"
														type="radio"
														checked={true}
														name="radio"
														onClick={() => this._handleExistingOption("maintain")}
													/>
													<span class="cdk-ssis__radio-checkmark"></span>
												</label>
												<label class="cdk-ssis__radio-container">
													{this._literals.existingOpt2Label}
													<input
														class="cdk-ssis__radio-input"
														type="radio"
														name="radio"
														onClick={() => this._handleExistingOption("overwrite")}
													/>
													<span class="cdk-ssis__radio-checkmark"></span>
												</label>
											</div>
										</div> */}
										</div>
										<scib-ui-textarea
											label-txtarea={this._literals.textAreaLabel}
											id-txtarea="textArea"
											name-txtarea="textArea"
											placeholder-txtarea={this._literals.textAreaPlaceholder}
											onEventChange={() => this._handleTextarea(event)}
											required={false}
										></scib-ui-textarea>
									</div>
								</fieldset>
							</form>
							<footer class="cdk-ssis__footer">
								<span class="cdk-ssis__notice">{this._literals.notice}</span>
								<div class="cdk-ssis__buttons">
									<scib-ui-button secondary type="submit" onEventClick={() => this._handleCancelModal()}>
										{this._literals.cancelBtn}
									</scib-ui-button>
									<scib-ui-button primary type="submit" disabled={this.disabledSubmit} onEventClick={() => this._handleSave()}>
										{this._literals.submitBtn}
									</scib-ui-button>
								</div>
							</footer>
						</section>
					) : (
						<section class="cdk-ssis cdk-ssis--sheet">
							<header class="cdk-ssis__header">
								<h3 class="cdk-ssis__title">{this._literals?.mainTitleDetail}</h3>
								<div class="cdk-ssis__index">
									<span class="cdk-ssis__legend">
										{this._literals?.instructionID + this._product?.id}
										<span class="cdk-ssis__legend--status">{this._literals?.instructionStatus + this._product?.status}</span>
									</span>
									{this.canEditDetail ? (
										<scib-ui-button type="button" icon="icon-edit-pencil" icon-left link disableMinWidth nobackground onEventClick={() => this._handleEditForm()}>
											{this._literals?.editBtn}
										</scib-ui-button>
									) : (
										''
									)}
								</div>
							</header>
							<ul class="cdk-ssis__listing">
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.productLabel}
									</label>
									<span class="cdk-ssis__data">{this._product?.product ? this.initialProducts : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.currrencyLabel}
									</label>
									<span class="cdk-ssis__data">{this._product?.currency ? this._product?.currency : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.primaryInstructionLabel}
									</label>
									<span class="cdk-ssis__data">{this.getPrimaryInstructionLabel()}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.swiftCodeLabel}
									</label>
									<span class="cdk-ssis__data">{this._product?.bicCorresponsal ? this._product?.bicCorresponsal : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.accountLabel}
									</label>
									<span class="cdk-ssis__data">{this._product?.cuentaCorresponsal ? this._product?.cuentaCorresponsal : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.swiftIntermediaryLabel}
									</label>
									<span class="cdk-ssis__data">{this._product?.bicIntermediario1 ? this._product?.bicIntermediario1 : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.accountIntermediaryLabel}
									</label>
									<span class="cdk-ssis__data">{this._product?.cuentaIntermediario1 ? this._product?.cuentaIntermediario1 : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.swiftIntermediary2Label}
									</label>
									<span class="cdk-ssis__data">{this._product?.bicIntermediario2 ? this._product?.bicIntermediario2 : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.accountIntermediary2Label}
									</label>
									<span class="cdk-ssis__data">{this._product?.cuentaIntermediario2 ? this._product?.cuentaIntermediario2 : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.valueDateLabel}
									</label>
									<span class="cdk-ssis__data">{this._product?.fechaEfectiva ? this._product?.fechaEfectiva : '-'}</span>
								</li>
								<li class="cdk-ssis__item">
									<label class="cdk-ssis__label" htmlFor="">
										{this._literals?.textAreaLabel}
									</label>
									<p class="cdk-ssis__data cdk-ssis__data--block">{this._product?.comments ? this._product?.comments : '-'}</p>
								</li>
							</ul>
						</section>
					)}
				</scib-ui-dialog>
			</Host>
		);
	}

	private getPrimaryInstructionLabel() {
		return this._product?.primaryInstruction ? 'Yes' : 'No';
	}
}
