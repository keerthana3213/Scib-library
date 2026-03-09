import { getStoryConfig } from '../../../../.storybook/utils';
import { parseAttributes } from '../../../utils/helpers/common';
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
	...getStoryConfig('scib-ui-v2-text-field'),
	title: 'Design System/Atoms/Text Field',
	render: (args) => (
		<div>
			<scib-ui-v2-text-field {...args}></scib-ui-v2-text-field>
		</div>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		label: 'Label',
		helperText: 'Helper text',
		limit: 50,
		type: 'text',
		variant: 'none',
		numberFormatConfig: {
			alwaysAllowDecimalCharacter: true,
			digitGroupSeparator: ',',
			decimalCharacter: '.'
		}
	}
};

const autoTooltipProps = {
	['enable-auto-tooltip']: false,
	['tooltip-config']: JSON.stringify({
		arrow: 'top',
		maxWidth: '500px',
		delay: 300
	}),
	label: 'Field with long helper text',
	limit: 20,
	['helper-text']:
		"This is an extremely long helper text that should cause the tooltip to display automatically due to overflow. The component detects when the text doesn't fit in the available space and activates the tooltip."
};

export const WithTooltip: StoryObj = {
	args: {
		['enable-auto-tooltip']: false,
		label: 'Field with configured tooltip',
		['helper-text']: 'This is a helper text with explicitly configured tooltip',
		['enable-tooltip']: true,
		tooltipConfig: {
			arrow: 'bottom',
			headerText: 'Additional Information',
			literalsTooltip: 'This tooltip provides more details about the field',
			delay: 300
		},
		limit: 20
	}
};

export const WithAutoTooltip: StoryObj = {
	args: {
		['enable-auto-tooltip']: true,
		['tooltip-config']: {
			arrow: 'top',
			maxWidth: '500px',
			delay: 300
		},
		label: 'Field with long helper text',
		limit: 20,
		['helper-text']:
			"This is an extremely long helper text that should cause the tooltip to display automatically due to overflow. The component detects when the text doesn't fit in the available space and activates the tooltip."
	}
};
