export enum ECDKSidecommTabIds {
	'BUL' = 'BUL',
	'MSG' = 'MSG',
	'ALE' = 'ALE',
}

export interface ICDKSidecommTab {
	/** identificador único para la tab */
	id: ECDKSidecommTabIds;
	/** Literal a mostrar */
	label: string;
	/** Número de notificaciones a mostrar en el globo */
	notifications?: number;
}

export interface ICDKSidecommProfile {
	/** Nombre completo a mostrar del usuario */
	name: string;
	/** Avatar */
	avatar: {
		src: string;
		alt: string;
	};
}
