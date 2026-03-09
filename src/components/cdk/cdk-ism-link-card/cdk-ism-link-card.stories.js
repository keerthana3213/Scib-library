import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ism Link Card',
	...getStoryConfig('scib-cdk-ism-link-card')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-ism-link-card
		literals='${parseObject(args.literals).replaceAll(/[\/\(\)\']/g, "\\$&")}'
		show-skeleton=${parseBoolean(args.showSkeleton)}
	>
	</scib-cdk-ism-link-card>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: [{
		title: 'Client Request',
		icon: '../../../assets/images/i-client-app.svg',
		step1: 'Click here to access',
		step2: "The app'll open in another tab", 
		image: '../../../assets/images/i-tablet-man.svg'
	},
	{
		title: 'Service Level Review Reports',
		icon: '../../../assets/images/i-laptop-app.svg',
		step1: 'Click here to access',
		step2: "The app'll open in another tab", 
		image: '../../../assets/images/i-desktop-woman.svg'
	}]
	// Add default values here
};
