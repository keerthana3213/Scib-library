// filepath: c:\Users\x590424\Desktop\Proyectos\UI KIT\cib-dpemp-uikit\src\components\atoms\text\text.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import { getStoryConfig } from '../../../../.storybook/utils';

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'scib-atoms-helper-text': any;
		}
	}
}

const meta: Meta = {
	...getStoryConfig('scib-atoms-helper-text'),
	title: 'Design System/Atoms/Text',
	render: (args) => <scib-atoms-helper-text {...args} />,
	argTypes: {
		status: {
			control: { type: 'select' },
			options: ['default', 'success', 'error', 'warning', 'loading', 'info']
		},
		enableTooltip: {
			control: { type: 'boolean' }
		}
	}
};
export default meta;

// Playground story
export const Playground: StoryObj = {
	args: {
		text: 'This is a sample text',
		status: 'default',
		enableTooltip: false
	}
};

// Text with different status
export const TextWithStatus: StoryObj = {
	render: () => (
		<div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
			<scib-atoms-helper-text text="Text with default status" status="default" />
			<scib-atoms-helper-text text="Text with success status" status="success" />
			<scib-atoms-helper-text text="Text with error status" status="error" />
			<scib-atoms-helper-text text="Text with warning status" status="warning" />
			<scib-atoms-helper-text text="Text with loading status" status="loading" />
			<scib-atoms-helper-text text="Text with info status" status="info" />
		</div>
	)
};

// Text with tooltip
export const TextWithTooltip: StoryObj = {
	args: {
		text: 'This is a long text that should trigger the tooltip when the enableTooltip option is enabled or when the text is too long to fit in the container and overflow is detected.',
		enableTooltip: true,
		tooltipConfig: {
			arrow: 'bottom',
			headerText: 'Important Information'
		}
	}
};

// Text with custom tooltip configuration
export const TextWithCustomTooltipConfig: StoryObj = {
	args: {
		text: 'This text has custom tooltip configuration',
		enableTooltip: true,
		tooltipConfig: {
			arrow: 'top',
			headerText: 'Custom Configuration',
			literalsTooltip: 'This is a custom message that appears in the tooltip instead of the original text',
			delay: 300,
			maxWidth: '150px'
		}
	}
};

// Long text that overflows and automatically enables tooltip
export const TextAutoTooltip: StoryObj = {
	args: {
		text: 'This is an extremely long text that will surely exceed the container boundaries and automatically trigger the tooltip when overflow is detected, without needing to explicitly enable it.',
		status: 'info',
		enableAutoTooltip: true
	},
	render: (args) => (
		<div>
			<scib-atoms-helper-text text="Option with auto tooltip" />
			<scib-atoms-helper-text {...args} text="Enable auto tooltip" />

			<scib-atoms-helper-text text="Option auto tooltip with overflow" />
			<div style={{ width: '700px', height: '300px', border: '1px dashed #ccc', padding: '10px', resize: 'both', overflow: 'auto' }}>
				<scib-atoms-helper-text {...args} />
			</div>
		</div>
	)
};
