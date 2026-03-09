import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Color Panel',
	...getStoryConfig('scib-ui-color-panel', {
		argTypes: {
			status: {
				control: {
					type: 'select',
					options: {
						'Pending': 'pending',
						'Requested': 'requested',
						'Progress': 'progress',
						'Done': 'done',
						'On Boarding': 'onboarding',
						'Stand By': 'stand',
						'Closed': 'closed',
						'Canceled': 'canceled',
						'Rejected': 'rejected',
						'Disabled': 'disabled',
						'>90 days': 'more-90-days',
						'<30 days': 'minus-30-days',
					},
				},
			},
		},
	}),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-color-panel top-label='${args.topLabel}' status='${args.status}'>
		<div slot='dataContent'>
			${args.dataContent}
		</div>
	</scib-ui-color-panel>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	status: 'pending',
	topLabel: 'Top  Label text',
	dataContent: 'Text',
	isPrevActive: true
	// Add default values here
};
