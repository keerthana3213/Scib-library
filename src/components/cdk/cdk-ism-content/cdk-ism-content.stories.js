import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ism Content',
	...getStoryConfig('scib-cdk-ism-content')
};


const issue_log_literals = {
	title: 'Issue Log',
	url: '/dashboard/issue-log',
	dataLiterals: {
		title: 'Status of incidents',
		legendLiterals: [
			{ title: 'In process', id: 'in_process'},
			{ title: 'Solved', id: 'solved'}
		],
		infoLiteral: 'Pending action plans',
		listLiteral: 'Lastest incidents'
	}
}


const issue_log_data = {
	total: 139,
	data: [{
		legend: [
			{title: 'In process', data: 18, status: 'done' },
			{title: 'Solved', data: 121, status: 'pending' },
		],
		info: 2,
		list: [
			'Securities financincing - G1 to crest incidence affecting SLB deals',
			'Treasury - Late payment of Medium Branch',
			'Normas, CISO & Risk control - contingency activation in Santander …'
		]
	}]
}


/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-ism-content
		show-skeleton=${parseBoolean(args.showSkeleton)}
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		text='${args.text}'
		type='${args.type}'
		full-width=${parseBoolean(args.fullWidth)}
	>
	</scib-cdk-ism-content>
`);
const TemplateVersionB = (args) => render(args, `
	<scib-cdk-ism-content
		show-skeleton=${parseBoolean(args.showSkeleton)}
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		text='${args.text}'
		type='${args.type}'
		full-width=${parseBoolean(args.fullWidth)}
	>
	</scib-cdk-ism-content>
`);
const TemplateVersionC = (args) => render(args, `
	<scib-cdk-ism-content
		show-skeleton=${parseBoolean(args.showSkeleton)}
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		text='${args.text}'
		type='${args.type}'
		full-width=${parseBoolean(args.fullWidth)}
	>
	</scib-cdk-ism-content>
`);
const TemplateAvatars = (args) => render(args, `
	<scib-cdk-ism-content
		show-skeleton=${parseBoolean(args.showSkeleton)}
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		text='${args.text}'
		type='${args.type}'
	>
	</scib-cdk-ism-content>
`);
const TemplateFiles = (args) => render(args, `
	<scib-cdk-ism-content
		show-skeleton=${parseBoolean(args.showSkeleton)}
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		text='${args.text}'
		type='${args.type}'
	>
	</scib-cdk-ism-content>
