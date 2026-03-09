import Sortable from '@shopify/draggable/lib/sortable';
import { Component, Event, EventEmitter, h, Host, Method, Prop, State, Watch } from '@stencil/core';
import { cloneDeep, get } from 'lodash';
import { generateRandomId } from '../../../../utils/public_api';
import { IUIInputOption } from '../../../ui/ui-input/models/ui-input.model';
import {
	QualifiedLabels,
	QualifiedOptions,
	RecipientOptions,
	RecipientsData,
	SignatureTypes,
	SignatureTypesEnum
} from '../../cdk-signature-modal/models/cdk-signature-modal.model';
import {
	CodeValue,
	InputsToValidate,
	Languages,
	Literals,
	RecipientListWithLabel,
	RecipientRoles,
	RecipientTypes,
	ResetDataInput,
	SignatureOptions,
	SignatureOptionsId,
	SignatureTypesIdEnum,
	SignerRecipient,
	Subsidiary,
	Template
} from '../models/cdk-signature-modal-configuration.model';

/**
 * Component description
 */
@Component({
	tag: 'scib-cdk-signature-modal-configuration',
	styleUrl: 'cdk-signature-modal-configuration.scss',
	shadow: false,
	scoped: false
})
export class CDKSignatureModalConfiguration {
	$draggableList!: HTMLElement;
	$draggableList2!: HTMLElement;
	private _selectedSignatureValue: number;
	private _hasReordered: boolean = false;
	private _draggableList2: Sortable;
	private _orderRecipientsEnabled: boolean = true;
	private _masiveLoadEnabled: boolean = false;
	private _expireDaysEnabled: boolean = true;
	private _changeTypeRadioRecipient: boolean = false;
	private noResult: boolean = false;
	private mailRegExp: RegExp = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
	private optionReceivedWhenInputChanged: IUIInputOption;
	private _qualifiedOptions: QualifiedOptions[] = [];

	@Prop() downloadTemplateUrl: string;
	@Prop() minValueExpireDays: number = 1;
	@Prop() maxValueExpireDays: number = 999;
	@Prop() mailRegExpString: string = '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,4}$';
	@Prop({ mutable: true }) validateDaysExpire: boolean;
	@Prop({ mutable: true }) validateEmailRegExp: boolean;
	@Prop({ mutable: true }) isAsignedTemplate: boolean = false;
	@Prop() asignedTemplate: Template;
	@Prop() recipentNameOptions: IUIInputOption[] = [];
	@Prop() recipentEmailOptions: IUIInputOption[] = [];

	@Prop() modalOpen: boolean;

	@Prop({ mutable: true }) emailInvalid: boolean;
	/* Entorno de desarrollo - local, dev, pre, pro */
	@Prop() env: string;
	@Prop() loadOnlyTemplates: boolean;

	@Prop() recipientsOrderCheck: boolean = false;
	@Watch('recipientsOrderCheck') parseRecipientsOrderCheck(newVal: boolean) {
		this._recipientsOrderCheck = newVal;
	}
	@State() _recipientsOrderCheck: boolean;

	@State() _inputTelephoneDirty: Array<boolean> = [];
	@State() _defaultPhonePrefix: string = '';
	@State() _filteredRecipentNameOptions: IUIInputOption[] = [];
	@State() _filteredRecipentEmailOptions: IUIInputOption[] = [];
	@State() _radioRecipientTypeCC: RecipientListWithLabel[];
	@State() _invalidEmail: boolean[] = [];
	@State() _orderedRecipientsList: SignerRecipient[] = [];
	@State() _activeMasiveLoad: boolean = false;
	@State() _templateSignatureType: string | number;
	@State() _accessCodeValuesTemplate: CodeValue[];

	@Prop() optionalConfig: boolean[];
	@Watch('optionalConfig') parseOptionalConfig(newVal: boolean[]) {
		this._optionalConfig = newVal;
	}
	@State() _optionalConfig: boolean[] = [];

	@Prop() docAccessCode: boolean[];
	@Watch('docAccessCode') parseDocAccessCode(newVal: boolean[]) {
		this._docAccessCode = newVal;
	}
	@State() _docAccessCode: boolean[] = [];

	@Prop() radioSignatureTypes: SignatureTypes[];
	@Watch('radioSignatureTypes') parseRadioSignatureTypes(newVal: SignatureTypes[]) {
		this._radioSignatureTypes = newVal;
	}
	@State() _radioSignatureTypes: SignatureTypes[];

	@Prop() recipientsList: SignerRecipient[];
	@Watch('recipientsList') parseRecipientsList(newVal: SignerRecipient[]) {
		if (newVal) {
			this._recipientsList = newVal;
			if (this.isAsignedTemplate && this._loadTemplateData) {
				this._accessCodeValuesTemplate = [];
				this._templateSignatureType = this._selectedSignatureType.id;
				this._recipientsList.map((recipient) => {
					this._accessCodeValuesTemplate.push({
						id: recipient.id,
						cardId: recipient.cardId,
						accessCode: recipient.accessCode
					});
				});
				this._loadTemplateData = false;
			}
		}
	}
	@State() _recipientsList: SignerRecipient[];

	@Prop() selectedSignatureType: SignatureTypes;
	@Watch('selectedSignatureType') parseSelectedSignatureType(newVal: SignatureTypes) {
		this._selectedSignatureType = newVal;
	}
	@State() _selectedSignatureType: SignatureTypes;

	@Prop() recipentsOptions: RecipientOptions[];
	@Watch('recipentsOptions') setRecipentsOptions(options: RecipientOptions[]) {
		this.recipentsOptions = options;
	}

	@Prop() language: Languages;
	@Watch('language') setLang(language: Languages) {
		this._language = language;
		this.parseRadioRecipientTypes();
		if (this._recipientsList && this._recipientsList.length > 0) {
			this._recipientsList.forEach((_, idx) => {
				this._recipientsList[idx]['typeLabel'] = this._radioRecipientTypes[0]['label'];
				this._recipientsList[idx]['options'] = JSON.parse(JSON.stringify(this._radioRecipientTypes));
			}, this);
		}
	}
	@State() _language: Languages;

	@Prop() literals: Literals | any;
	@Watch('literals') parseLiterals(literals: Literals | any) {
		this._literals = literals;
	}
	@State() _literals: Literals | any;

