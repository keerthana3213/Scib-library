export interface Option {
	label: string;
	value: string;
	id: string;
	button?: {
		text: string;
		disabled?: boolean;
		event: string;
		level: levels;
	};
	helperText?: string;
}
export type levels = 'primary' | 'secondary' | 'tertiary';
