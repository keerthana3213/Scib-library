import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Accordion',
	...getStoryConfig('scib-ui-accordion')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-accordion
		open='${parseBoolean(args.open)}'
		transparent-bg='${parseBoolean(args.transparentBg)}'
		show-error='${parseBoolean(args.showError)}'
		show-info-label='${parseBoolean(args.showInfoLabel)}'
		literals='${parseObject(args.literals)}'
		title-text='${args.titleText}'
		summary='${args.summary}'
		header-icon='${parseObject(args.headerIcon)}'
		header-text="${args.headerText}"
		large='${parseBoolean(args.large)}'
		quantity='${parseBoolean(args.quantity)}'
	>
		<scib-ui-label-data
			label="Arriba"
			text="Abajo"
			copy-button="true"
		></scib-ui-label-data>
	</scib-ui-accordion>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	content: 'Slot: UIaccordion',
	titleText: 'Prop: UIaccordion',
	summary: 'Summary of items',
	showError: false,
	literals: {
		textInfoLabel: 'New',
		errorText: 'Pending rquired info'
	},
	showInfoLabel: true,
	headerIcon: {
		'active': true,
		'icon': 'icon-warning',
		'color': 'seventh.mediumLight',
	},
	headerText: "3 pending to complete",
	large: false,
	quantity: false
	// Add default values here
};
