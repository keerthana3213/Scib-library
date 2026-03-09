import { getStoryConfig, parseBoolean, parseNumber, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Select',
	...getStoryConfig('scib-ui-select', {status: 'deprecated'}),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style='padding: 1rem; max-width: 340px'>
		<scib-ui-select
			${parseBoolean(args.asInline) ? 'as-inline' : ''}
			${parseBoolean(args.iconInnerRight) ? 'icon-inner-right' : ''}
			debounce-time='${parseNumber(args.debounceTime)}'
			autocomplete
			add-user
			multiselect-v-2='${parseBoolean(args.multiselectV2)}'
			select-all-multiselect-v-2='${parseBoolean(args.selectAllMultiselectV2)}'
			owner-list='${args.ownerList}'
			name='${args.name}'
			placeholder-select='${args.placeholderSelect}'
			placeholder='${args.placeholder}'
			loading='${parseBoolean(args.loading)}'
			open-options='${parseBoolean(args.openOptions)}'
			back-mode='${parseBoolean(args.backMode)}'
			text-cursor='${parseBoolean(args.textCursor)}'
			no-result='${args.noResult}'
			add-new-user='${args.addNewUser}'
			options='${parseObject(args.options)}'
		></scib-ui-select>
	</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	iconLeftClasses: 'c-tab-icon u-icon icon-search iconitem-glass',
	debounceTime: 450,
	ownerList: 'owner-members',
	name: 'member-list',
	placeholderSelect: 'Placeholder select',
	placeholder: 'Placeholder',
	noResult: 'No results',
	addNewUser: 'Add new user',
	openOptions: false,
	backMode: false,
    textCursor: false,
	multiselectV2: false,
	selectAllMultiselectV2: false,
	options: [
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
		{
			'id': '1239',
			'email': 'jmiguel@santander.es',
			'name': 'José Miguel Martínez José Miguel Martínez José Miguel Martínez José Miguel Martínez José Miguel Martínez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
		},
	],
	// Add default values here
};


const TemplateAutocomplete = (args) => render(args, `
	<div style='padding: 1rem; max-width: 340px'>
		<scib-ui-select
			autocomplete
			icon-left-classes='${args.iconLeftClasses}'
			label='${args.label}'
			error='${args.error}'
			id-select='${args.idSelect}'
			multiselect='${parseBoolean(args.multiselect)}'
			reset='${parseBoolean(args.reset)}'
			disabled='${parseBoolean(args.disabled)}'
			debounce-time='${parseNumber(args.debounceTime)}'
			placeholder-select='${args.placeholderSelect}'
			options='${parseObject(args.options)}'

			is-signature-modal-manager='${parseBoolean(args.isSignatureModalManager)}'
		></scib-ui-select>
	</div>
`);

// Autocomplete Story
export const Autocomplete = TemplateAutocomplete.bind();
Autocomplete.args = {
	iconLeftClasses: 'c-tab-icon u-icon icon-search iconitem-glass',
	label: 'Label*',
	error: 'Mensaje de error',
	idSelect: 'rol',
	placeholderSelect: 'Seleccione',
	debounceTime: 300,
	multiselect: false,
	reset: false,
	disabled: false,
	isSignatureModalManager: true,
	optionDetail: true,
	options: [
		{
			'id': '1',
			'apply': 'true',
			'value': 'ggggggg',
			'name': 'ggggg',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'ggggg',
			},
			'email':'ggggggg@emeal.com',
			'role':'Employee',
			'secondary':'Santander Compliance'
		},
		{
			'id': '2',
			'apply': 'true',
			'value': 'jmartinez@santander.es',
			'name': 'Jeremías Martínez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'email':'jmartinez@santander.es',
			'role':'Employee',
			'secondary':'Santander Compliance'
		},
		{
			'id': '3',
			'apply': 'true',
			'value': 'jperez@santander.es',
			'name': 'Jerónimo Pérez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'email':'jperez@santander.es',
			'role':'Employee',
			'secondary':'Santander Compliance 2'
		},
		{
			'id': '4',
			'apply': 'true',
			'value': 'asanchez@santander.es',
			'name': 'Alba Sanchez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'email':'asanchez@santander.es',
			'role':'Employee',
			'secondary':'Santander Compliance'
		},
		{
			'id': '5',
			'apply': 'true',
			'value': 'jmiguel@santander.es',
			'name': 'José Miguel Martínez',
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'email':'jmiguel@santander.es',
			'role':'Employee',
			'secondary':'Santander Compliance'
		},
	],
	// Add default values here
};