	@Prop() validation: boolean;
	@Watch('validation') parseValidation(validation: boolean) {
		this._validation = validation;
	}
	@State() _validation: boolean;

	/** Recipient types options */
	@Prop() radioRecipientTypes: RecipientListWithLabel[];
	@Watch('radioRecipientTypes') parseRadioRecipientTypes(newData?: RecipientListWithLabel[]) {
		this._radioRecipientTypes = newData;
	}
	@State() _radioRecipientTypes: RecipientListWithLabel[];

	@Prop() selectedSignatureTypeIndex: number;
	@Watch('selectedSignatureTypeIndex') parseSelectedSignatureTypeIndex(newData: number) {
		if (newData === -1) newData = 0;
		this._selectedSignatureTypeIndex = newData;
	}
	@State() _selectedSignatureTypeIndex: number;

	@Prop() daysToExpireSiganture: string;
	@Watch('daysToExpireSiganture') parseDaysToExpireSiganture(newData: string) {
		this._daysToExpireSiganture = newData;
	}
	@State() _daysToExpireSiganture: string;

	@Prop() glcsOptions: Subsidiary[];
	@Watch('glcsOptions') parseGlcsOptions(newData: Subsidiary[]) {
		this._glcsOptions = newData;
	}
	@State() _glcsOptions: Subsidiary[];

	@Prop() glcsInputValues: string[];
	/*@Watch('glcsInputValue') parseGlcsInputValue(newData: string[]) {
		this._glcsInputValues = [];
		this._glcsInputValues = newData;
	}
	@State() _glcsInputValues: string[];*/

	@Prop() reset: boolean = false;
	@Watch('reset') parseResetStep(newData: boolean) {
		if (newData) {
			this._invalidEmail = new Array(this._recipientsList.length || 0).fill(false);
			this._optionalConfig = new Array(this._recipientsList.length || 0).fill(false);
			this._docAccessCode = new Array(this._recipientsList.length || 0).fill(false);
		}
	}

	@Prop({ mutable: true }) loadTemplateData: boolean = true;
	@Watch('loadTemplateData') parseLoadTemplateData(newVal: boolean) {
		this._loadTemplateData = newVal;
	}
	@State() _loadTemplateData: boolean;
	/**
	 *
	 */
	@Event() validationRequiredEvent: EventEmitter<InputsToValidate>;
	@Event() configurationDataEvent: EventEmitter<RecipientsData>;
	@Event() resetInputValue: EventEmitter<ResetDataInput>;

	/**
	 * Method to set recipientList on cdk-signature-modal when go step back
	 */
	@Method() async sendData() {
		const resumeData: RecipientsData = {
			recipentNameOptions: this.recipentNameOptions,
			recipentEmailOptions: this.recipentEmailOptions,
			recipientsOrderCheck: this._recipientsOrderCheck,
			emailInvalid: this.emailInvalid,
			selectedSignatureType: this._selectedSignatureType,
			recipentsOptions: this.recipentsOptions,
			radioRecipientTypes: this._radioRecipientTypes,
			radioSignatureTypes: this._radioSignatureTypes,
			recipientsList: this._recipientsList,
			daysToExpireSiganture: this._daysToExpireSiganture,
			selectedSignatureTypeIndex: this._selectedSignatureTypeIndex,
			selectedSignatureValue: this._selectedSignatureValue,
			loadTemplateData: this._loadTemplateData
		};
		this.configurationDataEvent.emit(resumeData);
	}

	/** Life cycle executed before the first render */
	componentWillLoad() {
		this.parseValidation(this.validation);
		this.parseLiterals(this.literals);
		this.setLang(this.language);
		this.parseRadioRecipientTypes(this.radioRecipientTypes);
		this._recipientsList = [
			{
				id: 0,
				name: '',
				email: '',
				typeId: this._radioRecipientTypes[0]?.id,
				type: this._radioRecipientTypes[0]?.value,
				typeLabel: this._radioRecipientTypes[0]?.label,
				showForm: true,
				options: this._radioRecipientTypes,
				glcs: null,
				cardId: generateRandomId()
			}
		];
		//this._glcsInputValues = new Array(this._recipientsList.length || 0).fill(null);
		this._glcsOptions = [];
		this.parseRecipientsList(this.recipientsList);
		this.parseRadioSignatureTypes(this.radioSignatureTypes);
		this.parseSelectedSignatureType(this.selectedSignatureType);
		this.parseSelectedSignatureTypeIndex(this.selectedSignatureTypeIndex);
		this.parseDaysToExpireSiganture(this.daysToExpireSiganture);
		this.parseGlcsOptions(this.glcsOptions);
		this.parseRecipientsOrderCheck(this.recipientsOrderCheck);
		//this.parseGlcsInputValue(this.glcsInputValues);
		this.parseResetStep(this.reset);
		this.parseOptionalConfig(this.optionalConfig);
		this.parseDocAccessCode(this.docAccessCode);
		this.parseLoadTemplateData(this.loadTemplateData);
		this.validateDaysExpire = false;
		this.validateEmailRegExp = false;
		this._invalidEmail = new Array(this._recipientsList.length || 0).fill(false);
		this._optionalConfig = new Array(this._recipientsList.length || 0).fill(false);
		this._docAccessCode = new Array(this._recipientsList.length || 0).fill(false);
		this._qualifiedOptions = [
			{
				id: SignatureTypesIdEnum.QUALIFIED_ID_NOW,
				value: SignatureTypesEnum.QUALIFIED_ID_NOW,
				label: QualifiedLabels.IDNOW
			},
			{
				id: SignatureTypesIdEnum.QUALIFIED_SIGNER_HELD_MEXICO,
				value: SignatureTypesEnum.QUALIFIED_SIGNER_HELD_MEXICO,
				label: QualifiedLabels.SIGNERHELDMEXICO
			}
		];
	}

