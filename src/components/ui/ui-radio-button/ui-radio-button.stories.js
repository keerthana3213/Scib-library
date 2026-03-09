import { getStoryConfig, parseObject, render, parseBoolean } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Radio Button',
	...getStoryConfig('scib-ui-radio-button'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ui-radio-button
		active-button-index='${1}'
		group-name='${args.groupName}'
		tooltip-text='${args.tooltipText}'
		options='${parseObject(args.options)}'
		action-menu='${parseObject(args.actionMenu)}'
	></scib-ui-radio-button>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	groupName: 'ibor-cases',
	tooltipText: 'You are not allowed',
	options: [
		{
			id: 'clients',
			label: 'Clients View',
			value: 'clients',
		},
		{
			id: 'products',
			label: 'Products View',
			value: 'products',
			disabled: true
		},
	],
	actionMenu: {
		hover: false,
		options: [{
			id: 0,
			text: "Set as priority",
			separator: false,
			eventId: 'set-priority'
		}]
	},
	// Add default values here
};


/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const TemplateBigSize = (args) => render(args, `
	<scib-ui-radio-button
		big-size='${args.bigSize}'
		group-name='${args.groupName}'
		options='${parseObject(args.options)}'
		tooltip-text='${args.tooltipText}'
	></scib-ui-radio-button>

`);

// Big Story
export const BigSize = TemplateBigSize.bind();
BigSize.args = {
	groupName: 'radioBig',
	bigSize: true,
	options: [
		{
			id: 'clientsBig',
			label: 'Clients View Big',
			value: 'clientsBig',
		},
		{
			id: 'productsBig',
			label: 'Products View Big',
			value: 'productsBig',
		},
	],
	// Add default values here
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const TemplateExtraSmallSize = (args) => render(args, `
 <scib-ui-radio-button
     extra-small='${args.extraSmall}'
     group-name='${args.groupName}'
     options='${parseObject(args.options)}'
     tooltip-text='${args.tooltipText}'
 ></scib-ui-radio-button>

`);

// Extra small Story
export const ExtraSmall = TemplateExtraSmallSize.bind();
ExtraSmall.args = {
	groupName: 'radioExtraSmall',
	extraSmall: true,
	options: [
		{
			id: 'clientsSmall',
			label: 'Clients View Small',
			value: 'clientsSmall',
		},
		{
			id: 'productsSmall',
			label: 'Products View Small',
			value: 'productsSmall',
		},
	],
	// Add default values here
};


/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const TemplateCard = (args) => render(args, `
	<scib-ui-radio-button
		is-radio-card='${args.isRadioCard}'
		group-name='${args.groupName}'
		options='${parseObject(args.options)}'
		tooltip-text='${args.tooltipText}'
	></scib-ui-radio-button>
`);

// Card Story
export const Card = TemplateCard.bind();
Card.args = {
	groupName: 'radioCard',
	isRadioCard: true,

	options: [
		{
			id: 'clientsBox',
			label: 'Virtual Data Room IBOR negotiation',
			value: 'clientsBox',
			description: 'Initiates IBOR negotiation through the Client’s VDR creating a new topic. This is the most desirable channel to carry out the negotiation, being the most user-friendly as well as simple from the operational point of view (automatic notifications and easy access to action buttons for escalation, closure, upload/ download of files).',
		},
		{
			id: 'productsBox',
			label: 'Non-VDR alternative IBOR Negotiation',
			value: 'productsBox',
			description: 'Changes the negotiation case status. It requires the case negotiation to be carried out through an alternative channel by the Execution Team. During the negotiation, you must bear in mind that it will be required to reflect all actions conducted outside the platform on the action buttons on the IBOR Transition application:',
			list: [
				'New amendment file update',
				'Amendment signature',
				'Escalation/ de-escalation',
				'Parameters confirmation by a different peer and case closure',
			],
		},
	],
	// Add default values here
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const TemplateCardExtra = (args) => render(args, `
	<scib-ui-radio-button
		group-name='${args.groupName}'
		extra-small='${parseBoolean(args.smallRadios)}'
		options='${parseObject(args.options)}'
		active-button-index='${args.activeButtonIndex}'
		action-menu='${parseObject(args.actionMenu)}'
		show-in-column='${parseBoolean(args.showInColumn)}'
		>
	</scib-ui-radio-button>
`);

// Card Story
export const ListOptions = TemplateCardExtra.bind();
ListOptions.args = {
	groupName: 'list-options',
	smallRadios: true,
	showInColumn: true,
	options: [
		{
			id: '0',
			label: 'Repsol Trading, S.A.',
			value: '0',
			subLabel: '(Priority)',
			isPredefined: true
		},
		{
			id: '1',
			label: 'Repsol Exploración, S.A.',
			value: '1',
			subLabel: '',
			isPredefined: false,
			dontShowIsPredefined: true
		},
		{
			id: '2',
			label: 'Repsol Brazil',
			value: '2',
			subLabel: ''
			,
			isPredefined: false
		},
		{
			id: '3',
			label: 'Repsol India',
			value: '3',
			subLabel: '',
			isPredefined: false
		},
		{
			id: '4',
			label: 'Repsol Madrid',
			value: '4',
			subLabel: '',
			isPredefined: false
		},
		{
			id: '5',
			label: 'Repsol Scroll',
			value: '5',
			subLabel: '',
			isPredefined: false
		},
	],
	activeButtonIndex: 0,
	actionMenu: {
		hover: true,
		options: [{
			id: 0,
			text: "Set as priority entity",
			separator: false,
			eventId: "set_priority"
		}]
	}
};
