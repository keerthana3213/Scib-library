import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ism Modal Detail',
	...getStoryConfig('scib-cdk-ism-modal-detail')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-ism-modal-detail
		open='${parseBoolean(args.open)}'
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	>
	</scib-cdk-ism-modal-detail>
`);
const TemplateSimple = (args) => render(args, `
	<scib-cdk-ism-modal-detail
		open='${parseBoolean(args.open)}'
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	>
	</scib-cdk-ism-modal-detail>
`);
const TemplateReduce = (args) => render(args, `
	<scib-cdk-ism-modal-detail
		open='${parseBoolean(args.open)}'
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	>
	</scib-cdk-ism-modal-detail>
`);
const TemplateCards = (args) => render(args, `
	<scib-cdk-ism-modal-detail
		open='${parseBoolean(args.open)}'
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	>
	</scib-cdk-ism-modal-detail>
`);
// Default Story
export const Develop = Template.bind();
export const DevelopSimple = TemplateSimple.bind();
export const DevelopReduce = TemplateReduce.bind();
export const DevelopCards = TemplateCards.bind();
Develop.args = {
	open: true,
	literals: {
		title: 'Incident Detail',
		subtitle: 'Securities financincing - G1 GBO in order is duplicate',
		data: [
			{
				type: 'data',
				content:[
					{
						title: "STATUS",
						content: "In progress"
					},
					{
						title: "CRITICALITY",
						content: "P01",
						criticality: true
					},
					{
						title: "INCIDENT NUMBER",
						content: 1249058,
						status: 'critical'
					},
					{
						title: "CLASIFICATION",
						content: "Technology"
					},
					{
						title: "RESPONSIBLE DEPARTMENT",
						content: "Data Quality"
					},
					{
						title: "AFFECTED PRODUCT",
						content: ["Leverage agile", "Leverage no agile", "Leverage"]
					},
					{
						title: "REPORTING DEPARTMENT",
						content: "SLB Deals"
					},
					{
						title: "REPORTING AREA",
						content: "SLB"
					},
					{
						title: "DETECTION DATE",
						content: "15/01/2021"
					},
					{
						title: "OCURRENCE DATE",
						content: "04/03/2021"
					},
					{
						title: "RELEVANT FACT",
						content: "526788",
					}
				],
			}
		],
		button: "Back",
	},
	data:[
		{
			type: 'resume',
			title:"General Data",
			data:{
				general:[
					{
						subtitle:"UPDATE 10/01/2021",
						description: `On March, 16th, 2021 the vendor for I ntellinnatch, FIS, did not process the SWIFT confirmation messages for 8 hours (from 18h to 2h CET). The problem affected to all Santander branches that use Intellimatch. FXMM have requested FIS to send them a report with the incidence. They experienced a technical problem that did not Let them consume the SWIFT messages received.`
						},
					{
						subtitle: "UPDATE 15/01/2021",
						description: `On March, 16th, 2021 the vendor for I ntellinnatch, FIS, did not process the SWIFT confirmation messages for 8 hours (from 18h to 2h CET). The problem affected to all Santander branches that use Intellimatch. FXMM have requested FIS to send them a report with the incidence. They experienced a technical problem that did not Let them consume the SWIFT messages received.

						• LEI Control process does not take into account these codes.
						• Label with a parameter in GBO in order is duplicate.
						• The execution of this change Led to approximately 4,800 nacks.
					
					As part of the control that Client Data executes over duplicate LEIs in the systems, Last Wednesday, March 14th, the LEIs of the following codes, used to report trades with the Chicago Mercantile Exchange (CME), were changed by mistake. The reason For this change was the misinterpretation that these entities should have the LEI LCZ7XYGSLJUHFXXNXD88, which belongs to CME GROUP INC. The execution of this change Led to approximately 4,800 nacks in EMIR valuation messaging (all Santander S.A). On Thursday, March 5th, the Reporting team alerted of the generation of these racks and the correct LEI were restored to these entities by Gent Data Team in the same day. Today Friday, March 6th, SBGM Reporting confirmed that the Valuation of March 5th has been generated correctly, without nacks related to this issue.
					
					On March, 15th, 2020 the vendor for I ntellinnatch, FIS, did not process the SWIFT confirmation messages for 8 hours (from 18h to 2h CET). The problem affected to all Santander branches that use Intellimatch. FXMM have requested FIS to send them a report with the incidence. They experienced a technical problem that did not Let them consume the SWIFT messages received. Intellimatch is the platform which FXMM manage through the SWIFT confirmations. This tool is essential to detect any discrepancies with counterparties or even trades that have not been input in our systems. In addition, this tool_ is connected to Calypso FX and it feeds the matched status. Once trades get matched and the kick off time for payments is reached, payments are sent to STP.
					
					FXMM STP work line was broken by their vendor, so they had to confirm by phone/email all those trades whose payments were urgent and trigger them From Calypso manually. This manual actions prevented any payment default, so no economic impact has been produced, only the time invested by the team.
					
					They experienced a technical problem that did not Let them consume the SWIFT messages received. Intellimatch is the platform which FXMM manage through the SWIFT confirmations. This tool is essential to detect any discrepancies with counterparties or even trades that have not been input in our systems. In addition, this tool_ is connected to Calypso FX and it feeds the matched status. Once trades get matched and the kick off time for payments is reached, payments are sent to STP. This manual actions prevented any payment default and economic impact.`
					}
				],
				content:[
					{
						title:"Service Now",
						content:[
							{
								title:"INCIDENT CODE",
								content: "146789"
							},
							{
								title:"SERVICE NOW TICKET",
								content: "0755723581"
							},
							{
								title:"INCIDENT TYPE",
								content: "Economic"
							},
							{
								title:"FINAL PRIORITY",
								content: "High"
							},
							{
								title:"REGISTRATION DATE",
								content: "04/12/2020"
							}
						]
					},
					{
						title:"Responsible department",
						content:[
							{
								title:"RESPONSIBLE ENTITY",
								content: "SBGM"
							},
							{
								title:"RESPONSIBLE DEPARTMENT",
								content: "Data Quality"
							},
							{
								title:"RESPONSIBLE AREA",
								content: "Technology"
							},
							{
								title:"PERSON IN CHARGE",
								content: "Francisco Pinzón",
								status: 'critical'
							}
						]
					},
					{
						title:"Department affected",
						content:[
							{
								title:"DEPARTMENT",
								content: ["Boadilla del Monte","Encinar & Marisma","Europa continental","NY bank"]
							},
							{
								title:"CAUSE",
								content: "Error 404"
							},
							{
								title:"RISK CATEGORY",
								content: "P01"
							},
							{
								title:"BUSINESS LINE SEGMENT",
								content: "Technology"
							}
						]
					},
					{
						title:"Qualitative analysis",
						content:[
							{
								title:"AFFECTED OPERATION",
								content: "24564578906"
							},
							{
								title:"AFFECTED SERVICE",
								content: "LEI Control"
							},
							{
								title:"AFFECTED PRODUCT",
								content: "Leverage agile"
							},
							{
								title:"REASON NO PRODUCT",
								content: ""
							},
							{
								title:"APPLY ACTION PLAN",
								content: "Yes"
							},
							{
								title:"REASON IF NOT APPLICABLE",
								content: ""
							}
						]
					}
				]
			}
		},
		{

			type: 'table',
			title:"Geography and impact",
			data:{
				id: 'geo_impact',
				tableHeaders:['GEOGRAPHY','CLIENT','SUBCLIENT','IMPACT TYPE','REGULATION','PROCESS'],
				content:[
					{
						geography:'Madrid',
						client:'Santnder Bank',
						subclient:'Boadilla del',
						type:'Operations',
						regulation:'DFA',
						process:'Clearance - Classic',
						resume:[
							{
								title: 'Description',
								content: 'The execution of this change Led to approximately 4,800 nacks in EMIR valuation messaging (all Santander S.A / Madrid).'
							},
							{
								title: 'External customer affected',
								content: 'Eum ubique voluptatibus te. In reque dicta usu. Ne rebum dissentiet eam, vim omnis deseruisse id.'
							},
							{
								title: 'Resolution date',
								content: '04/12/2020'
							},
							{
								title: 'Resolution',
								content: 'Response to claims submitted by customers.'
							},
							{
								title: 'Amount',
								content: '24.689,00'
							},
							{
								title: 'Currency',
								content: 'EUR'
							},
							{
								title: 'Account',
								content: '3256789401256678557'
							}
						]
					},
					{
						geography:'Madrid',
						client:'Santnder Bank',
						subclient:'Boadilla del',
						type:'Reputational',
						regulation:'DFA',
						process:'Clearance - Classic',
						resume:[
							{
								title: 'Description',
								content: 'The execution of this change Led to approximately 4,800 nacks in EMIR valuation messaging (all Santander S.A / Madrid).'
							},
							{
								title: 'External customer affected',
								content: 'Eum ubique voluptatibus te. In reque dicta usu. Ne rebum dissentiet eam, vim omnis deseruisse id.'
							},
							{
								title: 'Resolution date',
								content: '05/12/2020'
							},
							{
								title: 'Resolution',
								content: 'Response to claims submitted by customers.'
							},
							{
								title: 'Amount',
								content: '14.689,00'
							},
							{
								title: 'Currency',
								content: 'EUR'
							},
							{
								title: 'Account',
								content: '3256789401256678557'
							}
						]
					},
					{
						geography:'Madrid',
						client:'Santnder Bank',
						subclient:'Boadilla del',
						type:'Economic',
						regulation:'MMSR',
						process:'Clearance - Classic'
					}
				]
			}
		},
		{
			type: 'card',
			title:"Services",
			data:[
				{
					icon: 'icon-success',
					title: 'Validation',
					module: 'MOD.04 VALIDATION',
					content: {
						description: 'Validation of arranged transactions in BO systems, including display of interfaces, automatic/manual logging of transactions, controls/reconciliations to ensure process quality and incident management.',
					}
				},
				{
					icon: 'icon-lsecurity',
					title: 'Confirmation',
					module: 'MOD.05 Generation of confirmation',
					content: {
						description: 'Generation of confirmation about arranged transactions, including the execution of checks to ensure process quality and submission to the customer, and management of process incidents.',
					}
				},
				{
					icon: 'icon-financial',
					title: 'Accounting',
					module: 'MOD.09 Calculation and generation of the accounting',
					content: {
						description: 'Calculation and input of manual accounting in systems.',
					}
				},
				{
					icon: 'icon-report',
					title: 'Regulatory reporting',
					module: 'MOD.30 Transaction monitoring',
					content: {
						description: `Review of the alerts generated in the Transaction Monitoring process, escalating those operations that are unusual or suspicious to 1LOD-B / 2LOD and notifying the CDD team of those cases that require an update of the client's file, all according to the criteria established in the current Operating Model.`,
					}
				},
			]
		},
		{
			type: 'table',
			title: "Action plans",
			data:{
				id: 'act_plans',
				number: "2",
				tableHeaders:['PLAN TYPE', 'STATUS','PLANNED IMPL. DATE','REAL IMPL. DATE'],
				content:[ 
					{
						type:'Punctual action',
						status:'In progress no date',
						planImpDate:'04/12/2020',
						realImpDate:'04/03/2021',
						resume:[
							{
								title: 'IMPL. DEPARTMENT',
								content: 'SLB Deals'
							},								
							{
								title: 'ENTITY',
								content: 'NO SBGM'
							},							
							{
								title: 'AREA RESPONSABLE',
								content: 'SLB'
							},
							{
								title: 'PERSON IN CHANGE',
								content: 'María Angeles Parron Alite',
								status: 'critical'
							},
							{
								title: 'DESCRIPTION',
								content:'Once trades get matched and the kick off time for payments is reached, payments are sent to STP. This manual actions prevented any payment default and economic impact.'
							}
						]
					},
					{
						type:'Punctual action',
						status:'In progress',
						planImpDate:'07/11/2020',
						realImpDate:'04/02/2021',
						resume:[
							{
								title: 'IMPL. DEPARTMENT',
								content: 'SLB Deals'
							},								
							{
								title: 'ENTITY',
								content: 'NO SBGM'
							},							
							{
								title: 'AREA RESPONSABLE',
								content: 'SLB'
							},
							{
								title: 'PERSON IN CHANGE',
								content: 'María Angeles Parron Alite',
								status: 'critical'
							},
							{
								title: 'DESCRIPTION',
								content:'Once trades get matched and the kick off time for payments is reached, payments are sent to STP. This manual actions prevented any payment default and economic impact.'
							}
						]
					},
				]
			}				
		},
		{
			type: 'files',
			title:"Additional documentation",
			data:{
					title:"COMMENTS",
					content:"Client trades get matched it and  payments are sent to STP.",
					files: [
						{
							name: 'Incident_1249058.xls',
							extension: '.xls',
							size: '1.2 mb',
							date: '18/4/2020 10:02:00 am'
						},
						{
							name: 'Incident_1249058.pdf',
							extension: 'pdf',
							size: '765 KB',
							date: '18/4/2020 10:02:00 am'
						}
					]
			}
		}

	]
};
DevelopSimple.args = {
	open: true,
	literals: {
		title: 'Relevant Fact Detail',
		subtitle: 'Treasury - Movement settlement error in DGO',
		data: [
			{
				type: 'data',
				content:[
					{
						title: "STATUS",
						content: "Pending"
					},
					{
						title: "RELEVANT FACT CODE",
						content: "526788"
					},
					{
						title: "REPORTING DEPARTMENT",
						content: "LEI Control"
					},
					{
						title: "COMMUNICATION DATE",
						content: "04/12/2020"
					},
					{
						title: "OCURRENCE DATE",
						content:  "04/03/2021"
					},
					{
						title: "UPDATE DATE",
						content:  "15/01/2021"
					}
				]
			},
			{
				type: 'text',
				content: [{
					title: "DESCRIPTION",
					content:`On March, 16th, 2021 the vendor for I ntellinnatch, FIS, did not process the SWIFT confirmation messages for 8 hours (from 18h to 2h CET). The problem affected to all Santander branches that use Intellimatch. FXMM have requested FIS to send them a report with the incidence.

LEI Control process does not take into account these codes.
Label with a parameter in GBO in order is duplicate.
The execution of this change Led to approximately 4,800 nacks.`
				},
				{
					title: "DESCRIPTION 2",
					content:`On March, 18th, 2021 the vendor for I ntellinnatch, FIS, did not process the SWIFT confirmation messages for 8 hours (from 18h to 2h CET). The problem affected to all Santander branches that use Intellimatch. FXMM have requested FIS to send them a report with the incidence.`
				}],
			},
			{
				type: 'data',
				mainTitle: "Reported as incident",
				content:[
					{
						title:"",
						content:"526788",
						status: 'code',
						subtitle:"Read incident"
					}
				]
			},
			{
				type: 'text',
				content: [{
					title: "DESCRIPTION",
					content:`On March, 16th, 2021 the vendor for I ntellinnatch, FIS, did not process the SWIFT confirmation messages for 8 hours (from 18h to 2h CET). The problem affected to all Santander branches that use Intellimatch. FXMM have requested FIS to send them a report with the incidence.

LEI Control process does not take into account these codes.
Label with a parameter in GBO in order is duplicate.
The execution of this change Led to approximately 4,800 nacks.`
				},
				{
					title: "DESCRIPTION 2",
					content:`On March, 18th, 2021 the vendor for I ntellinnatch, FIS, did not process the SWIFT confirmation messages for 8 hours (from 18h to 2h CET). The problem affected to all Santander branches that use Intellimatch. FXMM have requested FIS to send them a report with the incidence.`
				}],
			}
		],
		button: "Back",
	},
	data:[]
};
DevelopReduce.args = {
	open: true,
	literals: {
		title: 'Invoice Detail',
		subtitle: '175210001 Multiple - Securitisation - managing exe',
		data: [
			{
				type: 'data',
				content:[
					{
						title: "STATUS",
						content: "Pending >90 days"
					},
					{
						title: "INVOICE DATE",
						content: "04/01/2021"
					},
					{
						title: "BUSINESS",
						content: "Operations"
					},
					{
						title: "ANX",
						content: "ANX01038_20",
						status: 'critical'
					},
					{
						title: "CONTRACT AMOUNT",
						content: "228.272,20"
					},
					{
						title: "TOTAL INVOICE AMOUNT",
						content: "230.577,98"
					},
					{
						title: "AMOUNT CHARGED",
						content: "2.000,00"
					},
					{
						title: "PENDING AMOUNT",
						content: "228.577,98"
					},
					{
						title: "PAYMENT DATE",
						content: "15/01/2021"
					}
				],
				onlyText: true
			},			
		],
		button: "Back"
	},
	data:[]
};
DevelopCards.args = {
	open: true,
	literals: {
		title: 'Contract Detail',
		subtitle: 'ANX00147 BAU Business Reporting Consolidation',
		data: [
			{
				type: 'data',
				content:[
					{
						title: "STATUS",
						content: "In progress"
					},
					{
						title: "PHASE",
						content: "New service"
					},
					{
						title: "BUSINESS",
						content: "Operations (1000)"
					},
					{
						title: "DEPARTMENT",
						content: "CLMC"
					},
					{
						title: "SERVICE TYPE",
						content: "BAU"
					},
					{
						title: "DIM/PROG",
						content: "D1592"
					},
					{
						title: "STAR DATE",
						content: "01/01/2021"
					},
					{
						title: "END DATE",
						content: "31/12/2021"
					},
					{
						title: "AMOUNT",
						content: "23.577,98"
					},
					{
						title: "PURCHASE NUMBER",
						content: "526788"
					},
					{
						title: "ID ELECTRONIC SING.",
						content: "CW22553"
					}
				],
			}
		],
		info:{
			textBefore: 'To check the status of the contracted services, click ',
			link: 'Service Level Review Reports',
			textAfter: '. The app will open in another tab.',
			linkAdress: 'https://analyticsbi.scib.gs.corp/login'
		},
		button: "Back",
	},
	data:[
		{
			type: 'card',
			title:'Services',
			data:[
				{
					icon: 'icon-success',
					title: 'Validation',
					module: 'MOD.04 VALIDATION',
					content: {
						description: 'Validation of arranged transactions in BO systems, including display of interfaces, automatic/manual logging of transactions, controls/reconciliations to ensure process quality and incident management.',
					}
				},
				{
					icon: 'icon-lsecurity',
					title: 'Confirmation',
					module: 'MOD.05 Generation of confirmation',
					content: {
						description: 'Generation of confirmation about arranged transactions, including the execution of checks to ensure process quality and submission to the customer, and management of process incidents.',
					}
				},
				{
					icon: 'icon-financial',
					title: 'Accounting',
					module: 'MOD.09 Calculation and generation of the accounting',
					content: {
						description: 'Calculation and input of manual accounting in systems.',
					}
				},
				{
					icon: 'icon-report',
					title: 'Regulatory reporting',
					module: 'MOD.30 Transaction monitoring',
					content: {
						description: `Review of the alerts generated in the Transaction Monitoring process, escalating those operations that are unusual or suspicious to 1LOD-B / 2LOD and notifying the CDD team of those cases that require an update of the client's file, all according to the criteria established in the current Operating Model.`,
					}
				},
			]
		},
		{
			type: 'card',
			title:'KPI',
			data:[
				{
					title: 'OTC Derivatives',
					module: 'MOD.04 Validation',
					content: {
						title:'IND.VALIDAT01: Validation of transactions in BO systems',
						description: 'Number of transactions validated (*) within the agreed timeframe (**)/Number of transactions entered into the BO system on the day (***)*100.',
					},
					leyend: {
						icon: 'icon-time',
						frequency: 'DAILY',
						title: 'MEASUREMENT:',
						values: [
							{
								value:'>=98%',
								color:'#00BC63'
							},
							{
								value:'>=95% & <98%',
								color:'#F2AB4E'
							},
							{
								value:'<95%',
								color:'#EC0000'
							}
						]
					}
				},
				{
					title: 'OTC Derivatives',
					module: 'MOD.05 Generation of confirmation',
					content: {
						title:'IND.CONFIR01: Documentary confirmations issued within the deadline',
						description: 'Number of confirmations issued within the agreed deadline',
					},
					leyend: {
						icon: 'icon-time',
						frequency: 'DAILY',
						title: 'MEASUREMENT:',
						values: [
							{
								value:'>=98%',
								color:'#00BC63'
							},
							{
								value:'>=95% & <98%',
								color:'#F2AB4E'
							},
							{
								value:'<95%',
								color:'#EC0000'
							}
						]
					}
				},
				{
					title: 'Financial statement accounting',
					module: 'MOD.09 Calculation and generation of the accounting',
					content: {
						title:'IND.ACCOUN02: Open entries in accounting reconciliations at close of month exceeding agreed amount',
						description: 'Number of open entries in accounting reconciliations at close of month exceeding agreed amount',
					},
					leyend: {
						icon: 'icon-time',
						frequency: 'MONTHLY',
						title: 'MEASUREMENT:',
						values: [
							{
								value:'>=98%',
								color:'#00BC63'
							},
							{
								value:'>=95% & <98%',
								color:'#F2AB4E'
							},
							{
								value:'<95%',
								color:'#EC0000'
							}
						]
					}
				}
			]
		}
	]
};