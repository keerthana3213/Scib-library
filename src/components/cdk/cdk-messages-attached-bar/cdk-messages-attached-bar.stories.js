import { getStoryConfig, parseBoolean, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/Messages Attached Bar',
	...getStoryConfig('scib-cdk-messages-attached-bar'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-messages-attached-bar
		files='${parseObject(args.files)}'
		title-text='${args.titleTxt}'
		downloadable='${parseBoolean(args.downloadble)}'
		read-mode='${args.readMode}'
	></scib-cdk-messages-attached-bar>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	files: [
		{
			name: 'Test-file(1).pdf',
			extension: 'pdf',
			size: '175.8 KB',
		},
		{
			name: 'Test-file.pdf',
			extension: 'pdf',
			size: '1.8 MB',
		},
	],
	titleTxt: 'Title Text',
	downloadble: true,
};
