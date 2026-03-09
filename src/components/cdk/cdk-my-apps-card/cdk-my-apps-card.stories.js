import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/My Apps Card',
	...getStoryConfig('scib-cdk-my-apps-card')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-my-apps-card
		literals='${parseObject(args.literals)}'
		my-apps-card-data='${parseObject(args.myAppsCardData)}'>
		<span> ${args.slot} </span>
	</scib-cdk-my-apps-card>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		active: "Active App",
		locked: "Locked App",
	},
	myAppsCardData: {
		id: "card-id",
		title: "Virtual Data Room",
		isLocked: false,
		isActive: true,
		icon: "https://pymdigital.com/wp-content/uploads/2017/11/profile.jpg",
		link: "/store/virtual-data-room"
	},
	slot: ''
};
