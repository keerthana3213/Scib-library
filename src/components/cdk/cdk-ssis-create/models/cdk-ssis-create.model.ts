export interface ICDKSsisCreateLiterals {
	productsListLabel: string;
	tooltip: string;
	mainTitle: string;
	instructionTitle: string;
	productLabel: string;
	productPlaceholder: string;
	currrencyLabel: string;
	currencyPlaceholder: string;
	primaryInstructionLabel: string;
	swiftCodeLabel: string;
	swiftCodePlaceholder: string;
	accountLabel: string;
	accountPlaceholder: string;
	swiftIntermediaryLabel: string;
	swiftIntermediaryPlaceholder: string;
	accountIntermediaryLabel: string;
	accountIntermediaryPlaceholder: string;
	swiftIntermediary2Label: string;
	swiftIntermediary2Placeholder: string;
	accountIntermediary2Label: string;
	accountIntermediary2Placeholder: string;
	valueDateLabel: string;
	valueDatePlaceholder: string;
	existingLabel: string;
	existingOpt1Label: string;
	existingOpt2Label: string;
	textAreaLabel: string;
	textAreaPlaceholder: string;
	addInstructionBtn: string;
	deleteInstructionBtn: string;
	notice: string;
	cancelBtn: string;
	submitBtn: string;
	labelInfoCheckbox: string;
	labelInfoDate: string;
	noResult: string;
	/*Titulo del listado del multiselect*/
}

export interface IInstruction {
	cuentaCorresponsal: string;
	accountIntermediary: string;
	accountIntermediary2: string;
	currency: string;
	date: string;
	existingOption: string;
	primaryInstruction: boolean;
	product: string;
	swiftCode: string;
	swiftIntermediary: string;
	swiftIntermediary2: string;
	textarea: string;
}

export class Instruction implements IInstruction {
	constructor() {
		this.cuentaCorresponsal = null;
		this.accountIntermediary = null;
		this.accountIntermediary2 = null;
		this.currency = null;
		this.date = null;
		this.existingOption = null;
		this.primaryInstruction = false;
		this.product = null;
		this.swiftCode = null;
		this.swiftIntermediary = null;
		this.swiftIntermediary2 = null;
		this.textarea = null;
	}

	cuentaCorresponsal: string;
	accountIntermediary: string;
	accountIntermediary2: string;
	currency: string;
	date: string;
	existingOption: string;
	primaryInstruction: false;
	product: string;
	swiftCode: string;
	swiftIntermediary: string;
	swiftIntermediary2: string;
	textarea: string;
}

export interface IInstructionAccordeon {
	index: number;
	open: boolean;
}

export interface ICDKSsisErrorsLiterals {
	exactlyCharacters: string;
}

export interface ICDKSsisCreateSelect {
	key?: any;
	name?: string;
	value?: string;
	t_name?: string;
	id_doc_type?: string;
}
