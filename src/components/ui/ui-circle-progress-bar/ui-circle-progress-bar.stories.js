import { getStoryConfig, parseBoolean, parseNumber, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Circle Progress Bar',
	...getStoryConfig('scib-ui-circle-progress-bar'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = args => render(args, `
	<scib-ui-circle-progress-bar
		circle-progress-bar-id='${args.circleProgressBarId}'
		part-label='${args.partLabel}'
		part-value='${parseNumber(args.partValue)}'
		total-label='${args.totalLabel}'
		total-value='${parseNumber(args.totalValue)}'
		show-ratio='${parseBoolean(args.showRatio)}'
		show-check-when-complete='${parseBoolean(args.showCheckWhenComplete)}'
		no-decimals='${parseBoolean(args.noDecimals)}'
	></scib-ui-circle-progress-bar>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	circleProgressBarId: 'circle-progress-bar-id',
	partLabel: 'Grouped contracts',
	partValue: 1000,
	totalLabel: 'ALL CONTRACTS',
	totalValue: 11589,
	showRatio: true,
	noDecimals: true,
	showCheckWhenComplete: true,
};
