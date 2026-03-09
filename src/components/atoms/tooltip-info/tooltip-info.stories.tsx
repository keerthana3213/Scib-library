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
	...getStoryConfig('scib-atoms-tooltip-info'),
	title: 'Design System/Atoms/Tooltip Info',
	render: (args) => (
		<div style={{ margin: '20%', textAlign: 'center' }}>
			<scib-atoms-tooltip-info {...args} dangerouslySetInnerHTML={{ __html: args.content }} />
		</div>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		content: '<h2>Other Access</h2>',
		arrow: 'left',
		literalsTooltip: 'Product sheet',
		visibility: 'visible',
		disableReposition: {
			horizontal: false,
			vertical: false
		},
		delay: 0,
		headerText: 'Tooltip title'
	}
};
