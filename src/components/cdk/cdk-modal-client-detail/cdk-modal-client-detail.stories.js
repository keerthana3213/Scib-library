import { getStoryConfig, parseObject, render,parseBoolean } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Modal Client Detail',
	...getStoryConfig('scib-cdk-modal-client-detail'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-modal-client-detail
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		apps='${parseObject(args.apps)}'
		show-apps='${parseBoolean(args.showApps)}'
	></scib-cdk-modal-client-detail>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		isRequiredLabel: '*Required input',
		buttonLabelList: ['Cancel', 'Create Group'],
		loading: 'Loading...',
		edit: 'Editar',
		resend:'Reenviar',
		delete: 'Eliminar cliente',
		userName: 'Nombre de Usuario',
		name: 'Nombre',
		surname: 'Apellidos',
		phoneNumber: 'Numero teléfono',
		idDocType: 'Id doc type',
		idNumber: 'idNumber',
		rol: 'role',
		company: 'Company',
		subsidiary: 'Subsidiary',
		appSelection: 'Seleccion apps',
        entity: 'Entity',
        entityDefault: 'Primary entity',
		userType: "USER TYPE",
		online: "Online",
		offline: "Offline",
		twoFactorActivated: "Two factor activated",
		deactivateUser: "Deactivate User",
		activateUser: "Activate User",
		frCommsActivated: "COMMUNICATION FRAMEWORK"
	},
	data: {
		title: 'detalle cliente',
		id: 1316,
		role: 'SAT',
		client_identifier: 'aleoncre@everis.com',
		created_on: '2020/05/04',
		modified_on: '2020/12/21',
		state: 'I',
		language: 'en-GB',
		subsidiary_id: 3726,
		provider_id: 16,
		state_reason: null,
		avatar: null,
		application: 'SCIBDP',
		num_login_err: 0,
		num_profile_changes: 0,
		ldap_uid: 'iG7BCWt6',
		email: null,
		name: 'Albertoo',
		surname: 'León',
		last_connection: '2020-12-16T20:07:47',
		last_password_change: '2020-11-16T18:17:37',
		fullName: 'Albertoo León',
		hiddenId: 1316,
		blank: '-',
		subsidiary: 'Santander',
		company: 'Santander',
		rol: 'Super Admin Tesorero',
		twoFactorActivated: 'Inactivo',
		// frCommsActivated: "Online",
		permission: true,
		permissionEdit: true,
        multiglcs_data: [
            {
                "subsidiary_id": 5409,
                "subsidiary_glcs": "BSTV",
                "subsidiary": "BANCO SANTANDER TOTTA S.A.",
                "company": "BANCO SANTANDER"
            },
            {
                "subsidiary_id": 3690,
                "subsidiary_glcs": "DCGC",
                "subsidiary": "EVERIS CHILE S A",
                "company": "EVERIS"
            },
            {
                "subsidiary_id": 3726,
                "subsidiary_glcs": "DCEY",
                "subsidiary": "EVERIS SPAIN S.L.",
                "company": "EVERIS"
            },
            {
                "subsidiary_id": 867,
                "subsidiary_glcs": "5INT",
                "subsidiary": "INDUSTRIA DE TURBO PROPULSORES SA",
                "company": "ROLLS ROYCE"
            }
        ]
	},
	apps: [
		{ id: 388, name: 'Contract Reviewer', select: false },
		{ id: 381, name: 'Settlement Instructions', select: true },
		{ id: 2, name: 'Santander Cash Nexus', select: true },
		{ id: 389, name: 'Pre Post Trade', select: false },
		{ id: 379, name: 'Analytics Reports', select: false },
		{ id: 385, name: 'Virtual Data Room', select: false },
		{ id: 387, name: 'IBOR Transition', select: false },
		{ id: 378, name: 'User access management', select: false },
		{ id: 3, name: 'Research', select: false },
		{ id: 371, name: 'Time Report SBGM', select: false },
		{ id: 367, name: 'E-Derivatives (Demo mode)', select: false },
		{ id: 7, name: 'Equity Futures and Options Organized Markets', select: false },
		{ id: 373, name: 'Permit for PRO', select: false },
		{ id: 372, name: 'Gestor de Candidatos', select: false },
		{ id: 5, name: 'Confirming Global', select: false },
		{ id: 4, name: 'FX', select: false },
		{ id: 9, name: 'Receivables Client Web', select: false },
		{ id: 10, name: 'OTC Clearing', select: false },
		{ id: 266, name: 'Supply Chain', select: false },
		{ id: 6, name: 'E-Derivatives', select: false },
		{ id: 8, name: 'Primary bonds Syndicate', select: false },
		{ id: 358, name: 'Dart', select: false },
		{ id: 35, name: 'Incident Report', select: false },
		{ id: 368, name: 'Research (Demo mode)', select: false },
		{ id: 366, name: 'Global Confirming (Demo mode)', select: false },
		{ id: 311, name: 'Mark To Market', select: false },
		{ id: 22, name: 'Trade Portal', select: false },
		{ id: 36, name: 'Informes MISCO', select: false },
		{ id: 96, name: 'Blotter', select: false },
		{ id: 37, name: 'Evaluación ACPM', select: false },
		{ id: 158, name: 'Appian', select: false },
		{ id: 314, name: 'Instrucciones de Liquidaciones Cash', select: false },
		{ id: 270, name: 'Cash Management Qlik Reports', select: false },
		{ id: 272, name: 'qlik-basic', select: false },
		{ id: 361, name: 'FX (Demo mode)', select: false },
		{ id: 307, name: 'LoanIQ', select: false },
	],
	showApps:true
	// Add default values here
};
