import { ICDKPitchCardData } from '../../cdk-pitch-card/models/cdk-pitch-card.model';

export interface ICDKPitchSectionContainerLiterals {
	sectionTitle: string;
	mainTitle: string;
	titleDescription: string;
	add: string;
	imgUrl: string;
	btnOpen: string;
}

export interface ICDKPitchSectionContainerData {
	personalPitch: boolean;
	title: string;
	pitches: ICDKPitchCardData[];
}
