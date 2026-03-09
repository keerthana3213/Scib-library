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
	...getStoryConfig('scib-atoms-slider'),
	title: 'Design System/Atoms/Slider',
	render: (args) => <scib-atoms-slider {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		marks: true,
		indicator: true,
		color: 'primary',
		value: '2,7',
		ranges: [
			{
				id: 'value1',
				min: 0,
				max: 5,
				step: 0.5,
				value: 2,
				name: 'rangeStart',
				ariaLabel: 'Continuous range slider demo'
			},
			{
				id: 'value2',
				min: 5,
				max: 10,
				step: 0.5,
				value: 7,
				name: 'rangeEnd',
				label: 'Continuous range slider demo'
			}
		]
	}
};
