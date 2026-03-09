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
	...getStoryConfig('scib-ui-v2-counter-panel'),
	title: 'Design System/Atoms/Counter Panel',
	render: (args) => (
		<div style={{ height: '300px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
			<scib-ui-v2-counter-panel {...args} />
		</div>
	)
};
export default meta;

/**
 *
 */
const commonConfig = {
	singleSelection: false,
	panels: [
		{
			label: 'Issued',
			status: 'issued',
			color: '#1BB3BC',
			counter: 1
		},
		{
			label: 'Pend. paid',
			status: 'pendingPaid',
			color: '#F2AB4E',
			counter: 120
		},
		{
			label: 'Advanced',
			status: 'advanced',
			color: '#9E3667',
			counter: 130,
			limit: 110
		},
		{
			label: 'Paid',
			status: 'paid',
			color: '#3366FF',
			counter: 1
		},
		{
			label: 'Collected',
			status: 'collected',
			color: '#63BA68',
			counter: 2
		},
		{
			label: 'Cancelled',
			status: 'cancelled',
			counter: 2
		},
		{
			label: 'Custom',
			status: 'custom',
			color: '#FF00FF',
			counter: '--'
		}
	]
};

export const Medium: StoryObj = {
	args: {
		...commonConfig,
		size: 'm'
	}
};

export const Small: StoryObj = {
	args: {
		...commonConfig,
		size: 's'
	}
};
