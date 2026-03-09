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
	...getStoryConfig('scib-molecules-otp'),
	title: 'Design System/Molecules/Otp',
	render: (args) => <scib-molecules-otp {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		label: 'Verification code',
		value: '',
		loading: true,
		invalid: false,
		disabled: false,
		inputCount: 4,
		literals: {
			error: 'Wrong code. You have 4 attempts left',
			helper: 'Insert the code sent to finish the verification',
			disabled: 'You do not have any more attempts. Please try sending your verification code again',
			loading: 'Please wait, the code is under validation'
		}
	}
};
