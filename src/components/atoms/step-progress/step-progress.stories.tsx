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
	...getStoryConfig('scib-atoms-step-progress'),
	title: 'Design System/Atoms/Step Progress',
	render: (args) => <scib-atoms-step-progress {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		activeId: 3,
		allowFlow: true,
		allowOnlyEvents: false,
		adjustText: true,
		steps: [
			{
				id: 1,
				value: 'first_step',
				label: 'First large large step'
			},
			{
				id: 2,
				value: 'second_step',
				label: 'Second step'
			},
			{
				id: 3,
				value: 'third_step',
				label: 'Third step'
			},
			{
				id: 4,
				value: 'fourth_step',
				label: 'Fourth step'
			},
			{
				id: 5,
				value: 'fifth_step',
				label: 'Fifth step',
				notAllow: true
			}
		]
	}
};
