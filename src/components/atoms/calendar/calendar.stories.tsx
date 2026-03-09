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
	...getStoryConfig('scib-atoms-calendar'),
	title: 'Design System/Atoms/Calendar',
	render: (args) => <scib-atoms-calendar {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		level: 'tertiary',
		date: new Date().toISOString().substr(0, 19).split('T')[0],
		disableDates: {
			weekends: true,
			dates: ['2024-01-09', '2024-01-10', '2024-01-11']
		},
		config: {
			action: {
				icon: 'viewdetail'
			},
			dayData: {
				'2024-01-14': {
					title: 'Invoices',
					currency: 'USD',
					total: 5,
					amount: 127500,
					selected: true
				},
				'2024-01-20': {
					title: 'Invoices',
					currency: 'USD',
					total: 5,
					amount: 375000,
					selected: false
				},
				'2024-01-25': {
					title: 'Invoices',
					currency: 'USD',
					total: 5,
					amount: 718500,
					selected: true
				}
			}
		}
	}
};
