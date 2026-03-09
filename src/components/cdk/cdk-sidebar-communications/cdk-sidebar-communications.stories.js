import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Sidebar Communications',
	...getStoryConfig('scib-cdk-sidebar-communications'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-sidebar-communications
		open='${parseBoolean(args.open)}'
		active-tab='${args.activeTab}'
		profile='${parseObject(args.profile)}'
		tabs='${parseObject(args.tabs)}'
	>
		<div slot='tab-MSG' style='height: 100%'>
			<scib-cdk-panels-communications>
				<div slot='panel-main'>main content</div>
				<div slot='panel-detail'>detail content</div>
			</scib-cdk-panels-communications>
		</div>
		<div slot='tab-ALE' style='height: 100%'>
			<scib-cdk-panels-communications>
				<div slot='panel-main'>main content</div>
				<div slot='panel-detail'>detail content</div>
			</scib-cdk-panels-communications>
		</div>
		<div slot='tab-BUL' style='height: 100%'>
			<scib-cdk-panels-communications>
				<div slot='panel-main'>main content</div>
				<div slot='panel-detail'>detail content</div>
			</scib-cdk-panels-communications>
		</div>
	</scib-cdk-sidebar-communications>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	open: true,
	activeTab: 'MSG',
	profile: {
		name: 'Jesús Cárdenas Vizcaíno',
		avatar: {
			src: 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			alt: 'Jesús Cárdenas Vizcaíno',
		},
	},
	tabs: [
		{ id: 'BUL', label: 'Bulletines' },
		{ id: 'MSG', label: 'Messages', notifications: 3 },
		{ id: 'ALE', label: 'Alerts and notices' },
	],
	// Add default values here
};
