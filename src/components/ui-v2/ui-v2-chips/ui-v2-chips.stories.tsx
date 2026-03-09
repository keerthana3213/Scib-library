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
	...getStoryConfig('scib-ui-v2-chips'),
	title: 'Design System/Atoms/Chips',
	render: (args) => (
		<div style={{ height: '800px', padding: '100px 0' }}>
			<scib-ui-v2-chips {...args} />
		</div>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		value: [
			{ id: 1, label: 'label', value: 'this is too long text for a chip that should not come out of the container' },
			{ id: 2, label: 'label', value: 'filter2 disabled', disabled: true },
			{ id: 3, label: 'label', value: 'filter3' },
			{
				id: 4,
				label: 'long label',
				value: 'this is too long text for a chip that should not come out of the container. The tooltip should be repositioned if it is larger than the window size'
			},
			{ id: 5, label: 'label', value: 'filter5' },
			{ id: 6, label: 'label', value: 'this is too long text for a chip that should not come out of the container' }
		],
		buttonText: 'Clear all',
		variant: 'white',
		tooltipPosition: 'top'
	}
};
