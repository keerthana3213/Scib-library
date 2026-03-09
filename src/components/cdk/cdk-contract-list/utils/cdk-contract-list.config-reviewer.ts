import { ICDKStatusConfig, ICDKContractLiterals, CDKStatusSubtypeEnum } from '../models/cdk-contract-list.model';
import { Colors } from '../../../../utils/helpers/styling-settings';

export const CDKStatusTypeEnumReviewer = {
	PENDING: 'pending',
	SIGNED: 'signed',
	DONE: 'done'
};

const buttonTypeConfig = (literals: ICDKContractLiterals) => {
	return {
		vdr: {
			label: literals.vdr,
			icon: 'icon-message',
			eventName: 'vdr'
		},
		markAsAccepted: {
			label: literals.markAsAccepted,
			icon: 'icon-check',
			eventName: 'markAsAccepted'
		},
		setUpSignature: {
			label: literals.setUpSignature,
			icon: 'icon-sign',
			eventName: 'setUpSignature'
		},
		close: {
			label: literals.close,
			icon: 'icon-doc_ok',
			eventName: 'close'
		},
		delete: {
			label: '',
			icon: 'icon-delete',
			eventName: 'delete'
		},
		signed: {
			label: literals.signedContract,
			icon: 'icon-sign',
			eventName: 'signed'
		},
		reject: {
			label: literals.reject,
			icon: 'icon-reject',
			eventName: 'reject'
		},
		uploadSignedContract: {
			label: literals.uploadSignedContract,
			icon: 'icon-upload',
			eventName: 'uploadSignedContract'
		},
		detail: {
			label: literals.detail,
			icon: 'icon-information-in-a-circle',
			eventName: 'openDetail'
		},
		resend: {
			label: literals.resend,
			icon: 'icon-send',
			eventName: 'resend'
		}
	};
};

export const statusConfigSwitchReviewer = (caseStatus, literals, permission?): ICDKStatusConfig => {
	const buttonType = buttonTypeConfig(literals);
	let configDigital;
	switch (caseStatus) {
		case CDKStatusSubtypeEnum.CLOSED_SIGNED:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.vdr]
			};
		case CDKStatusSubtypeEnum.CLOSED_NEED_UPDATE:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.vdr]
			};
		case CDKStatusSubtypeEnum.CLOSED_INVALID:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.vdr]
			};
		case CDKStatusSubtypeEnum.PENDING_SIGN:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.reject, buttonType.signed, buttonType.vdr]
			};
		case CDKStatusSubtypeEnum.PENDING_SIGNATURE_CLIENT:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.signed, buttonType.uploadSignedContract, buttonType.vdr]
			};
		case CDKStatusSubtypeEnum.PENDING_REVIEW_CLIENT:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.vdr]
			};
		case CDKStatusSubtypeEnum.SIGNED_UNDER_REVIEW:
			return {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.reject, buttonType.signed, buttonType.vdr]
			};
		case CDKStatusSubtypeEnum.DIGITAL_SIGNATURE_ERROR:
			configDigital = {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.resend, buttonType.detail, buttonType.reject, buttonType.vdr]
			};
			if (!permission.hasOwnProperty(buttonType.detail.eventName)) {
				configDigital.buttonListConfig.splice(1, 1);
			}
			if (!permission.hasOwnProperty(buttonType.reject.eventName)) {
				configDigital.buttonListConfig.splice(1, 1);
			}
			if (!permission.resend) {
				configDigital.buttonListConfig.shift();
			}
			return configDigital;
		case CDKStatusSubtypeEnum.DIGITAL_SIGNATURE_ERROR_NO_RESEND:
			configDigital = {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.detail, buttonType.reject, buttonType.vdr]
			};
			if (!permission.hasOwnProperty(buttonType.detail.eventName)) {
				configDigital.buttonListConfig.shift();
			}
			return configDigital;
		case CDKStatusSubtypeEnum.DIGITAL_SIGNATURE_PENDING:
			configDigital = {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.reject, buttonType.detail, buttonType.vdr]
			};
			if (!permission.hasOwnProperty(buttonType.reject.eventName)) {
				configDigital.buttonListConfig.shift();
			}
			if (!permission.hasOwnProperty(buttonType.detail.eventName)) {
				configDigital.buttonListConfig.shift();
			}
			return configDigital;
		case CDKStatusSubtypeEnum.DIGITAL_SIGNATURE_COMPLETED:
			configDigital = {
				color: Colors.tertiary.dark,
				progress: 60,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.reject, buttonType.detail, buttonType.vdr]
			};
			if (!permission.hasOwnProperty(buttonType.detail.eventName)) {
				configDigital.buttonListConfig.splice(1, 1);
			}
			return configDigital;
		default:
			return {
				color: '',
				progress: 0,
				uploadEnabled: false,
				showFeed: false,
				noProgressBar: true,
				noDropDown: true,
				date: true,
				buttonListConfig: [buttonType.uploadSignedContract, buttonType.vdr]
			};
	}
};
