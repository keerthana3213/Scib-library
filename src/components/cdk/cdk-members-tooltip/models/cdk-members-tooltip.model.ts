export interface ICDKListMembersTooltip {
	/** Avatar src*/
	imgSrc: string;

	/** Avatar alt*/
	imgAlt: string;

	/** Indica si es empleado o no*/
	isEmployees: boolean;

	/** Nombre del usuario */
	name: string;

	readDate?: string;
}

export interface ICDKLinkDataTooltip {
	/** Literal link */
	literal: string;

	/** Link src */
	eventName?: string;
}

export interface ICDKLiteralsTooltip {
	unreadTxt?: string;
	titleTxt?: string;
	membersTxt?: string;
}
