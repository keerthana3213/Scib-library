import { getStoryConfig, render, parseBoolean, parseObject } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/List V1',
	...getStoryConfig('scib-ui-list'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-list
		owners='${JSON.stringify(args.ownersList)}'
		label='${args.label}'
		hidden-label='${parseBoolean(args.hiddenLabel)}'
		show-checkbox='${parseBoolean(args.showCheckbox)}'
		has-info-data='${parseBoolean(args.hasInfoData)}'
		></scib-ui-list>
	`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	ownersList: [
		{
			'value': '1234',
			'email': 'jcardenas@santander.es',
			'name': 'Jesús Cárdenas Vizcaíno',
			'isSelected': true,
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'labelCheckbox': 'Add...'
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
			'labelCheckbox': 'Add...'
		},
		{
			'value': '1234',
			'email': 'jcardenas@santander.es',
			'name': 'Jesús Cárdenas Vizcaíno',
			'isSelected': true,
			'avatar': {
				'src': 'https://outpostrecruitment.com/wp-content/uploads/2019/05/Ruairi-Spillane.png',
				'alt': 'Jesús Cárdenas Vizcaíno',
			},
			'labelCheckbox': 'Add...'
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
			'labelCheckbox': 'Add...'
		}
	],
	label: 'Title items',
	hiddenLabel: false,
	showCheckbox: true,
	hasInfoData: true
};


const TemplateItems = (args) => render(args, `
 	<scib-ui-list
 		items='${JSON.stringify(args.items)}'
 		label='${args.label}'
 		hidden-label='${parseBoolean(args.hiddenLabel)}'
		tooltip='${args.tooltip}'
	></scib-ui-list>
`);

// Default Story
export const DevelopItems = TemplateItems.bind();
DevelopItems.args = {
	items: [
		'ejemplo 1', 'ejemplo 2', 'ejemplo 3'
	],
	label: 'Title items',
	hiddenLabel: false,
	tooltip: 'Delete product'
};
