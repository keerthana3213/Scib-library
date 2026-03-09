import { getStoryConfig, parseBoolean, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/UI/Date Picker',
	...getStoryConfig('scib-ui-date-picker')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<div style="display: flex">
		<scib-ui-date-picker
			label="${args.label}"
			header="${args.header}"
			datetime="${parseBoolean(args.datetime)}"
			time="${parseBoolean(args.time)}"
			min-date="${args.minDate}"
			max-date="${args.maxDate}"
			disabledselector="${parseBoolean(args.disabledselector)}">
		</scib-ui-date-picker>
	</div>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	label: 'Label',
	header: 'Choose Date',
	disabledselector: false,
	datetime: false,
	time: true,
	minDate: null,
	maxDate: null
};
