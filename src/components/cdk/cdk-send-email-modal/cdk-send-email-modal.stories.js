import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Send Email Modal',
	...getStoryConfig('scib-cdk-send-email-modal')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open is-emitter absolute>
		<scib-cdk-send-email-modal
			literals='${parseObject(args.literals)}'
			members='${parseObject(args.membersString)}'
			is-employee='${parseBoolean(args.isEmployee)}'
			id-list='${args.idList}'
		>
		</scib-cdk-send-email-modal>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	content: 'Slot: CDKsend-email-modal',
	text: 'Prop: CDKsend-email-modal',
	idList: 'membersCreateTopic',
	isEmployee: false,
	literals: {
		title: 'Send conversation via email',
		infoMessage: "You are going to share all the messages from the conversation <b>'Working from home'</b>. <br /> If you'd like to share any files, you will need to go to the files section and download them. <br /> <b>*Please be careful sharing this information for data protection.</b>",
		conversationTitle: 'Working from home',
		membersLabel: '* Select the members you want to send the conversation',
		textAreaLabel: 'Description message',
		placeholderTextarea: 'Please provide a message to share the conversation...',
		textAreaValue: "Hello, \nJohn and Lisa, I'm sending you the conversation from Client Hub that you asked me. \n\nKind regards. \nAmy.",
		notice: '*Required input',
		btnCancel: 'Cancel',
		btnSend: 'Send',
		selectAllLabel: 'Select all',
		unselectAllLabel: 'Unselect all'
	},
	membersString: [
		{
			'id': '1234',
			'email': 'jcardenas@santander.es',
			'name': 'Jesús Cárdenas Vizcaíno',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'isEmployee': true,
		},
		{
			'id': '1235',
			'email': 'jmartinez@santander.es',
			'name': 'Jeremías Martínez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
		},
		{
			'id': '1236',
			'email': 'jperez@santander.es',
			'name': 'Jerónimo Pérez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
		},
	],
	// Add default values here
};
