export interface ICDKSsisEditLiterals {
	mainTitle: string;
	mainTitleDetail: string;
	instructionID: string;
	instructionStatus: string;
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
	editBtn: string;
	notice: string;
	cancelBtn: string;
	submitBtn: string;
	labelInfoCheckbox: string;
	labelInfoDate: string;
	productsListLabel: string;
	tooltip: string;
	noResult: string;
}

export interface ICDKSsisErrorsLiterals {
	exactlyCharacters: string;
}

export interface ICDKSsisEditSelect {
	apply?: boolean;
	primaryInstruction?: boolean;
	name?: string;
	value?: string;
	t_name?: string;
	id_doc_type?: string;
	product?: string | any;
	status?: string;
	id?: string;
	currency?: string;
	accountNumber?: string;
	cuentaCorresponsal?: string;
	bicIntermediario1?: string;
	bicCorresponsal?: string;
	cuentaIntermediario1?: string;
	bicIntermediario2?: string;
	cuentaIntermediario2?: string;
	fechaEfectiva?: string;
	comments?: string;
	existingOption?: boolean;
	comment?: string;
	primary?: boolean;
	producto?: string | [];
	idRequest?: string;
	key?: any;
}