	/** Life cycle executed after each render update */
	async componentDidUpdate() {
		if (!this._recipientsOrderCheck) {
			if (this._draggableList2) {
				this._draggableList2.destroy();
			}
		}

		if (this._orderRecipientsEnabled && this._recipientsOrderCheck && this._recipientsList.length > 0) {
			if (this._draggableList2) {
				this._draggableList2.destroy();
			}
			this._draggableList2 = new Sortable(this.$draggableList2, {
				distance: 20,
				mirror: {
					constrainDimensions: true
				}
			});
			this._draggableList2.on('sortable:stop', (ev) => {
				const duplicated: SignerRecipient[] = cloneDeep(this._recipientsList);
				const item: string = ev.data.dragEvent.data.source.id.split('-')[1];

				this._orderedRecipientsList = cloneDeep(this._moveArrayPosition(duplicated, +item, ev.data.newIndex));
				this._resetAllDataOrder(+item, ev.data.newIndex);
				this._hasReordered = true;
			});
		}

		this._validationRequired();
	}

	componentDidRender() {
		if (this._changeTypeRadioRecipient) {
			const recipientArray: SignerRecipient[] = [...this._recipientsList];
			recipientArray.map((recipient, index) => {
				if (recipient.typeId === RecipientTypes.SIGNER) {
					if (!recipient.glcs) {
						const idInput: string = 'glcs-value' + index;
						this.resetInputValue.emit({ reset: true, id: idInput });
					}
				}
			});
			this._recipientsList = recipientArray;
			this._changeTypeRadioRecipient = false;
		}
		if (this._hasReordered) {
			this._recipientsList = cloneDeep(this._orderedRecipientsList);

			this._hasReordered = false;
		}
	}

	_moveArrayPosition(arr: SignerRecipient[], old_index: number, new_index: number): SignerRecipient[] {
		const elem: SignerRecipient = arr[old_index];
		arr.splice(old_index, 1);
		arr.splice(new_index, 0, elem);
		arr.forEach((elem, index) => {
			elem.id = index;
			elem.options = elem.options.map((item) => {
				if (
					(item.id === RecipientTypes.SIGNER && elem.typeId === RecipientTypes.SIGNER) ||
					(item.id === RecipientTypes.CC && elem.typeId === RecipientTypes.CC)
				) {
					item.isChecked = true;
				} else {
					item.isChecked = false;
				}
				return item;
			});
		});
		return arr;
	}
	_resetAllDataOrder(old_index: number, new_index: number): void {
		if (this._selectedSignatureType?.id === 4) {
			const optionalConfig: boolean[] = this._optionalConfig;
			const optionConfig: boolean = optionalConfig[old_index];
			optionalConfig.splice(old_index, 1);
			optionalConfig.splice(new_index, 0, optionConfig);
			this._optionalConfig = optionalConfig;
		}

		const docAccessCode: boolean[] = this._docAccessCode;
		const accessCode: boolean = docAccessCode[old_index];
		docAccessCode.splice(old_index, 1);
		docAccessCode.splice(new_index, 0, accessCode);
		this._docAccessCode = docAccessCode;

		if (this.isAsignedTemplate) {
			const accessCodeValuesTemplate: CodeValue[] = this._accessCodeValuesTemplate;
			const accessCodeValue: CodeValue = accessCodeValuesTemplate[old_index];
			accessCodeValuesTemplate.splice(old_index, 1);
			accessCodeValuesTemplate.splice(new_index, 0, accessCodeValue);
			accessCodeValuesTemplate.map((elem, index) => {
				elem.id = this._orderedRecipientsList[index].id;
				elem.cardId = this._orderedRecipientsList[index].cardId;
			});
			this._accessCodeValuesTemplate = accessCodeValuesTemplate;
		}
	}

	_handleRadioRecipient(ev, index): void {
		this._changeTypeRadioRecipient = true;
		const recipientArray: SignerRecipient[] = [...this._recipientsList];
		recipientArray.map((recipient, r_i) => {
			if (r_i === index) {
				recipient.typeId = ev.detail.id;
				recipient.type = ev.detail.value;
				recipient.typeLabel =
					recipient.typeLabel === 'Only CC' ||
					recipient.typeLabel === 'Signer' ||
					recipient.typeLabel === 'Firmante' ||
					recipient.typeLabel === 'Solo CC'
						? ev.detail.label
						: recipient.typeLabel;
				/*if (ev.detail.id === RecipientTypes.CC && (recipient.glcs || this._glcsInputValues[index])) {
					recipient.glcs = null;
					if (this._glcsInputValues?.length) {
						this._glcsInputValues[index] = null;
					}
					this._glcsOptions = [];
				}*/
			}
		});
		this._recipientsList = recipientArray;
	}

	async _handleGlcsInputChange(ev: CustomEvent, index: number) {
		const name: string = ev.detail;
		const listRecipient: SignerRecipient[] = [...this._recipientsList];
		listRecipient[index].glcs = name;
		/*this._glcsOptions = [];
		this._glcsInputValues[index] = ev.detail;
		if (name) {
			const listRecipient = [...this._recipientsList];
			listRecipient[index].glcs = null;
			this._recipientsList = listRecipient;
			if (name.length >= 3) {
				await GlcsService.getGlcsList(this.env, name)
					.then(res => {
						this._glcsOptions = [...res];
						if (!res.length) {
							this._glcsOptions = [];
						}
						this.noResult = res.length ? false : true;
					})
					.catch(err => {
						console.error(err);
						this.noResult = true;
					});
			}
			this._validationRequired();
		}*/
	}

	_autocompleteSelectedOp(type: string, option: IUIInputOption, index: number): void {
		const listRecipient: SignerRecipient[] = [...this._recipientsList];

		switch (type) {
			/*case 'glcs':
				listRecipient[index].glcs = option;
				break;*/
			case 'name':
			case 'email':
				this._handleSelectAutocompleValue(option, index);
				break;
			default:
				break;
		}
		this._recipientsList = listRecipient;
		this._validationRequired();
	}

	_handleInputName({ detail }: CustomEvent, index: number, htmlElem?: string): void {
		this._filterNameEmail('name', detail, htmlElem);
		const listRecipient: SignerRecipient[] = [...this._recipientsList];
		listRecipient[index].name = detail;
		this._recipientsList = listRecipient;
		this._validationRequired();
	}

