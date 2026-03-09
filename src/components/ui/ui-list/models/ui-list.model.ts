export interface ILiterals {
	[key: string]: any;
}

export interface IDetailCheckboxSelected {
	checkboxData: Event;
	checkboxId: string;
	checkboxValue: 'indeterminate' | 'checked' | 'unchecked';
}
