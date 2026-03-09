/**Literales*/
export interface ICDKContractCardLiterals {
	accessibleLoading?: string;
	tooltip?: string;
	status: string[];
	items: string[];
}

export interface ICDKContractCardData {
	/**ID de la card*/
	id: string | number;
	/**Titulo de la card*/
	title: string;
	/**Cantidades para cada apartado de la parte de contratos*/
	items: number[];
	/**Cantidades de contratos referentes a cada tipo de estado*/
	status: {
		[key: string]: string;
	};
}
