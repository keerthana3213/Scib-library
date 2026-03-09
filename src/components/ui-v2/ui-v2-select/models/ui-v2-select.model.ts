export interface SelectOption {
	id: string;
	value: string;
	label: string;
	children: SelectOption[];
}

export type SelectOptions = SelectOption[];
