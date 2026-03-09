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
	...getStoryConfig('scib-atoms-upload-images'),
	title: 'Design System/Atoms/Upload Images',
	render: (args) => <scib-atoms-upload-images {...args} dangerouslySetInnerHTML={{ __html: args.content }} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		id: 'images',
		maxItems: 5,
		shape: 'square',
		errorFormatMessage: 'The file or extension is not supported',
		errorMaxSizeMessage: 'File size exceeded',
		content: `<span>Application Images*</span>`
	}
};
