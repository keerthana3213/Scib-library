import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Panel Data',
	...getStoryConfig('scib-cdk-panel-data'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-panel-data 
		status='${args.status}'
		data='${parseObject(args.data)}'
	></scib-cdk-panel-data>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	status: 'pending',
	data: [
		{
			'label': 'Status',
			'data': 'Pending',
		},
		{
			'label': 'Client',
			'data': 'Iberdrola',
		},
		{
			'label': 'ID Request',
			'data': '82634923475',
		},
		{
			'label': 'Creation Date',
			'data': '12/12/2012',
		},
	],
};
