import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Members Tooltip',
	...getStoryConfig('scib-cdk-members-tooltip', {
		argTypes: {
			show: {
				control: {
					type: 'select',
					options: {
						'None': 'none',
						'Block': 'block',
					},
				},
			},
			positionX: {
				control: {
					type: 'select',
					options: {
						'Left': 'left',
						'Right': 'right',
					},
				},
			},
			positionY: {
				control: {
					type: 'select',
					options: {
						'Top': 'top',
						'Bottom': 'bottom',
					},
				},
			},
		},
	}),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style="position:relative;width:100%;">
		<scib-cdk-members-tooltip
			members='${parseObject(args.members)}'
			link-data='${parseObject(args.data)}'
			show="${args.show}"
			positionX="${args.positionX}"
			positionY="${args.positionY}"
			parent-height="${args.parentHeight}"
		>
		</scib-cdk-members-tooltip>
	</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	members: [
		{
			"isEmployees" : true,
			"imgSrc" : "https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png",
			"imgAlt" : "Alejandro Rafael Ibañez Peiro",
			"name" : "Alejandro Rafael Ibañez Peiro",
			"readDate" : "12 Abril 2020, 19:32"
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
		}
	],
	data: {
		"literal": "See all members",
		"eventName": "eventSeeAllMembers"
	},
	show: 'block',
	positionX: 'left',
	positionY: 'top',
	parentHeight: '20px'
};
