export interface ICDKVdrDetailLiterals {
	/*Condicional para activar las caracteristicas adicionales de empleados*/
	isEmployees: boolean;

	/*Título de la vdr*/
	title: string;

	/*Descripción de la vdr*/
	description: string;

	/*Literal fecha activación*/
	status: string;

	/*Fecha activación*/
	activedate: string;

	/*Literales owners de la card*/
	ownersLabel: string;

	/*Owners de la card*/
	owners: string;

	/*Literales members de la card*/
	membersLabel: string;

	/*Members de la card*/
	members: string;

	/*Boton de creacion*/
	btnCreate: string;

	/*Boton de edicion*/
	btnEdit: string;

	/*Open/close VDR switch */
	switchClose?: string;

	stateVdr?: string;

	/** Criticality */
	criticality?: ICDKVdrStateCardLiterals;

	/** Status */
	state?: ICDKVdrStateCardLiterals;
}

export interface ICDKVdrDetailMembersLiterals {
	/** Avatar src*/
	imgSrc: string;

	/** Avatar alt*/
	imgAlt: string;

	/** Indica si es empleado o no*/
	isEmployees: boolean;

	/** Nombre del usuario */
	name: string;
}

export interface ICDKVdrDetailOwnersLiterals {
	/** Avatar src*/
	imgSrc: string;

	/** Avatar alt*/
	imgAlt: string;

	/** Owner alt*/
	name: string;

	/** Indica si es empleado o no*/
	isEmployees: boolean;
}

export interface ICDKVdrStateCardLiterals {
	title: string;
	color: string;
}
