export interface IECMVMetadataDetailValues {
	id: string;
	nombre: string;
	valor: any;
	multi: string;
	show?: boolean;
}

export class IECMVMetadataDetail {
	id: string;
	nombre: string;
	valor: any;
	multi: string;
	show?: boolean;
}

export interface IECMVAdditionalDetailValues {
	show: boolean;
	title: string;
	elements: [string];
}
