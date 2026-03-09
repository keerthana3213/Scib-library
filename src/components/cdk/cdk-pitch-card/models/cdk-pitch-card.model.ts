export class ICDKPitchCardLiterals {
	btnOpen: string;
}
export class ICDKPitchCardData {
	area: string;
	id: string;
	title: string;
	url: string;
	btnUrl: string;
	btnOptions: string;
	openOptions?: boolean;
	actions: ICDKPitchCardActions[];
}
export class ICDKPitchCardActions {
	text: string;
	icon: string;
	eventId: string;
	options?: ICDKPitchCardActions[];
}
