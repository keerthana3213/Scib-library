export interface TutorialDetails {
	idBullet: string;
	size: 'small' | 'normal' | 'large';
	bulletPosition: 'medium-left' | 'medium-right' | 'header' | 'left' | 'right' | 'top' | 'bottom';
	contentCard: ContentCard;
	urlPath: string;
}

export interface ContentCard {
	content: string;
	arrowPosition: string;
	tooltipCardTitle: string;
	linkTitle: string;
	btnTitle: string;
	disableLink: string;
	disableClose: boolean;
	widthCard?: number;
	next?: string;
	prev?: string;
}

export interface ILiterals {
	[key: string]: any;
}