`);
// Default Story
export const Develop = Template.bind();
export const DevelopVersionB = TemplateVersionB.bind();
export const DevelopVersionC = TemplateVersionC.bind();
export const DevelopAvatars = TemplateAvatars.bind();
export const DevelopFiles = TemplateFiles.bind();
Develop.args = {
	showSkeleton: false,
	literals: {
		title: 'Issue Log',
		url: '/dashboard/issue-log',
		dataLiterals: {
			infoLiteral: 'Pending action plans',
			listLiteral: 'Lastest incidents'
		}
	},
	data: {
		// total: 139,
		data: [{
			legend: [
				{
					title: 'Status of incidents',
					legend: [
						{title: 'In process', data: 18, status: 'pending', id: 'in_process' },
						{title: 'Solved 30d', data: 121, status: 'done', id: 'solved' },
					],
					info: 5,
				},
				{
					title: 'Hight criticality P01 - P03',
					legend: [
						{title: 'In process', data: 7, status: 'more-90-days', id: 'more-90-days' },
						{title: 'Solved 30d', data: 19, status: 'done', id: 'solved' },
					],
					info: 2,
				}
			],
			list: [
				{criticality:'P5', title:'Securities financincing - G1 to crest incidence affecting SLB deals'},
				{criticality:'P3+', title:'Treasury - Late payment of Medium Branch'},
				{criticality:'P5', title:'Normas, CISO & Risk control - contingency activation in Santander …'}
			]
		}]
	},
	type: "issues",
	fullWidth: true
	// Add default values here
};

DevelopVersionB.args = {
	showSkeleton: false,
	literals: {
		title: 'Relevant Facts',
		url: '/dashboard/issue-log',
		dataLiterals: {
			infoLiteral: 'Reported as incident',
			listLiteral: 'Lastest 30 days relevant facts'
		}
	},
	data: {
		// total: 139,
		data: [{
			legend: [
				{
					title: 'Relevant facts and news',
					legend: [
						{title: 'In process', data: 18, status: 'pending', id: 'pending' },
						{title: 'Solved 30d', data: 268, status: 'done', id: 'reported' },
					],
					info: 56,
				},
			],
			list: [
				{title:'Securities financincing - G1 to crest incidence affecting SLB deals'},
				{title:'Treasury - Late payment of Medium Branch'},
				{title:'Normas, CISO & Risk control - contingency activation in Santander …'}
			]
		}]
	},
	type: "issues",
	fullWidth: true
	// Add default values here
};

DevelopVersionC.args = {
	showSkeleton: false,
	literals: {
		title: 'Contracts',
		url: '/dashboard/issue-log',
		dataLiterals: {
			infoLiteral: '',
			listLiteral: 'Lastest contracts being formalized'
		}
	},
	data: {
		// total: 139,
		data: [{
			legend: [
				{
					title: 'Status of your contracts 2022',
					legend: [
						{title: 'Proposals', data: 120, status: 'requested', id: 'proposals' },
						{title: 'Creating', data: 120, status: 'pending', id: 'creating' },
						{title: 'Formal.', data: 100, status: 'compensated', id: 'formalizing' },
						{title: 'Invoiced', data: 121, status: 'done', id: 'invoiced' },
					],
					info: null,
				},
			],
			list: [
				{status:'formalizing', title:'ANX00147 BAU Business Reporting Consolidation'},
				{status:'formalizing', title:'CS Product Owner Q1y Q2'},
				{status:'formalizing', title:'MIS Apv BDR 1T 2021'}
			]
		}]
	},
	type: "issues",
	fullWidth: true
	// Add default values here
};

DevelopAvatars.args = {
	showSkeleton: false,
	literals: {
		title: 'SBGM Organigram & Contact List',
		url: '/sbgb-ism/organigram',
		dataLiterals: {
			title: 'Consult the contacts in the organigram'
		}
	},
	data: {
		total: null,
		data : [
			{
				legend: null,
				info: null,
				list: [
					{
						name: "María Angeles Porron Alite",
						role: "Relationship manager",
						email: "maria.parron.alite@santander.com",
						phone: "612345678",
						tagText: "RM",
						showTag: true,
						img: "https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg"
					},
					{
						name: "Miguel Angel de la Torre Molina",
						role: "Roll description",
						email: "angel.torre.molina@santander.com",
						phone: "698765432",
						tagText: "RM",
						showTag: true,
						img: "https://kprofiles.com/wp-content/uploads/2018/12/nak6-900x600.jpeg"
					}
				]
			}
		],
	},
	type: "contacts",
	fullWidth: true
};

DevelopFiles.args = {
	showSkeleton: false,
	literals: {
		title: 'Invoices',
	},
	data: {
		total: 1232,
		data: [
			{
				title: 'Status of your invoices/contracts',
				legend: [
					{
						title: 'Pend. Pay.',
						data: 498,
						status: 'pending'
					},
					{
						title: 'Denied',
						data: 42,
						status: 'progress'
					},
					{
						title: 'Payed',
						data: 692,
						status: 'done'
					}
				],
				list: {
					title: 'Lastest',
					data: [
						{
							name: '20191209_Validation_Of_Invoise',
							extension: 'pdf',
							size: '175.8 KB',
						},
						{
							name: '20191209_Validation_Of_Invoise',
							extension: 'pdf',
							size: '1.8 MB',
						},
						{
							name: 'Test-file(1).pdf',
							extension: 'pdf',
							size: '175.8 KB',
						},
						{
							name: 'Test-file.pdf',
							extension: 'pdf',
							size: '1.8 MB',
						}
					]
				}
			}
		]
	},
	type: "status",
	fullWidth: true
}
