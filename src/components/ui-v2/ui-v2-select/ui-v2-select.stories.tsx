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
	...getStoryConfig('scib-ui-v2-select'),
	title: 'Design System/Atoms/Select',
	args: {
		menuOptions: [
			{
				id: 1,
				label: 'Preparation',
				value: 1
			},
			{
				id: 2,
				label: 'Negotiation',
				value: 2
			},
			{
				id: 4,
				label: 'Closed',
				value: 4
			}
		]
	},
	render: (args) => <scib-ui-v2-select {...args} />
};
export default meta;

export const Playground: StoryObj = {
	args: {
		label: 'Search',
		menuOptions: [
			{
				id: 1,
				label: 'Preparation',
				value: 1
			},
			{
				id: 2,
				label: 'Negotiation',
				value: 2
			},
			{
				id: 4,
				label: 'Closed',
				value: 4
			}
		],
		value: 'banana',
		selectAllText: 'Select all',
		variant: 'none',
		level: 'primary',
		invalid: false,
		helperText: 'Helper text',
		limit: 50
	}
};

export const WithTooltip: StoryObj = {
	args: {
		label: 'Search',
		menuOptions: [
			{
				id: 1,
				label: 'Preparation',
				value: 1
			},
			{
				id: 2,
				label: 'Negotiation',
				value: 2
			},
			{
				id: 4,
				label: 'Closed',
				value: 4
			}
		],
		value: 'banana',
		selectAllText: 'Select all',
		variant: 'none',
		level: 'primary',
		enableAutoTooltip: true,
		tooltipConfig: {
			headerText: 'Important Information'
		},
		invalid: false,
		helperText:
			"This is an extremely long helper text that should cause the tooltip to display automatically due to overflow. The component detects when the text doesn't fit in the available space and activates the tooltip.",
		limit: 50
	}
};

export const Custom: StoryObj = {
	args: {
		label: 'Search',
		menuOptions: [
			{
				id: 'asset owner',
				label: 'BOA Markets Legal',
				value: 'asset owner'
			},
			{
				id: 'analyst',
				label: 'BOA Risk Validator',
				value: 'analyst'
			},
			{
				id: 'Client',
				label: 'client',
				value: 'Client'
			}
		],
		value: 'banana',
		selectAllText: 'Select all',
		variant: 'none',
		invalid: false,
		helperText: 'Helper text',
		limit: 50
	}
};

export const CustomTest: StoryObj = {
	args: {
		label: 'Search',
		menuOptions: [
			{
				id: 1,
				label: 'Preparation',
				value: 1
			},
			{
				id: 2,
				label: 'Negotiation',
				value: 'TEST 1'
			},
			{
				id: 22,
				label: 'Negotiation',
				value: 'TEST 2'
			},
			{
				id: 4,
				label: 'Closed',
				value: 4
			}
		],
		value: 'banana',
		selectAllText: 'Select all',
		variant: 'none',
		invalid: false,
		helperText: 'Helper text',
		limit: 50
	}
};

export const WithoutId: StoryObj = {
	args: {
		label: 'Search',
		menuOptions: [
			{
				label: '123456789012345',
				value: '468',
				name: '123456789012345',
				avatar: 'src/assets/assets/img/BMC-request-manager-icon.png',
				isSelected: false,
				isEmployee: false,
				ldapUid: '468',
				idSupplier: 2,
				document: 441,
				idCandidate: 468,
				email: null,
				extensionFile: '.csv'
			},
			{
				label: 'AAA 2C',
				value: '591',
				name: 'AAA 2C',
				avatar: 'src/assets/assets/img/BMC-request-manager-icon.png',
				isSelected: false,
				isEmployee: false,
				ldapUid: '591',
				idSupplier: 2,
				document: 685,
				idCandidate: 591,
				email: 'aaa@ntt.es',
				extensionFile: '.pdf'
			},
			{
				label: 'afcss fsfvsf',
				value: '592',
				name: 'afcss fsfvsf',
				avatar: 'src/assets/assets/img/BMC-request-manager-icon.png',
				isSelected: false,
				isEmployee: false,
				ldapUid: '592',
				idSupplier: 2,
				document: 690,
				idCandidate: 592,
				email: 'afcss@test.com',
				extensionFile: '.csv'
			},
			{
				label: 'Alberto 2C',
				value: '371',
				name: 'Alberto 2C',
				avatar: 'src/assets/assets/img/BMC-request-manager-icon.png',
				isSelected: false,
				isEmployee: false,
				ldapUid: '371',
				idSupplier: 2,
				document: 387,
				idCandidate: 371,
				email: 'aab@bcbc.es',
				extensionFile: '.csv'
			},
			{
				label: 'Alberto Calleja',
				value: '346',
				name: 'Alberto Calleja',
				avatar: 'src/assets/assets/img/BMC-request-manager-icon.png',
				isSelected: false,
				isEmployee: false,
				ldapUid: '346',
				idSupplier: 2,
				document: 386,
				idCandidate: 346,
				email: null,
				extensionFile: '.csv'
			},
			{
				label: 'Alex AAAAx',
				value: '407',
				name: 'Alex AAAAx',
				avatar: 'src/assets/assets/img/BMC-request-manager-icon.png',
				isSelected: false,
				isEmployee: false,
				ldapUid: '407',
				idSupplier: 2,
				document: null,
				idCandidate: 407,
				email: null
			}
		],
		value: 'banana',
		selectAllText: 'Select all',
		variant: 'none',
		invalid: false,
		helperText: 'Helper text',
		limit: 50
	}
};
