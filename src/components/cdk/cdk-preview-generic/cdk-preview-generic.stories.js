import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Preview Generic',
	...getStoryConfig('scib-cdk-preview-generic')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-preview-generic
		literals='${parseObject(args.literals)}'
		image='${args.image}'
        inverted='${parseBoolean(args.inverted)}'
	>
	</scib-cdk-preview-generic>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
    inverted: false,
	image: '../../../assets/images/i-tablet-man.svg',
	literals: {
		title: 'Access all the information about the researchs',
        description: 'This is an application external to the portal. The app may request your access data.'
	}
	// Add default values here
};
