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
	...getStoryConfig('scib-ui-password-strength-bar'),
	title: 'Design System/DEPRECATED/UI/Password Strength Bar',
	render: (args) => <scib-ui-password-strength-bar {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {}
};
