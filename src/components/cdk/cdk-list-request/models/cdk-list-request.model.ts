export interface ICDKRequest {
	status?: string;
	id?: string;
	creationDate?: string;
	/** Informative data about the request */
	requestData: {
		status: string;
		id: string;
		creationDate: string;
		client?: string;
	};
	/**Data of the sub-requests associated with the request*/
	childsData?: {
		data: Array<{
			status: string;
			product: string | [];
			currency: string;
			cuentaCorresponsal: string;
			bicCorresponsal: string;
			id: string;
			cuentaIntermediario1?: string;
			cuentaIntermediario2?: string;
			bicIntermediario2?: string;
			fechaEfectiva?: string;
		}>;
	};
	/**Indicates whether the request has been blocked or not*/
	locked: boolean;
	/**Indicates the status of the request*/
	petitionStatus: string;
}
export interface ICDKLiterals {
	/**Literal of the header of the list with the total of requests*/
	totalResult: string;
	/**Literal of the header employees of the list with the total of requests*/
	totalHeaderEmployees: string;
	/**Literal of the button to load more requests*/
	loadBtn: string;
	/**Literal labels table-child*/
	labels?: string[];
	/**Literal first empty message*/
	firstMessage: string;
	/**Literal last empty message*/
	secondMessage: string;
	/**Literal accesible loading skeleton*/
	accessibleLoading?: string;
}
export interface ICDKButtons {
	/** Information about the buttons with the request text */
	textBtns?: Array<{
		name: string;
		label: string;
		icon: string;
		event: string;
	}>;
	/** Data on the buttons with the request icon */
	iconBtns?: Array<{
		name: string;
		label: string;
		icon: string;
		event: string;
	}>;
}

export interface ICDKLegend {
	/** Petition status titles */
	pendingLabel: string;
	requestedLabel: string;
	inProgressLabel: string;
	doneLabel: string;
	cancelLabel: string;

	/** Content of the petition statuses */
	pending: number;
	requested: number;
	inProgress: number;
	done: number;
	canceled: number;
}
