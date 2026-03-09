export interface Literals {
	selectManager: string;
	textManager: string;
	noResultsText: string;
	notListAbove: string;
	nameManager: string;
	emailManager: string;
	emailMessageError: string;
	requiredInputs: string;
	buttonCancel: string;
	buttonConfirm: string;
	errorManager?: string;
}

export interface Manager {
	id: string;
	email: string;
	name: string;
	avatar: {
		src: string;
		alt: string;
	};
}

export interface ManagersBack {
	avatar?: string | null;
	clave: string;
	email: string;
	id: number;
	lastname1: string;
	name: string;
	status: string;
}

export interface SelectedManagerInfo {
	id: string;
	name: string;
	email: string;
}
