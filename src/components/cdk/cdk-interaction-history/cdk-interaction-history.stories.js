import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Interaction History',
	...getStoryConfig('scib-cdk-interaction-history')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-interaction-history
		data='${parseObject(args.data)}'
		literals='${parseObject(args.literals)}'
	>
	</scib-cdk-interaction-history>
`);

// Default Story
export const Develop = Template.bind();
const testDate = new Date();

Develop.args = {
	data: {
		showForm: false,
		interactions: [
			{
				date:"2021-03-19T10:04:00.788Z",
				interactionType: 'Client On boarded in VDR',
				channel: 'ClientHub',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
			},
			{
				date: testDate,
				interactionType: 'Client On boarded in VDR',
				channel: 'ClientHub',
				// description: 'Lorem ipsum dolor sit amet, consectetur adipiscing ',
			},
			{
				date: testDate,
				interactionType: 'Client On boarded in VDR',
				channel: 'ClientHub',
				description: 'Lorem ipsum dolor sit amet, consectetur adipiscing',
			},
		]
	},
	literals: {
		date: 'Date',
		time: 'Hour',
		interactionType: 'Interaction type',
		channel: 'Channel',
		description: 'Description',
		datePlaceholder: 'Date',
		timePlaceholder: 'Hour',
		interactionTypePlaceholder: 'Select type...',
		channelPlaceholder: 'Select channel...',
		descriptionPlaceholder: 'Enter some description...',
		newInteraction: 'New interaction',
		addClientInteraction: 'Add client interaction',
	}
};
