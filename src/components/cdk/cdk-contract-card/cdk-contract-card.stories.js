import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Contract Card',
	...getStoryConfig('scib-cdk-contract-card'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-contract-card
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		show-skeleton='${parseBoolean(args.showSkeleton)}'
	></scib-cdk-contract-card>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		accessibleLoading: 'Loading info...',
		items: ['Groups', 'Contracts', 'Ungrouped Contracts'],
		status: ['Prop. Prep', 'Neg. Ready', 'Negotiation', 'Closed'],
	},
	data: {
		id: 'card-id',
		title: 'Acciona',
		items: [7, 425, 12],
		status: {
			pending: 1,
			progress: 1,
			requested: 4,
			done: 1,
		},
	},
};
