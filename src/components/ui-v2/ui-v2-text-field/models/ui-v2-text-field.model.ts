export interface ILiterals {
	[key: string]: any;
}

export const defaultNumberFormatConfig = {
	alwaysAllowDecimalCharacter: true,
	failOnUnknownOption: false,
	digitGroupSeparator: ',',
	formatOnPageLoad: true,
	decimalCharacter: '.',
	showWarnings: false,
};
