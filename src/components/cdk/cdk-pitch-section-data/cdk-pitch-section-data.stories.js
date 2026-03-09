import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Pitch Section Data',
	...getStoryConfig('scib-cdk-pitch-section-data'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-pitch-section-data
		literals='${parseObject(args.literals)}'
		data='${parseObject(args.data)}'
		elements='${parseObject(args.elements)}'
		items='${parseObject(args.items)}'
		template='${parseBoolean(args.template)}'
		disabled='${parseBoolean(args.disabled)}'
		disabledsave='${parseBoolean(args.disabledsave)}'
	></scib-cdk-pitch-section-data>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	additionalContent: true,
	template: true,
	disabled: true,
	disabledsave: true,
	literals: {
		title: 'Custom Pitch',
		subtitle: ' Data and information',
		footNote: '*Required input',
		labelContentButton: 'Content Button Name',
		contentButtonInfo: 'Content button will be called \'Relevant facts\', if you don\'t change the name.',
		contetButtonLimit: 20,
		placeholderContentButton: 'E.g. \´Relevant facts\´...',
		labelContentImage: 'Content Image',
		labelContentTitle: 'Content Title',
		contentTitleInfo: 'Additional content is a section that would be accessible in all the pitch pages and it should be added only if it is necessary to show some information.',
		contetTitleLimit: 80,
		placeholderContentTitle: 'Enter content title...',
		labelCoverImg: 'COVER IMAGE',
		labelDropdown: 'TEMPLATE SOURCE*',
		placeholderDrop: 'Select template',
		labelInput: 'NAME*',
		placeholderInput: 'Insert pitch name',
		labelTextArea: 'DESCRIPTION*',
		placeholderTextArea: 'Enter a short description of your pitch',
		labelCheckbox: 'Private pitch',
		img: 'https://marketplace.canva.com/EAD40wmLMZs/1/0/800w/canva-mt.-fuji-local-landmark-zoom-background-OC0HH_gKX0o.jpg',
		resetText: 'Reset',
		previewText: 'Preview',
		helpText: 'Help',
		saveText: 'Save changes',
		closeText: 'Close',
		helpUrl: '/help',
		page: 'Page 01',
		inputLimit: 30,
		textareaLimit: 75,
		startAddSection: 'Start adding a new section',
		addSection: 'Add a new section',
		contents: 'Landing contents',
		coverBtn: 'Select cover for pitch'
	},
	data: {
		'pitch': {
			'template': '0',
			'additionalContent': true,
			'name': "",
			'description': "",
			'private': true,
			'image': null,
			'contentButtonName':'Default',
			'contentImage':'',
			'contentTitle':'Default',
		},
		'templates': [
			{
				'id': '29',
				'name': 'Cash Nexus General',
				'type': 'Pitch',
				'country_id': 'ESP',
				'country': 'Spain',
				'url': 'http://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/pitch/cash-nexus-general',
				'thumbnail__target_id': 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
			},
			{
				'id': '30',
				'name': 'Cash Nexus USA',
				'type': 'Pitch',
				'country_id': 'ESP,ESP,ESP,ESP',
				'country': 'Spain,Spain,Spain,Spain',
				'url': 'http://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/pitch/cash-nexus-usa',
				'thumbnail__target_id': 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
			},
			{
				'id': '35',
				'name': 'Confirming Spain',
				'type': 'Pitch',
				'country_id': 'ESP',
				'country': 'Spain',
				'url': 'http://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/pitch/confirming-spain',
				'thumbnail__target_id': 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
			},
			{
				'id': '34',
				'name': 'Confirming Spain',
				'type': 'Pitch',
				'country_id': 'ESP,ESP,ESP,ESP',
				'country': 'Spain,Spain,Spain,Spain',
				'url': 'http://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/es/pitch/confirming-spain',
				'thumbnail__target_id': 'https://pitch-scib-nueva-web-publica-dev.appls.boae.paas.gsnetcloud.corp/sites/pitch/files/2019-09/img-pitch-preview.png',
			},
			{
				'id': '0',
				'name': 'Custom',
				'type': 'Pitch',
				'langcode': '',
				'url': '',
				'created': '',
				'changed': '',
				'country': 'Global',
				'country_id': 'GBL',
			},
		],
	},
	elements: [
		{
			title: 'Custom',
			description: 'Press or drag a .ppt file to add a presentation of your own',
			image: 'assets/images/i-laptop.svg',
			imageAlt: 'Laptop',
			subtitle: 'Test'
		},
		{
			title: 'Tombstones',
			description: 'Search and select any Tombstone available in the database',
			image: 'assets/images/i-shop.svg',
			imageAlt: 'Minimalist icon of shop',
		},
	],
	items: [
		{
			id: '13132345',
			title: 'Tombstones',
			extension: 'pdf',
			type: 'Tombstones',
			quantity: 3,
			acciones: [
				{
					text: 'Edit',
					icon: 'icon-edit-pencil',
					eventId: 'editRow',
				},
				{
					text: 'Delete',
					icon: 'icon-delete',
					eventId: 'deleteRow',
				},
			],
		},
		{
			id: '2232',
			title: 'Tombstones',
			extension: 'pdf',
			type: 'Custom',
			acciones: [
				{
					text: 'Delete',
					icon: 'icon-delete',
					eventId: 'deleteRow',
				},
			],
		},
	],
	// Add default values here
};
