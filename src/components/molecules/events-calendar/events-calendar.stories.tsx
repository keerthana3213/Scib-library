import type { Meta, StoryObj } from '@storybook/react';
import { DateTime } from 'luxon';
import React from 'react';
import { generateRandomId, getStoryConfig } from '../../../../.storybook/utils';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const dates = new Array(4).fill(null).map(() => {
	const day = Math.floor(generateRandomId() * (29 - 1 + 1) + 1);
	const date = DateTime.now();
	return date.set({ day }).toFormat('yyyy-MM-dd');
});

const meta: Meta = {
	...getStoryConfig('scib-molecules-events-calendar'),
	title: 'Design System/Molecules/Events Calendar',
	render: (args) => <scib-molecules-events-calendar {...args} dangerouslySetInnerHTML={{ __html: args.header }} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		header: `<div slot="header">
			<scib-ui-v2-tabs
			tab-options='[{"id":1, "value":"Notifications"}]'
			fit-content="true"
			active-index="0"
			variant="white"
			level="secondary"></scib-ui-v2-tabs>
		</div>`,
		date: DateTime.now().toISODate(),
		disableDates: {
			weekends: true,
			dates: ['2024-01-23', '2024-01-24', '2024-01-30']
		},
		displayHeader: true,
		displayTitle: true,
		displayNavigation: true,
		loading: false,
		formatDays: 'long',
		formatTitle: 'LLLL, yyyy',
		calendarColor: 'primary',
		buttonsColor: 'none',
		buttonsVariant: 'icon',
		language: 'en-US',
		size: 'm',
		literals: {
			navigation: {
				previousMonth: 'Previous month',
				nextMonth: 'Next month'
			}
		},
		events: {
			[dates[0]]: {
				title: undefined,
				currency: undefined,
				total: undefined,
				amount: undefined,
				selected: true
			},
			[dates[1]]: {
				title: 'Invoices',
				currency: 'USD',
				total: 5,
				amount: 375000,
				selected: false
			},
			[dates[2]]: {
				title: 'Invoices',
				currency: 'USD',
				total: 5,
				amount: 718500,
				selected: true
			},
			[dates[3]]: {
				title: 'Invoices',
				currency: 'USD',
				total: 5,
				amount: 718500,
				selected: true
			}
		}
	}
};
