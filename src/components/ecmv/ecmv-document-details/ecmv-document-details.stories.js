import { getStoryConfig, parseBoolean, parseNumber, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Document Details',
	...getStoryConfig('scib-ecmv-document-details'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ecmv-document-details 
		titlemodal='${args.titlemodal}'
		download-btn='${args.downloadBtn}'
		edit-btn='${args.editBtn}'
		recent-version='${args.recentVersion}'
		datafile='${parseObject(args.datafile)}'
		metadatavalues='${parseObject(args.metadatavalues)}'
		titleselector='${args.titleselector}'
		maxfiles='${parseNumber(args.maxfiles)}'
		filesarray='${parseObject(args.filesarray)}'
		buttoncancelname='${args.buttoncancelname}'
		buttonsavename='${args.buttonsavename}'
		isClosedModalDetail='${parseBoolean(args.isClosedModalDetail)}'
	></scib-ecmv-document-details>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	titlemodal: 'Document details',
	downloadBtn: 'Download',
	editBtn: 'Edit',
	recentVersion: 'Recent version',
	titleselector: 'Select or Drag Files to Update',
	buttoncancelname: 'Cancel',
	buttonsavename: 'Save',
	maxfiles: 1,
	filesarray: [],
	datafile: {
		'id': '{F0376E86-81F8-43F2-93AB-D1E5C9B3A1E3}', 'metadatos': [
			{ 'nombre': 'ClassDescription', 'multi': false, 'valor': 'Contracts' },
			{ 'nombre': 'Creator', 'multi': false, 'valor': 'dfndigplat' },
			{ 'nombre': 'DateCreated', 'multi': false, 'valor': '2020-09-02T09:32:56+02' },
			{ 'nombre': 'DateLastModified', 'multi': false, 'valor': '2020-09-02T09:32:57+02' },
			{ 'nombre': 'DocumentTitle', 'multi': false, 'valor': 'accesos-24x7-20200628_101252.xlsx.xlsx.xlsx.xlsx' },
			{ 'nombre': 'LastModifier', 'multi': false, 'valor': 'dfndigplat' }, { 'nombre': 'LockOwner', 'multi': false, 'valor': null },
			{ 'nombre': 'DocumentTitle', 'multi': false, 'valor': 'accesos-24x7-20200628_101252.PDF.xlsx.xlsx.pdf' },
			{ 'nombre': 'GN_CADUCITYDATE', 'multi': false, 'valor': null }, { 'nombre': 'GN_CREATIONDATE', 'multi': false, 'valor': null },
			{ 'nombre': 'GN_DATE', 'multi': false, 'valor': null }, { 'nombre': 'GN_DOC_ORIG', 'multi': false, 'valor': null },
			{ 'nombre': 'GN_ID', 'multi': false, 'valor': 'DCC5D1DA67DE47328E24099D871112B8' },
			{ 'nombre': 'GN_NAME', 'multi': false, 'valor': null }, { 'nombre': 'GN_VALIDITYDATE', 'multi': false, 'valor': null },
			{ 'nombre': 'GDPR', 'multi': false, 'valor': false },
			{ 'nombre': 'ConfidentialityLevel', 'multi': false, 'valor': 'RestrictedConfidential' },
			{ 'nombre': 'BusinessProcess', 'multi': false, 'valor': 'ValidationOrigination' },
			{ 'nombre': 'Geographymanagesdocument', 'multi': false, 'valor': 'SCIBArgentina' },
			{ 'nombre': 'Geographyownerdocument', 'multi': false, 'valor': 'SCIBArgentina' },
			{ 'nombre': 'DocumentType', 'multi': false, 'valor': '01BD' }, { 'nombre': 'DocumentOwner', 'multi': true, 'valor': ['Frontoffice'] },
			{ 'nombre': 'ContractCode', 'multi': false, 'valor': null }, { 'nombre': 'DateSignature', 'multi': false, 'valor': null },
			{ 'nombre': 'IBORRate', 'multi': false, 'valor': null }, { 'nombre': 'IBORRelated', 'multi': false, 'valor': false },
			{ 'nombre': 'Interventer', 'multi': false, 'valor': null }, { 'nombre': 'OperationName', 'multi': false, 'valor': null },
			{ 'nombre': 'ProjectName', 'multi': false, 'valor': null }, { 'nombre': 'ShortCode', 'multi': false, 'valor': null },
			{ 'nombre': 'TypeProduct', 'multi': false, 'valor': 'NotInformed' }, { 'nombre': 'CodeGLCS', 'multi': false, 'valor': '' },
			{ 'nombre': 'ApplicableLaw', 'multi': false, 'valor': 'NotInformed' }, { 'nombre': 'ClientCIF', 'multi': false, 'valor': '' },
			{ 'nombre': 'BICCode', 'multi': false, 'valor': '' }, { 'nombre': 'MessageDate', 'multi': false, 'valor': null },
			{ 'nombre': 'OperationID', 'multi': false, 'valor': '' }, { 'nombre': 'TradeDate', 'multi': false, 'valor': null },
			{ 'nombre': 'IBORtypeofproduct', 'multi': false, 'valor': null },
			{ 'nombre': 'IBORAmendedStatus', 'multi': false, 'valor': 'NotAmended' },
			{ 'nombre': 'ExpirationDate', 'multi': false, 'valor': null }, { 'nombre': 'ClientName', 'multi': true, 'valor': ['gfd'] },
			{ 'nombre': 'GBOReference', 'multi': false, 'valor': '' }, { 'nombre': 'ReferenceType', 'multi': false, 'valor': '' },
			{ 'nombre': 'Currency', 'multi': false, 'valor': '' }, { 'nombre': 'EventType', 'multi': false, 'valor': 'NotInformed' },
			{ 'nombre': 'GlobalAmount', 'multi': false, 'valor': '' }, { 'nombre': 'MarketType', 'multi': false, 'valor': 'NotInformed' },
			{ 'nombre': 'MessageID', 'multi': false, 'valor': '' }, { 'nombre': 'MurexLabel', 'multi': false, 'valor': '' },
			{ 'nombre': 'RateFee', 'multi': false, 'valor': '' }, { 'nombre': 'TypeofAgreement', 'multi': false, 'valor': 'NotInformed' },
			{ 'nombre': 'Vendor', 'multi': false, 'valor': '' }, { 'multi': false, 'nombre': 'Size', 'valor': '0.01 MB' },
		],
	},
	metadatavalues: [
		{
			'id_dc_metadata': 1792,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'Vendor',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'Vendor',
				't_name': 'Vendor',
				't_description': '',
				't_type': 'String',
				't_type_send': '',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': false,
				't_list_value': '',
			},
		},
		{
			'id_dc_metadata': 1793,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'ClientName',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'ClientName',
				't_name': 'Client name',
				't_description': '',
				't_type': 'String',
				't_type_send': 'array',
				'b_automatic': false,
				't_cardinality': 'multi',
				'b_list': false,
				't_list_value': '',
			},
		},
		{
			'id_dc_metadata': 1794,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'DocumentType',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'DocumentType',
				't_name': 'Document type',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': true,
				't_list_value': '9006 No SISA accounting notes#03AS||9006 SISA  accounting notes#02AS||Account opening form#06CS||Administrative details (O. E.)#22BA||Administrative details (SAN) (Templates)#21BA||AML control list#31TY||AML policies#15CDD||Annex 3 - Web Users authorized by the customer or supplier.#03BD||Annex delegation collateral#20CD||Annex delegation MtM#19CD||Audit requests#01TY||Audited annual report#02CDD||Automatic payment agreement#04BD||Base case#20MG||Bearer shares #26CDD||BIDI digitized document#32CD||Bill#33TY||Bill of Lading#32TY||Board of directors / Senior management #03CDD||Bond forward confirmations#03RF||Breakdown of operations#12TY||Business conducted principal countries#24CDD||Case disposition template#18FC||Case ID#19FC||Certified ID & Vs #06CDD||Chasers confirmations Corporate#14DO||Claim - Client document#16EF||Claim - ECA document#15EF||Closing Memo Mercurio#13TY||Closure operations with corporates#03TA||CME (Repo)#09SF||CME (Sec)#10SF||CMOF retail#05DO||CMOF-Annex III#02SF||Collateral addendum#03SF||Collateral FBF ARG#04SF||Commitment letter #18CDD||Compliance certificate#14TY||Conciliation Markets#05ETD||Confirmation operation #01TP||Confirmations issued by RF#05RF||Confirmations issued to corporates#04DO||Confirmations issued to retail#16DO||Confirmations received Corporate#01DO||Confirmations received Retail#02DO||Confirming contract#01BD||Contact entities#13CD||Contingency contract#01GT||Contracts of open accounts #01ETD||CRS self-declaration#31CD||CSA#01SF||Customer request#07FO||Debtor List / Calculator#15MT||Declarations via email#24CD||Defense questionaire #17CDD||Delegated reporting terms form OTC derivatives EMIR#10TY||Discrepancies with counterparties#10DO||Dodd Frank bilateral documentation#15CD||Dodd Frank ISDA amend documentation#16CD||DRV#12SF||Due diligence#25CD||Due diligence environment#12MG||Due dillegence technical#11MG||Due Dilligence Legal #10MG||DVP -confirmation means for Fixed Income#09CD||Email evidence clasification change#37CD||Email evidence sending document#36CD||EMIR questionnaire#22CD||Enviromental Monitoring Report#15TY||Evidences external sources#17FO||Evidences tax consulting / compliance#33CD||Exemptions tax advice#08CD||Exporter / Supplier confirmation#06EF||FATCA Download #19CDD||Fee letter#16TY||Fee Structure Santander, Paris and Milan Branch#03CS||Final Term Commercial Paper#20BA||Finance agreement#11TY||Financial staments#17TY||Front Sheet#11BA||Front sheet EF#18EF||Front Sheet GDF#14MG||Front Sheet T&WCS#08MT||GMRA#08SF||GMSLA#06SF||Guarantee#05SF||Guarantee offer / promise#14EF||Historic reporting letter#18CD||HVD#19TY||Insurance policy#03MT||Investment Research Contracts#09TY||Invoices Issued#04TY||Invoices received from vendors#03TY||ISDA EMIR classification letter#21CD||ISDA Master Regulatory Disclosure Letter#23CD||ISMA#11SF||Issuance request guarantees#12MT||KYC questionnaire#28CDD||Legal existence extract #01CDD||LEI extract #09CDD||LEI mandate letters#06DO||Letter of indemnity#30TY||Letters of introduction#21TY||Library templates emission SGC#03DO||List of funds per agent#14CD||Lists of debtors / suppliers / underlying#15FO||Loan request#17BA||Manual accounting sheets#02TY||Manual payment orders#01TT||Manual payment sheets#09BR||Market Information#04ETD||MIFID Basic contracts#34CD||MO Invoices#20TY||Monitoring report#29TY||Nature of business #23CDD||NCT0 accounting notes#01AS||Offer and acceptance#18MT||Offer notice#27TY||OK front office#09DO||Onboarding form #14CDD||Origin and destiny of the funds #25CDD||OSLA#07SF||OTC Consent#35CD||OTC-confirmation means for operational cash#10CD||Other agreements#09FO||Other approvals / evidences#26TY||Other communications (Settlement / CAU)#13DO||Other documents#18BA||Other general undertaking#24EF||Others documents#22TY||Ownership structure #12CDD||Paper based payment order (Manual Payment)#04CS||Patriots act #16CDD||Power of Attorney (PoA)#05TY||Pricing letter#19BA||Print out confirma y liquida (currency <> EUR)#02TM||Product aplication form#05CS||Promissory Note#25MG||Promissory notes#20MT||Proof of Identification of UBOs #21CDD||Proof of listing #05CDD||Proof of regulation #04CDD||Proposals for advice#08DO||Questionnaires#27CD||Regulatory Packs - MiFID, EMIR, Dodd Frank #20CDD||Representation letter#26CD||Reuters conversation Treasury Asia#01TA||Reuters conversation Treasury Madrid#01TM||Risk approval#23TY||Risk document approved with limit and price conditions#02BD||RV Confirmations#04RF||Searches Factiva evidence #07CDD||Selective discount#05BD||Sending of documents to the office#12DO||SISA notes accounting#04AS||Source of Funds#27CDD||Source of Wealth #22CDD||SSI - OTC cash settlement Instructions#03CD||SSI DVP - Settlement Instructions for Fixed Income#02CD||Swift messages#16FO||Tax form cetificate#04CD||Tax form declaration#07CD||Term sheet#24TY||Term sheet derivatives#06TY||TEST SPPI#08TY||Tracking report#24MG||Trade confirmation#28TY||Transaction commercial documents  / Import or Export qualifying report#21MT||Trust Deed #13CDD||Utilization request#25TY||W8BenE / CRS Form #08CDD||Wolfsberg questionnaire#29CDD||XML associated term sheet#03MM',
			},
		},
		{
			'id_dc_metadata': 1796,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'DocumentOwner',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'DocumentOwner',
				't_name': 'Document owner',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'array',
				'b_automatic': true,
				't_cardinality': 'multi',
				'b_list': false,
				't_list_value': '1LOD B Boadilla#1LODBBoadilla||ACPM#ACPM||Asesoría Jurídica#AsesoríaJurídica||Asset servicing#Assetservicing||Banking#Banking||Brokerage#Brokerage||Business Delegated Services#BusinessDelegatedServices||Cash nexus#Cashnexus||Client Due Diligence#ClientDueDiligence||Client service#Clientservice||Data Quality#DataQuality||FC & Ops #FC&Ops||FC & OPS - Transaction Monitoring#FC&OPSTM||FC & OPS- Batch Screening#FC&OPSBS||Front office#Frontoffice||Middle office#Middleoffice||MO Export Finance#MOExportFinance||MO Global Debt Financing #MOGlobalDebtFinancing||MO Markets#MOMarkets||MO Trade & Working Capital Solutions#MOTrade||OTC Derivatives#OTCDerivatives||Riesgos#Riesgos||SBGM - Client Data#SBGM-ClientData||SBGM Documentación#SBGMDocumentación||Securities#Securities||Securities Financing Operations - Collateral Management & CCP Clearing#SecuritiesFinancingOperations||Treasury FXMM - Transaccional (FRK; MLN; LON; PARIS, CONSUMER)#FXMMCONSUMER||Treasury FXMM - Transaccional (FRK; potencialmente MLN; PARIS)#FXMM||Treasury FXMM ASIA#TreasuryFXMMASIA||Treasury FXMM Madrid#TreasuryFXMMMadrid||Treasury- OTC Derivatives#TreasuryOTCDerivatives||Tresuary ETDs#TresuaryETDs',
			},
		},
		{
			'id_dc_metadata': 1797,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'BusinessProcess',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'BusinessProcess',
				't_name': 'Business process',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': true,
				't_cardinality': 'single',
				'b_list': false,
				't_list_value': 'Accounting#Accounting||Brokerage#Brokerage||Business support#Businesssupport||Client service#Clientservice||Collateral set up and maintenance#Collateralmaintenance||Confirmation#Confirmation||Controls, executions & analysis#Controlsexecutionsanalysis||Events management#Eventsmanagement||Financial reporting#Financialreporting||Functional support#Functionalsupport||Incidences correction / regularization#Incidencescorrectionregularization||Management of requests#Managementrequests||Position management & funding#Positionmanagementfunding||Process monitoring#Processmonitoring||Provisioning & reporting#Provisioningreporting||Reconcilation, execution & analysis#Reconcilationexecutionanalysis||Settlement#Settlement||Transactional reporting#Transactionalreporting||Validation / Origination #ValidationOrigination',
			},
		},
		{
			'id_dc_metadata': 1798,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'ConfidentialityLevel',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'ConfidentialityLevel',
				't_name': 'Confidentiality level',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': true,
				't_cardinality': 'single',
				'b_list': false,
				't_list_value': 'Public#Public||Internal#Internal||Confidential#Confidential||Restricted Confidential#RestrictedConfidential||Secret#Secret',
			},
		},
		{
			'id_dc_metadata': 1799,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'GDPR',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'GDPR',
				't_name': 'GDPR',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': true,
				't_cardinality': 'single',
				'b_list': false,
				't_list_value': 'Yes#true||No#false',
			},
		},
		{
			'id_dc_metadata': 1800,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'IBORRelated',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'IBORRelated',
				't_name': 'IBOR RELATED',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': true,
				't_list_value': 'Yes#true||No#false',
			},
		},
		{
			'id_dc_metadata': 1801,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'IBORRate',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'IBORRate',
				't_name': 'IBOR RATE',
				't_description': '',
				't_type': 'String',
				't_type_send': '',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': false,
				't_list_value': '',
			},
		},
		{
			'id_dc_metadata': 1802,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'IBORAmendedStatus',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'IBORAmendedStatus',
				't_name': 'IBOR AMENDED STATUS',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': true,
				't_list_value': 'Not Amended#NotAmended||Fallback Amendment#FallbackAmendment||Final Amendment#FinalAmendment||NA Repapering#NARepapering||Not Informed #NotInformed',
			},
		},
		{
			'id_dc_metadata': 1803,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'IBORtypeofproduct',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'IBORtypeofproduct',
				't_name': 'IBOR Type of product',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': '',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': true,
				't_list_value': 'Bilateral Loans||Collateral Derivatives||Collateral Repurchase||Collateral security lending||Deposits||Derivatives||Repurchase||Security Lending||Syndicated agency loans||Syndicated participated loans',
			},
		},
		{
			'id_dc_metadata': 1795,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'Geographyownerdocument',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'Geographyownerdocument',
				't_name': 'Geography owner document',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': true,
				't_list_value': 'Banco Santander Beijing#BancoSantanderBeijing||Banco Santander Brasil#BancoSantanderBrasil||Banco Santander Shangai#BancoSantanderShangai||Banco Santander Singapore#BancoSantanderSingapore||Open Bank, S.A.#OpenBankSA||Santander Bank N. A.#SantanderBankNA||Santander Consumer finance#SantanderConsumerfinance||Santander UK#SantanderUK||SCIB Argentina#SCIBArgentina||SCIB Boadilla#SCIBBoadilla||SCIB Chile#SCIBChile||SCIB Colombia#SCIBColombia||SCIB Frankfurt Branch#SCIBFrankfurtBranch||SCIB Hong Kong#SCIBHongKong||SCIB London Branch#SCIBLondonBranch||SCIB México#SCIBMéxico||SCIB Milan Branch#SCIBMilanBranch||SCIB New York Branch#SCIBNewYorkBranch||SCIB Paris Branch#SCIBParisBranch||SCIB Peru#SCIBPeru||SCIB Poland#SCIBPoland||SCIB Portugal#SCIBPortugal||SCIB Spain#SCIBSpain||SCIB Uruguay#SCIBUruguay',
			},
		},
		{
			'id_dc_metadata': 1804,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'Geographyownerdocument',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'Geographyownerdocument',
				't_name': 'Geography owner document',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': true,
				't_list_value': 'Banco Santander Beijing#BancoSantanderBeijing||Banco Santander Brasil#BancoSantanderBrasil||Banco Santander Shangai#BancoSantanderShangai||Banco Santander Singapore#BancoSantanderSingapore||Open Bank, S.A.#OpenBankSA||Santander Bank N. A.#SantanderBankNA||Santander Consumer finance#SantanderConsumerfinance||Santander UK#SantanderUK||SCIB Argentina#SCIBArgentina||SCIB Boadilla#SCIBBoadilla||SCIB Chile#SCIBChile||SCIB Colombia#SCIBColombia||SCIB Frankfurt Branch#SCIBFrankfurtBranch||SCIB Hong Kong#SCIBHongKong||SCIB London Branch#SCIBLondonBranch||SCIB México#SCIBMéxico||SCIB Milan Branch#SCIBMilanBranch||SCIB New York Branch#SCIBNewYorkBranch||SCIB Paris Branch#SCIBParisBranch||SCIB Peru#SCIBPeru||SCIB Poland#SCIBPoland||SCIB Portugal#SCIBPortugal||SCIB Spain#SCIBSpain||SCIB Uruguay#SCIBUruguay',
			},
		},
		{
			'id_dc_metadata': 3002,
			'id_doc_type': '01BD',
			'id_doc_metadata': 'Geographymanagesdocument',
			'documenttype': { 'id_doc_type': '01BD', 't_name': 'Confirming contract', 't_description': '' },
			'documentmetadata': {
				'id_doc_metadata': 'Geographymanagesdocument',
				't_name': 'Geography manages document',
				't_description': '',
				't_type': 'String(ValueList)',
				't_type_send': 'string',
				'b_automatic': false,
				't_cardinality': 'single',
				'b_list': true,
				't_list_value': 'Banco Santander Beijing#BancoSantanderBeijing||Banco Santander Shangai#BancoSantanderShangai||Banco Santander Singapore#BancoSantanderSingapore||SCIB Argentina#SCIBArgentina||SCIB Boadilla#SCIBBoadilla||SCIB Chile#SCIBChile||SCIB Colombia#SCIBColombia||SCIB Frankfurt Branch#SCIBFrankfurtBranch||SCIB Hong Kong#SCIBHongKong||SCIB London Branch#SCIBLondonBranch||SCIB México#SCIBMéxico||SCIB Milan Branch#SCIBMilanBranch||SCIB New York Branch#SCIBNewYorkBranch||SCIB Paris Branch#SCIBParisBranch||SCIB Peru#SCIBPeru||SCIB Poland#SCIBPoland||SCIB Portugal#SCIBPortugal||SCIB Spain#SCIBSpain||SCIB Uruguay#SCIBUruguay',
			},
		},
	],
	// Add default values here
};
