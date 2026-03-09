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
	...getStoryConfig('scib-apps-ecmv-form-add-files'),
	title: 'Design System/Apps/Ecmv Form Add Files',
	render: (args) => <scib-apps-ecmv-form-add-files {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		maxfiles: 6,
		maxSizeFiles: 1024 * 1024 * 50,
		language: 'es-ES',
		readMode: false
	}
};
