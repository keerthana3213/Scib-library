import { getStoryConfig, parseBoolean, parseNumber, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Modal Files',
	...getStoryConfig('scib-ecmv-modal-files'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ecmv-modal-files name=''
		titleselector='${args.titleselector}'
		error-max-files='${args.errorMaxFiles}'
		error-format='${args.errorFormat}'
		maxfiles='${parseNumber(args.maxfiles)}'
		titlemodal='${args.titlemodal}'
		requiredinputs='${args.requiredinputs}'
		buttoncancelname='${args.buttoncancelname}'
		buttonclosename='${args.buttonclosename}'
		buttoncontinuename='${args.buttoncontinuename}'
		dropdownclasslabel='${args.dropdownclasslabel}'
		dropdownclassheader='${args.dropdownclassheader}'
		dropdowntypelabel='${args.dropdowntypelabel}'
		dropdowntypeheader='${args.dropdowntypeheader}'
		dropdownclassid='${args.dropdownclassid}'
		dropdowntypeid='${args.dropdowntypeid}'
		selecteddocclass='${parseObject(args.selecteddocclass)}'
		selecteddoctype='${parseObject(args.selecteddoctype)}'
		docclass='${parseObject(args.alldocclass)}'
		metadatavalues='${parseObject(args.metadatavalues)}'
		automaticdata='${parseObject(args.automaticdata)}'
		filesarray='${args.filesarray}'
		numfilesarray='${parseNumber(args.numfilesarray)}'
		open='${parseBoolean(args.open)}'
		loading-save-and-continue='${parseBoolean(args.loadingSaveAndContinue)}'
		literals-toaster-action='${parseObject(args.literalsToasterAction)}'
		sailpoint-url='${args.sailpointUrl}'>
	</scib-ecmv-modal-files>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	open: true,
	titleselector: 'Select or Drag Files*',
	errorMaxFiles: 'Sorry, you cannot upload more than 10 files at a time',
	errorFormat: 'The file or extension is not supported',
	maxfiles: 5,
	titlemodal: 'Add files',
	requiredinputs: '*Required inputs',
	buttoncancelname: 'Cancel',
	buttonclosename: 'Save and close',
	buttoncontinuename: 'Save and continue',
	dropdownclasslabel: 'DOCUMENT CLASS*',
	dropdownclassheader: 'Choose Class',
	dropdowntypelabel: 'DOCUMENT TYPE*',
	dropdowntypeheader: 'Choose type',
	dropdownclassid: 'documentClass',
	dropdowntypeid: 'documentType',
	literalsToasterAction: {
		message: 'Si no puede encontrar los valores que está buscando, es posible que necesites más permisos. Puede encontrarlos en la herramienta de Sailpoint.',
		doNotShowAgain: 'No mostrar de nuevo',
		goToSailPoint: 'Ir a Sailpoint'
	},
	sailpointUrl: 'TESTO URL',
	// metadatavalues: [
	// 	{
	// 		'id_doc_metadata': 'clientName',
	// 		't_name': 'Client Name',
	// 		't_description': null,
	// 		't_type': 'String(ValueList)',
	// 		'b_automatic': false,
	// 		't_cardinality': 'multi',
	// 		't_list': null,
	// 		't_list_value': 'Accounting controls#id1||Contracts#id2||Legal persons and entities#id3',
	// 		'options': null,
	// 	},
	// 	{
	// 		'id_doc_metadata': 'geography',
	// 		't_name': 'Geography owner document*',
	// 		't_description': null,
	// 		't_type': 'String(ValueList)',
	// 		'b_automatic': false,
	// 		't_cardinality': 'single',
	// 		't_list': null,
	// 		't_list_value': 'Bill of Lading#id1||Bill#id2||Boadilla#id3',
	// 		'options': null,
	// 		'selectedDefaultLabel': 'Default' 
	// 	},
	// 	{
	// 		'id_doc_metadata': 'typeProduct',
	// 		't_name': 'Type of product',
	// 		't_description': null,
	// 		't_type': 'String',
	// 		'b_automatic': false,
	// 		't_cardinality': null,
	// 		't_list': null,
	// 		't_list_value': '',
	// 		'options': null,
	// 	},
	// 	{
	// 		'id_doc_metadata': 'inputText',
	// 		't_name': 'Input automatic',
	// 		't_description': null,
	// 		't_type': 'String',
	// 		'b_automatic': true,
	// 		't_cardinality': null,
	// 		't_list': null,
	// 		't_list_value': '',
	// 		'options': null,
	// 	},
	// 	{
	// 		'id_doc_metadata': 'signature',
	// 		't_name': 'Date signature',
	// 		't_description': null,
	// 		't_type': 'Date',
	// 		'b_automatic': false,
	// 		't_cardinality': null,
	// 		't_list': null,
	// 		't_list_value': '',
	// 		'options': null,
	// 	},
	// 	{
	// 		'id_doc_metadata': 'automaticSignature',
	// 		't_name': 'Date automatic',
	// 		't_description': null,
	// 		't_type': 'Date',
	// 		'b_automatic': true,
	// 		't_cardinality': null,
	// 		't_list': null,
	// 		't_list_value': '',
	// 		'options': null,
	// 	},
	// 	{
	// 		'id_doc_metadata': 'DocumentOwner',
	// 		't_name': 'Select automatic',
	// 		't_description': null,
	// 		't_type': 'String(ValueList)',
	// 		'b_automatic': true,
	// 		't_cardinality': null,
	// 		't_list': null,
	// 		't_list_value': '',
	// 		'options': null,
	// 	},
	// 	{
	// 		'id_doc_metadata': 'BusinessProcess',
	// 		't_name': 'Select automatic',
	// 		't_description': null,
	// 		't_type': 'String(ValueList)',
	// 		'b_automatic': true,
	// 		't_cardinality': null,
	// 		't_list': null,
	// 		't_list_value': '',
	// 		'options': null,
	// 	},
	// 	{
	// 		'id_doc_metadata': 'GN_ID',
	// 		't_name': 'GN_ID',
	// 		't_description': null,
	// 		't_type': 'String',
	// 		'b_automatic': true,
	// 		't_cardinality': 'single',
	// 		't_list': null,
	// 		't_list_value': '',
	// 		'options': null,
	// 	},

	// ],
	// automaticdata: [
	// 	{
	// 		'display_value_metadata': 'Automatic!',
	// 		'documentclass': {
	// 			'id_doc_class': 'Approvals',
	// 			't_description': 'Banking',
	// 			't_name': 'Approvals',
	// 		},
	// 		'documentmetadata': {
	// 			'b_automatic': true,
	// 			'b_list': false,
	// 			'id_doc_metadata': 'GDPR',
	// 			't_cardinality': 'single',
	// 			't_description': '',
	// 			't_list_value': 'Yes#Yes||No#No',
	// 			't_name': 'GDPR',
	// 			't_type': 'String(ValueList)',
	// 		},
	// 		'documenttype': {
	// 			'id_doc_type': '23TY',
	// 			't_description': '',
	// 			't_name': 'Risk approval',
	// 		},
	// 		'id_doc_class': 'Approvals Input',
	// 		'id_doc_metadata': 'inputText',
	// 		'id_doc_type': '23TY',
	// 		'id_metadata_autom': '169',
	// 		'value_metadata': 'No',
	// 	},
	// 	{
	// 		'display_value_metadata': '2021-04-04',
	// 		'documentclass': {
	// 			'id_doc_class': 'Approvals',
	// 			't_description': 'Banking',
	// 			't_name': 'Approvals',
	// 		},
	// 		'documentmetadata': {
	// 			'b_automatic': true,
	// 			'b_list': false,
	// 			'id_doc_metadata': 'ConfidentialityLevel',
	// 			't_cardinality': 'single',
	// 			't_description': '',
	// 			't_list_value': 'Public#Public||Internal#Internal||Confidential#Confidential||Restricted Confidential#RestrictedConfidential||Secret#Secret',
	// 			't_name': 'Confidentiality level',
	// 			't_type': 'String(ValueList)',
	// 		},
	// 		'documenttype': {
	// 			'id_doc_type': '23TY',
	// 			't_description': '',
	// 			't_name': 'Risk approval',
	// 		},
	// 		'id_doc_class': 'Approvals',
	// 		'id_doc_metadata': 'automaticSignature',
	// 		'id_doc_type': '23TY',
	// 		'id_metadata_autom': '168',
	// 		'value_metadata': 'RestrictedConfidential',
	// 	},
	// 	{
	// 		'display_value_metadata': 'Business Support',
	// 		'documentclass': {
	// 			'id_doc_class': 'Approvals',
	// 			't_description': 'Banking',
	// 			't_name': 'Approvals',
	// 		},
	// 		'documentmetadata': {
	// 			'b_automatic': true,
	// 			'b_list': false,
	// 			'id_doc_metadata': 'BusinessProcess',
	// 			't_cardinality': 'single',
	// 			't_description': '',
	// 			't_list_value': 'Accounting#Accounting||Brokerage#Brokerage||Business support#Businesssupport||Client service#Clientservice||Collateral set up and maintenance#Collateralmaintenance||Confirmation#Confirmation||Controls, executions & analysis#Controlsexecutionsanalysis||Events management#Eventsmanagement||Financial reporting#Financialreporting||Functional support#Functionalsupport||Incidences correction / regularization#Incidencescorrectionregularization||Management of requests#Managementrequests||Position management & funding#Positionmanagementfunding||Process monitoring#Processmonitoring||Provisioning & reporting#Provisioningreporting||Reconcilation, execution & analysis#Reconcilationexecutionanalysis||Settlement#Settlement||Transactional reporting#Transactionalreporting||Validation / Origination #ValidationOrigination',
	// 			't_name': 'Business process',
	// 		},
	// 		'documenttype': {
	// 			'id_doc_type': '23TY',
	// 			't_description': '',
	// 			't_name': 'Risk approval',
	// 		},
	// 		'id_doc_class': 'Approvals',
	// 		'id_doc_metadata': 'BusinessProcess',
	// 		'id_doc_type': '23TY',
	// 		'id_metadata_autom': '167',
	// 		'value_metadata': 'Businesssupport',
	// 	},
	// 	{
	// 		'display_value_metadata': 'Riesgos',
	// 		'documentclass': {
	// 			'id_doc_class': 'Approvals',
	// 			't_description': 'Banking',
	// 			't_name': 'Approvals',
	// 		},
	// 		'documentmetadata': {
	// 			'b_automatic': true,
	// 			'b_list': false,
	// 			'id_doc_metadata': 'DocumentOwner',
	// 			't_cardinality': 'multi',
	// 			't_description': '',
	// 			't_list_value': '1LOD B Boadilla#1LODBBoadilla||ACPM#ACPM||Asesoría Jurídica#AsesoríaJurídica||Asset servicing#Assetservicing||Banking#Banking||Brokerage#Brokerage||Business Delegated Services#BusinessDelegatedServices||Cash nexus#Cashnexus||Client Due Diligence#ClientDueDiligence||Client service#Clientservice||Data Quality#DataQuality||FC & Ops #FC&Ops||FC & OPS - Transaction Monitoring#FC&OPSTM||FC & OPS- Batch Screening#FC&OPSBS||Front office#Frontoffice||Middle office#Middleoffice||MO Export Finance#MOExportFinance||MO Global Debt Financing #MOGlobalDebtFinancing||MO Markets#MOMarkets||MO Trade & Working Capital Solutions#MOTrade||OTC Derivatives#OTCDerivatives||Riesgos#Riesgos||SBGM - Client Data#SBGM-ClientData||SBGM Documentación#SBGMDocumentación||Securities#Securities||Securities Financing Operations - Collateral Management & CCP Clearing#SecuritiesFinancingOperations||Treasury FXMM - Transaccional (FRK; MLN; LON; PARIS, CONSUMER)#FXMMCONSUMER||Treasury FXMM - Transaccional (FRK; potencialmente MLN; PARIS)#FXMM||Treasury FXMM ASIA#TreasuryFXMMASIA||Treasury FXMM Madrid#TreasuryFXMMMadrid||Treasury- OTC Derivatives#TreasuryOTCDerivatives||Tresuary ETDs#TresuaryETDs',
	// 			't_name': 'Document owner',
	// 			't_type': 'String(ValueList)',
	// 		},
	// 		'documenttype': {
	// 			'id_doc_type': '23TY',
	// 			't_description': '',
	// 			't_name': 'Risk approval',
	// 		},
	// 		'id_doc_class': 'Approvals',
	// 		'id_doc_metadata': 'DocumentOwner',
	// 		'id_doc_type': '23TY',
	// 		'id_metadata_autom': '166',
	// 		'value_metadata': 'Riesgos',
	// 	},
	// ],
	selecteddocclass: {
		'id_doc_class': 'AccountingControls',
		't_name': 'Accounting controls',
		't_description': 'FC & Ops',
	},
	selecteddoctype: {
		'id_doc_type': '32TY',
		't_name': 'Bill of Lading',
		't_description': '',
	},
	// alldocclass: [
	// 	{
	// 		'id_doc_class': 'AccountingControls',
	// 		't_name': 'Accounting controls',
	// 		't_description': 'FC & Ops',
	// 		'documentyype': [
	// 			{
	// 				'id_doc_type': '32TY',
	// 				't_name': 'Bill of Lading',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '33TY',
	// 				't_name': 'Bill',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '04TY',
	// 				't_name': 'Invoices Issued',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '03TY',
	// 				't_name': 'Invoices received from vendors',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '02TY',
	// 				't_name': 'Manual accounting sheets',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '01AS',
	// 				't_name': 'NCT0 accounting notes',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '02AS',
	// 				't_name': '9006 SISA  accounting notes',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '03AS',
	// 				't_name': '9006 No SISA accounting notes',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '04AS',
	// 				't_name': 'SISA notes accounting',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '05ETD',
	// 				't_name': 'Conciliation Markets',
	// 				't_description': '',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		'id_doc_class': 'Approvals',
	// 		't_name': 'Approvals',
	// 		't_description': 'Banking',
	// 		'documentyype': [
	// 			{
	// 				'id_doc_type': '23TY',
	// 				't_name': 'Risk approval',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '26TY',
	// 				't_name': 'Other approvals / evidences',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '13TY',
	// 				't_name': 'Closing Memo Mercurio',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '12TY',
	// 				't_name': 'Breakdown of operations',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '19TY',
	// 				't_name': 'HVD',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '02TM',
	// 				't_name': 'Print out confirma y liquida (currency <> EUR)',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '18EF',
	// 				't_name': 'Front sheet EF',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '14MG',
	// 				't_name': 'Front Sheet GDF',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '08MT',
	// 				't_name': 'Front Sheet T&WCS',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '09DO',
	// 				't_name': 'OK front office',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '12DO',
	// 				't_name': 'Sending of documents to the office',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '02BD',
	// 				't_name': 'Risk document approved with limit and price conditions',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '01TY',
	// 				't_name': 'Audit requests',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '20MG',
	// 				't_name': 'Base case',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '14TY',
	// 				't_name': 'Compliance certificate',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '12MG',
	// 				't_name': 'Due diligence environment',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '11MG',
	// 				't_name': 'Due dillegence technical',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '15TY',
	// 				't_name': 'Enviromental Monitoring Report',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '17TY',
	// 				't_name': 'Financial staments',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '10MG',
	// 				't_name': 'Due Dilligence Legal ',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '04ETD',
	// 				't_name': 'Market Information',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '29TY',
	// 				't_name': 'Monitoring report',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '22TY',
	// 				't_name': 'Others documents',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '24EF',
	// 				't_name': 'Other general undertaking',
	// 				't_description': '',
	// 			},
	// 		],
	// 	},
	// 	{
	// 		'id_doc_class': 'Instructions',
	// 		't_name': 'Instructions',
	// 		't_description': 'Brokerage',
	// 		'documentyype': [
	// 			{
	// 				'id_doc_type': '09BR',
	// 				't_name': 'Manual payment sheets',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '01TM',
	// 				't_name': 'Reuters conversation Treasury Madrid',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '01TA',
	// 				't_name': 'Reuters conversation Treasury Asia',
	// 				't_description': '',
	// 			},
	// 			{
	// 				'id_doc_type': '04CS',
	// 				't_name': 'Manual payment orders',
	// 				't_description': '',
	// 			},
	// 		],
	// 	},
	// ],
	// alldoctypex: [
	// 	{
	// 		'id_dc_metadata': '1',
	// 		'documenttype': {
	// 			'id_doc_type': '32TY',
	// 			't_name': 'Bill of Lading',
	// 			't_description': '',
	// 		},
	// 		'documentmetadata': {
	// 			'id_doc_metadata': 'ClientName',
	// 			't_name': 'Client name',
	// 			't_description': '',
	// 			't_type': 'String',
	// 			'b_automatic': false,
	// 			't_cardinality': 'multi',
	// 			'b_list': false,
	// 			't_list_value': '',
	// 		},
	// 	},
	// 	{
	// 		'id_dc_metadata': '2',
	// 		'documenttype': {
	// 			'id_doc_type': '32TY',
	// 			't_name': 'Bill of Lading',
	// 			't_description': '',
	// 		},
	// 		'documentmetadata': {
	// 			'id_doc_metadata': 'DocumentType',
	// 			't_name': 'Document type',
	// 			't_description': '',
	// 			't_type': 'String',
	// 			'b_automatic': false,
	// 			't_cardinality': 'single',
	// 			'b_list': false,
	// 			't_list_value': '',
	// 		},
	// 	},
	// 	{
	// 		'id_dc_metadata': '3',
	// 		'documenttype': {
	// 			'id_doc_type': '32TY',
	// 			't_name': 'Bill of Lading',
	// 			't_description': '',
	// 		},
	// 		'documentmetadata': {
	// 			'id_doc_metadata': 'GeographyOwnerDocument',
	// 			't_name': 'Geography owner document',
	// 			't_description': '',
	// 			't_type': 'String(ValueList)',
	// 			'b_automatic': false,
	// 			't_cardinality': 'single',
	// 			'b_list': true,
	// 			't_list_value': 'Banco Santander Beijing#BancoSantanderBeijing||Banco Santander Brasil#BancoSantanderBrasil||Banco Santander Shangai#BancoSantanderShangai||Banco Santander Singapore#BancoSantanderSingapore||Open Bank, S.A.#OpenBankSA||Santander Bank N. A.#SantanderBankNA||Santander Consumer finance#SantanderConsumerfinance||Santander UK#SantanderUK||SCIB Argentina#SCIBArgentina||SCIB Boadilla#SCIBBoadilla||SCIB Chile#SCIBChile||SCIB Colombia#SCIBColombia||SCIB Frankfurt Branch#SCIBFrankfurtBranch||SCIB Hong Kong#SCIBHongKong||SCIB London Branch#SCIBLondonBranch||SCIB México#SCIBMéxico||SCIB Milan Branch#SCIBMilanBranch||SCIB New York Branch#SCIBNewYorkBranch||SCIB Paris Branch#SCIBParisBranch||SCIB Peru#SCIBPeru||SCIB Poland#SCIBPoland||SCIB Portugal#SCIBPortugal||SCIB Spain#SCIBSpain||SCIB Uruguay#SCIBUruguay',
	// 		},
	// 	},
	// ],
	// Add default values here
};
