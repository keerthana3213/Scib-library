import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Vdr Edit',
	...getStoryConfig('scib-cdk-vdr-edit'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-dialog open is-emitter absolute>
		<scib-cdk-vdr-edit
			no-result='${args.noResult}'
			option-default-checkbox='${args.optionDefaultCheckbox}'
			selected-members='${parseObject(args.selectedMembers)}'
			selected-owners='${parseObject(args.selectedOwners)}'
			input='${args.input}'
			textarea='${args.textarea}'
			input-disabled='${parseBoolean(args.inputDisabled)}'
			textarea-disabled='${parseBoolean(args.textareaDisabled)}'
			logged-user='${args.loggedUser}'
			literals='${parseObject(args.literals)}'
			owners-list='${parseObject(args.ownersList)}'
			members-list='${parseObject(args.membersList)}'
			open-options-owners='${parseBoolean(args.openOptionsOwners)}'
			open-options-members='${parseBoolean(args.openOptionsMembers)}'
			loading-select-owners='${parseBoolean(args.loadingSelectOwners)}'
			loading-select-members='${parseBoolean(args.loadingSelectMembers)}'
			back-mode='${parseBoolean(args.backMode)}'
			monitorized-owner = '${parseInt(args.monitorizedOwner)}'
			monitorized-member = '${parseInt(args.monitorizedMember)}'
		></scib-cdk-vdr-edit>
</scib-ui-dialog>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	noResult: 'No results',
	input: 'test',
	textarea: 'testing description',
	loggedUser: '1234',
	inputDisabled: true,
	textareaDisabled: true,
	openOptionsOwners: false,
	openOptionsMembers: false,
	loadingSelectOwners: false,
	loadingSelectMembers: false,
	backMode: false,
	optionDefaultCheckbox: 'checked',
	literals: {
		'mainTitle': '<h2>Edit Virtual Data Room</h2>',
		'labelInput': 'Name*',
		'placeholderInput': 'Enter name',
		'labelMultiSelect': 'Add owners*',
		'placeholderMultiSelect': 'Choose owners',
		'textAreaLabel': 'Description*',
		'textAreaId': 'vdr-desc',
		'textAreaName': 'textarea_desc',
		'placeholderTextarea': 'Enter description...',
		'notice': '*Required input',
		'labelMultiSelectMembers': 'Add members*',
		'membersId': 'members-id',
		'placeholderMultiSelectMembers': 'Choose members',
		'ownersList': 'Owners:',
		'btnCancel': 'Cancel',
		'btnSave': 'Save',
		'ownersLabel': 'Owners:',
		'membersLabel': 'Current Members:',
		'newMembersLabel': 'New members:',
		'labelCheckboxNewItems': 'Add...',
		'addUser': 'Add new user'
	},
	membersList: [
		{
			'id': '1234',
			'email': 'jcardenas@santander.es',
			'name': 'Jesús Cárdenas Vizcaíno',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
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
	selectedMembers: [
		{
			'isSelected': true,
			'value': '1298',
			'name': 'Santiago Fernando Ojeda Botan',
			'avatar': { 'src': null, 'alt': 'Santiago Fernando Ojeda Botan' },
			'isEmployee': true,
		}, {
			'isSelected': true,
			'value': '1316',
			'name': 'Alberto León Crespo',
			'avatar': { 'src': null, 'alt': 'Alberto León Crespo' },
			'isEmployee': true,
		}, {
			'isSelected': true,
			'value': '1256',
			'name': ' TEST USER03',
			'avatar': {
				'src': 'https://employee.pre.corp/api/statics/avatar/1599743393506perfil-hombre-dibujos-animados_18591-58483.jpg',
				'alt': ' TEST USER03',
			},
			'isEmployee': true,
		}, {
			'isSelected': true,
			'value': '1150',
			'name': 'PALOMA ELENA CARRETERO',
			'avatar': { 'src': 'https://employee.pre.corp/api/statics/avatar/1599810911089050905_883048.jpg', 'alt': 'PALOMA ELENA CARRETERO' },
			'isEmployee': true,
		}, {
			'isSelected': true,
			'value': '1292',
			'name': 'MARIA ANGELES BARBA MORALEDA',
			'avatar': {
				'src': 'https://employee.pre.corp/api/statics/avatar/1600174919935dibujos-animados-perfil-mujer_18591-58478.jpg',
				'alt': 'MARIA ANGELES BARBA MORALEDA',
			},
			'isEmployee': true,
		}, {
			'isSelected': true,
			'value': '1258',
			'name': ' TEST USER05',
			'avatar': { 'src': 'https://employee.pre.corp/api/statics/avatar/1600176848270asdf.png', 'alt': ' TEST USER05' },
			'isEmployee': true,
		},
	],
	ownersList: [
		{
			'id': '1234',
			'email': 'jcardenas@santander.es',
			'name': 'Jesús Cárdenas Vizcaíno',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
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
	selectedOwners: [
		{
			'value': '1234',
			'email': 'jcardenas@santander.es',
			'name': 'Jesús Cárdenas Vizcaíno',
			'isSelected': true,
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
		},
		{
			'value': '1235',
			'email': 'jmartinez@santander.es',
			'name': 'Jeremías Martínez',
			'isSelected': true,
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
		},
	],
	monitorizedOwner:'',
	monitorizedMember:1298
};
