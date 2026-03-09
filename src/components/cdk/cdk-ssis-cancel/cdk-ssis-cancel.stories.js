import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Ssis Cancel',
	...getStoryConfig('scib-cdk-ssis-cancel'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open is-emitter absolute>
		<scib-cdk-ssis-cancel literals='${parseObject(args.literals)}'></scib-cdk-ssis-cancel>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		'mainTitle': 'Request Cancelation',
		'legend': 'Are you sure you want to cancel the request? Include the reason in the following field.',
		'textAreaLabel': 'Reason for Cancellation*',
		'textAreaPlaceholder': 'Enter text...',
		'notice': '*Required input',
		'cancelBtn': 'Cancel',
		'submitBtn': 'Submit',
	},
	// Add default values here
};
