import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Breadcrumb',
	...getStoryConfig('scib-ecmv-breadcrumb'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ecmv-breadcrumb secondary='${args.secondary}' small-txt='${args.smallTxt}' breadcrumb='${parseObject(args.breadcrumb)}'></scib-ecmv-breadcrumb>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	breadcrumb: [
		{
			'name': 'ECM Documents',
			'tooltip': 'Back to ECM Documents',
			'active': false,
			'position': 1,
		},
		{
			'name': 'Approvals',
			'tooltip': 'Back to Approvals',
			'active': false,
			'position': 2,
		},
		{
			'name': 'Sending documents to the offices',
			'tooltip': 'Back to Sending documents to the offices',
			'active': true,
			'position': 3,
		},
    ],
    smallTxt: false,
    secondary: false
	// Add default values here
};
