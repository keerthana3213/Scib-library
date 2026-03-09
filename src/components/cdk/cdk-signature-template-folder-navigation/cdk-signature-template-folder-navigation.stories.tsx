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
	...getStoryConfig('scib-cdk-signature-template-folder-navigation'),
	title: 'Design System/DEPRECATED/CDK/Signature Template Folder Navigation',
	render: (args) => <scib-cdk-signature-template-folder-navigation {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		literals: {
			mainTitle: 'This folder is empty.',
			desc: 'Contact with the administrator if is an error.'
		}
	}
};
