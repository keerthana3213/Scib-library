export interface IECMVMetadataFilter {
	id: string;
	metadata: string;
	values: IECMVMetadata[];
	typeItem: string;
	totalValues: string;
}

export interface IECMVMetadata {
	id?: string;
	label?: string;
	active?: boolean;
}

export interface IECMVMetadataValues {
	id: string;
	metadata: string;
	value: string;
}
