import { IUITableLiterals, IUITableTopButtons, IUITableColumnDefs } from '../../../ui/ui-table/models/ui-table.model';
import { ICDKHeaderSummaryLiterals } from '../../cdk-header-summary/models/cdk-header-summary.model';
import { UIFilterLiterals } from '../../../ui/ui-filter/models/ui-filter.model';

export interface ICDKContractData {
	/** Archtype config */
	archetype: CDKStatusArchetypeEnum;
	/** User's permission */
	permissions: ICDKPermissions;
	/** Shows Loading Button */
	showLoading: boolean;
	/** Lodading more items indicator */
	loadingMoreItems: boolean;
	/** Item Count */
	itemCount: number;
	/** Subitem Count */
	subitemCount: number;
	/** Group List */
	groupList: ICDKGroup[];
	/** Table columns defintions */
	tableColumnDefs: IUITableColumnDefs[];
	/** Table top buttons */
	tableTopButtons: IUITableTopButtons[];
	/** Totales status contract */
	totalesStatus?: {
		done: number;
		signed: number;
		pending: number;
		[key: string]: number;
	}[];
	/** Contracts type count */
	statusTypeCount?: {
		type: CDKStatusTypeEnum;
		count: number;
	}[];
}

export interface ICDKGroup {
	/** Identificador del grupo */
	id: string;
	/** Nombre del grupo */
	groupName: string;
	/** Nombre de enmienda */
	amendmentName?: string;
	/** Condición de si tiene template asignada */
	hasTemplate?: boolean;
	/** Nombre de cliente */
	clientName?: string;
	/** Email de cliente */
	contactEmail?: string;
	/** Estado del grupo */
	status: {
		/** Tipo de status */
		type: CDKStatusTypeEnum;
		/** Subipo de status */
		subType?: CDKStatusSubtypeEnum;
	};
	/** lista de contratos */
	contracts: number;
	/** Loading State */
	isLoading?: boolean;
	/** Empty State */
	emptyState?: boolean;
	/** Template name*/
	template: string;
	/** Disable option for feed */
	feedDisabled?: boolean;
	/** Header del detalle */
	detailHeader: string;
	/** Param-Types */
	paramTypes?: string[];
	/** Param-Data */
	paramList?: {
		label: string;
		text: string;
		parameterType: string;
	}[];
	/** Contract-Data */
	contractList?: ICDKContract[];
	trade_date?: string;
	/** Show the feed button */
	hasFeed?: boolean;
	/** Ending date time for ready to negotiate */
	blockEnd?: string;
	/** Topic permission */
	topicPermission?: boolean;
}

export interface ICDKContract {
	/** Identificador del contrato */
	id: string;
	/** Nombre del contrato */
	contractName: string;
}

/** Permission per action */
export interface ICDKPermissions {
	uploadEnabled: boolean;
	downloadEnabled: boolean;
	downloadEnabledIcon: boolean;
	delete: boolean;
	selectTemplate: boolean;
	startNegotation: boolean;
	vdr: boolean;
	escalate: boolean;
	deescalate: boolean;
	markAsAccepted: boolean;
	setUpParameters: boolean;
	setUpSignature: boolean;
	confirmParameters: boolean;
	editParameters: boolean;
	close: boolean;
	_reassignOperation: boolean;
	_downloadOperations: boolean;
	signed: boolean;
	reject: boolean;
	uploadSignedContract: boolean;
}

export interface ICDKStatusConfig {
	/** Codigo hexadecimal de color */
	color: string;
	/** Porcentaje del proceso a mostrar en la progress-bar */
	progress: number;
	/** Opción de poder subir template de amendment */
	uploadEnabled: boolean;
	/** Opción de admitir feed */
	showFeed: boolean;
	/** Show edit params*/
	editParamsEnabled?: boolean;
	/** Enable reasign operation */
	reasignOperationEnabled?: boolean;
	/** Lista de configuracion de los botones */
	buttonListConfig: {
		label: string;
		icon: string;
		eventName: string;
	}[];

