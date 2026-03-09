export interface StepProgress {
	id: number;
	value: string;
	label: string;
	active?: boolean;
	complete?: boolean;
	notAllow?: boolean;
}
