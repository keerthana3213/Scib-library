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
	...getStoryConfig('scib-ecmv-breadcrumb'),
	title: 'Design System/DEPRECATED/ECM/Breadcrumb',
	render: (args) => <scib-ecmv-breadcrumb {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		breadcrumb: [
			{
				name: 'ECM Documents',
				tooltip: 'Back to ECM Documents',
				active: false,
				position: 1
			},
			{
				name: 'Approvals',
				tooltip: 'Back to Approvals',
				active: false,
				position: 2
			},
			{
				name: 'Sending documents to the offices',
				tooltip: 'Back to Sending documents to the offices',
				active: true,
				position: 3
			}
		],
		smallTxt: false,
		secondary: false
		// Add default values here
	}
};
