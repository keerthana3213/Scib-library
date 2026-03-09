import { getStoryConfig, parseObject, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Vdr Final Form',
	...getStoryConfig('scib-cdk-vdr-final-form'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-vdr-final-form
		slot='fieldset'
		no-result='${args.noResult}'
		main-title='${args.mainTitle}'
		to-label-txt= '${args.toLabelTxt}'
		id-select='${args.idSelect}'
		placeholder-select='${args.placeholderSelect}'
		legend='${args.legend}'
		add-new-user-literal='${args.addNewUserLiteral}'
		members-label='${args.membersLabel}'
		members-list='${parseObject(args.membersList)}'
		open-options='${parseBoolean(args.openOptions)}'
		loading-select='${parseBoolean(args.loadingSelect)}'
		back-mode='${parseBoolean(args.backMode)}',
		monitorized-member='${parseInt(args.monitorized)}'
	></scib-cdk-vdr-final-form>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	noResult: 'No results',
	mainTitle: '<h2>Members</h2>',
	toLabelTxt: 'Members*',
	idSelect: 'members-id',
	placeholderSelect: 'Choose members',
	legend: '<p>Invite members to participate in the Virtual Data Room. You can also add more members later.</p><p><strong>*Please be careful with invitations for data protection.</strong></p>',
	membersLabel: 'Members:',
	addNewUserLiteral: 'Add new user',
	openOptions: false,
	loadingSelect: false,
	backMode: false,
	membersList: [
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
		{
			'id': '1237',
			'email': 'asanchez@santander.es',
			'name': 'Alba Sanchez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
		},
		{
			'id': '1238',
			'email': 'jmiguel@santander.es',
			'name': 'José Miguel Martínez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
		},
	],
	monitorized:"1234"

};
