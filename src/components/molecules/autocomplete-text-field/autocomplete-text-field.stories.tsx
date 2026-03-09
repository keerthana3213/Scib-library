import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { getStoryConfig } from '../../../../.storybook/utils';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			[key: string]: any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-molecules-autocomplete-text-field'),
	title: 'Design System/Molecules/Autocomplete Text Field',
	render: (args) => {
		return (
			<scib-molecules-autocomplete-text-field {...args}>
				<scib-atoms-list>
					<scib-atoms-item-list>
						<span style={{ fontWeight: 'bold', fontSize: '16px' }}>GLT - 32DEFCC891</span>
					</scib-atoms-item-list>
					<scib-atoms-item-list>
						<span style={{ fontWeight: 'bold', fontSize: '16px' }}>GLT - 32DEFCC891</span>
					</scib-atoms-item-list>
				</scib-atoms-list>
			</scib-molecules-autocomplete-text-field>
		);
	}
};
export default meta;

export const Playground: StoryObj = {
	args: {
		id: 'name-autocompl-field',
		name: 'nameautocompl',
		label: 'Name',
		icon: 'search',
		minChars: 3,
		debounceTime: 200,
		helperText: 'Type at least 3 characters'
	}
};

export const WithTooltip: StoryObj = {
	args: {
		id: 'name-autocompl-field',
		name: 'nameautocompl',
		label: 'Name',
		icon: 'search',
		minChars: 3,
		debounceTime: 200,
		helperText:
			'This is a tooltip with a long text that should trigger the tooltip when the enableTooltip option is enabled or when the text is too long to fit in the container and overflow is detected.',
		enableAutoTooltip: true,
		tooltipConfig: {
			headerText: 'Important Information',
			delay: 300
		}
	},
	render: (args) => {
		return (
			<scib-molecules-autocomplete-text-field {...args}>
				<scib-atoms-list>
					<scib-atoms-item-list>
						<span style={{ fontWeight: 'bold', fontSize: '16px' }}>GLT - 32DEFCC891</span>
					</scib-atoms-item-list>
					<scib-atoms-item-list>
						<span style={{ fontWeight: 'bold', fontSize: '16px' }}>GLT - 32DEFCC891</span>
					</scib-atoms-item-list>
				</scib-atoms-list>
			</scib-molecules-autocomplete-text-field>
		);
	}
};
