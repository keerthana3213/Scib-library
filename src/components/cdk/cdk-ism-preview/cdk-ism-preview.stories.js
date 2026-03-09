import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ism Preview',
	...getStoryConfig('scib-cdk-ism-preview')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-ism-preview
		is-loading=${parseBoolean(args.isLoading)}
		error-on-loading=${parseBoolean(args.errorOnLoading)}
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
	</scib-cdk-ism-preview>
`);

// Default Story
export const Develop = Template.bind();

const literals = {
	errorTitle: "Were having trouble loading this right now",
	errorDesc: "Please come again later or try to refresh the page",
	literalsCard: [
		{ title: 'Invoices', subtitle: 'pend. risk.' },
		{ title: 'Contracts', subtitle: 'pend. sign.' },
		{ title: 'Incidents', subtitle: 'pend. sign.' },
		{ title: 'Action plans', subtitle: 'pend. action plans' },
		{ title: 'Relevant facts', subtitle: 'total last 30 days' }]
}

Develop.args = {
	isLoading: false,
	errorOnLoading: false,
	literals: {
		errorTitle: "Were having trouble loading this right now",
		errorDesc: "Please come again later or try to refresh the page",
		literalsCard: {
			incidents: {
				title: 'Incidents,',
				inProgress: 'in progress last 30d',
				pending: 'pend. action plans',
				critical: 'Criticality P01 - P03'
			},
			relevantFacts: {
				title: 'Relevant facts,',
				subtitle: 'new last 30 days'
			},
			invoices: {
				title: 'Invoices,',
				subtitle: 'pending'
			},
			contracts: {
				title: 'Contracts,',
				subtitle: 'formalizing'
			}
		}
	},
	data: {
		"loadingImgSrc": "images/i-descarga.svg",
		incidents: {
			inProgress: '12',
			pending: '2',
			critical: '7'
		},
		relevantFacts: {
			newLast30: '45'
		},
		invoices: {
			pending: '100'
		},
		contracts: {
			formalizing: '34'
		}
	}
};
