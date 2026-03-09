import { getStoryConfig, parseBoolean, parseObject, parseNumber, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Topic Create',
	...getStoryConfig('scib-cdk-topic-create'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open is-emitter absolute>
		<scib-cdk-topic-create
			literals='${parseObject(args.literals)}'
			char-limit-name='${parseNumber(args.charLimitName)}'
			char-limit-description='${parseNumber(args.charLimitDescription)}'
			id-list='${args.idList}'
			selected-members='${args.edit ? '["1234", "1236"]' : false}'
			edit='${parseBoolean(args.edit)}'
			topic-data='${args.edit ? '{"name":"Example title","description":"Example description of topic card"}' : false}'
			owners='${parseObject(args.owners)}'
			members='${parseBoolean(args.withoutMembers) ? '[]' : parseObject(args.membersString)}'
		</scib-cdk-topic-create>
	</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	withoutMembers: false,
	charLimitName: 35,
	charLimitDescription: 90,
	idList: 'membersCreateTopic',
	literals: {
		'mainTitle': '<h2>New Topic</h2>',
		'editTitle': '<h2>Edit the Topic</h2>',
		'labelInput': 'Name*',
		'placeholderInput': 'Termsheet',
		'textAreaLabel': 'Description*',
		'textAreaId': 'txt-area-topic-create',
		'textAreaName': 'text-area',
		'placeholderTextarea': 'Topic description...',
		'notice': '*Required input',
		'btnCancel': 'Cancel',
		'btnSave': 'Save',
		'membersLabel': 'Select the members you want to add to this topic:',
		'noMembers': 'There are no members to include here. Go to the VDR Configuration to add them.',
		'vdrConfig': 'Open VDR Configuration',
	},
	owners: [
		{
			'id': '1231',
			'email': 'jhidalgo@santander.es',
			'name': 'Juan Hidalgo Nolano',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Juan Hidalgo Nolano',
			},
			'isEmployee': true,
		},
		{
			'id': '1232',
			'email': 'rferreras@santander.es',
			'name': 'Roberto Ferreras',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Roberto Ferreras',
			},
			'isEmployee': true,
		},
	],
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
};
