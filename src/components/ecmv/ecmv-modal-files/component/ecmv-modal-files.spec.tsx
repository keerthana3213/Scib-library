import { ECMVModalFiles } from '../component/ecmv-modal-files';
// import { newSpecPage } from '@stencil/core/testing';
// import { h } from '@stencil/core';

describe('ecmv-modal-files', () => {
	// const metadataValues = [
	// 	{
	// 		id_doc_metadata: 'DocumentType',
	// 		t_name: 'Document type',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: false,
	// 		t_cardinality: 'single',
	// 		b_list: true,
	// 		t_list_value:
	// 			'Account opening form#06CS||Ad Hoc Liquidity Reports#04IL||Administrative details (O. E.)#22BA||Administrative details (SAN) (Templates)#21BA||Agreement#27MO||AML policies#15CDD||Annex 3 - Web Users authorized by the customer or supplier.#03BD||Annex delegation collateral#20CD||Annex delegation MtM#19CD||Annual Report#25MO||APPIAN As Murex#03AM||AS Murex Audits#01AM||AS Murex Evidences#02AM||AS Murex Projects#04AM||Assignment agreement#52MO||Audit requests#01TY||Audited annual report#02CDD||Authorized Signatory File#13TL||Automatic payment agreement#04BD||B.S.Frankfurt Liquidity Position#05TL||Banco de España Policy#04TL||Bank counter guarantee - Swift documents#62MO||Bank counter guarantee Amendment#66MO||Banker Approval#05MO||Base case#20MG||Basilea Regulatory Report#01IL||Bearer shares #26CDD||BI Final Reports#08FI||BIDI digitized document#32CD||Bill of Lading#32TY||Bill#33TY||Billing info#03EQ||Board of directors / Senior management #03CDD||Bond forward confirmations#03RF||Business conducted principal countries#24CDD||Case disposition template#18FC||Case ID#19FC||Cash Management Activity Reports#08CS||Cash Pooling Clients#02CN||Cash Pooling#04ML||CBI contract#02ML||Certificate of Incorporation#22MO||Certified ID & Vs #06CDD||Chasers confirmations Corporate#14DO||CIB Payments Report#03IL||Cibersecurity Alerts Reports#01CT||Cibersecurity Historic Controls#02CT||Cibersecurity Received Incidences#05CT||Claiming Process#40MO||Client Broker Review#10CS||Client Call Report#11CS||Client counter guarantee documents Amendment#68MO||Client counter guarantee documents#64MO||Client Digital Signature#02GA||Client request#42MO||Client Satisfaction Surveys#12CS||Client Trade Profile (CTP)#19FO||Closing Memo#06MO||Closure operations with corporates#03TA||CLS Report#04LC||CME (Repo)#09SF||CME (Sec)#10SF||CMOF Master Agreement#02MA||CMOF retail#05DO||CMOF-Annex III#02SF||Collateral addendum#03SF||Collateral FBF ARG#04SF||Collateral Obligations#37MO||Collateral T2S#11TL||Collaterals agreement#29MO||Comitee Reports#02PC||Commitment letter #18CDD||Compliance certificate#14TY||Compliance Corporate Policies Controls#01GR||Compliance/AML Approval#04MO||Comunica Incidence Addtional Info#11OR||Comunica Incidence Summary#10OR||Conciliation Markets#05ETD||Confirmation operation #01TP||Confirmation Templates Corporate#03DO||Confirmation Templates Retail#02TP||Confirmations issued by RF#05RF||Confirmations issued to corporates#04DO||Confirmations issued to retail#16DO||Confirmations received Corporate#01DO||Confirmations received Retail#02DO||Confirming Client Audits#10BD||Confirming Vendor Audits#09BD||Confirming client contract#01BD||Consumer Liquidity Position#08TL||Contact entities#13CD||Contingency contract#01GT||Contracts of open accounts #01ETD||Controls 1LoD#02CU||Corporate Compliance Program#03GR||Correspondent Documents Opening Account#07LC||Counterparty agreements#02PR||Country Schedules #03CE||Cross Border#07MO||CRS self-declaration#31CD||CSA#01SF||CTU Assets Documentation#04CT||CTU Audit Results#03CT||CTU Daily Activity Events#07CT||Customer request#07FO||Cyber Maturity Level#09GR||DAC6 Analysis#12MO||Daily Relevant Events#05OR||Declarations via email#24CD||Defense questionaire #17CDD||Delegated reporting terms form OTC derivatives EMIR#10TY||Disbursement approval#50MO||Disbursement CP´s#11MO||Discrepancies with counterparties#10DO||DLP Control#06CT||Dodd Frank bilateral documentation#15CD||Dodd Frank ISDA amend documentation#16CD||DRV#12SF||DTY Discount#51MO||Due diligence#25CD||DVP -confirmation means for Fixed Income#09CD||d-zero contract#11FK||EBICS Contract#08FK||ECA Insurance Policy#18MO||EMA Derivatives#07MA||EMA Repos#08MA||EMA Securities#09MA||Email evidence clasification change#37CD||Email evidence sending document#36CD||EMIR questionnaire#22CD||EMIR REPORT Timely Confirmation#18DO||European Master Agreement#04MA||Evidences Client Trade Profile (CTP)#18FO||Evidences correspondent interest#05LC||Evidences external sources#17FO||Evidences Liquidity Buffer#02IL||Evidences manual payment orders#02LC||Evidences Portfolio Compression#01PC||Evidences tax consulting / compliance#33CD||Excel Set Ups#06BD||Exemptions tax advice#08CD||Failed operations conciliation#06LC||FATCA Download #19CDD||FATCA-CRS#04FK||FBF IFT Master Agreement#03MA||FBF Repos#10MA||FBF_derivatives#06MA||Fee Structure Santander, Paris and Milan Branch#03CS||Fee Structure#05FK||Final Term Commercial Paper#20BA||Finance agreement#11TY||Finance Approval#03MO||Finance Collateral Report#04FI||Finance Official Documentation#01FI||Financial model#30MO||Financial Ratios#35MO||Financial staments#17TY||Follow Up Finance Collateral Report#05FI||Front Sheet#11BA||FTA FED NY#06IL||GAP Analysis Holistic Exercise#08GR||General Business and Conditions #06FK||General Terms and conditions#02CE||Global Agency Operations Report#03GA||Global Agency Reports#01GA||Glogal Agency Templates#04GA||GMRA#08SF||GMSLA#06SF||GPI Analysis and Incidence#01PA||GPI Monthly Report#03PA||GPI SLA#02PA||GPI Tracker#04PA||GRC Reports#02GR||Guarantee documents Amendment#67MO||Guarantee documents#63MO||Guarantee#05SF||Historic reporting letter#18CD||HVD or Closing Memos#08BD||ICM Test#09TL||Incidences Comunica#07PA||Input EMIR REPORT Timely Confirmation#19DO||Input EMIR REPORT Timely Confirmation#19DO||Intercreditor agreement#28MO||Interest Stabilization Agreement/ Interest MakeUp Agreeement#20MO||Interest Statements#01EQ||Internal Control Model Dashboard#08OR||Internal Control Model SBGM#09OR||Inventories GRC#04GR||Investment Research - Client Interaction Reports#13CS||Investment Research Contracts#09TY||Investment research out of scope - self declaration letter#07CS||Invoices Issued#04TY||Invoices received from vendors#03TY||ISDA EMIR classification letter#21CD||ISDA Master Agreement#01MA||ISDA Master Regulatory Disclosure Letter#23CD||ISMA#11SF||Issuance amendment - CP´s#09MO||Issuance Request Amendment#65MO||Issuance Request#61MO||KIDs Corporate#17DO||KPI of Escalation#12OR||KYC other#26MO||KYC questionnaire#28CDD||Legal Approval#02MO||Legal existence extract #01CDD||LEI extract #09CDD||LEI mandate letters#06DO||Liquidity Daily Positions Inputs#10LC||Liquidity Daily Positions Treasury Consumer#11LC||Liquidity Daily Positions#01LC||List of funds per agent#14CD||Lists of debtors / suppliers / underlying#15FO||London Branch Return PRA Report#05IL||Magalix Accounting Notes Diary#06AS||Magalix Accounting Notes Monthly#05AS||Magalix Interest Monthly Report#06PA||Mail evidence Bond forward confirmations#06RF||Mail evidence Confirmations issued to corporates#22DO||Mail evidence Confirmations issued to retail#20DO||Mail evidence Confirmations received Corporate#23DO||Mail evidence Confirmations received Retail#21DO||Manual accounting sheets#02TY||Manual payment orders#01TT||Manual payment sheets#09BR||Manual Payments Evidence#12TL||Manuals 1LoD#01CU||Market Information#04ETD||Markets Finance Dashboard#06FI||Meetings and Support Documentation#02FI||Memorandum and Articles of Association/ Bylaws#23MO||MIFID Basic contracts#34CD||MiFID II Annual Costs and Charges and Incentives Report #01RE||Minimun Reserves Banco de España#10TL||Monitoring Dates#39MO||Monitoring Payments#38MO||Monitoring report#29TY||Movilization approvals#54MO||MT101 Contract#09FK||MT940 request#03ML||MT950 Correspondent Monthly Report#03LC||Murex Management Report#05AM||MyOris Additional Info#13OR||NAFMII Master Agreement#05MA||Nature of business #23CDD||New Asset Questionnaires SBGM#06GR||Nexus Client Account Onboarding#02IM||Nexus Client Contracts#01IM||Nexus Conectivity Client Form#04IM||Nexus Deal Intake Form#05IM||Nexus Evidences Support Implementation#06IM||Nexus Payment Files Test Evidences#03IM||Nexus Transactional Hub Evidence Control#01CN||Nexus#05ML||Notice of acknowledgment#14MO||Notices#41MO||Official Statements#02EQ||OK front office#09DO||Onboarding form #14CDD||Operational Risk Dashboard#07OR||Operational Risk Training and Awareness#06OR||Operations Procedures and Guides#01PR||Organization Report#03CM||Origin and destiny of the funds #25CDD||ORIS and Top of the House (ToH) Report - Own Risk#04OR||ORIS Delegated Services Report#14OR||OSLA#07SF||OTC Consent#35CD||OTC-confirmation means for operational cash#10CD||Other agreements#09FO||Other approvals / evidences#26TY||Other approvals#08MO||Other communications (Settlement / CAU)#13DO||Other coverage document#21MO||Other documents#18BA||Other financial documents#49MO||Other legal documentation#31MO||Other movilization documents#57MO||Other waiver documents#46MO||Others Accounting Notes#07AS||Others Requirements#16MO||Ownership structure #12CDD||Paper based payment order (Manual Payment)#04CS||Patriots act #16CDD||Payment Instructions Single Discount#69MO||Payment request#02FK||PCN Murex#06AM||Popular Bank Historic Positions#08LC||Power of Attorney (PoA)#05TY||Pricing letter#19BA||Print out confirma y liquida (currency <> EUR)#02TM||Private Insurance Coverage#19MO||Private Insurance policy#56MO||Product aplication form#05CS||Proof of Identification of UBOs #21CDD||Proof of listing #05CDD||Proof of regulation #04CDD||Proposals for advice#08DO||PSD2 Annex #04CE||Public Procedures SBGM#07GR||Questionnaires#27CD||RCSA (Risk Control Self Assessment)#01OR||RDA Reports#07FI||Received Daily Balances#02SB||Recieved Daily Breaks#01SB||Register of Directors#24MO||Regulatory Packs - MiFID, EMIR, Dodd Frank #20CDD||Reporting by email#08PR||Reporting#36MO||Representation letter#26CD||Reuters conversation Treasury Asia#01TA||Reuters conversation Treasury Madrid#01TM||RIB#03PR||Risk Apetite SBGM#03OR||Risk approval#23TY||Risk document approved with limit and price conditions#02BD||Risk Participation Agreement#55MO||RV Confirmations#04RF||S.Investment Liquidity Position#06TL||Santander Liquidity Position#07TL||SBGM Executive Committe#03FI||SBGM Proposals#01CM||SBGM waivers#05GR||Scenario Analysis#02OR||Scrittura Classic#02LA||Scrittura Flow#01LA||Searches Factiva evidence #07CDD||Selective discount#05BD||Sending of documents to the office#12DO||ServiceNow As Murex#07AM||SLA As Murex#08AM||SLA Minute#02CM||Source of Funds#27CDD||Source of Wealth #22CDD||SSI - OTC cash settlement Instructions#03CD||SSI Branches#04SB||SSI Correspondent Banks - Santander Consumer Finance#13LC||SSI Correspondent Banks - Santander Madrid#12LC||SSI DVP - Settlement Instructions for Fixed Income#02CD||Stats SWIFT Monthly Report#05PA||Supplemental Assigment Agreement#17MO||Suppliers Check List#07BD||Sweeping and Topping#10FK||Swift messages#16FO||SWIFT MT101 with third bank#09PR||Target2 Forms#14TL||Tax form cetificate#04CD||Tax form declaration#07CD||Templates KIDs#01TK||Term sheet derivatives#06TY||Term sheet#24TY||Termination documents#60MO||Test Evidences Bank of England#03SB||TEST SPPI#08TY||Top of the House KPIs#10GR||Trade confirmation#28TY||Transfer agreement#58MO||Transfer SWIFT Merva Template#09LC||Trust Deed #13CDD||Utilization request#25TY||Verum As Murex#09AM||W8BenE / CRS Form #08CDD||Waiver & Amendment agreement#43MO||Waiver & Amendment ECA acceptance#45MO||Waiver & Amendment Lenders acceptance#44MO||Waiver&Amendment approvals#47MO||Waivers & Amendments CP´s#10MO||Wolfsberg questionnaire#29CDD||XML associated term sheet#03MM||',
	// 		required: true,
	// 	},
	// 	{
	// 		id_doc_metadata: 'BusinessProcess',
	// 		t_name: 'Business process',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: true,
	// 		t_cardinality: 'single',
	// 		b_list: false,
	// 		t_list_value: 'Collateral set up and maintenance#Collateralmaintenance',
	// 		required: true,
	// 		selectedDefaultLabel: 'Collateral set up and maintenance',
	// 		selectedDefaultId: 'Collateralmaintenance',
	// 		display_value_metadata: 'Collateral set up and maintenance',
	// 		value_metadata: 'Collateralmaintenance',
	// 	},
	// 	{
	// 		id_doc_metadata: 'GDPR',
	// 		t_name: 'GDPR',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: true,
	// 		t_cardinality: 'single',
	// 		b_list: false,
	// 		t_list_value: 'No#false',
	// 		required: true,
	// 		selectedDefaultLabel: 'No',
	// 		selectedDefaultId: 'false',
	// 		display_value_metadata: 'No',
	// 		value_metadata: 'false',
	// 	},
	// 	{
	// 		id_doc_metadata: 'ConfidentialityLevel',
	// 		t_name: 'Confidentiality level',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: true,
	// 		t_cardinality: 'single',
	// 		b_list: false,
	// 		t_list_value: 'Internal#Internal',
	// 		required: true,
	// 		selectedDefaultLabel: 'Internal',
	// 		selectedDefaultId: 'Internal',
	// 		display_value_metadata: 'Internal',
	// 		value_metadata: 'Internal',
	// 	},
	// 	{
	// 		id_doc_metadata: 'DocumentOwner',
	// 		t_name: 'Document owner',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'array',
	// 		b_automatic: true,
	// 		t_cardinality: 'multi',
	// 		b_list: false,
	// 		t_list_value: 'Accounting Derivados#AccountingDerivados',
	// 		required: true,
	// 		selectedDefaultLabel: 'Accounting Derivados',
	// 		selectedDefaultId: 'AccountingDerivados',
	// 		display_value_metadata: 'Accounting Derivados',
	// 		value_metadata: 'AccountingDerivados',
	// 	},
	// 	{
	// 		id_doc_metadata: 'Geographyownerdocument',
	// 		t_name: 'Geography owner document',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: false,
	// 		t_cardinality: 'single',
	// 		b_list: true,
	// 		t_list_value:
	// 			'Banco Santander Beijing#BancoSantanderBeijing||Banco Santander Brasil#BancoSantanderBrasil||Banco Santander Shangai#BancoSantanderShangai||Banco Santander Singapore#BancoSantanderSingapore||Open Bank, S.A.#OpenBankSA||Santander Bank N. A.#SantanderBankNA||Santander Consumer finance#SantanderConsumerfinance||Santander Investment Securities#SantanderInvestmentSecurities||Santander UK#SantanderUK||SCIB Argentina#SCIBArgentina||SCIB Boadilla#SCIBBoadilla||SCIB Chile#SCIBChile||SCIB Colombia#SCIBColombia||SCIB Frankfurt Branch#SCIBFrankfurtBranch||SCIB Hong Kong#SCIBHongKong||SCIB London Branch#SCIBLondonBranch||SCIB Mexico#SCIBMexico||SCIB Miami Branch#SCIBMiamiBranch|| SCIB Milan Branch#SCIBMilanBranch||SCIB New York Branch#SCIBNewYorkBranch||SCIB Paris Branch#SCIBParisBranch||SCIB Peru#SCIBPeru||SCIB Poland#SCIBPoland||SCIB Portugal#SCIBPortugal||SCIB Spain#SCIBSpain||SCIB Uruguay#SCIBUruguay||SCF Nordics#SCFNordics||SCF Paises Bajos#SCFPaisesBajos||SCF Grecia#SCFGrecia||SCF Polonia#SCFPolonia',
	// 		required: false,
	// 		selectedDefaultLabel: 'SCIB Boadilla',
	// 		selectedDefaultId: 'SCIBBoadilla',
	// 	},
	// 	{
	// 		id_doc_metadata: 'Geographymanagesdocument',
	// 		t_name: 'Geography manages document',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: false,
	// 		t_cardinality: 'single',
	// 		b_list: true,
	// 		t_list_value: 'SCIB Boadilla#SCIBBoadilla',
	// 		required: true,
	// 		selectedDefaultLabel: 'SCIB Boadilla',
	// 		selectedDefaultId: 'SCIBBoadilla',
	// 	},
	// 	{
	// 		id_doc_metadata: 'Regulation',
	// 		t_name: 'Regulation',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: false,
	// 		t_cardinality: 'single',
	// 		b_list: true,
	// 		t_list_value:
	// 			'Not Informed#NotInformed||BIS#BIS||CRDIV#CRDIV||CRR2#CRR2||DFA#DFA||EMIR#EMIR||MiFID#MiFID||GDPR#GDPR||SFTR#SFTR||Volcker#Volcker||SBSD#SBSD||IFRS9#IFRS9||MMSR#MMSR||SMMD#SMMD||HKMA#HKMA',
	// 		required: false,
	// 	},
	// 	{
	// 		id_doc_metadata: 'RegulationWorkstream',
	// 		t_name: 'Regulation Workstream',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: false,
	// 		t_cardinality: 'single',
	// 		b_list: true,
	// 		t_list_value:
	// 			'Reporting#Reporting||Clearing#Clearing||Front Office#FrontOffice||Portfolio Commpression#PortfolioCommpression||Onboarding#Onboarding||Trade Acknowledgment#TradeAcknowledgment||Disclosures#Disclosures||Portfolio Reconciliation & Segregation#PortfolioReconciliation&Segregation||Daily Mark#DailyMark||Trading Relationship Documentation#TradingRelationshipDocumentation||Margin#Margin||Scenario Analysis#ScenarioAnalysis||De Minimis#DeMinimis||Recordkeeping#Recordkeeping||Control#Control||Not Informed#NotInformed',
	// 		required: false,
	// 	},
	// 	{
	// 		id_doc_metadata: 'Date',
	// 		t_name: 'Date',
	// 		t_description: '',
	// 		t_type: 'Date',
	// 		t_type_send: 'string',
	// 		b_automatic: false,
	// 		t_cardinality: 'single',
	// 		b_list: false,
	// 		t_list_value: '',
	// 		required: false,
	// 	},
	// 	{
	// 		id_doc_metadata: 'Unit',
	// 		t_name: 'Unit',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: false,
	// 		t_cardinality: 'single',
	// 		b_list: true,
	// 		t_list_value:
	// 			'Not Informed#NotInformed||Asesoria Juridica#AsesoriaJuridica||Asset Servicing#AssetServicing||Banking#Banking||Brokerage#Brokerage||Business Alignment#BusinessAlignment||Business Delegated Services#BusinessDelegatedServices||CDD#CDD||Cash Nexus#CashNexus||Client Service#ClientService||Confirming Global#ConfirmingGlobal||Cumplimiento normativo#Cumplimientonormativo||Data Quality#Dat Quality||FC & OPS Batch Screening#FC&OPSBatchScreening||FC & OPS Transaction Monitoring#FC&OPSTransactionMonitoring||FC & Ops#FC&Ops||MO Export Finance#MOExportFinance||MO Markets#MOMarkets||MO Middle Office Global Debt Financing#MOMiddleOfficeGlobalDebtFinancing||MO Trade & Working Capital Solutions#MOTrade&WorkingCapitalSolutions||Market Activities Europe#MarketActivitiesEurope||PPT Administrator#PPTAdministrator||Proceso y Control España#ProcesoyControlEspaña||SBGM Client Data#SBGMClientData||SBGM Documentación#SBGMDocumentación||Securities#Securities||Securities Financing Operations Collateral Management & CCP Clearing#SecuritiesFinancingOperationsCollateralManagement&CCPClearing||Technical Calpyso#TechnicalCalpyso||Treasury FXMM ASIA#TreasuryFXMMASIA||Treasury FXMM Madrid#TreasuryFXMMMadrid||Treasury FXMM Transaccional (FRK, MLN, LON, PARIS, CONSUMER)#TreasuryFXMMTransaccional(FRK,MLN,LON,PARIS,CONSUMER)||Treasury FXMM Transaccional (FRK, MLN, PARIS)#TreasuryFXMMTransaccional(FRK,MLN,PARIS)||Treasury OTC Derivatives#TreasuryOTCDerivatives||Tresuary ETDs#TresuaryETDs||Ventas FX#VentasFX',
	// 		required: false,
	// 	},
	// 	{
	// 		id_doc_metadata: 'Typology',
	// 		t_name: 'Typology',
	// 		t_description: '',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'string',
	// 		b_automatic: false,
	// 		t_cardinality: 'single',
	// 		b_list: true,
	// 		t_list_value: 'Not Informed#NotInformed||Procedures#Procedures||Manuals#Manuals||Guides#Guides',
	// 		required: false,
	// 	},
	// 	{
	// 		id_doc_metadata: 'GN_ID',
	// 		t_name: 'GN_ID',
	// 		t_description: '',
	// 		t_type: 'String',
	// 		t_type_send: 'string',
	// 		b_automatic: true,
	// 		t_cardinality: 'single',
	// 		b_list: false,
	// 		t_list_value: '',
	// 		required: false,
	// 	},
	// 	{
	// 		id_doc_metadata: 'ProductLevel1',
	// 		t_name: 'Product Level 1',
	// 		t_description:
	// 			'Estas son las diversas categorias de documentos en los que cabrían el 99% de los documentos generados en Trade y objeto de este repositorio.',
	// 		t_type: 'String(ValueList)',
	// 		t_type_send: 'array',
	// 		b_automatic: false,
	// 		t_cardinality: 'multi',
	// 		b_list: true,
	// 		t_list_value:
	// 			'Not Informed#NotInformed||Nda#Nda||Letter Of Credit#LetterOfCredit||Red Clause Letter Of Credit#RedClauseLetterOfCredit||Guarantee / Standby#Guarantee/Standby||Insurance Policy#InsurancePolicy||Trade Funding Facility#TradeFundingFacility||Term Sheet#TermSheet||Funded Risk Participation Agreement #FundedRiskParticipationAgreement||Deferred Payment Letter Of Credit#DeferredPaymentLetterOfCredit||Statement Of Work / Provision Of Services#StatementOfWork/ProvisionOfServices||Unfunded Risk Participation Agreement #UnfundedRiskParticipationAgreement||Prepaymet#Prepaymet||Inventory Finance#InventoryFinance||Borrowing Base#BorrowingBase||Confirming#Confirming||Receivables Discounting#ReceivablesDiscounting||Rpp#Rpp||Grpp#Grpp||Buyer Credit#BuyerCredit',
	// 		required: false,
	// 	},
	// ];

	it('builds', () => {
		expect(new ECMVModalFiles()).toBeTruthy();
	});

	// describe('render', () => {
	// 	it('should render correctly', async () => {
	// 		await newSpecPage({
	// 			components: [ECMVModalFiles],
	// 			template: () => <scib-ecmv-modal-files id="modal" open={true} maxfiles={10}></scib-ecmv-modal-files>,
	// 			supportsShadowDom: true
	// 		});
	// 		const ECMVModalFilesHTMLElement: HTMLElement = document.getElementById('modal');
	// 		expect(ECMVModalFilesHTMLElement).toBeTruthy();
	// 	});
	// });
});
