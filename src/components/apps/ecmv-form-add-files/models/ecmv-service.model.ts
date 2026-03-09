//Copy ecmviewer.interface.ts

export interface Scope {
	document_type: string[];
	geography: string;
	confidentiality: string;
	gdpr: boolean;
	document_owner: string;
	business_process: string;
}
export interface Access {
	area: string;
	geography: string;
}
export interface FSEPermissions {
	permision: string;
	scope: Scope;
	access: Access;
}

export interface IECMVFSEData {
	id: string;
	what: string;
	how: IECMVFSEHowData[];
}

export interface IECMVFSEHowData {
	key: string;
	value: string;
	descrip: string;
}

export interface IECMVMetadataByDocType {
	documentmetadata: IECMVDocumentMetadata;
	documenttype: IECMVDocumentTypeData;
	id_dc_metadata: number;
	id_doc_metadata: string;
	id_doc_type: string;
}

export interface IECMVDocumentMetadata {
	b_automatic: boolean;
	b_list: boolean;
	id_doc_metadata: string;
	required: boolean;
	t_cardinality: string;
	t_description: string;
	t_list_value: string;
	t_name: string;
	t_type: string;
	t_type_send: string;
}

export interface IECMVAreaRelatedMetadatasData {
	confidentiality: IECMVMetadataData;
	gdpr: IECMVMetadataData;
	document_owner: IECMVMetadataData;
	business_process: IECMVMetadataData;
	geography: IECMVMetadataData;
}

export interface IECMVMetadataData {
	id: string;
	label: string;
	t_list: string;
}

export interface IECMVNavigation {
	itemName: string;
}

export interface IECMVMetadataFilter {
	id: string;
	metadata: string;
	values: IECMVMetadataFilterValue[];
	typeItem: string;
	totalValues: string;
}

export interface IECMVMetadataDetailValues {
	id: string;
	nombre: string;
	valor: any;
	multi: string;
	metadataType: string;
}

export interface IECMVAdditionalDetailValues {
	show: boolean;
	title: string;
	elements: [string];
}

export interface IECMVMetadataFilterValue {
	label: string;
	active: boolean;
}

export interface IECMVDocumentMetadataData {
	id: string;
	metadatos: IECMVMetadataObject[];
}
export interface IECMVMetadataObject {
	nombre: string;
	valor: string;
}
export class IECMVFilesData {
	hiddenId: any;
	extensionType: any;
	documentTitle: any;
	documentOwner: any;
	businessProcess: any;
	dateLastModified: any;
	size: any;
	idFile: any;
}

export class IECMVFilesSearchData {
	hiddenId: any;
	docType: any;
	extensionType: any;
	documentTitle: any;
	documentClass: any;
	documentType: any;
	dateLastModified: any;
	ContentSize: any;
	size: any;
	idFile: any;
}

export interface IECMQueryDocumentByValueBodyData {
	select: string[];
	from: string;
	where: string[];
	filter: string;
	contentSearch: string;
	pageSize: number;
	pageNumber: number;
	order: string;
}

export interface IECMVTableColumnData {
	headerName: String;
	field: String;
	filter: Boolean;
	sortable?: Boolean;
	disableDefaultSort?: Boolean;
}

export interface ICMVUploadFile {
	fileName: string;
	docClass: string;
	file: string;
	typeMIME: string;
	storagePath: string;
	metadata: IECMVMetadata;
}
export interface IECMVDocumentClassData {
	id_doc_class: string;
	storage_path: string;
	t_description: string;
	t_name: string;
	documentyype: IECMVDocumentTypeData[];
	id?: string;
	value?: string;
	label?: string;
}
export interface IECMVDocumentTypeData {
	id_doc_type: string;
	t_description: string;
	t_name: string;
	id?: string;
	value?: string;
	label?: string;
}
export interface IECMVMetadata {
	IBORRelated?: string;
	ClientName?: string[];
	ProductLevel1?: string[];
	IDUsuario?: string;
	IDSignature?: string;
	IMigration?: string;
	ConfidentialityLevel: string;
	DocumentType: string;
	GDPR: string;
	Geographymanagesdocument: string;
	Geographyownerdocument: string;
	BusinessProcess: string;
	DocumentOwner: string[];
	IBORAmendedStatus: string;
	EventType: string;
	MarketType: string;
	ApplicableLaw: string;
}

export class IECMVMetadataDetail {
	id: string;
	nombre: string;
	valor: any;
	multi: string;
	type_send: string;
	metadataType: string;
}

export class IECMVAllMetadata {
	ClientName: string[];
	DocumentType: string;
	Geographyownerdocument: string;
	InvoiceDate: string;
	IssuedCode: string;
	TypeProduct: string;
	TypeService: string;
	Vendor: string;
	DocumentOwner: string[];
	BusinessProcess: string;
	ConfidentialityLevel: string;
	GDPR: string;
	Geographymanagesdocument: string;
	ReceptionDate: string;
	ClearinghouseName: string;
	DateSignature: string;
	OperationName: string;
	Interventer: string;
	ProjectName: string;
	TradeDate: string;
	OperationID: string;
	TypeofAgreement: string;
	IBORRelated: string;
	ExpirationDate: string;
	MessageDate: string;
	ApplicableLaw: string;
	RateFee: string;
	ShortCode: string;
	MarketType: string;
	IBORRate: string;
	IBORAmendedStatus: string;
	IBORtypeofproduct: string;
	ReferenceType: string;
	Currency: string;
	GlobalAmount: string;
	ContractCode: string;
	MurexLabel: string;
	EventType: string;
	MessageID: string;
	ClientCIF: string;
	BICCode: string;
	Supplier: string;
	ReportDate: string;
	ExternalAssessor: string;
	OperationDate: string;
	DocumentDate: string;
	PaymentDate: string;
	ConversationDate: string;
	DealingCode: string;
	ClientAccountNumber: string;
	SwiftCode: string;
	FenergoID: string;
	AccounOpeningDate: string;
	Seller: string;
	TaxID: string;
	ClassificationHTCHTCS: string;
	TestDate: string;
	ISIN: string;
	GuaranteeIssueDate: string;
	Index: string;
	TemplateReference: string;
	ProductSubtype: string;
	ProductSubtype2: string;
}

export enum SearchCriteriaType {
	CONTENT = 'content',
	FILE_NAME = 'fileName',
	CLIENTNAME = 'clientName',
}

export enum PermissionType {
	EDIT = 'write',
	VIEW = 'read',
	NONE = 'none',
}

export enum FSEScopeDataCode {
	HOWGEOGRAPHY = 'HOWGEOGRAPHY',
	HOWCONFIDENTIAL = 'HOWCONFIDENTIAL',
	HOWGDPR = 'HOWGDPR',
	HOWAREA = 'HOWAREA',
	HOWBUSPROCESS = 'HOWBUSPROCESS',
	HOWDOCUMENT = 'HOWDOCUMENT',
}
