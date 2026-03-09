import { ICDKContractLiterals, ICDKStatusConfig, CDKStatusSubtypeEnum } from '../models/cdk-contract-list.model';
import { Colors } from '../../../../utils/helpers/styling-settings';

const buttonTypeConfig = (literals: ICDKContractLiterals) => {
	return {
		selectTemplate: {
			label: literals.selectTemplate,
			icon: 'icon-filepage',
			eventName: 'selectTemplate',
		},
		startNegotation: {
			label: literals.startNegotation,
			icon: 'icon-player',
			eventName: 'startNegotation',
		},
		vdr: {
			label: literals.vdr,
			icon: 'icon-message',
			eventName: 'vdr',
		},
		createVdr: {
			label: literals.createVdr,
			icon: 'icon-meeting',
			eventName: 'createVdr',
		},
		escalate: {
			label: literals.escalate,
			icon: 'icon-awarness',
			eventName: 'escalate',
		},
		deescalate: {
			label: literals.deescalate,
			icon: 'icon-awarness-fill',
			eventName: 'deescalate',
		},
		markAsAccepted: {
			label: literals.markAsAccepted,
			icon: 'icon-check',
			eventName: 'markAsAccepted',
		},
		setUpSignature: {
			label: literals.setUpSignature,
			icon: 'icon-sign',
			eventName: 'setUpSignature',
		},
		confirmParameters: {
			label: literals.confirmParameters,
			icon: 'icon-check',
			eventName: 'confirmParameters',
		},
		close: {
			label: literals.close,
			icon: 'icon-doc_ok',
			eventName: 'close',
		},
		delete: {
			label: '',
			icon: 'icon-delete',
			eventName: 'delete',
		},
		setUpParameters: {
			label: literals.setUpParameters,
			icon: 'icon-sign',
			eventName: 'setUpParameters',
		},
	};
};

export enum CDKStatusTypeEnumIbor {
	PENDING = 'pending',
	PROGRESS = 'progress',
	REQUESTED = 'requested',
	DONE = 'done',
}

export const statusConfigSwitchIbor = (caseStatus: CDKStatusSubtypeEnum, literlas: ICDKContractLiterals): ICDKStatusConfig => {
	const buttonType = buttonTypeConfig(literlas);
	switch (caseStatus) {
		case CDKStatusSubtypeEnum.PROPOSAL_PREPARATION_DELETE:
			return {
				color: Colors.seventh.mediumLight,
				progress: 0,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.selectTemplate, buttonType.delete],
			};
		case CDKStatusSubtypeEnum.PROPOSAL_PREPARATION:
			return {
				color: Colors.seventh.mediumLight,
				progress: 0,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.selectTemplate, buttonType.close],
			};
		case CDKStatusSubtypeEnum.PROPOSAL_PREPARATION_PARAMS_WAITING:
			return {
				color: Colors.seventh.mediumLight,
				progress: 15,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.setUpParameters, buttonType.close],
			};
		case CDKStatusSubtypeEnum.PROPOSAL_PREPARATION_PARAMS_CONFIRMED:
			return {
				color: Colors.seventh.mediumLight,
				progress: 20,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.close],
			};
		case CDKStatusSubtypeEnum.PROPOSAL_PREPARATION_ASSIGNED:
			return {
				color: Colors.seventh.mediumLight,
				progress: 25,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.close],
			};
		case CDKStatusSubtypeEnum.PENDING_AMENDMENT:
			return {
				color: Colors.sixtieth.base,
				progress: 40,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.startNegotation, buttonType.close],
			};
		case CDKStatusSubtypeEnum.READY_TO_NEGOTIATE:
			return {
				color: Colors.sixtieth.base,
				progress: 40,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.startNegotation, buttonType.close],
			};
		case CDKStatusSubtypeEnum.BLOCKED_BY_CLIENT_OWNER:
			return {
				color: Colors.sixtieth.base,
				progress: 40,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [],
			};
		case CDKStatusSubtypeEnum.NEGOTATION:
			return {
				color: Colors.tertiary.dark,
				progress: 50,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.vdr, buttonType.escalate, buttonType.markAsAccepted, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_ACCEPTED:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.vdr, buttonType.escalate, buttonType.setUpSignature, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_ESCALATED:
			return {
				color: Colors.tertiary.dark,
				progress: 50,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.vdr, buttonType.deescalate, buttonType.markAsAccepted, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_PENDING_DIGITAL_SIGNATURE:
			return {
				color: Colors.tertiary.dark,
				progress: 65,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.vdr, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_SIGNED:
			return {
				color: Colors.tertiary.dark,
				progress: 70,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.vdr, buttonType.confirmParameters, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_PARAMETERS_CONFIRMED:
			return {
				color: Colors.tertiary.dark,
				progress: 80,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.vdr, buttonType.close],
			};
		case CDKStatusSubtypeEnum.CLOSED_AGREED:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.vdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_PROTOCOL:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.vdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_ORIGINAL_CLAUSE:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.vdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_CONTIGENCY:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.vdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_NEW_CONTRACTS_AFTER_ISDA_PROTOCOL:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.vdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_PENDING_COMPENSATION:
			return {
				color: Colors.quaternary.base,
				progress: 95,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.vdr, buttonType.close],
			};
		case CDKStatusSubtypeEnum.CLOSED_AGREED_COMPENSATION:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.vdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_NO_COMPENSATION:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.vdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_STATUTORYFALLBACK:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.vdr],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_NOVDR:
			return {
				color: Colors.tertiary.dark,
				progress: 50,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.createVdr, buttonType.escalate, buttonType.markAsAccepted, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_ACCEPTED_NOVDR:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.createVdr, buttonType.escalate, buttonType.setUpSignature, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_ESCALATED_NOVDR:
			return {
				color: Colors.tertiary.dark,
				progress: 50,
				uploadEnabled: true,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.createVdr, buttonType.deescalate, buttonType.markAsAccepted, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_PENDING_DIGITAL_SIGNATURE_NOVDR:
			return {
				color: Colors.tertiary.dark,
				progress: 65,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.createVdr, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_SIGNED_NOVDR:
			return {
				color: Colors.tertiary.dark,
				progress: 70,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.createVdr, buttonType.confirmParameters, buttonType.close],
			};
		case CDKStatusSubtypeEnum.NEGOTATION_PARAMETERS_CONFIRMED_NOVDR:
			return {
				color: Colors.tertiary.dark,
				progress: 80,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.createVdr, buttonType.close],
			};
		case CDKStatusSubtypeEnum.CLOSED_AGREED_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.createVdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_PROTOCOL_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.createVdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_ORIGINAL_CLAUSE_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.createVdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_CONTIGENCY_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.createVdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_NEW_CONTRACTS_AFTER_ISDA_PROTOCOL_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.createVdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_PENDING_COMPENSATION_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 95,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.createVdr, buttonType.close],
			};
		case CDKStatusSubtypeEnum.CLOSED_AGREED_COMPENSATION_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.createVdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_NO_COMPENSATION_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.createVdr],
			};
		case CDKStatusSubtypeEnum.CLOSED_STATUTORYFALLBACK_NOVDR:
			return {
				color: Colors.quaternary.base,
				progress: 100,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: false,
				reasignOperationEnabled: false,
				buttonListConfig: [buttonType.createVdr],
			};
		default:
			return {
				color: '',
				progress: 0,
				uploadEnabled: false,
				showFeed: true,
				editParamsEnabled: true,
				reasignOperationEnabled: true,
				buttonListConfig: [buttonType.delete],
			};
	}
};
