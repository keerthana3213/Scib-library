import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Delete Members',
	...getStoryConfig('scib-cdk-delete-members'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open hide-header is-emitter absolute>
		<scib-cdk-delete-members
			literals='${parseObject(args.literals)}'
			member='${parseObject(args.member)}'
			topics='${parseObject(args.topics)}'
		></scib-cdk-delete-members>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	literals: {
		'title': 'Attention!',
		'subTitle': 'You are about to remove a member from the Virtual Data Room',
		'message': 'By removing this member from the Virtual Data Room, you are about to remove him from the following active topics:',
		'selectLabel': 'Yes, I agree to remove this member from the VDR and all topics that the user is active.',
		'textAreaLabel': 'Remove Reason*',
		'textAreaPlaceholder': 'Enter reason...',
		'cancelBtn': 'Cancel',
		'submitBtn': 'Remove Member',
	},
	member: {
		'id': '1235',
		'name': 'Jeremías Martínez',
		'avatar': {
			'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
			'alt': 'Jesús Cárdenas Vizcaíno',
		},
		'isEmployee': true,
	},
	topics: ['Example Topic', 'Topic'],
};
