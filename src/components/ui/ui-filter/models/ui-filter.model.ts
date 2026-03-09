import { IUIInputOption } from '../../ui-input/models/ui-input.model';

export interface UIFilterLiterals {
	/**Filter title literal*/
	filterTitle?: string;
	/**Filter literal button*/
	filterbtn?: string;
	/**fieldset content object array*/
	fieldset?: UIContentForm[];
	/**hasExtendedFilters boolean**/
	hasExtendedFilters?: boolean;
	/**Filter title literal*/
	hideIconLabel?: string;
	showIconLabel?: string;
	/**extendedFilters content object array**/
	extendedFilters?: ExtendedFilters[];
	/**Date error messsage */
	dateErrorMessage?: string;
	/**Expected entry Year */
	expectedYear?: string;
}

export interface ExtendedFilters {
	legend: string;
	fieldset: UIContentForm[];
}

export interface UIContentForm {
	/**Dropdown object array*/
	dropdown?: UIDropdownLiterals;
	/**Input object array*/
	input?: UIInputLiterals;
	/**Datepicker object array*/
	datepicker?: UIDatePickerLiterals;
	// Display several components in a row
	row?: Array<UIDropdownLiterals | UIInputLiterals>;
}

export interface UIDropdownLiterals {
	label?: string;
	placeholderSelect?: string;
	idSelect?: string;
	values: UIDropdownValues[];
	selectedValue: UIDropdownValues;
	loading?: boolean;
	backMode?: boolean;
	textCursor?: boolean;
	long?: boolean;
	double?: boolean;
}

export interface UIDropdownValues {
	value: string;
	name: string;
	[key: string]: any;
	isSelected?: boolean;
	secondary?: string;
	avatar?: any;
	isEmployee?: boolean;
}

export interface UIInputLiterals {
	label?: string;
	placeholder?: string;
	idInput?: string;
	long?: boolean;
	disable?: boolean;
	double?: boolean;
	autocomplete?: boolean;
	options?: string | IUIInputOption[];
	loading?: boolean;
	noResult?: string;
}

export interface UIDatePickerLiterals {
	valueDatePickerLabel?: string;
	valueDatePickerLabel2?: string;
	idDate?: string;
	txt?: string;
	id?: string;
	limitDate?: boolean;
	expectedYear?: string;
	errormessage?: string;
}

export interface UICheckboxLiterals {
	label: string;
	idCheckbox?: string;
}
