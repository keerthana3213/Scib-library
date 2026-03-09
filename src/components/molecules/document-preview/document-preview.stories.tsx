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
	...getStoryConfig('scib-molecules-document-preview'),
	title: 'Design System/Molecules/Document Preview',
	render: (args) => <scib-molecules-document-preview {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		files: [
			{
				name: 'Test-file.pdf',
				extension: 'pdf',
				size: '175.8 KB',
				downloable: false,
				disableRemoveFile: false
			},
			{
				name: 'Test-file.csv',
				extension: 'csv',
				size: '1.8 MB',
				downloable: true,
				disableRemoveFile: true
			}
		],
		collapseLimit: 1,
		literals: {
			showMoreFiles: 'Show more',
			showLessFiles: 'Show less'
		}
	}
};
