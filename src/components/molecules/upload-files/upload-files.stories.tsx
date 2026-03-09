import { getStoryConfig } from '../../../../.storybook/utils';
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-molecules-upload-files'),
	title: 'Design System/Molecules/Upload Files',
	render: (args) => <scib-molecules-upload-files {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		maxfiles: 5,
		formatFileSize: true,
		name: 'fileTemplate',
		styleVariant: 'standard',
		idelement: 'IDfileTemplate',
		allowedFilesExt: ['.csv', '.doc', '.pdf'],
		showUploadFiles: true,
		autoDownloadFiles: false,
		initialfiles: [
			{
				id: 1,
				extension: '.csv',
				formatedSize: '0.56 kB',
				lastModified: 1644930132324,
				lastModifiedDate: 'Tue Feb 15 2022 14:02:12 GMT+0100 (hora estándar de Europa central)',
				name: 'testFile.csv',
				size: 56,
				type: 'text/csv',
				webkitRelativePath: '',
				url: URL.createObjectURL(new File(['This is a test downloaded by scib-molecules-upload-files'], 'testFile.csv', { type: 'text/csv' }))
			},
			{
				id: 1,
				extension: '.csv',
				formatedSize: '0.56 kB',
				lastModified: 1644930132324,
				lastModifiedDate: 'Tue Feb 15 2022 14:02:12 GMT+0100 (hora estándar de Europa central)',
				name: 'testFile1.csv',
				size: 56,
				type: 'text/csv',
				webkitRelativePath: '',
				url: URL.createObjectURL(
					new File(['This is a test downloaded by scib-molecules-upload-files'], 'testFile1.csv', { type: 'text/csv' })
				)
			},
			{
				id: 1,
				extension: '.csv',
				formatedSize: '0.56 kB',
				lastModified: 1644930132324,
				lastModifiedDate: 'Tue Feb 15 2022 14:02:12 GMT+0100 (hora estándar de Europa central)',
				name: 'testFile2.csv',
				size: 56,
				type: 'text/csv',
				webkitRelativePath: '',
				url: URL.createObjectURL(
					new File(['This is a test downloaded by scib-molecules-upload-files'], 'testFile2.csv', { type: 'text/csv' })
				)
			}
		],
		acceptedTypeFiles: '.csv, .doc, .pdf',
		literals: {
			fileListTitle: '',
			titleselector: 'Select or drag files',
			errorMaxFiles: 'Sorry, you cannot upload more than 3 files at a time',
			errorFormat: 'The file or extension is not supported',
			errorDuplicate: 'Duplicated filename',
			errorMaxSize: 'File size exceeded',
			fileSelectedText: 'Attached document',
			documentPreview: {
				showMoreFiles: 'Show more',
				showLessFiles: 'Show less'
			}
		},
		collapseLimit: 2
	}
};