	_handleDropdownOptions({ detail }: CustomEvent, index: number): void {
		if (!detail) return;
		const listRecipient: SignerRecipient[] = [...this._recipientsList];

		let selectedOption: number = detail == 'sms' ? SignatureOptionsId.SMS : SignatureOptionsId.OTP;

		if (detail == 'certificate') {
			selectedOption = SignatureOptionsId.CERTIFICATED;
			listRecipient[index].sms = null;
			listRecipient[index]['oneTimePassword'] = null;
		} else {
			if (selectedOption === SignatureOptionsId.SMS) {
				listRecipient[index]['oneTimePassword'] = null;
			} else {
				listRecipient[index].sms = null;
			}
		}

		listRecipient[index].sms = listRecipient[index].sms ? listRecipient[index].sms : null;
		listRecipient[index].selectedOption = selectedOption;
		this._recipientsList = listRecipient;
	}

	_handleSelectAutocompleValue(ev: IUIInputOption, index: number): void {
		this.optionReceivedWhenInputChanged = ev;
		if (ev) {
			const listRecipient: SignerRecipient[] = [...this._recipientsList];
			const recipentOption: IUIInputOption = this.recipentNameOptions.find((option) => {
				if (
					!this.optionReceivedWhenInputChanged.name.includes('@') &&
					option.name === this.optionReceivedWhenInputChanged.name &&
					option.secondary === this.optionReceivedWhenInputChanged.secondary
				) {
					return option;
				} else if (
					this.optionReceivedWhenInputChanged.name.includes('@') &&
					option.secondary === this.optionReceivedWhenInputChanged.name &&
					option.name === this.optionReceivedWhenInputChanged.secondary
				) {
					return option;
				}
			});
			listRecipient[index].name = recipentOption.name;
			listRecipient[index].email = recipentOption.secondary;

			if (listRecipient[index].name !== undefined && listRecipient[index].email !== undefined) {
				this.setRecipentsInputsNameEmailInfo(index, listRecipient[index].name, listRecipient[index].email);
				this._recipientsList = [...listRecipient];
				this._recipientsList.map((recipient) => {
					if (recipient.email.match(this.mailRegExp)) {
						recipient.isValid = true;
						this.validateEmailRegExp = false;
					} else {
						recipient.isValid = false;
						this.validateEmailRegExp = true;
					}
				});

				this._validationRequired();
			}
			this._invalidEmail[index] = false;
		}
	}

	private setRecipentsInputsNameEmailInfo(input_index: number, input_name_value: string, input_email_value: string): void {
		const input_element_name: HTMLInputElement = document.getElementsByName(
			'recipient-content-input-name' + input_index + '-search-input'
		)[0] as HTMLInputElement;
		const input_element_email: HTMLInputElement = document.getElementsByName(
			'recipient-content-input-email' + input_index + '-search-input'
		)[0] as HTMLInputElement;
		if (input_element_name !== undefined && input_element_email !== undefined) {
			input_element_name.value = input_name_value;
			input_element_email.value = input_email_value;
		}
	}

	private _filterNameEmail(type: string, value: string, elem: string): void {
		if (type === 'name') {
			this._filteredRecipentNameOptions = [];
			this._filteredRecipentNameOptions = this.recipentNameOptions.filter((elem) => elem.name.toLowerCase().includes(value.toLowerCase()));
		} else {
			this._filteredRecipentEmailOptions = [];
			this._filteredRecipentEmailOptions = this.recipentEmailOptions.filter((elem) => elem.name.toLowerCase().includes(value.toLowerCase()));
		}
		this._loadedList(elem);
		this.noResult = this._filteredRecipentNameOptions.length || this._filteredRecipentEmailOptions.length ? false : true;
	}

	_handleAddRecipient(): void {
		const index: number = this._recipientsList.length;
		const listRecipient: SignerRecipient[] = [...this._recipientsList];
		const clonedRecipient: SignerRecipient = this._cloneObj(listRecipient[0]);
		clonedRecipient.id = index;
		clonedRecipient.typeId = this._radioRecipientTypes[0].id;
		clonedRecipient.type = this._radioRecipientTypes[0].value;
		clonedRecipient.typeLabel = this._radioRecipientTypes[0].label;
		clonedRecipient.options = this._radioRecipientTypes;
		clonedRecipient.sms = null;
		clonedRecipient.selectedOption = SignatureOptionsId.SMS;
		clonedRecipient.cardId = generateRandomId();
		clonedRecipient.showForm = true;
		listRecipient.push(clonedRecipient);
		this._recipientsList = listRecipient;
		this._docAccessCode.push(false);
		this._optionalConfig.push(false);
		if (this.isAsignedTemplate) {
			this._accessCodeValuesTemplate.push({
				id: clonedRecipient.id,
				cardId: clonedRecipient.cardId,
				accessCode: null
			});
		}
		//this._glcsInputValues.push(null);
		this._hideAccordionRecipient(index);
		this._validationRequired();
		clonedRecipient.isValid = true;
	}

	_hideAccordionRecipient(newRecipientIndex: number): void {
		this._recipientsList.map((recipient) => {
			if (recipient.id !== newRecipientIndex) {
				this._accordionRecipient(newRecipientIndex, true, true);
			}
		});
	}

	_cloneObj(obj) {
		if (null == obj || 'object' != typeof obj) {
			return obj;
		}
		if (obj.isQualifiedIDNow) delete obj.isQualifiedIDNow;
		const copy: Object = obj.constructor();
		for (const attr in obj) {
			if (obj.hasOwnProperty(attr)) {
				const t = typeof obj[attr];
				copy[attr] = t == 'object' ? this._cloneObj(obj[attr]) : { string: '', number: 0, boolean: false }[t];
			}
		}
		return copy;
	}

	_handleInputEmail({ detail }: CustomEvent, index: number, htmlElem?: string): void {
		this._filterNameEmail('email', detail, htmlElem);
		if (index !== -1) {
			const listRecipient: SignerRecipient[] = [...this._recipientsList];
			listRecipient[index].email = detail;
			this._recipientsList = listRecipient;
			this._recipientsList.map((recipient) => {
				if (recipient.email) {
					if (recipient.email.match(this.mailRegExp)) {
						recipient.isValid = true;
						this.validateEmailRegExp = false;
						this._invalidEmail[index] = false;
					} else {
						recipient.isValid = false;
						this.validateEmailRegExp = true;
						this._invalidEmail[index] = true;
					}
				} else {
					recipient.isValid = false;
					this._invalidEmail[index] = false;
				}
			});
			this._validationRequired();
		}
	}

