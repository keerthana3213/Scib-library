import { getStoryConfig, parseObject, render } from '@storybook/utils';
import * as metadata from './metadata.json';

// Story definition
export default {
	title: 'Design System/DEPRECATED/ECM/Metadata Filter',
	...getStoryConfig('scib-ecmv-metadata-filter'),
};


/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => {
	const meta = JSON.stringify(metadata.default);
	return render(args, `
	<scib-ecmv-metadata-filter
		metadata='${meta}'
		buttontitle='${args.buttontitle}'
	></scib-ecmv-metadata-filter>
`);
};

// Default Story
export const Develop = Template.bind();
Develop.args = {
	buttontitle: 'Apply'
	// Add default values here
};