	noProgressBar?: boolean;
	noDropDown?: boolean;
	date?: boolean;
}

/** Modelo para los literales del componente */
export interface ICDKContractLiterals {
	filterLiterals: UIFilterLiterals;
	itemCountLabel: string;
	subitemCountLabel: string;
	pending: string;
	inProgress: string;
	requested: string;
	done: string;
	filters: string;
	status: string;
	group: string;
	contracts: string;
	amendment: string;
	client: string;
	pendingToAssignTemplate: string;
	pendingToAssignParameters: string;
	pendingToAssignAmendment: string;
	proposalPreparation: string;
	proposalPreparationDelete: string;
	proposalPreparationAssigned: string;
	readyToNegotiate: string;
	blockedByClientOwner: string;
	negotation: string;
	negotationAccepted: string;
	negotationEscalated: string;
	negotationSigned: string;
	negotationParametersConfirmed: string;
	closedAgreed: string;
	closedProtocol: string;
	closedOriginalClause: string;
	closedContigency: string;
	closedNewContractsAfterISDAProtocol: string;
	selectTemplate: string;
	startNegotation: string;
	setUpParameters: string;
	vdr: string;
	createVdr?: string;
	escalate: string;
	deescalate: string;
	markAsAccepted: string;
	setUpSignature: string;
	confirmParameters: string;
	template: string;
	contact: string;
	emptyContact: string;
	close: string;
	tooltip: string;
	disabledTooltip: string;
	loadBtn: string;
	noTableMessage: string;
	noTableSubMessage: string;
	editParameters?: string;
	tableItemCount?: string;
	loading?: string;
	headerSummaryLiterals?: ICDKHeaderSummaryLiterals;
	tableLiterals?: IUITableLiterals;
	date?;
	signedContract: string;
	reject: string;
	uploadSignedContract: string;
	accessibleLoading?: string;
	emptyState: string;
	paramTypes: string[];
	detail: string;
	resend: string;
}

/** Enum para los tipos de status */
export enum CDKStatusTypeEnum {
	PENDING = 'pending',
	PROGRESS = 'progress',
	REQUESTED = 'requested',
	DONE = 'done',
	ERROR = 'error'
}

