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
	...getStoryConfig('scib-ui-v2-date-picker'),
	title: 'Design System/Atoms/Date Picker',
	render: (args) => <scib-ui-v2-date-picker {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		min: '2025-06-20',
		max: '2025-06-25',
		label: 'Date',
		language: 'es',
		disableDates: {
			weekends: true,
			dates: ['2023-12-13', '2023-12-14', '2023-12-15', '2023-12-23']
		},
		inputIcon: true,
		config: {
			autoClose: true,
			timepicker: true
		},
		showCleanIcon: true,
		helperText: 'Helper text'
	}
};

export const WithTooltip: StoryObj = {
	args: {
		label: 'Date',
		language: 'es',
		disableDates: {
			weekends: true,
			dates: ['2023-12-13', '2023-12-14', '2023-12-15', '2023-12-23']
		},
		inputIcon: true,
		config: {
			autoClose: true,
			timepicker: true
		},
		showCleanIcon: true,
		helperText:
			"This is an extremely long helper text that should cause the tooltip to display automatically due to overflow. The component detects when the text doesn't fit in the available space and activates the tooltip.",
		enableAutoTooltip: true
	}
};
