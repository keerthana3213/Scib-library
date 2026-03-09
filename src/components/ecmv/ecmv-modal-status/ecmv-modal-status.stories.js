import { getStoryConfig, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Modal Status',
	...getStoryConfig('scib-ecmv-modal-status'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ecmv-modal-status
		open='${parseBoolean(args.open)}'
		title-item='${args.titleItem}'
		message='${args.message}'
		submessage='${args.submessage}'
		button-text-continue='${args.buttonTextContinue}'
		button-text-cancel='${args.buttonTextCancel}'
		type='${args.type}'
	></scib-ecmv-modal-status>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	titleItem: 'Attention!',
	message: 'Are you sure you want to exit?',
	submessage: 'Entered data will be lost',
	buttonTextContinue: 'Continue',
	buttonTextCancel: 'Cancel',
	type: 'alert',
	open: true
	// Add default values here
};
