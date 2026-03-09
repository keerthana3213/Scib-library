import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Config Notification',
	...getStoryConfig('scib-cdk-config-notification'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-config-notification
		literals='${parseObject(args.literals)}'
		config-data='${parseObject(args.configData)}'
		global='${parseBoolean(args.global)}'
	></scib-cdk-config-notification>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	global: true,
	literals: {
		titleConfi: 'Customize your notification preferences',
		subTitle: 'My Activated Apps',
		subText: 'Get notified about all your active apps via email',
		boton: 'Edit',
		botonSave: 'Save',
		textPlatform: 'Notification General Platform',
		textSubPlatform: 'Active plataform notifications via email',
	},
	configData: [
		{
			"acronym": "CF",
			"img": "https://employee.pre.corp/api/statics/icon/icon-confirming.svg",
			"nameApp": "Confirming Global",
			"descriptionApp": "Do not receive notifications via email",
			"checked": false,
			"checkisDisabled": true,
			"idCheck": 5,
			"imgEnabled": true
		},
		{
			"acronym": "gdu",
			"img": "https://employee.pre.corp/api",
			"nameApp": "User access management",
			"descriptionApp": "Receive notifications via email",
			"checked": true,
			"checkisDisabled": true,
			"idCheck": 378,
			"imgEnabled": true
		},
		{
			"acronym": "vdr",
			"img": "https://employee.pre.corp/api/statics/icon/1604429146289i-vdr.svg",
			"nameApp": "Virtual Data Room",
			"descriptionApp": "Do not receive notifications via email",
			"checked": false,
			"checkisDisabled": true,
			"idCheck": 385,
			"imgEnabled": true
		},
		{
			"acronym": "FX",
			"img": "https://employee.pre.corp/api",
			"nameApp": "FX",
			"descriptionApp": "Do not receive notifications via email",
			"checked": false,
			"checkisDisabled": true,
			"idCheck": 4,
			"imgEnabled": true
		}
	],

};
