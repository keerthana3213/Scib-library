export interface IOtpLiterals {
	error: string;
	defaultText: string;
	disabled: string;
	loading: string;
}

export type OtpMode = 'numeric' | 'text';

export type OtpType = 'password' | 'text';

export const patterns = {
	numeric: '^[0-9]$',
	text: '^[A-Za-z0-9]$'
};
