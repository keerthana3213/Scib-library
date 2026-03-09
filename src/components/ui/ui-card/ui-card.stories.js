import { getStoryConfig, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Card',
	...getStoryConfig('scib-ui-card'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = args => render(args, `
	<scib-ui-card card-id='${args.cardId}' tooltip='${args.tooltip}' disable-hover='${parseBoolean(args.disableHover)}'>
		<h3>Title</h3>
		<p>
			${args.content}
		</p>
	</scib-ui-card>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	content:
		'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore' +
		' magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo' +
		' consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur' +
		' sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
	cardId: 'card-id',
	tooltip: 'Tooltip for the card',
	disableHover: true,
	// Add default values here
};
