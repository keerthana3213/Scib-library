import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Signature Table Cell Status',
	...getStoryConfig('scib-cdk-signature-table-cell-status')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-signature-table-cell-status
	    status='${args.status}'
	    cell-id='${'textoidn'}'
	    completed='${args.completed}'
	    total='${args.total}'
	    color='${args.color}'
	    literal='${args.literal}'
	    is-error='${args.isError}'
	    error='${args.error}'
		
	></scib-cdk-signature-table-cell-status>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	isError: true,
	status: "completed",
	'cell-id': "textoidn",
	completed: "2",
	total: "3",
	color: "#CCCCCC",
	literal: "Draft",
	error: "with error"

};