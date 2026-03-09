export interface ICDKTopicCardLiterals {
	/**VDR Link title*/
	tooltipTopic: string;

	/**Literals */
	[key: string]: string;

	/** Card title */
	mainTitle: string;

	/** Card description */
	description: string;

	/** Card members */
	members: string;
}

export interface ICDKTopicListLiterals {
	/** Avatar src*/
	imgSrc: string;

	/** Avatar alt*/
	imgAlt: string;

	/** Indica si es empleado o no*/
	isEmployees: boolean;

	/** Nombre del usuario */
	name: string;
}
