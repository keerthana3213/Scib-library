export interface ICDKPanelData {
	/**Estado de la petición*/
	status: string;
	/**Identificación de la petición*/
	id: string;
	/**Fecha de creación de la petición*/
	creationDate: string;
	/**Cliente de la petición*/
	client?: string;
}
export interface ICDKRequestLabel {
	/**Label de estado de la petición*/
	status: string;
	/**Label de identificación de la petición*/
	id: string;
	/**Label de fecha de creación de la petición*/
	creationDate: string;
	/**Label del cliente de la petición*/
	client?: string;
}
