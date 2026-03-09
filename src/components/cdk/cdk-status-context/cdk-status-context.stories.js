import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Status Context',
	...getStoryConfig('scib-cdk-status-context'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-status-context literals='${parseObject(args.literals)}'> </scib-cdk-status-context>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		title: 'Index',
		text:
			'Negotiation cases are shown with different format and status according to the following information:',
		items: [
			{
				status: 'pending',
				id: 'pending01',
				title: 'Proposal Preparation',
				text: 'Group needed for assignment of a new template.',
			},
			{
				status: 'pending',
				id: 'pending02',
				title: 'Proposal Preparation - Waiting for parameters',
				text: 'Negotiation case pending assignment of parameter values for the generation of the amendment proposal.',
			},
			{
				status: 'pending',
				id: 'pending03',
				title: 'Proposal Preparation - Parameters confirmed',
				text: 'Negotiation case with parameter values assigned and pending generation & assignment of the amendment proposal.',
			},
			{
				status: 'pending',
				id: 'pending04',
				title: 'Proposal Preparation - Template Assigned',
				text: 'Proposal needed for amendment upload.',
			},
			{
				status: 'progress',
				id: 'progress01',
				title: 'Ready to Negotiation',
				text: 'Pending to initiate negotiation.',
			},
			{
				status: 'progress',
				id: 'progress02',
				title: 'Block by client owner',
				text: 'Negociation blocked by client owner.',
			},
			{
				status: 'requested',
				id: 'requested01',
				title: 'Negotiation',
				text: 'Negotiation iniciated.',
			},
			{
				status: 'requested',
				id: 'requested02',
				title: 'Negotiation - Accepted',
				text: 'Negotiation accepted by the client.',
			},
			{
				status: 'requested',
				id: 'requested03',
				title: 'Negotiation - Escalated',
				text: 'Negotiation escalated to higher-level.',
			},
			{
				status: 'requested',
				id: 'requested04',
				title: 'Negotiation – Pending digital signature',
				text: 'Negotiation group pending reception of digital signature confirmation of the amendment.'
			},
			{
				status: 'requested',
				id: 'requested05',
				title: 'Negotiation - Signed',
				text: 'Contract signed by client.',
			},
			{
				status: 'requested',
				id: 'requested06',
				title: 'Negotiation - Parameters confirmed',
				text: 'Parameters confirmed by third party.',
			},
			{
				status: 'done',
				id: 'done01',
				title: 'Closed - Agreed',
				text: 'Closed negociation fue to agreement with the client.',
			},
			{
				status: 'done',
				id: 'done010',
				title: 'Closed  – Pending Cash Compensation',
				text: 'Negotiation case with signed amendment pending for compensation agreement with client..',
			},
			{
				status: 'done',
				id: 'done011',
				title: 'Closed – Agreed Cash Compensatio',
				text: 'Negotiation case closed with signed amendment and compensation agreed with the client..',
			},
			{
				status: 'done',
				id: 'done012',
				title: 'Closed – No Cash Compensation',
				text: 'Negotiation case closed with signed amendment and no compensation agreed with the client.',
			},
			{
				status: 'done',
				id: 'done02',
				title: 'Closed - Protocol',
				text: 'Negotiation closed due to compliance with the joined protocol.',
			},
			{
				status: 'done',
				id: 'done03',
				title: 'Closed - Original Clause',
				text: 'Negotiation closed due to compliance with original clause on the contracts.',
			},
			{
				status: 'done',
				id: 'done04',
				title: 'Closed - Contingency',
				text: 'Negotiation closed due to contingency.',
			},
			{
				status: 'done',
				id: 'done05',
				title: 'Closed - New contracts after ISDA protocol',
				text: 'Negotiation closed due to ISDA protocol.',
			},
		],
	},
	// Add default values here
};
