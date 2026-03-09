import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ibor Preview',
	...getStoryConfig('scib-cdk-ibor-preview')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-ibor-preview
		is-loading=${parseBoolean(args.loading)}
		error-on-loading=${parseBoolean(args.error)}
		loading-img-src='images/i-descarga.svg'
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	></scib-cdk-ibor-preview>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	loading: false,
	error: false,
	literals: {
		"errorTitle": "Were having trouble loading this right now",
		"errorDesc": "Please come again later or try to refresh the page"
	},
	data: [
		{
			"id":"progress-bar-1",
			"partLabel":"Grouped contracts",
			"partValue":2400,
			"totalLabel":"ALL CONTRACTS",
			"totalValue":11500,
			"showRatio":true,
			"showCheckWheComplete":true,
			"noDecimals":false,
			"styling": {"color":"#1BB3BC"}
		},
		{
			"id":"progress-bar-2",
			"partLabel":"Closed IBOR Cases",
			"partValue":1300,
			"totalLabel":"ALL CASES",
			"totalValue":11500,
			"showRatio":true,
			"showCheckWheComplete":true,
			"noDecimals":false,
			"styling": {"color":"#1BB3BC"}
		},
		{
			"id":"progress-bar-3",
			"partLabel":"Clients with IBOR TRANSITION completed",
			"partValue":1234,
			"totalLabel":"ALL CLIENTS",
			"totalValue":3588,
			"showRatio":true,
			"showCheckWheComplete":true,
			"noDecimals":false,
			"styling": {"color":"#1BB3BC"}
		}
	]
};
