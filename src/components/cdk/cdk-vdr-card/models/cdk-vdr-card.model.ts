export interface ICDKVdrCardLiterals {
	/**Virtual-data-room url*/
	urlVdr: string;

	/**VDR Link title*/
	tooltipVdr: string;

	/**Literals */
	[key: string]: string | any;

	/** Card title */
	mainTitle: string;

	/** Card description */
	description: string;

	/** Card creation date */
	date: string;

	/** Card owner */
	owners?: string;

	/** Card members */
	members: string;

	/** Criticality */
	criticality?: ICDKVdrStateCardLiterals;

	/** Status */
	state?: ICDKVdrStateCardLiterals;
}

export interface ICDKVdrListLiterals {
	/** Avatar src*/
	imgSrc: string;

	/** Avatar alt*/
	imgAlt: string;

	/** Indica si es empleado o no*/
	isEmployees: boolean;

	/** Nombre del usuario */
	name: string;
}

export interface ICDKVdrStateCardLiterals {
	title: string;
	color: string;
}
