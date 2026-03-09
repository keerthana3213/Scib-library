export interface ICDKDeleteMembersLiterals {
	/** Titulo de la modal */
	title: string;
	/** Sub titulo de la modal */
	subTitle: string;
	/** Mensaje de información de la modal */
	message: string;
	/** Label del select */
	selectLabel: string;
	/** Label del text area */
	textAreaLabel: string;
	/** Placeolder del text area */
	textAreaPlaceholder: string;
	/** Texto del botón de cancelar */
	cancelBtn: string;
	/** Texto del botón de confirmar */
	submitBtn: string;
}

export interface ICDKDeleteMember {
	id: string;
	name: string;
	avatar: {
		src: string;
		alt: string;
	};
	isEmployee: boolean;
}
