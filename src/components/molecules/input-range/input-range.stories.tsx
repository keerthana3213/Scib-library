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
	...getStoryConfig('scib-molecules-input-range'),
	title: 'Design System/Molecules/Input Range',
	render: (args) => <scib-molecules-input-range {...args} />
};
export default meta;

export const AmountRange: StoryObj = {
	args: {
		label: 'Label',
		type: 'amount',
		menuOptions: [
			{ id: 1, value: '0', label: 'Range' },
			{ id: 2, value: '1', label: 'Equals' },
			{ id: 3, value: '2', label: 'From' },
			{ id: 4, value: '3', label: 'To' }
		],
		icon: 'arrow-right',
		showCleanIcon: true,
		helperTextError: 'The second value must be greater than or equal to the first value.',
		helperText:
			"This is an extremely long helper text that should cause the tooltip to display automatically due to overflow. The component detects when the text doesn't fit in the available space and activates the tooltip.",
		invalid: false,
		config: {
			prefix: 'to',
			disabledDates: { weekends: true },
			language: 'es',
			locale: 'es-ES',
			max: '5-10-2023',
			min: '4-10-2023',
			datePickerConfig: { autoClose: true },
			amountInputConfig: {
				alwaysAllowDecimalCharacter: true,
				failOnUnknownOption: false,
				digitGroupSeparator: ',',
				formatOnPageLoad: true,
				decimalCharacter: '.',
				showWarnings: false
			}
		},
		tooltipConfig: {
			arrow: 'top',
			maxWidth: '500px',
			delay: 300
		}
	}
};

export const AmountRangeWithTooltip: StoryObj = {
	args: {
		label: 'Label',
		type: 'amount',
		menuOptions: [
			{ id: 1, value: '0', label: 'Range' },
			{ id: 2, value: '1', label: 'Equals' },
			{ id: 3, value: '2', label: 'From' },
			{ id: 4, value: '3', label: 'To' }
		],
		icon: 'arrow-right',
		showCleanIcon: true,
		helperText:
			"This is an extremely long helper text that should cause the tooltip to display automatically due to overflow. The component detects when the text doesn't fit in the available space and activates the tooltip.",
		invalid: false,
		config: {
			prefix: 'to',
			disabledDates: { weekends: true },
			language: 'es',
			locale: 'es-ES',
			max: '5-10-2023',
			min: '4-10-2023',
			datePickerConfig: { autoClose: true },
			amountInputConfig: {
				alwaysAllowDecimalCharacter: true,
				failOnUnknownOption: false,
				digitGroupSeparator: ',',
				formatOnPageLoad: true,
				decimalCharacter: '.',
				showWarnings: false
			}
		},
		enableAutoTooltip: true
	}
};

export const DatePickerRange: StoryObj = {
	args: {
		label: 'Label',
		type: 'date',
		menuOptions: [
			{ id: 1, value: 'range', label: 'Range' },
			{ id: 2, value: 'equals', label: 'Equal' },
			{ id: 3, value: 'from', label: 'Later than' },
			{ id: 4, value: 'to', label: 'Earlier than' }
		],
		mode: 'range',
		inputIcon: true,
		showCleanIcon: true,
		config: {
			prefix: 'to',
			disabledDates: { weekends: true },
			language: 'es',
			locale: 'es-ES',
			max: '5-10-2023',
			min: '4-10-2023',
			datePickerConfig: { autoClose: true },
			amountInputConfig: {
				alwaysAllowDecimalCharacter: true,
				failOnUnknownOption: false,
				digitGroupSeparator: ',',
				formatOnPageLoad: true,
				decimalCharacter: '.',
				showWarnings: false
			}
		}
	}
};

export const DatePickerRangeWithTooltip: StoryObj = {
	args: {
		label: 'Label',
		type: 'date',
		menuOptions: [
			{ id: 1, value: 'range', label: 'Range' },
			{ id: 2, value: 'equals', label: 'Equal' },
			{ id: 3, value: 'from', label: 'Later than' },
			{ id: 4, value: 'to', label: 'Earlier than' }
		],
		mode: 'range',
		inputIcon: true,
		showCleanIcon: true,
		config: {
			prefix: 'to',
			disabledDates: { weekends: true },
			language: 'es',
			locale: 'es-ES',
			max: '5-10-2023',
			min: '4-10-2023',
			datePickerConfig: { autoClose: true },
			amountInputConfig: {
				alwaysAllowDecimalCharacter: true,
				failOnUnknownOption: false,
				digitGroupSeparator: ',',
				formatOnPageLoad: true,
				decimalCharacter: '.',
				showWarnings: false
			}
		},
		helperText:
			"This is an extremely long helper text that should cause the tooltip to display automatically due to overflow. The component detects when the text doesn't fit in the available space and activates the tooltip.",
		enableAutoTooltip: true
	}
};
