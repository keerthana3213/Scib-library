export interface ICDKIsmPreviewLiterals {
	errorTitle: string;
	errorDesc: string;
	literalsCard: LiteralsCard;
}

export interface LiteralsCard {
	incidents: IncidentCard;
	relevantFacts: CommonCard;
	invoices: CommonCard;
	contracts: CommonCard;
}

export interface CommonCard {
	title: string;
	subtitle?: string;
}

export interface IncidentCard extends CommonCard {
	inProgress: string;
	pending: string;
	critical: string;
}

export interface ICDKIsmPreviewData {
	loadingImgSrc: string;
	incidents: {
		inProgress: string | number;
		pending: string | number;
		critical: string | number;
	};
	relevantFacts: {
		newLast30: string | number;
	};
	invoices: {
		pending: string | number;
	};
	contracts: {
		formalizing: string | number;
	};
}
