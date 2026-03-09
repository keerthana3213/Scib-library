import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Vdr Card',
	...getStoryConfig('scib-cdk-vdr-card')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-vdr-card 
		show-skeleton=${parseBoolean(args.loading)}
		literals='${parseObject(args.literals)}'
		owners-list='${parseObject(args.owners)}'
		members-list='${parseObject(args.members)}'
		closed=${parseBoolean(args.closed)}
		></scib-cdk-vdr-card> 
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	loading: false,
	closed: false,
	literals: { 
		"urlVdr":"https://digitalplatform.scib.dev.corp/home", 
		"tooltipVdr": "Go to portal",
		"mainTitle" : "<h3>Innovation budget Q4 2020</h3>",
		"description" : "<p>Budget revision and approval for committee presentation</p>",
		"date" : "<span>April 20, 2020</span>",
		"owners" : "<span>Owners</span>",
		"members" : "<span>Members</span>",
		"closedStatus": "Closed",
		"criticality": { 
			title: "P3", 
			color: "#990000"
		},
		"state": { 
			title: "In progress - action plans", 
			color: "#f2ab4e"
		}
	},
	owners: [
		{
			"isEmployees" : true,
			"imgSrc" : "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
			"imgAlt" : "Jesús Cárdenas Vizcaíno",
			"name" : "Jesús Cárdenas Vizcaíno"
		},
		{
			"isEmployees" : true,
			"imgSrc" : "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
			"imgAlt" : "Jesús Cárdenas Vizcaíno",
			"name" : "Jesús Cárdenas Vizcaíno"
		},
		{
			"isEmployees" : true,
			"imgSrc" : "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
			"imgAlt" : "Jesús Cárdenas Vizcaíno",
			"name" : "Jesús Cárdenas Vizcaíno"
		},
		{
			"isEmployees" : true,
			"imgSrc" : "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
			"imgAlt" : "Jesús Cárdenas Vizcaíno",
			"name" : "Jesús Cárdenas Vizcaíno"
		}
	],
	members: [
		{
			"isEmployees" : true,
			"imgSrc" : "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
			"imgAlt" : "Alejandro Rafael Ibañez Peiro",
			"name" : "Alejandro Rafael Ibañez Peiro"
		},
		{
			"isEmployees" : false,
			"imgSrc" : "",
			"imgAlt" : "Alejandro Rafael Ibañez Peiro",
			"name" : "Alejandro Rafael Ibañez Peiro"
		},
		{
			"imgSrc" : "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
			"imgAlt" : "Alejandro Rafael Ibañez Peiro",
			"name" : "Alejandro Rafael Ibañez Peiro"
		},
		{
			"imgSrc" : "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
			"imgAlt" : "Alejandro Rafael Ibañez Peiro",
			"name" : "Alejandro Rafael Ibañez Peiro"
		}
	],
};
