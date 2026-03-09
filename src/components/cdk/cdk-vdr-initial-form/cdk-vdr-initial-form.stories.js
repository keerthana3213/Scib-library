import { getStoryConfig, parseObject, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Vdr Initial Form',
	...getStoryConfig('scib-cdk-vdr-initial-form'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-vdr-initial-form
		slot='fieldset' 
		no-result='${args.noResult}'
		main-title='${args.mainTitle}'
		name='${args.name}'
		placeholder='${args.placeholder}'
		to-label-txt= '${args.toLabelTxt}'
		contacts-label-txt= '${args.contactsLabelTxt}'
		placeholder-select='${args.placeholderSelect}'
		id-txtarea='${args.idTxtarea}'
		name-txtarea='${args.nameTxtarea}'
		label-txtarea='${args.labelTxtarea}'
		placeholder-txtarea='${args.placeholderTxtarea}'
		id-select='${args.idSelect}'
		owners-label='${args.ownersLabel}'
		char-limit-name='${args.charLimitName}'
		char-limit-description='${args.charLimitDescription}'
		selected-owners='${parseObject(args.selectedOwners)}'
		owners-list='${parseObject(args.ownersList)}'
		open-options='${parseBoolean(args.openOptions)}'
		loading-select='${parseBoolean(args.loadingSelect)}'
		back-mode='${parseBoolean(args.backMode)}'
		monitorized-owner = '${parseInt(args.monitorized)}'
		>
	</scib-cdk-vdr-initial-form>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	noResult: 'No results',
	mainTitle: '<h2>Create a New Virtual Data Room</h2>',
	name: 'Name*',
	placeholder: 'Enter name',
	toLabelTxt: 'Add Owners*',
	contactsLabelTxt: 'Contacts',
	placeholderSelect: 'Choose owners',
	idTxtarea: 'vdr-name',
	nameTxtarea: 'vdr description',
	labelTxtarea: 'Description*',
	placeholderTxtarea: 'Enter description...',
	idSelect: 'owners-id',
	ownersLabel: 'Owners:',
	charLimitName: '35',
	charLimitDescription: '90',
	openOptions: false,
	loadingSelect: false,
	backMode: false,
	selectedOwners: [
		{
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'isSelected': true,
			'name': 'Jesús Cárdenas Vizcaíno',
			'value': '1234',
			'isEmployee': true,
		},
		{
			"value": "322",
			 "name": " DIEGO LOPEZ VICENTE", 
			  
			 "avatar": { "src": null, "alt": " DIEGO LOPEZ VICENTE" },
			 "isSelected": true,
			 "isEmployee": true, 
			 
		 }
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
			'isEmployee': true,
			'ldapUid':"123123"
		},
		{
			'id': '1235',
			'email': 'jmartinez@santander.es',
			'name': 'Jeremías Martínez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'isEmployee': true,
			'ldapUid':"123123"
		},
		{
			'id': '1236',
			'email': 'jperez@santander.es',
			'name': 'Jerónimo Pérez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'ldapUid':"123123"
		},
		{
			'id': '1237',
			'email': 'asanchez@santander.es',
			'name': 'Alba Sanchez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'ldapUid':"123123"
		},
		{
			'id': '1238',
			'email': 'jmiguel@santander.es',
			'name': 'José Miguel Martínez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'ldapUid':"123123"
		},
	
	],
	monitorized:"322"
	// Add default values here
};
