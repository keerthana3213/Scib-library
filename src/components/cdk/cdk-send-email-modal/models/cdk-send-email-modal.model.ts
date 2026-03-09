import { ICDKTopicCreateMembers } from '../../cdk-topic-create/models/cdk-topic-create.model';

export interface ILiterals {
	[key: string]: any;
}

export interface Dataform {
	selectedMembers: ICDKTopicCreateMembers[];
	textarea: string;
}

export interface Avatar {
	src: string;
	alt: string;
}
