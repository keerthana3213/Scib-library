/**Literales */
export interface ICDKMyAppsCardLiterals {
	active: string;
	locked: string;
}
export interface ICDKMyAppsCardData {
	/**ID de la card*/
	id: string;
	/**Titulo de la card*/
	title: string;
	/**App bloqueada */
	locked_activation: boolean;
	/**App activa */
	isActive: boolean;
	/**Logo app */
	icon: string;
	/** App link */
	link: string;
}
