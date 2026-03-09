import { CheckboxValue } from '../../../ui-v2/ui-v2-checkbox/models/ui-v2-checkbox.model';

export interface ILiterals {
	[key: string]: any;
}

export interface IModalTutorial {
	open: boolean;
	imgSrc: string;
	modalTitle: string;
	description: string;
	btnText: string;
	chkText: string;
	chkValue: CheckboxValue;
	start?: boolean;
}
