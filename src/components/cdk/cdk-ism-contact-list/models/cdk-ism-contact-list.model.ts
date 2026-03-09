export interface ILiterals {
	noContact?: NoContact;
	[key: string]: any;
}

type NoContact = {
	text: string;
	img: string;
	alt: string;
};

export type CardData = {
	cardInfo: CardInfo;
	img: Images;
	extraInfo?: ExtraInfo;
};

type CardInfo = {
	fullName: string;
	role: string;
	email: string;
	phone: string;
	tagText: string;
	showTag: string;
};

type ExtraInfo = {
	postion: string;
	department: string;
};

type Images = {
	src: string;
	alt: string;
};