	_handleInputOptions({ detail }: CustomEvent, index: number): void {
		const listRecipient: SignerRecipient[] = [...this._recipientsList];

		let singnType: string;

		if (listRecipient[index].selectedOption == SignatureOptionsId.SMS) {
			singnType = SignatureOptions.SMS;
		} else {
			singnType = SignatureOptions.OTP;
		}

		listRecipient[index][singnType] = detail;
		this._recipientsList = listRecipient;
	}

	_handleDeleteRecipient(index: number): void {
		//const glcsInputValues = [...this._glcsInputValues];
		const listRecipient: SignerRecipient[] = [...this._recipientsList];
		const invalidEmail: boolean[] = [...this._invalidEmail];
		const docAccessCode: boolean[] = [...this._docAccessCode];
		const optionalConfig: boolean[] = this._optionalConfig;

		listRecipient.splice(index, 1);
		//glcsInputValues.splice(index, 1);
		invalidEmail.splice(index, 1);
		docAccessCode.splice(index, 1);
		optionalConfig.splice(index, 1);

		this._recipientsList = listRecipient;
		//this._glcsInputValues = glcsInputValues;
		this._invalidEmail = invalidEmail;
		this._docAccessCode = docAccessCode;
		this._optionalConfig = optionalConfig;

		if (this.isAsignedTemplate) {
			const accessCodeValuesTemplate: CodeValue[] = this._accessCodeValuesTemplate;
			accessCodeValuesTemplate.splice(index, 1);
			this._accessCodeValuesTemplate = accessCodeValuesTemplate;
		}

		this._validationRequired();
	}

	private _validationRequired(): void {
		this.validationRequiredEvent.emit({
			signatureType: this._selectedSignatureType,
			recipientList: this._recipientsList,
			//glcsList: this._glcsInputValues,
			daysToEspire: this._daysToExpireSiganture,
			docAccessCode: this._docAccessCode
		});
	}

	_handleCheckRecipientOrder(): void {
		this._recipientsOrderCheck = !this._recipientsOrderCheck;
	}

	_accordionRecipient(index: number, all: boolean, forceOpen?: boolean): void {
		const recipientArray: SignerRecipient[] = [...this._recipientsList];
		const element: HTMLElement = document.getElementById('recipient-content-' + index);
		if (forceOpen) {
			recipientArray[index].showForm = true;
			if (element && element.style) {
				element.style.display = 'block';
			}
		} else if (all) {
			recipientArray[index].showForm = false;
			element.style.display = 'none';
		} else {
			if (element.style.display === 'none') {
				recipientArray[index].showForm = true;
				element.style.display = 'block';
			} else {
				recipientArray[index].showForm = false;
				element.style.display = 'none';
			}
		}
		this._recipientsList = recipientArray;
	}

	_setDirtyInputTelephoneSmsValidation(index: number): void {
		if (this._inputTelephoneDirty && index < this._inputTelephoneDirty.length) {
			this._inputTelephoneDirty[index] = true;
		} else {
			for (let i = 0; i < index; i++) {
				if (this._inputTelephoneDirty[i] === undefined) {
					this._inputTelephoneDirty[i] = false;
				}
			}
			this._inputTelephoneDirty[index] = true;
		}
	}

	_checkInputTelephoneSmsValidationIsDirty(index: number): boolean {
		return !!(this._inputTelephoneDirty && this._inputTelephoneDirty[index]);
	}

	private _loadedList(id: string): void {
		const element = document.getElementById(id) as HTMLScibMoleculesAutocompleteTextFieldElement;
		element.loaded();
	}

	private _setQualifiedOption({ detail }: CustomEvent, index: number): void {
		const recipients: SignerRecipient[] = [...this._recipientsList];
		recipients[index].qualifiedType = detail;
		this._recipientsList = [...recipients];
	}

	_handleInputDaysExpire({ detail }: CustomEvent): void {
		this._daysToExpireSiganture = detail;

		if (parseInt(this._daysToExpireSiganture) >= this.minValueExpireDays && parseInt(this._daysToExpireSiganture) <= this.maxValueExpireDays) {
			this.validateDaysExpire = false;
		} else {
			this.validateDaysExpire = true;
		}
	}

	_handleMasiveLoad(): void {
		this._activeMasiveLoad = !this._activeMasiveLoad;
	}

	_handleRadioSignature({ detail }: CustomEvent): void {
		this._selectedSignatureType = detail;
		this._selectedSignatureValue = +detail?.id;
		this._recipientsList.map((recipient, index) => {
			if (!recipient.selectedOption) {
				recipient.selectedOption = SignatureOptionsId.SMS;
			}
			if (!recipient.selectedOption && !this.isAsignedTemplate) {
				recipient['oneTimePassword'] = null;
				recipient['sms'] = null;
			}

			if (this._selectedSignatureValue !== SignatureTypesIdEnum.ADEVANCED) {
				recipient['oneTimePassword'] = null;
				recipient['sms'] = null;
			}
			if (this.isAsignedTemplate) {
				if (this._templateSignatureType === this._selectedSignatureType.id) {
					const code: CodeValue = this._accessCodeValuesTemplate.find(
						(elem) => elem.id === recipient.id || elem.cardId === recipient.cardId
					);
					recipient.accessCode = code ? code.accessCode : null;
					this._docAccessCode[index] = code?.accessCode || this._docAccessCode[index] ? true : false;
				} else {
					if (recipient.accessCode) {
						recipient.accessCode = null;
					}
				}
			} else {
				if (recipient.accessCode) {
					recipient.accessCode = null;
				}
			}
		});
		if (!this.isAsignedTemplate || (this.isAsignedTemplate && this._templateSignatureType !== this._selectedSignatureType.id)) {
			this._docAccessCode = new Array(this._recipientsList.length || 0).fill(false);
		}
		this._recipientsList = [...this._recipientsList];
		this._docAccessCode = [...this._docAccessCode];
	}

	_changeOptionalConfig(index: number) {
		const checkValues: boolean[] = [...this._optionalConfig];
		const recipients: SignerRecipient[] = [...this._recipientsList];
		checkValues[index] = !checkValues[index];
		if (checkValues[index]) {
			recipients[index].qualifiedType = SignatureTypesEnum.QUALIFIED_ID_NOW;
		} else {
			recipients[index].qualifiedType = SignatureTypesEnum.QUALIFIED;
		}
		this._optionalConfig = [...checkValues];
		this._recipientsList = [...recipients];
	}

