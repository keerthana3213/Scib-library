import { getStoryConfig, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Elements List',
	...getStoryConfig('scib-cdk-elements-list'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-elements-list data='${parseObject(args.data)}' ></scib-cdk-elements-list>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	data: [
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
					eventId: 'accion',
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
					text: 'Edit',
					icon: 'icon-edit-pencil',
					eventId: 'accion',
				},
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
