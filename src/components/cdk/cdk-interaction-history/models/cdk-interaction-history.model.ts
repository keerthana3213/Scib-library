export interface ICDKInteractionHistoryData {
	showForm: boolean;
	interactions: ICDKInteractionHistoryInteraction[];
}

export interface ICDKInteractionHistoryInteraction {
	date: string;
	interactionType: CDKInteractionHistoryTypeEnum;
	channel: CDKInteractionHistoryChannelEnum;
	description?: string;
}

export interface ICDKInteractionHistoryLiterals {
	[key: string]: any;
}

/** Interaction Type Enum */
export enum CDKInteractionHistoryTypeEnum {
	CHANGE_STATUS = 'Change Status',
	REMINDER_TO_INITIATE_IBOR_NEGOTIATION = 'Reminder to initiate IBOR negotiation',
	CHASING_TO_ONBOARD_CLIENT_IN_IBOR_CLIENT_HUB_1 = 'Chasing to on-board client in IBOR Client Hub 1',
	CHASING_TO_ONBOARD_CLIENT_IN_IBOR_CLIENT_HUB_2 = 'Chasing to on-board client in IBOR Client Hub 2',
	CHASING_TO_ONBOARD_CLIENT_IN_IBOR_CLIENT_HUB_3 = 'Chasing to on-board client in IBOR Client Hub 3',
	CLIENT_ON_BOARDED_IN_VDR = 'Client On boarded in VDR',
	CHASING_TO_INITIATE_NEGOTIATION_1 = 'Chasing to initiate negotiation 1',
	CHASING_TO_INITIATE_NEGOTIATION_2 = 'Chasing to initiate negotiation 2',
	CHASING_TO_INITIATE_NEGOTIATION_3 = 'Chasing to initiate negotiation 3',
	NEGOTIATION_INTERACTIONS_PDT_SANTANDER = 'Negotiation interactions (PDT SANTANDER)',
	NEGOTIATION_INTERACTIONS_PDT_CLIENTE = 'Negotiation interactions (PDT CLIENTE)',
	CHASING_NEGOTIATION_INITIATED_1 = 'Chasing negotiation initiated 1',
	CHASING_NEGOTIATION_INITIATED_2 = 'Chasing negotiation initiated 2',
	CHASING_NEGOTIATION_INITIATED_3 = 'Chasing negotiation initiated 3',
	CHASING_NEGOTIATION_FOR_SIGN_OFF_1 = 'Chasing negotiation for sign off 1',
	CHASING_NEGOTIATION_FOR_SIGN_OFF_2 = 'Chasing negotiation for sign off 2',
	CHASING_NEGOTIATION_FOR_SIGN_OFF_3 = 'Chasing negotiation for sign off 3',
	INTERNAL_ESCALATION_LEGAL_1 = 'Internal Escalation Legal 1',
	INTERNAL_ESCALATION_LEGAL_2 = 'Internal Escalation Legal 2',
	INTERNAL_ESCALATION_LEGAL_3 = 'Internal Escalation Legal 3',
	INTERNAL_ESCALATION_AO_1 = 'Internal Escalation AO 1',
	INTERNAL_ESCALATION_AO_2 = 'Internal Escalation AO 2',
	INTERNAL_ESCALATION_AO_3 = 'Internal Escalation AO 3',
	INTERNAL_ESCALATION_PROJECT_TEAM_1 = 'Internal Escalation Project team 1',
	INTERNAL_ESCALATION_PROJECT_TEAM_2 = 'Internal Escalation Project team 2',
	INTERNAL_ESCALATION_PROJECT_TEAM_3 = 'Internal Escalation Project team 3',
	INTERNAL_ESCALATION_BUSINESS_1 = 'Internal Escalation Business 1',
	INTERNAL_ESCALATION_BUSINESS_2 = 'Internal Escalation Business 2',
	INTERNAL_ESCALATION_BUSINESS_3 = 'Internal Escalation Business 3',
	CASH_COMPENSATION_ATTEMPT_1 = 'Cash compensation - attempt 1',
	CASH_COMPENSATION_ATTEMPT_2 = 'Cash compensation - attempt 2',
	CASH_COMPENSATION_ATTEMPT_3 = 'Cash compensation - attempt 3',
	CASH_COMPENSATION_ATTEMPT_4 = 'Cash compensation - attempt 4',
	CASH_COMPENSATION_ATTEMPT_5 = 'Cash compensation - attempt 5',
	CASH_COMPENSATION_ATTEMPT_6 = 'Cash compensation - attempt 6',
}

/** Channel Enum */
export enum CDKInteractionHistoryChannelEnum {
	CLIENTHUB = 'ClientHub',
	EMAIL = 'Email',
	PHONE = 'Phone',
	INTEGRATION = 'Integration',
	OTHER = 'Other',
}
