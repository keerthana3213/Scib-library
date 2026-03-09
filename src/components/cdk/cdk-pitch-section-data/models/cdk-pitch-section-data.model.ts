export interface ICDKLiterals {
	title: string;
	subtitle: string;
	footNote: string;
	labelContentButton: string;
	contentButtonInfo: string;
	contentButtonDefault: string;
	contetButtonLimit: number;
	placeholderContentButton: string;
	labelContentImage: string;
	labelContentTitle: string;
	contentTitleInfo: string;
	contentTitleDefault: string;
	contetTitleLimit: number;
	placeholderContentTitle: string;
	labelCoverImg: string;
	labelDropdown: string;
	placeholderDrop: string;
	labelInput: string;
	placeholderInput: string;
	labelTextArea: string;
	placeholderTextArea: string;
	labelCheckbox: string;
	img: string;
	resetText: string;
	previewText: string;
	helpText: string;
	saveText: string;
	closeText: string;
	helpUrl: string;
	page: string;
	landing: string;
	inputLimit: number;
	textareaLimit: number;
	startAddSection: string;
	addSection: string;
	contents: string;
	coverBtn: string;
}

export interface ICDKPitchData {
	pitch: ICDKPitch;
	templates: ICDKPitchItem[];
}

export interface ICDKPitch {
	template: string;
	name: string;
	private: boolean;
	description: string;
	selectedTemplate?: any;
	image: string;
	contentButtonName: string;
	contentImage: string;
	contentTitle: string;
}

export interface ICDKPitchItem {
	id: string;
	name: string;
	value: any;
	image: string;

	// ContentKnowledge
	type: string;
	langcode: string;
	url: string;
	created: string;
	changed: string;
	country: string;
	country_id: string;
	areaName?: string;
	thumbnail__target_id?: string;
}

export interface ICDKElements {
	/**Title literal*/
	title: string;

	/**Subtitle literal*/
	subtitle: string;

	/**Description literal*/
	description: string;

	/**Image src literal*/
	image: string;

	/**Image alt */
	imageAlt: string;

	/**Literals */
	[key: string]: string;
}
