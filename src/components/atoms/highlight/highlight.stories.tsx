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
	...getStoryConfig('scib-atoms-highlight'),
	title: 'Design System/Atoms/Highlight',
	render: (args) => (
		<>
			<scib-atoms-highlight {...args} />
			<div dangerouslySetInnerHTML={{ __html: args.content }} />
		</>
	)
};
export default meta;

export const Playground: StoryObj = {
	args: {
		content: '<button id="myButton">ClickMe!</button>',
		idWidget: 'myButton',
		variant: 'red'
	}
};
