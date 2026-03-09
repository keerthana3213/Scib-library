export class ICDKElementsListData {
	id: string;
	title: string;
	extension: string;
	acciones: ICDKElementsListActions[];
	type: string;
	quantity?: number;
}
export class ICDKElementsListActions {
	text: string;
	icon: string;
	eventId: string;
}