/** Enum para los subtipos de status */
export enum CDKStatusSubtypeEnum {
	BLOCKED_BY_CLIENT_OWNER = 'blockedByClientOwner',
	PROPOSAL_PREPARATION = 'proposalPreparation',
	PROPOSAL_PREPARATION_DELETE = 'proposalPreparationDelete',
	PROPOSAL_PREPARATION_ASSIGNED = 'proposalPreparationAssigned',
	PROPOSAL_PREPARATION_PARAMS_WAITING = 'proposalPreparationParamsWaiting',
	PROPOSAL_PREPARATION_PARAMS_CONFIRMED = 'proposalPreparationParamsConfirmed',
	PENDING_AMENDMENT = 'pendingAmendment',
	PENDING_SIGN = 'pendingSign',
	PENDING_SIGNATURE_CLIENT = 'pendingSignatureClient',
	PENDING_REVIEW_CLIENT = 'pendingReviewClient',
	READY_TO_NEGOTIATE = 'readyToNegotiate',
	NEGOTATION = 'negotation',
	NEGOTATION_NOVDR = 'negotationNoVdr',
	NEGOTATION_ACCEPTED = 'negotationAccepted',
	NEGOTATION_ACCEPTED_NOVDR = 'negotationAcceptedNoVdr',
	NEGOTATION_ESCALATED = 'negotationEscalated',
	NEGOTATION_ESCALATED_NOVDR = 'negotationEscalatedNoVdr',
	NEGOTATION_PENDING_DIGITAL_SIGNATURE = 'negotationPendingDigitalSignature',
	NEGOTATION_PENDING_DIGITAL_SIGNATURE_NOVDR = 'negotationPendingDigitalSignatureNoVdr',
	NEGOTATION_SIGNED = 'negotationSigned',
	NEGOTATION_SIGNED_NOVDR = 'negotationSignedNoVdr',
	NEGOTATION_PARAMETERS_CONFIRMED = 'negotationParametersConfirmed',
	NEGOTATION_PARAMETERS_CONFIRMED_NOVDR = 'negotationParametersConfirmedNoVdr',
	SIGNED_UNDER_REVIEW = 'signedUnderReview',
	CLOSED_AGREED = 'closedAgreed',
	CLOSED_AGREED_NOVDR = 'closedAgreedNoVdr',
	CLOSED_PROTOCOL = 'closedProtocol',
	CLOSED_PROTOCOL_NOVDR = 'closedProtocolNoVdr',
	CLOSED_ORIGINAL_CLAUSE = 'closedOriginalClause',
	CLOSED_ORIGINAL_CLAUSE_NOVDR = 'closedOriginalClauseNoVdr',
	CLOSED_CONTIGENCY = 'closedContigency',
	CLOSED_CONTIGENCY_NOVDR = 'closedContigencyNoVdr',
	CLOSED_NEW_CONTRACTS_AFTER_ISDA_PROTOCOL = 'closedNewContractsAfterISDAProtocol',
	CLOSED_NEW_CONTRACTS_AFTER_ISDA_PROTOCOL_NOVDR = 'closedNewContractsAfterISDAProtocolNoVdr',
	CLOSED_SIGNED = 'closedSigned',
	CLOSED_SIGNED_NOVDR = 'closedSignedNoVdr',
	CLOSED_PENDING_COMPENSATION = 'closedPendingCompensation',
	CLOSED_PENDING_COMPENSATION_NOVDR = 'closedPendingCompensationNoVdr',
	CLOSED_AGREED_COMPENSATION = 'closedAgreedCompensation',
	CLOSED_AGREED_COMPENSATION_NOVDR = 'closedAgreedCompensationNoVdr',
	CLOSED_NO_COMPENSATION = 'closedNoCompensation',
	CLOSED_NO_COMPENSATION_NOVDR = 'closedNoCompensationNoVdr',
	CLOSED_NEED_UPDATE = 'closedNeedUpdate',
	CLOSED_INVALID = 'closedInvalid',
	CLOSED_STATUTORYFALLBACK = 'ClosedStatutoryFallback',
	CLOSED_STATUTORYFALLBACK_NOVDR = 'ClosedStatutoryFallbackNoVdr',
	DIGITAL_SIGNATURE_PENDING = 'digitalSignaturePending',
	DIGITAL_SIGNATURE_ERROR = 'digitalSignatureError',
	DIGITAL_SIGNATURE_ERROR_NO_RESEND = 'digitalSignatureErrorNoResend',
	DIGITAL_SIGNATURE_COMPLETED = 'digitalSignatureCompleted'
}

/** Enum para los tipos de acciones de los botones */
export enum CDKButtonActionEnum {
	DELTE = 'delete',
	SELECT_TEMPLATE = 'selectTemplate',
	START_NEGOTATION = 'startNegotation',
	SET_UP_PARAMETERS = 'setUpParameters',
	VDR = 'vdr',
	ESCALATE = 'escalate',
	DEESCALATE = 'deescalate',
	MARK_AS_ACCEPTED = 'markAsAccepted',
	SET_UP_SIGNATURE = 'setUpSignature',
	CONFIRM_PARAMETERS = 'confirmParameters',
	CLOSE = 'close',
	UPLOADSIGNEDCONTRACT = 'uploadSignedContract'
}

/** Archetype avaible*/
export enum CDKStatusArchetypeEnum {
	IBOR = 'ibor',
	REVIEWER = 'reviewer'
}
