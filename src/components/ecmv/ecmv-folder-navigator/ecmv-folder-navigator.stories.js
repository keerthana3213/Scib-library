import { getStoryConfig, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Folder Navigator',
	...getStoryConfig('scib-ecmv-folder-navigator'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ecmv-folder-navigator name='${args.name}' custom-icon='${args.customIcon}'></scib-ecmv-folder-navigator>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	name: 'Approvals',
	customIcon: 'icon-dealership',

	// Add default values here
};