	_addDocAccessCode(index: number) {
		const checkValues: boolean[] = [...this._docAccessCode];
		const recipients: SignerRecipient[] = [...this._recipientsList];
		checkValues[index] = !checkValues[index];
		if (!checkValues[index]) {
			recipients[index].accessCode = null;
		}
		this._docAccessCode = [...checkValues];
		this._recipientsList = [...recipients];
		this._validationRequired();
	}

	_handleInputDocAccessCode({ detail }: CustomEvent, index: number) {
		const recipients: SignerRecipient[] = [...this._recipientsList];
		recipients[index].accessCode = detail;
		this._recipientsList = [...recipients];
	}

	private showRecipientsContainer() {
		return (
			!this.loadOnlyTemplates ||
			(Array.isArray(this._recipientsList) &&
				this._recipientsList.some((recipient) => recipient.roleName && recipient.roleName.toLowerCase().includes(RecipientRoles.EMPLOYEE)))
		);
	}

	render() {
		return (
			<Host>
				<h2 class="cdk-signature-modal__title">{this._literals.dialog.configurationTitle}</h2>
				<div
					class={{
						'cdk-signature-modal__signature-actions': true,
						'cdk-signature-modal__signature-actions--only': !this._expireDaysEnabled
					}}
				>
					<div class="cdk-signature-modal__signature-radio">
						<label class="cdk-signature-modal__signature-label" htmlFor="signature-type">
							{this._literals.dialog.signatureTypesLabel}
						</label>
						{(this._radioSignatureTypes || []).length > 0 && this.modalOpen && (
							<scib-ui-radio-button
								tooltipText={this._literals.dialog.signatureTypesTooltipApp}
								id="signature-type"
								group-name="signature-type"
								active-button-index={this._selectedSignatureTypeIndex}
								options={JSON.stringify(this._radioSignatureTypes)}
								onEventRadioButtonChange={(ev) => this._handleRadioSignature(ev)}
							></scib-ui-radio-button>
						)}
					</div>
					{this._expireDaysEnabled && (
						<div class="cdk-signature-modal__signature-days">
							<scib-ui-v2-text-field
								variant="white"
								type="number"
								numberFormatConfig={{
									decimalPlaces: 0,
									maximumValue: this.maxValueExpireDays,
									minimumValue: this.minValueExpireDays
								}}
								invalid={
									this._daysToExpireSiganture &&
									+this._daysToExpireSiganture >= this.minValueExpireDays &&
									+this._daysToExpireSiganture <= this.maxValueExpireDays
										? false
										: true
								}
								required={true}
								label={this._literals.dialog.signatureDaysExpireLabel}
								value={this._daysToExpireSiganture}
								onValueChange={($event) => this._handleInputDaysExpire($event)}
							></scib-ui-v2-text-field>
							{this._expireDaysEnabled &&
								(!this._daysToExpireSiganture ||
									+this._daysToExpireSiganture < this.minValueExpireDays ||
									+this._daysToExpireSiganture > this.maxValueExpireDays) && (
									<span class="cdk-signature-modal__signature-days--error"> {this._literals.dialog.daystoExpireError}</span>
								)}
						</div>
					)}
				</div>
				{!this.loadOnlyTemplates && (
					<div class="cdk-signature-modal__signature-check">
						<label class="cdk-signature-modal__signature-label" htmlFor="signature-check">
							{this._literals.dialog.signatureCheckLabel}
						</label>
						<scib-ui-v2-checkbox
							uid="signature-check"
							value={this._recipientsOrderCheck ? 'checked' : 'unchecked'}
							label={this._literals.dialog.checkSignOrderLabel}
							onValueChange={() => {
								this._handleCheckRecipientOrder();
							}}
						></scib-ui-v2-checkbox>
					</div>
				)}
				{this._masiveLoadEnabled && (
					<scib-ui-button class="cdk-signature-modal__masive-load" nobackground onEventClick={() => this._handleMasiveLoad()}>
						{this._activeMasiveLoad ? this._literals.dialog.cancelMasiveLoadBtn : this._literals.dialog.masiveLoadBtn}
					</scib-ui-button>
				)}
				{this._masiveLoadEnabled && this._activeMasiveLoad && (
					<div class="cdk-signature-modal__masive-load-container">
						<scib-cdk-file-selector
							maxfiles={1}
							format-file-size={true}
							show-upload-files
							idelement="masive-load-file"
							literals={JSON.stringify({
								titleselector: this._literals.dialog.selectorFilesTitle,
								errorMaxFiles: this._literals.dialog.selectorFilesMaxError2,
								errorFormat: this._literals.dialog.selectorFilesFormatError,
								errorDuplicate: this._literals.dialog.selectorFilesDuplicatedError,
								fileSelectedText: this._literals.dialog.selectorFilesAttached
							})}
						></scib-cdk-file-selector>
						{this.downloadTemplateUrl && (
							<div class="cdk-signature-modal__download-template-actions">
								<scib-atoms-button
									icon="download"
									size="s"
									level="tertiary"
									variant="icon"
									type="submit"
									onClick={() => (window.location.href = this.downloadTemplateUrl)}
								></scib-atoms-button>
								<span class="cdk-signature-modal__download-template-masive">{this._literals.dialog.downloadMasiveLoadTemplate}</span>
							</div>
						)}
					</div>
				)}
				<div class="cdk-signature-modal__recipients-container">
					{this.showRecipientsContainer() ? (
						<ul ref={(el) => (this.$draggableList2 = el as HTMLElement)} class="cdk-signature-modal__recipients-list">
							{this._recipientsList.map(
								(recipient, index) =>
									((recipient.roleName && recipient.roleName.toLowerCase().includes(RecipientRoles.EMPLOYEE)) ||
										!this.loadOnlyTemplates) && (
										<li
											class={{
												'cdk-signature-modal__recipient': true,
												'draggable-source': true,
												'cdk-signature-modal__recipient--active-drag': this._recipientsOrderCheck
											}}
											id={'elem-' + index}
											key={recipient.cardId}
										>
											<div class="cdk-signature-modal__recipient-section">
												<div class="cdk-signature-modal__recipient-drag">
													{this._recipientsOrderCheck && (
														<scib-ui-button
															class="cdk-signature-modal__file-drag"
															nobackground
															hide-txt
															icon="icon-drag-hander"
														>
															{'[[dragButton]]'}
														</scib-ui-button>
													)}
													<span class="cdk-signature-modal__recipient-title">
														<strong>
															{recipient.typeLabel
																? recipient.type === 'recipientType01' && this._recipientsOrderCheck
																	? index + 1 + '. ' + recipient.typeLabel
																	: recipient.typeLabel
																: this._literals.dialog.recipientsTitle}
														</strong>
														{!recipient.showForm && !recipient.name && !recipient.email && recipient.isValid !== false ? (
															<span>
																{' - '}
																<span class="cdk-signature-modal__recipient-title--alert">
																	{this._literals.dialog.pendingRecipientAlert}
																</span>
															</span>
														) : !recipient.showForm && recipient.name && recipient.email ? (
															' - ' + recipient.name + ', ' + recipient.email
														) : (
															''
														)}
													</span>
												</div>
												<scib-atoms-button
													class="cdk-signature-modal__chevron"
													icon={recipient.showForm ? 'chevron-top' : 'chevron-down'}
													size="s"
													level="tertiary"
													variant="icon"
													type="button"
													onClick={() => this._accordionRecipient(index, false)}
												></scib-atoms-button>
											</div>
											<div id={'recipient-content-' + index} class="cdk-signature-modal__recipient-container">
												{recipient.typeId === RecipientTypes.SIGNER && !this.loadOnlyTemplates && (
													<div class="cdk-signature-modal__recipient-glcs">
														<scib-ui-v2-text-field
															variant="white"
															label={this._literals.dialog.recipientGlcsLabelInput}
															value={recipient.glcs ? recipient.glcs : ''}
															limit={50}
															onValueChange={($event) => this._handleGlcsInputChange($event, index)}
														></scib-ui-v2-text-field>
													</div>
												)}
												{/* {recipient.typeId === RecipientTypes.SIGNER && this.showFileSelector && (
											<div class="cdk-signature-modal__recipient-glcs">
												<scib-molecules-autocomplete-text-field
													variant="white"
													icon="search"
													id={'glcs-value' + index}
													name={'recipient-content-input-glcs' + index}
													label={this._literals.dialog.recipientGlcsLabelInput}
													loading={!this._glcsOptions.length && !this.noResult}
													value={recipient.glcs ? recipient.glcs.name : this._glcsInputValues?.length ? this._glcsInputValues[index] : null}
													onValueChange={$event => this._handleGlcsInputChange($event, index)}
													onClick={() => {
														this._loadedList('glcs-value' + index);
													}}
												>
													<div slot="content-list">
														<ul>
															{this._glcsOptions.length ? (
																this._glcsOptions.map(option => {
																	return (
																		<li
																			class="content-list__item"
																			onClick={() => {
																				this._autocompleteSelectedOp('glcs', option, index);
																			}}
																		>
																			<span>{option.name}</span>
																		</li>
																	);
																})
															) : (
																<li>
																	<span>{this._literals.dialog.noResultsText}</span>
																</li>
															)}
														</ul>
													</div>
												</scib-molecules-autocomplete-text-field>
											</div>
										)} */}
												<div class="cdk-signature-modal__recipient-input">
													<scib-molecules-autocomplete-text-field
														variant="white"
														id={'name-value' + index}
														name={'recipient-content-input-name' + index}
														label={this._literals.dialog.recipientNameLabelInput}
														selected-value={recipient.name}
														loading={!this._filteredRecipentNameOptions.length && !this.noResult}
														onValueChange={(event) => {
															this._handleInputName(event, index, 'name-value' + index);
														}}
														onClick={() => {
															this._loadedList('name-value' + index);
														}}
													>
														<div slot="content-list">
															<ul>
																{this._filteredRecipentNameOptions.length ? (
																	this._filteredRecipentNameOptions.map((option) => {
																		return (
																			<li
																				class="content-list__item"
																				onClick={() => {
																					this._autocompleteSelectedOp('name', option, index);
																				}}
																			>
																				<span>{option.name}</span>
																				<span class="secondary-text">{option.secondary}</span>
																			</li>
																		);
																	})
																) : (
																	<li>
																		<span>{this._literals.dialog.noResultsText}</span>
																	</li>
																)}
															</ul>
														</div>
													</scib-molecules-autocomplete-text-field>
													<div class="cdk-signature-modal__recipient-input--email">
														<scib-molecules-autocomplete-text-field
															variant="white"
															id={'email-value' + index}
															name={'recipient-content-input-email' + index}
															label={this._literals.dialog.recipientEmailLabelInput}
															selected-value={recipient.email}
															type="email"
															invalid={this._invalidEmail[index]}
															loading={!this._filteredRecipentEmailOptions.length && !this.noResult}
															onClick={() => {
																this._loadedList('email-value' + index);
															}}
															onValueChange={(event) => {
																this._handleInputEmail(event, index, 'email-value' + index);
															}}
														>
															<div slot="content-list">
																<ul>
																	{this._filteredRecipentEmailOptions.length ? (
																		this._filteredRecipentEmailOptions.map((option) => {
																			return (
																				<li
																					class="content-list__item"
																					onClick={() => {
																						this._autocompleteSelectedOp('email', option, index);
																					}}
																				>
																					<span>{option.name}</span>
																					<span class="secondary-text">{option.secondary}</span>
																				</li>
																			);
																		})
																	) : (
																		<li>
																			<span>{this._literals.dialog.noResultsText}</span>
																		</li>
																	)}
																</ul>
															</div>
														</scib-molecules-autocomplete-text-field>
														{recipient.email && this._invalidEmail[index] && (
															<span class="cdk-signature-modal__recipient-input--error">
																{' '}
																{this._literals.dialog.emailMessageError}
															</span>
														)}
													</div>
												</div>

												{get(this._selectedSignatureType, 'options', []).length && recipient.type === 'recipientType01' ? (
													<div class="cdk-signature-modal__recipient-input">
														<scib-ui-v2-select
															class="cdk-signature-modal__recipient-input--advance"
															style={{
																width:
																	this._recipientsList[index]?.selectedOption === SignatureOptionsId.SMS
																		? '32%'
																		: '49%'
															}}
															id={`securityMode-${index}`}
															name={`securityMode-${index}`}
															label={'Security Mode'}
															onlySelect={true}
															value={this._selectedSignatureType.options[
																this._recipientsList[index]?.selectedOption
															].value.toString()}
															menuOptions={this._selectedSignatureType.options}
															onValueChange={(e) => this._handleDropdownOptions(e, index)}
														></scib-ui-v2-select>
														{this._recipientsList[index]?.selectedOption === SignatureOptionsId.SMS ? (
															<scib-atoms-input-telephone
																tlf={this._recipientsList[index]?.sms ? this._recipientsList[index]?.sms : null}
																style={{
																	width:
																		this._recipientsList[index]?.selectedOption === SignatureOptionsId.SMS
																			? '40%'
																			: null
																}}
																variant={'white'}
																required={true}
																label={this._literals.dialog.recipientOptionsPlaceholderInputSms}
																placeholder={this._literals.dialog.recipientOptionsPlaceholderInputSms}
																language={this._language}
																idInput={'phone' + index}
																literals={JSON.stringify({
																	format: this._literals.dialog.recipientOptionsLabelInputSmsFormat,
																	required: this._literals.dialog.recipientOptionsLabelInputSmsRequired,
																	requiredCountry:
																		this._literals.dialog.recipientOptionsLabelInputSmsCountryRequired
																})}
																onDirty={() => {
																	this._setDirtyInputTelephoneSmsValidation(index);
																}}
																onInternationalPhone={($event) => this._handleInputOptions($event, index)}
																onDefaultValue={(event) => {
																	this._defaultPhonePrefix = event.detail;
																}}
															></scib-atoms-input-telephone>
														) : (
															this._recipientsList[index]?.selectedOption == SignatureOptionsId.OTP && (
																<scib-ui-v2-text-field
																	variant="white"
																	label={this._literals.dialog.recipientOptionsLabelInputCode}
																	value={get(recipient, 'oneTimePassword')}
																	onValueChange={($event) => this._handleInputOptions($event, index)}
																></scib-ui-v2-text-field>
															)
														)}
													</div>
												) : this._selectedSignatureType?.id === 4 &&
												  recipient.typeId !== 'recipient_cc' &&
												  !this.loadOnlyTemplates ? (
													<div class="cdk-signature-modal__signature-qualified">
														<div>
															<scib-ui-v2-checkbox
																id={`optional-config-check-${index}`}
																uid={`optional-config-check-${index}`}
																name={`optional-config-check-${index}`}
																value={this._optionalConfig[index] ? 'checked' : 'unchecked'}
																label={this._literals.dialog.optionalConfig}
																onValueChange={() => {
																	this._changeOptionalConfig(index);
																}}
															></scib-ui-v2-checkbox>
															<scib-ui-info-tooltip
																text={this._literals.dialog.qualifiedOptionalInfo}
																title="Qualified info"
																tooltipPos="top"
															></scib-ui-info-tooltip>
														</div>
														{this._optionalConfig[index] && (
															<scib-ui-v2-select
																id={'optional-config-' + index}
																label={this._literals.dialog.qualifiedOptionalLabel}
																value={
																	recipient.qualifiedType
																		? recipient.qualifiedType.toString()
																		: SignatureTypesEnum.QUALIFIED_ID_NOW
																}
																menuOptions={this._qualifiedOptions}
																onlySelect={true}
																onValueChange={(e) => {
																	this._setQualifiedOption(e, index);
																}}
															></scib-ui-v2-select>
														)}
													</div>
												) : (
													''
												)}
												<div
													class={{
														'cdk-signature-modal__recipient--access-code': true,
														'cdk-signature-modal__recipient--advance-access-code':
															this._selectedSignatureType?.id === 2 &&
															recipient.typeId === RecipientTypes.SIGNER &&
															recipient.selectedOption === 0
													}}
												>
													<div>
														<scib-ui-v2-checkbox
															id={`access-code-check-${index}`}
															uid={`access-code-check-${index}`}
															name={`access-code-check-${index}`}
															value={this._docAccessCode[index] ? 'checked' : 'unchecked'}
															label={this._literals.dialog.docAccessCode}
															onValueChange={() => {
																this._addDocAccessCode(index);
															}}
														></scib-ui-v2-checkbox>
														<scib-ui-info-tooltip
															text={this._literals.dialog.docAccessCodeInfo}
															title="Qualified info"
															tooltipPos="top"
														></scib-ui-info-tooltip>
													</div>

													{this._docAccessCode[index] && (
														<scib-ui-v2-text-field
															id={`doc-access-code-${index}`}
															variant="white"
															label={this._literals.dialog.accessCodeLabel}
															value={recipient.accessCode}
															onValueChange={($event) => this._handleInputDocAccessCode($event, index)}
														></scib-ui-v2-text-field>
													)}
												</div>
												<div class="cdk-signature-modal__recipient-actions">
													{!this.loadOnlyTemplates && (
														<scib-atoms-group-radio-button
															options={JSON.stringify(recipient.options)}
															value={recipient.type}
															name={'recipient-type-' + recipient.cardId}
															onValueChange={(e) => this._handleRadioRecipient(e, index)}
														></scib-atoms-group-radio-button>
													)}
													{!this.loadOnlyTemplates && (
														<scib-atoms-button
															class={{
																'cdk-signature-modal__recipient-remove': true,
																'cdk-signature-modal__recipient-remove--disabled': index === 0
															}}
															text={this._literals.dialog.deleteRecipientBtn}
															size="s"
															level="tertiary"
															disabled={index === 0}
															onClick={() => this._handleDeleteRecipient(index)}
														></scib-atoms-button>
													)}
												</div>
											</div>
										</li>
									)
							)}
						</ul>
					) : (
						`${this._literals.dialog.noRecipientEmployees}`
					)}
					{!this.loadOnlyTemplates && (
						<scib-atoms-button
							class="cdk-signature-modal__recipient-add"
							text={this._literals.dialog.addRecipientBtn}
							size="s"
							level="secondary"
							iconPosition="leading"
							icon="add"
							disabled={!this._validation}
							onClick={() => this._handleAddRecipient()}
						></scib-atoms-button>
					)}
				</div>
			</Host>
		);
	}
}
