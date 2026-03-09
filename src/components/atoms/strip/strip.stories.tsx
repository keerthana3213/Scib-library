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
	...getStoryConfig('scib-atoms-strip'),
	title: 'Design System/Atoms/Strip',
	render: (args) => (
		<scib-atoms-strip {...args}>
			<div slot="content" dangerouslySetInnerHTML={{ __html: args.content }} />
		</scib-atoms-strip>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		content:
			'<ul style="display:flex; justify-content:space-between; flex-wrap: wrap;"><li style="padding-right:24px">Change team assignation (<span>2</span>)</li><li>Discard users of my ownership (<span>2</span>)</li></ul>',
		closeButtonText: 'Clear selection'
	}
};
