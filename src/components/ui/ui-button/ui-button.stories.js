import { getStoryConfig, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Button',
	...getStoryConfig('scib-ui-button')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style='display: flex'>
		<scib-ui-button
			primary='${parseBoolean(args.primary)}'
			secondary='${parseBoolean(args.secondary)}'
			link='${parseBoolean(args.link)}'
			nobackground='${parseBoolean(args.nobackground)}'
			hide-txt='${parseBoolean(args.hideTxt)}'
			disable-min-width='${parseBoolean(args.disableMinWidth)}'
			ultrasmall='${parseBoolean(args.ultrasmall)}'
			small='${parseBoolean(args.small)}'
			medium='${parseBoolean(args.medium)}'
			large='${parseBoolean(args.large)}'
			icon='${args.icon}'
			disabled='${parseBoolean(args.disabled)}'
			loading='${parseBoolean(args.loading)}'
			disabled-tooltip='${args.disabledTooltip}'
		>
			${args.content}
		</scib-ui-button>
	</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	content: 'Button text',
	icon: 'icon-add',
	primary: true,
	disabledTooltip: 'You have no permission to access to the negotiation. For more information, contact your administrator',
	// disabled: true,
	// hideTxt: true,
	// nobackground: true,
	// small: true,
	// iconLeft: true,
	// disableMinWidth: true,
	// classTooltip: '--forseti'
	// Add default values here
};
