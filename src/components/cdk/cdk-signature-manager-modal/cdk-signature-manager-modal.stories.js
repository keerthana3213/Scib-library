import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Signature Manager Modal',
	...getStoryConfig('scib-cdk-signature-manager-modal'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-signature-manager-modal
		env='${args.env}'
		literals='${parseObject(args.literals)}'
		email-invalid='${parseBoolean(args.emailInvalid)}'
	></scib-cdk-signature-manager-modal>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	env: 'cert',
	literals: {
		selectManager: 'Select manager',
		textManager: 'In order to be able to sign, the manager must be identified. Once your request has been sent, you will be able to sign.',
		noResultsText: 'No results',
		notListAbove: 'Not listed above?',
		nameManager: 'Name',
		emailManager: 'Email',
		emailInvalid: 'Invalid email format',
		requiredInputs: '*Required inputs',
		buttonCancel: 'Cancel',
		buttonConfirm: 'Confirm'
	},
	emailInvalid: false
};
