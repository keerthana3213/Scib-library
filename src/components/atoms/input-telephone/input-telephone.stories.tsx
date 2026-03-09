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
	...getStoryConfig('scib-atoms-input-telephone'),
	title: 'Design System/Atoms/Input Telephone',
	render: (args) => <scib-atoms-input-telephone {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		label: 'Phone Number',
		language: 'en-GB',
		placeholder: 'Enter a number',
		name: 'Name',
		literals: {
			format: 'Formato incorrecto',
			required: 'Campo requerido',
			requiredCountry: 'Prefijo obligatorio'
		},
		idInput: 'phone',
		required: false
	}
};
