import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Topic Card',
	...getStoryConfig('scib-cdk-topic-card'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-topic-card 
		show-skeleton='${parseBoolean(args.showSkeleton)}'
		literals='${parseObject(args.literals)}'
		have-notifications='${parseBoolean(args.haveNotifications)}'
        edit='${parseBoolean(args.edit)}'
        closed='${parseBoolean(args.closed)}'
        status-change-permission='${parseBoolean(args.statusChangePermission)}'
		members-list='${parseObject(args.membersList)}'
	></scib-cdk-topic-card> 
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	showSkeleton: false,
	haveNotifications: false,
    edit: false,
    closed: false,
    statusChangePermission: false,
	literals: {
		'urlTopic': 'https://digitalplatform.scib.dev.corp/home',
		'tooltipTopic': 'Go to portal',
		'mainTitle': '<h3>Innovation budget Q4 2020</h3>',
		'description': '<p>Budget revision and approval for committee presentation</p>',
        'members': '<span>Members</span>',
        'closedStatus': 'Closed'
	},
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
			'imgSrc': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'imgAlt': 'Alejandro Rafael Ibañez Peiro',
			'name': 'Alejandro Rafael Ibañez Peiro',
		},
	],
	// Add default values here
};
