import { getStoryConfig, parseBoolean, parseNumber, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Files Selector',
	...getStoryConfig('scib-ecmv-files-selector')
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-ecmv-files-selector cardview
		titleselector='${args.titleselector}'
		error-format='${args.errorFormat}'
		error-max-files='${args.errorMaxFiles}'
		maxfiles='${parseNumber(args.maxfiles)}'
		max-size-files='${parseNumber(args.maxSizeFiles)}'
		smallsize='${parseBoolean(args.smallsize)}'
	></scib-ecmv-files-selector>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	titleselector: 'Select or Drag Files',
	errorFormat: 'The file or extension is not supported',
	errorMaxFiles: 'Sorry, you cannot upload more than 10 files at a time',
	maxfiles: 3,
	maxSizeFiles: 300000
	// Add default values here
};
