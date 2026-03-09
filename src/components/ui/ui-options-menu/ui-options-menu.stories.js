import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Options Menu',
	...getStoryConfig('scib-ui-options-menu')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-options-menu
		show-slot='${parseBoolean(args.show)}'
		id='${args.id}'
		buttons='${parseObject(args.buttons)}'
		text='${args.text}'
	>
	</scib-ui-options-menu>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	content: `
	<p><b>Payments orders file</b></p>
	<scib-ui-label-data
		label="Start date"
		text="12/02/21"
	></scib-ui-label-data>
	<scib-ui-label-data
		label="Estimate end date"
		text="21/02/21"
	></scib-ui-label-data>
	`,
	text: 'Prop: UIoptions-menu',
	show: false,
	id: 1,
	buttons: [
		{ id: 1, text: 'Share', separator: false, icon: 'icon-share-24', eventId: 'sharePitch' },
		{ id: 2, text: 'Edit Pitch', separator: false, icon: 'icon-edit-pencil', eventId: 'editPitch' },
		{ id: 3, text: 'Duplicate Pitch', separator: true, icon: 'icon-duplicate-clipboard', eventId: 'duplicatePitch' },
		{ id: 4, text: 'Delete Pitch', separator: false, icon: 'icon-delete', eventId: 'deletePitch' },
		{ id: 5, text: 'opcion con texto muy largo y que no sale de la card', separator: false, icon: 'icon-delete', eventId: 'deletePitch' },
	]
	// Add default values here
};
