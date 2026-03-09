import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Vdr Detail',
	...getStoryConfig('scib-cdk-vdr-detail'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-vdr-detail
		show-skeleton='${parseBoolean(args.showSkeleton)}'
		literals='${parseObject(args.literals)}'
		tooltip-data='${parseObject(args.tooltipData)}'
		owners-list='${parseObject(args.ownersList)}'
		members-list='${parseObject(args.membersList)}'
		vdrStatus='${parseBoolean(args.closeVdr)}'
		scalation='${parseBoolean(args.scalation)}'
	></scib-cdk-vdr-detail>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	showSkeleton: false,
	literals: {
		'isEmployees': true,
		'title': 'Highway in Egypt',
		'description': 'Creation of a new highway from Cairo to Alejandria',
		'status': 'Active',
		'activedate': 'February 18, 2020',
		'ownersLabel': 'Owner',
		'membersLabel': 'Members',
		'btnCreate': 'Open manage request',
		'btnEdit': 'Open edit',
		'switchClose': 'Close VDR',
		'stateVdr': ' Status',
		'criticality': { 
			title: "P3", 
			color: "#990000"
		},
		'state': { 
			title: "In progress - action plans", 
			color: "#f2ab4e"
		}
	},
	tooltipData: {
		'link': {
			'literal': 'See all members',
			'eventName': 'eventSeeAllMembers',
		},
	},
	ownersList: [
		{
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'imgAlt': '',
			'name': 'Alejandro Rafael Ibañez Peiro',
			'isEmployees': false,
		},
	],
	membersList: [
		{
			'isEmployees': true,
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'isEmployees': false,
			'imgSrc': '',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'isEmployees': false,
			'imgSrc': '',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'isEmployees': false,
			'imgSrc': '',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'isEmployees': false,
			'imgSrc': '',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
		{
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
	],
	vdrStatus: true,
	scalation: true
	// Add default values here
};
