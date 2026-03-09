/** Data Interface */
export interface ICDKParameterData {
	name: string;
	itemList: ICDKParameterItem[];
	atributeList?: { [key: string]: string[] };
	parameterType?: Array<any>;
	parameterLogic?: string;
	automationType?: string;
	itemType?: string;
	atributes?: Array<any>;
	concatenatedValue?: string;
	couldBeMandatory?: boolean;
}

/** Item Interface */
export interface ICDKParameterItem {
	id: string;
	blocked?: boolean;
	inputType: CDKInputTypeEnum | string;
	paramType?: CDKParameterTypeEnum | string;
	paramTypes?: Array<any>;
	paramLogic?: CDKParameterLogicEnum | string;
	metadataName?: CDKParameterMetadataNameEnum | string;
	isMandatory?: boolean;
	atribute?: string;
	automation?: string;
	concatenated?: string;
	selectedType?: any;
	selectedLogic?: any;
	selectedAtribute?: any;
	selectedAutomation?: any;
	selectedMetadataName?: any;
	name: string;
	value: any;
}

/** Literals Interface */
export interface ICDKParameterLiterals {
	itemTitle: string;
	deleteItem: string;
	addNewItem: string;
	itemType: string;
	placeholderItemType: string;
	itemName: string;
	placeholderItemName: string;
	itemDefaultValue: string;
	placeholderItemDefaultValue: string;
	itemComboListOptions: string;
	itemValueListed: string;
	placeholderItemValueListed: string;
	date: string;
	text: string;
	number: string;
	combo: string;
	pendingError: string;
	newLable: string;
	parameterLogic: string;
	parameterType: string;
	parameterName: string;
	automationType: string;
	atribute: string;
	concatenation: string;
	manual: string;
	autoUSingle: string;
	autoAdded: string;
	default: string;
	calculated: string;
	autovalueaggregated: string;
	autovalueunique: string;
	checkLabel: string;
}

/** Input Type Enum */
export enum CDKInputTypeEnum {
	TEXT = 'text',
	NUMBER = 'number',
	DATE = 'date',
	COMBO = 'combo',
	STRING = 'string',
}

/** Parameter Type Enum */
export enum CDKParameterTypeEnum {
	OPERATIONAL = 'Operacionales',
	FILENET = 'Filenet',
	AMENDMENT = 'Template',
}

/** Parameter Logic Enum */
export enum CDKParameterLogicEnum {
	MANUAL = 'manual',
	AUTO_UNIQUE = 'autovalueunique',
	AUTO_AGREGADED = 'autovalueaggregated',
}

/** Parameter Automation Type */
export enum CDKParameterAumationTypeEnum {
	DEFAULT = 'default',
	CALCULATED = 'calculated',
}

export enum CDKParameterMetadataNameEnum {
	DOCUMENT_CLASS = 'Document class',
	DESTINATION = 'Destination',
	GDPR = 'GDPR',
	GEOGRAPHYOWNERDOCUMENT = 'Geographyownerdocument',
	CONFIDENTIALITYLEVEL = 'ConfidentialityLevel',
	BUSINESSPROCESS = 'BusinessProcess',
	GEOGRAPHYMANAGESDOCUMENT = 'Geographymanagesdocument',
	DOCUMENTTYPE = 'DocumentType',
	DOCUMENTOWNER = 'DocumentOwner',
	CLIENTNAME = 'ClientName',
	IBORRELATED = 'IBORRelated',
	APPLICABLELAW = 'ApplicableLaw',
	CLIENTCIF = 'ClientCIF',
	BICCODE = 'BICCode',
	CODEGLCS = 'CodeGLCS',
	CONTRACTCODE = 'ContractCode',
	CURRENCY = 'Currency',
	DATESIGNATURE = 'DateSignature',
	EVENTTYPE = 'EventType',
	EXPIRATIONDATE = 'ExpirationDate',
	GBOREFERENCE = 'GBOReference',
	GLOBALAMOUNT = 'GlobalAmount',
	IBORRATE = 'IBORRate',
	IBORAMENDEDSTATUS = 'IBORAmendedStatus',
	IBORTYPEOFPRODUCT = 'IBORtypeofproduct',
	INTERVENTER = 'Interventer',
	MARKETTYPE = 'MarketType',
	MESSAGEDATE = 'MessageDate',
	MESSAGEID = 'MessageID',
	MUREXLABEL = 'MurexLabel',
	OPERATIONID = 'OperationID',
	OPERATIONNAME = 'OperationName',
	PROJECTNAME = 'ProjectName',
	RATEFEE = 'RateFee',
	REFERENCETYPE = 'ReferenceType',
	SHORTCODE = 'ShortCode',
	TRADEDATE = 'TradeDate',
	TYPEOFAGREEMENT = 'TypeofAgreement',
	TYPEPRODUCT = 'TypeProduct',
}
