import { getStoryConfig, parseBoolean, parseNumber, parseObject, render } from '@storybook/utils';

// Story definition
export default {
	title: 'Design System/DEPRECATED/CDK/File Selector',
	...getStoryConfig('scib-cdk-file-selector'),
};

/**
 * Template function
 *
 * @param args All properties provided through args variable as object
 */
const Template = (args) => render(args, `
	<scib-cdk-file-selector
		show-upload-files
		maxfiles='${parseNumber(args.maxfiles)}'
		smallsize='${parseBoolean(args.smallsize)}'
		format-file-size='${parseBoolean(args.formatFileSize)}'
		literals='${parseObject(args.literals)}'
		name='${args.name}'
		idelement='${args.idelement}'
		disabled='${args.disabled}'
	></scib-cdk-file-selector>
`);

// Default Story
export const Develop = Template.bind();
Develop.args = {
	maxfiles: 1,
	smallsize: true,
	formatFileSize: true,
	name: 'fileTemplate',
	idelement: 'IDfileTemplate',
	literals: {
		labelSelector: 'Template Document*',
		titleselector: 'Select or Drag Files',
		errorMaxFiles: 'Sorry, you cannot upload more than 1 files at a time',
		errorFormat: 'The file or extension is not supported',
		errorDuplicate: 'Duplicated filename',
		fileSelectedText: 'Attached document',
	},
	disabled: false,
	// Add default values here
};

const TemplateFileList = (args) => render(args, `
	<scib-cdk-file-selector
		show-upload-files
		maxfiles='${parseNumber(args.maxfiles)}'
		smallsize='${parseBoolean(args.smallsize)}'
		format-file-size='${parseBoolean(args.formatFileSize)}'
		literals='${parseObject(args.literals)}'
		name='${args.name}'
		idelement='${args.idelement}'
		alter-file-list='${parseObject(args.alterFileList)}'
		disabled='${args.disabled}'
	></scib-cdk-file-selector>
`);

// Default Story
export const FileList = TemplateFileList.bind();
FileList.args = {
	maxfiles: 1,
	smallsize: true,
	formatFileSize: true,
	name: 'fileTemplate',
	idelement: 'IDfileTemplate',
	disabled: false,
	literals: {
		labelSelector: 'Not listed above?',
		titleselector: 'Select or Drag Files',
		errorMaxFiles: 'Sorry, you cannot upload more than 1 files at a time',
		errorFormat: 'The file or extension is not supported',
		errorDuplicate: 'Duplicated filename',
		fileSelectedText: 'Attached document',
		download: 'Download',
		fileListTitle: 'VDR documents:'
	},
	alterFileList: [
		{
			id: 530,
			created_at: '2020-12-19T13:08:54.752Z',
			updated_at: '2020-12-19T13:08:54.752Z',
			path: '58BB650CB5F74C3C9444B9836068CD3E',
			name: 'contractExample.pdf',
			size: 1610320,
			mime_type: 'application/pdf',
			verification: '65de215d603e985e9c8a092a44c95fafce8966d50d8689667ed22056a0360cdb',
		},
		{
			id: 526,
			created_at: '2020-12-18T16:16:48.118Z',
			updated_at: '2020-12-18T16:16:48.118Z',
			path: 'C59605BB65DD4692B4D771CEF9954086',
			name: 'export.csv',
			size: 47,
			mime_type: 'application/vnd.ms-excel',
			verification: 'a0bc776bbff7cf39566f54e97fb9649a9cc12cc328116536c99c1465c1270e18',
		},
		{
			id: 524,
			created_at: '2020-12-18T16:12:46.348Z',
			updated_at: '2020-12-18T16:12:46.348Z',
			path: '557447DE170149C5B2CCEFF02D918A17',
			name: 'export.csv',
			size: 47,
			mime_type: 'application/vnd.ms-excel',
			verification: 'a0bc776bbff7cf39566f54e97fb9649a9cc12cc328116536c99c1465c1270e18',
		},
		{
			id: 523,
			created_at: '2020-12-18T16:11:14.455Z',
			updated_at: '2020-12-18T16:11:14.455Z',
			path: '7C4EBCDDF0DB45C1B9E4699583B4B084',
			name: 'export.csv',
			size: 47,
			mime_type: 'application/vnd.ms-excel',
			verification: 'a0bc776bbff7cf39566f54e97fb9649a9cc12cc328116536c99c1465c1270e18',
		},
	]
	// Add default values here
};
